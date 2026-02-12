import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/pos_system';

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const Discount = mongoose.model('Discount', new mongoose.Schema({
      name: String,
      store: mongoose.Schema.Types.ObjectId
    }));

    const count = await Discount.countDocuments();
    console.log(`Total Discounts: ${count}`);

    const discounts = await Discount.find().lean();
    console.log('Discounts:', JSON.stringify(discounts, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
