import Shift from '../models/Shift.js';
import Order from '../models/Order.js';

// @desc    Start a new shift
// @route   POST /api/shifts/start
// @access  Private (Cashier/Admin)
export const startShift = async (req, res) => {
  try {
    const { openingBalance, storeId } = req.body;
    const userId = req.user._id;

    // Check if user already has an open shift
    const existingShift = await Shift.findOne({ userId, status: 'OPEN' });
    if (existingShift) {
      return res.status(400).json({ message: 'You already have an active shift.' });
    }

    const shift = await Shift.create({
      userId,
      storeId: storeId || req.user.storeId || req.user.store, // Fallback to user's assigned store
      openingBalance,
      cashMetrics: { expectedCash: openingBalance }
    });

    res.status(201).json({ success: true, data: shift });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    End current shift
// @route   POST /api/shifts/end
// @access  Private
export const endShift = async (req, res) => {
  try {
    const userId = req.user._id;
    const { actualCash, listActualCard, listActualUpi, notes } = req.body;

    const shift = await Shift.findOne({ userId, status: 'OPEN' });
    if (!shift) {
      return res.status(404).json({ message: 'No active shift found.' });
    }

    // Aggregate orders for this shift to calculate system totals
    // In a real app, you might maintain these totals incrementally or query orders by time range
    // Here we query orders created by this user between shift start and now
    const orders = await Order.find({
      user: userId,
      createdAt: { $gte: shift.startTime, $lte: new Date() },
      status: 'completed' // Only completed orders
    });

    let cashSales = 0;
    let cardSales = 0;
    let upiSales = 0;

    orders.forEach(order => {
        const method = order.paymentMethod ? order.paymentMethod.toUpperCase() : 'OTHER';
        if (method === 'CASH') cashSales += order.total;
        else if (method === 'CARD') cardSales += order.total;
        else if (method === 'UPI') upiSales += order.total;
    });
    
    // Calculate Cash Movements (Pay Im / Out)
    let totalPayIn = 0;
    let totalPayOut = 0;
    shift.cashMovements.forEach(m => {
        if(m.type === 'IN') totalPayIn += m.amount;
        else totalPayOut += m.amount;
    });

    const expectedCash = shift.openingBalance + cashSales + totalPayIn - totalPayOut;

    shift.endTime = new Date();
    shift.status = 'CLOSED';
    shift.paymentSummary = {
      cash: cashSales,
      card: cardSales,
      upi: upiSales
    };
    
    // Update cash metrics
    shift.cashMetrics = {
        expectedCash,
        actualCash: parseFloat(actualCash) || 0,
        difference: (parseFloat(actualCash) || 0) - expectedCash
    };
    
    shift.notes = notes;

    await shift.save();

    res.status(200).json({ success: true, data: shift });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current active shift
// @route   GET /api/shifts/current
// @access  Private
export const getCurrentShift = async (req, res) => {
  try {
    const shift = await Shift.findOne({ userId: req.user._id, status: 'OPEN' });
    if (!shift) {
      return res.status(200).json({ success: true, data: null });
    }
    
    // Optional: Calculate current totals for the active shift response
    // Or just return the static shift data
    res.status(200).json({ success: true, data: shift });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get shift history
// @route   GET /api/shifts/history
// @access  Private
export const getShiftHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const shifts = await Shift.find({ 
            userId: req.user._id,
            status: 'CLOSED'
        })
        .sort({ endTime: -1 })
        .skip(skip)
        .limit(limit);

        const total = await Shift.countDocuments({ 
            userId: req.user._id,
            status: 'CLOSED'
        });

        res.status(200).json({ 
            success: true, 
            data: {
                shifts,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit)
                }
            } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add cash movement (Pay In / Pay Out)
// @route   POST /api/shifts/movement
// @access  Private
export const addCashMovement = async (req, res) => {
    try {
        const { type, amount, reason } = req.body;
        const userId = req.user._id;

        const shift = await Shift.findOne({ userId, status: 'OPEN' });
        if (!shift) {
            return res.status(404).json({ message: 'No active shift found.' });
        }

        shift.cashMovements.push({
            type,
            amount: parseFloat(amount),
            reason
        });

        await shift.save();
        res.status(200).json({ success: true, data: shift });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
