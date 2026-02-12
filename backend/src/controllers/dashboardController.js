import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import Order from '../models/Order.js';
import Store from '../models/Store.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';

/**
 * @desc    Get dashboard stats (revenue, stores, staff, active sessions)
 * @route   GET /api/dashboard/stats
 * @access  Private (Admin/Manager)
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const { store } = req.query;
  
  // Date ranges
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const yesterdayStart = new Date(new Date(todayStart).setDate(todayStart.getDate() - 1));
  const yesterdayEnd = new Date(todayStart);

  const getStatsForRange = async (start, end) => {
    const matchQuery = { 
      status: 'COMPLETED',
      createdAt: { $gte: start }
    };
    if (end) matchQuery.createdAt.$lt = end;
    if (store) matchQuery.store = new mongoose.Types.ObjectId(store);

    const result = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      }
    ]);
    return result[0] || { totalRevenue: 0, count: 0 };
  };

  // Parallel execution for performance
  const statsQuery = {};
  if (store) {
    statsQuery.store = new mongoose.Types.ObjectId(store);
  } else if (req.storeId) {
    statsQuery.store = req.storeId;
  }

  const [todayStats, yesterdayStats, customerCount, productCount] = await Promise.all([
    getStatsForRange(todayStart),
    getStatsForRange(yesterdayStart, yesterdayEnd),
    Customer.countDocuments(statsQuery),
    Product.countDocuments({ ...statsQuery, isActive: true })
  ]);

  const calculateTrend = (current, previous) => {
    if (previous === 0) return current > 0 ? '+100%' : '+0%';
    const diff = ((current - previous) / previous) * 100;
    return `${diff >= 0 ? '+' : ''}${Math.round(diff)}%`;
  };

  const stats = {
    totalRevenue: todayStats.totalRevenue,
    totalTransactions: todayStats.count,
    totalCustomers: customerCount,
    activeProducts: productCount,
    revenueTrend: calculateTrend(todayStats.totalRevenue, yesterdayStats.totalRevenue),
    transactionsTrend: calculateTrend(todayStats.count, yesterdayStats.count),
    customersTrend: '+0%', // Placeholder for now
    productsTrend: 'Stable'
  };

  res.json(ApiResponse.success(stats, 'Dashboard stats fetched successfully'));
});

/**
 * @desc    Get activity counts (chart data)
 * @route   GET /api/dashboard/activity
 * @access  Private (Admin/Manager)
 */
export const getActivityCounts = asyncHandler(async (req, res) => {
  const { store } = req.query;
  
  // Calculate the last 7 days including today
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const matchQuery = {
    status: 'COMPLETED',
    createdAt: { $gte: sevenDaysAgo }
  };

  if (store) {
    matchQuery.store = new mongoose.Types.ObjectId(store);
  }

  // Use local timezone for grouping to match summary cards
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  const activityData = await Order.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone } },
        revenue: { $sum: "$total" },
        sales: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Fill in missing days
  const labels = [];
  const revenueData = [];
  const salesData = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(sevenDaysAgo.getDate() + i);
    
    // Create local date string YYYY-MM-DD
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const dayName = i === 6 ? 'Today' : dayNames[d.getDay()];
    
    const dayData = activityData.find(item => item._id === dateStr);
    
    labels.push(dayName);
    revenueData.push(dayData ? dayData.revenue : 0);
    salesData.push(dayData ? dayData.sales : 0);
  }

  res.json(ApiResponse.success({
    labels,
    datasets: [
      { name: 'Revenue', data: revenueData },
      { name: 'Sales', data: salesData }
    ]
  }, 'Activity counts fetched successfully'));
});

/**
 * @desc    Get employee statistics for personnel dashboard
 * @route   GET /api/dashboard/employee-stats
 * @access  Private (Admin/Manager)
 */
export const getEmployeeStats = asyncHandler(async (req, res) => {
  const { store } = req.query;
  const storeFilter = {};
  
  if (req.user.role === 'STORE_ADMIN') {
    if (store && store !== 'All') {
      storeFilter.store = store;
    } else {
      // Fetch all stores owned by this admin
      const ownedStores = await Store.find({ owner: req.user._id }).distinct('_id');
      storeFilter.store = { $in: ownedStores };
    }
  } else if (req.user.role !== 'SUPER_ADMIN') {
    storeFilter.store = req.storeId || req.user.store;
  } else if (store && store !== 'All') {
    storeFilter.store = store;
  }

  // Get all user IDs that have an associated Employee record for this store
  const employeeUserIds = await Employee.find(storeFilter).distinct('user');

  const totalStaff = employeeUserIds.length;
  const admins = await User.countDocuments({ _id: { $in: employeeUserIds }, role: 'ACCOUNTANT' });
  const managers = await User.countDocuments({ _id: { $in: employeeUserIds }, role: 'MANAGER' });
  const cashiers = await User.countDocuments({ _id: { $in: employeeUserIds }, role: 'CASHIER' });

  // For trend calculation (comparing with last month)
  const now = new Date();
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const getGrowth = async (model, query = {}) => {
    const currentCount = await model.countDocuments({ ...query });
    const lastMonthCount = await model.countDocuments({ 
      ...query, 
      createdAt: { $lt: firstDayCurrentMonth } 
    });
    
    if (lastMonthCount === 0) return currentCount > 0 ? 100 : 0;
    return Math.round(((currentCount - lastMonthCount) / lastMonthCount) * 100);
  };

  const stats = {
    totalBox: {
      value: totalStaff,
      trend: await getGrowth(Employee, storeFilter)
    },
    accountBox: {
      value: admins,
      trend: await getGrowth(User, { _id: { $in: employeeUserIds }, role: 'ACCOUNTANT' })
    },
    managerBox: {
      value: managers,
      trend: await getGrowth(User, { _id: { $in: employeeUserIds }, role: 'MANAGER' })
    },
    cashierBox: {
      value: cashiers,
      trend: await getGrowth(User, { _id: { $in: employeeUserIds }, role: 'CASHIER' })
    }
  };

  res.json(ApiResponse.success(stats));
});
