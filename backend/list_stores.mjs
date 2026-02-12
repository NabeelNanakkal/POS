import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/pos_system';

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const Store = mongoose.model('Store', new mongoose.Schema({
      name: String
    }));

    const stores = await Store.find().lean();
    console.log('Stores:', JSON.stringify(stores, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
