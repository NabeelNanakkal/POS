import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Quantity cannot be negative'],
    },
    reorderPoint: {
      type: Number,
      default: 10,
      min: [0, 'Reorder point cannot be negative'],
    },
    reorderQuantity: {
      type: Number,
      default: 50,
      min: [0, 'Reorder quantity cannot be negative'],
    },
    lastRestocked: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index - one inventory record per product per store
inventorySchema.index({ product: 1, store: 1 }, { unique: true });

// Index for low stock queries
inventorySchema.index({ store: 1, quantity: 1 });

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
