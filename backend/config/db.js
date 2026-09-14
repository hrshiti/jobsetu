import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes('<db_password>')) {
    console.warn('\n⚠️ WARNING: MONGO_URI in .env contains "<db_password>" template.');
    console.warn('👉 Please update MONGO_URI in backend/.env with your actual MongoDB password.');
    console.warn('⚠️ Server will operate with automatic memory-store fallback until a valid MongoDB connection is provided.\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Server starting with memory fallback so API endpoints remain functional.\n');
    return false;
  }
};

export const getIsConnected = () => isConnected;
