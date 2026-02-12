import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/pos_system';

async function check() {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB:', conn.connection.host);

    // Dynamic model definition
    const discountSchema = new mongoose.Schema({
      name: String,
      code: String,
      store: mongoose.Schema.Types.ObjectId,
      isActive: Boolean
    });

    const Discount = mongoose.models.Discount || mongoose.model('Discount', discountSchema, 'discounts');

    const count = await Discount.countDocuments();
    console.log(`Total Discounts in 'discounts' collection: ${count}`);

    const allDiscounts = await Discount.find().lean();
    console.log('All Discounts Data:', JSON.stringify(allDiscounts, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error in check script:', err);
    process.exit(1);
  }
}

check();
