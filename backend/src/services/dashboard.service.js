import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import Store from '../models/store.model.js';
import User from '../models/user.model.js';
import Employee from '../models/employee.model.js';
import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';

export const getDashboardStats = async (query, user) => {
  const { store } = query;

  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const yesterdayStart = new Date(new Date(todayStart).setDate(todayStart.getDate() - 1));
  const yesterdayEnd = new Date(todayStart);

  const buildMatchQuery = (start, end) => {
    const q = { status: 'COMPLETED', createdAt: { $gte: start } };
    if (end) q.createdAt.$lt = end;
    if (store) q.store = new mongoose.Types.ObjectId(store);
    return q;
  };

  const getStatsForRange = async (start, end) => {
    const result = await Order.aggregate([
      { $match: buildMatchQuery(start, end) },
      { $group: { _id: null, totalRevenue: { $sum: '$total' }, count: { $sum: 1 } } },
    ]);
    return result[0] || { totalRevenue: 0, count: 0 };
  };

  const statsQuery = {};
  if (store) {
    statsQuery.store = new mongoose.Types.ObjectId(store);
  } else if (user.storeId) {
    statsQuery.store = user.storeId;
  }

  const [todayStats, yesterdayStats, customerCount, productCount] = await Promise.all([
    getStatsForRange(todayStart),
    getStatsForRange(yesterdayStart, yesterdayEnd),
    Customer.countDocuments(statsQuery),
    Product.countDocuments({ ...statsQuery, isActive: true }),
  ]);

  const calculateTrend = (current, previous) => {
    if (previous === 0) return current > 0 ? '+100%' : '+0%';
    const diff = ((current - previous) / previous) * 100;
    return `${diff >= 0 ? '+' : ''}${Math.round(diff)}%`;
  };

  return {
    totalRevenue: todayStats.totalRevenue,
    totalTransactions: todayStats.count,
    totalCustomers: customerCount,
    activeProducts: productCount,
    revenueTrend: calculateTrend(todayStats.totalRevenue, yesterdayStats.totalRevenue),
    transactionsTrend: calculateTrend(todayStats.count, yesterdayStats.count),
    customersTrend: '+0%',
    productsTrend: 'Stable',
  };
};

export const getActivityCounts = async (query) => {
  const { store } = query;

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const matchQuery = { status: 'COMPLETED', createdAt: { $gte: sevenDaysAgo } };
  if (store) matchQuery.store = new mongoose.Types.ObjectId(store);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  const activityData = await Order.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone } },
        revenue: { $sum: '$total' },
        sales: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const labels = [];
  const revenueData = [];
  const salesData = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(sevenDaysAgo.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const dayName = i === 6 ? 'Today' : dayNames[d.getDay()];
    const dayData = activityData.find((item) => item._id === dateStr);

    labels.push(dayName);
    revenueData.push(dayData ? dayData.revenue : 0);
    salesData.push(dayData ? dayData.sales : 0);
  }

  return {
    labels,
    datasets: [
      { name: 'Revenue', data: revenueData },
      { name: 'Sales', data: salesData },
    ],
  };
};

export const getEmployeeStats = async (query, user) => {
  const { store } = query;
  const storeFilter = {};

  if (user.role === 'STORE_ADMIN') {
    if (store && store !== 'All') {
      storeFilter.store = store;
    } else {
      const ownedStores = await Store.find({ owner: user._id }).distinct('_id');
      storeFilter.store = { $in: ownedStores };
    }
  } else if (user.role !== 'SUPER_ADMIN') {
    storeFilter.store = user.storeId || user.store;
  } else if (store && store !== 'All') {
    storeFilter.store = store;
  }

  const employeeUserIds = await Employee.find(storeFilter).distinct('user');
  const totalStaff = employeeUserIds.length;

  const [admins, managers, cashiers] = await Promise.all([
    User.countDocuments({ _id: { $in: employeeUserIds }, role: 'ACCOUNTANT' }),
    User.countDocuments({ _id: { $in: employeeUserIds }, role: 'MANAGER' }),
    User.countDocuments({ _id: { $in: employeeUserIds }, role: 'CASHIER' }),
  ]);

  const now = new Date();
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const getGrowth = async (model, query = {}) => {
    const currentCount = await model.countDocuments({ ...query });
    const lastMonthCount = await model.countDocuments({ ...query, createdAt: { $lt: firstDayCurrentMonth } });
    if (lastMonthCount === 0) return currentCount > 0 ? 100 : 0;
    return Math.round(((currentCount - lastMonthCount) / lastMonthCount) * 100);
  };

  return {
    totalBox: { value: totalStaff, trend: await getGrowth(Employee, storeFilter) },
    accountBox: { value: admins, trend: await getGrowth(User, { _id: { $in: employeeUserIds }, role: 'ACCOUNTANT' }) },
    managerBox: { value: managers, trend: await getGrowth(User, { _id: { $in: employeeUserIds }, role: 'MANAGER' }) },
    cashierBox: { value: cashiers, trend: await getGrowth(User, { _id: { $in: employeeUserIds }, role: 'CASHIER' }) },
  };
};
