import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/pos_system';

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    const User = mongoose.model('User', new mongoose.Schema({
      username: String,
      role: String,
      store: mongoose.Schema.Types.ObjectId
    }));

    const users = await User.find().lean();
    console.log('Users:', JSON.stringify(users, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
