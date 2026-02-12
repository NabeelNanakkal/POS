import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [4, 'Password must be at least 4 characters'],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'STORE_ADMIN', 'MANAGER', 'CASHIER', 'INVENTORY_MANAGER', 'ACCOUNTANT'],
      default: 'CASHIER',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Validate password before hashing (numeric passwords allowed for all roles)
userSchema.pre('validate', function (next) {
  // Only validate if password is being modified
  // For SUPER_ADMIN and STORE_ADMIN, password MUST be numeric
  // For other roles, password CAN be numeric or alphanumeric
  if (this.isModified('password') && (this.role === 'SUPER_ADMIN' || this.role === 'STORE_ADMIN')) {
    if (!/^\d+$/.test(this.password)) {
      this.invalidate('password', 'Super admin and store admin passwords must contain only numbers (PIN format)');
    }
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate access token
userSchema.methods.generateAccessToken = function () {
  const payload = {
    id: this._id,
    email: this.email,
    role: this.role,
  };
  
  // Add storeId for non-super-admins
  if (this.role !== 'SUPER_ADMIN' && this.store) {
    payload.storeId = this.store;
  }
  
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiry,
  });
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    config.jwt.refreshSecret,
    {
      expiresIn: config.jwt.refreshExpiry,
    }
  );
};

// Remove password from JSON response
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
