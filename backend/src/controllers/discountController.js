import Discount from '../models/Discount.js';

// Get all discounts
export const getDiscounts = async (req, res) => {
  try {
    const { store } = req.user;
    const { isActive, type } = req.query;

    const filter = {};
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      filter.store = store;
    } else if (store) {
      filter.store = store;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    if (type) {
      filter.type = type;
    }

    const discounts = await Discount.find(filter)
      .populate('products', 'name sku')
      .populate('categories', 'name')
      .sort({ createdAt: -1 });

    res.json(discounts);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching discounts', 
      error: error.message 
    });
  }
};

// Get active discounts
export const getActiveDiscounts = async (req, res) => {
  try {
    const { store } = req.user;
    const now = new Date();

    const filter = { 
      isActive: true,
      validFrom: { $lte: now },
      validTo: { $gte: now }
    };

    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      filter.store = store;
    } else if (store) {
      filter.store = store;
    }

    const discounts = await Discount.find(filter)
      .populate('products', 'name sku')
      .populate('categories', 'name')
      .sort({ createdAt: -1 });

    res.json(discounts);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching active discounts', 
      error: error.message 
    });
  }
};

// Get discount by ID
export const getDiscountById = async (req, res) => {
  try {
    const { store } = req.user;
    const discount = await Discount.findOne({ 
      _id: req.params.id, 
      store 
    })
      .populate('products', 'name sku price')
      .populate('categories', 'name');

    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    res.json(discount);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching discount', 
      error: error.message 
    });
  }
};

// Create discount
export const createDiscount = async (req, res) => {
  try {
    const { store } = req.user;
    // If user has a store, use it. Otherwise, use store from body (for admins)
    const storeId = store || req.body.store;
    
    if (!storeId) {
      return res.status(400).json({ message: 'Store ID is required' });
    }

    const discountData = { ...req.body, store: storeId };

    const discount = await Discount.create(discountData);
    
    res.status(201).json(discount);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Discount with this name or code already exists' 
      });
    }
    res.status(400).json({ 
      message: 'Error creating discount', 
      error: error.message 
    });
  }
};

// Update discount
export const updateDiscount = async (req, res) => {
  try {
    const { store } = req.user;
    const filter = { _id: req.params.id };
    
    // Only filter by store if user is not admin
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      filter.store = store;
    }

    const discount = await Discount.findOneAndUpdate(
      filter,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('products', 'name sku')
      .populate('categories', 'name');

    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    res.json(discount);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating discount', 
      error: error.message 
    });
  }
};

// Delete discount
export const deleteDiscount = async (req, res) => {
  try {
    const { store } = req.user;
    const filter = { _id: req.params.id };

    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      filter.store = store;
    }

    const discount = await Discount.findOneAndDelete(filter);

    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    res.json({ message: 'Discount deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting discount', 
      error: error.message 
    });
  }
};

// Increment usage count and total amount
export const incrementUsageCount = async (req, res) => {
  try {
    const { store } = req.user;
    const { amount = 0 } = req.body;
    
    const filter = { _id: req.params.id };
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      filter.store = store;
    }

    const discount = await Discount.findOne(filter);

    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
      return res.status(400).json({ message: 'Discount usage limit reached' });
    }

    discount.usageCount += 1;
    discount.totalDiscountAmount = (discount.totalDiscountAmount || 0) + Number(amount);
    await discount.save();

    res.json(discount);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating discount usage', 
      error: error.message 
    });
  }
};
