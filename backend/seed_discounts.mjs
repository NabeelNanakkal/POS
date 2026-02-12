import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/pos_system';
const STORE_ID = '697dcbe2808071eb50432304'; // Downtown Branch

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected for seeding');

    const Discount = mongoose.model('Discount', new mongoose.Schema({
      name: String,
      code: String,
      description: String,
      type: String,
      value: Number,
      applicableTo: String,
      validFrom: Date,
      validTo: Date,
      isActive: Boolean,
      store: mongoose.Schema.Types.ObjectId,
      usageCount: Number,
      totalDiscountAmount: Number
    }));

    // Clear existing
    await Discount.deleteMany({});

    const samples = [
      {
        name: 'Grand Opening Sale',
        code: 'OPEN20',
        description: '20% off on all products for our grand opening!',
        type: 'PERCENTAGE',
        value: 20,
        applicableTo: 'ALL_PRODUCTS',
        validFrom: new Date(),
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        store: STORE_ID,
        usageCount: 15,
        totalDiscountAmount: 4500
      },
      {
        name: 'Special Fixed Discount',
        code: 'FIXED500',
        description: 'Flat ₹500 off on purchases above ₹2000',
        type: 'FIXED_AMOUNT',
        value: 500,
        applicableTo: 'ALL_PRODUCTS',
        validFrom: new Date(),
        validTo: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        isActive: true,
        store: STORE_ID,
        usageCount: 8,
        totalDiscountAmount: 4000
      }
    ];

    await Discount.insertMany(samples);
    console.log('Successfully seeded 2 discounts');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
