import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/pos_system';
const DISCOUNT_ID = '6985a8d4fa119ce7372116f5';
const USER_EMAIL = 'jane.manager@test.com';

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const Discount = mongoose.model('Discount', new mongoose.Schema({
      name: String,
      store: mongoose.Schema.Types.ObjectId
    }));

    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      store: mongoose.Schema.Types.ObjectId,
      role: String
    }));

    console.log('--- Checking Discount ---');
    const discount = await Discount.findById(DISCOUNT_ID).lean();
    if (discount) {
      console.log('Discount Found:', JSON.stringify(discount, null, 2));
    } else {
      console.log('Discount NOT FOUND');
      // List all IDs to see if there's a typo
      const allDiscounts = await Discount.find({}, '_id name store').lean();
      console.log('All available discounts:', JSON.stringify(allDiscounts, null, 2));
    }

    console.log('--- Checking User ---');
    const user = await User.findOne({ email: USER_EMAIL }).lean();
    if (user) {
      console.log('User Found:', JSON.stringify(user, null, 2));
    } else {
      console.log('User NOT FOUND');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
