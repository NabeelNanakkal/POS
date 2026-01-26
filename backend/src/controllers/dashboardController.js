import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import Order from '../models/Order.js';
import Store from '../models/Store.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

/**
 * @desc    Get dashboard stats (revenue, stores, staff, active sessions)
 * @route   GET /api/dashboard/stats
 * @access  Private (Admin/Manager)
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Parallel execution for performance
  const [storeCount, userCount, orderStats] = await Promise.all([
    Store.countDocuments({ isActive: true }),
    User.countDocuments({ isActive: true }),
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalWithTax' },
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  const totalRevenue = orderStats.length > 0 ? orderStats[0].totalRevenue : 0;
  
  // Mocking active sessions as we don't track them in DB in real-time
  const activeSessions = Math.floor(Math.random() * (userCount - 1) + 1);

  const stats = {
    totalRevenue,
    totalStores: storeCount,
    totalStaff: userCount,
    activeSessions,
    revenueTrend: '+12%' // Mock trend for now
  };

  res.json(ApiResponse.success(stats, 'Dashboard stats fetched successfully'));
});

/**
 * @desc    Get activity counts (chart data)
 * @route   GET /api/dashboard/activity
 * @access  Private (Admin/Manager)
 */
export const getActivityCounts = asyncHandler(async (req, res) => {
  // Mock data for chart - in real app, aggregate orders by date
  // This is compatible with the frontend's expected format if valid
  const mockActivity = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        name: 'Sales',
        data: [12, 19, 3, 5, 2, 3, 10]
      }
    ]
  };

  res.json(ApiResponse.success(mockActivity, 'Activity counts fetched successfully'));
});

/**
 * @desc    Get employee statistics for personnel dashboard
 * @route   GET /api/dashboard/employee-stats
 * @access  Private (Admin/Manager)
 */
export const getEmployeeStats = asyncHandler(async (req, res) => {
  // Get all user IDs that have an associated Employee record
  const employeeUserIds = await Employee.find().distinct('user');

  const totalStaff = employeeUserIds.length;
  const admins = await User.countDocuments({ _id: { $in: employeeUserIds }, role: 'ADMIN' });
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
      trend: await getGrowth(Employee)
    },
    accountBox: {
      value: admins,
      trend: await getGrowth(User, { _id: { $in: employeeUserIds }, role: 'ADMIN' })
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
