import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pos_system'
  },
  
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'your_access_secret_key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d'
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
      : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173', 'http://localhost:3003', 'https://pos-7r2o.vercel.app', 'https://pos-backend-n0jq.onrender.com']
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10000
  },
  
  defaultAdmin: {
    email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@pos.com',
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123',
    username: process.env.DEFAULT_ADMIN_USERNAME || 'admin'
  }
};
