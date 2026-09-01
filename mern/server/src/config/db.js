import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({
  path: new URL('../../.env', import.meta.url),
});

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is missing from server/.env');
  }

  try {
    await mongoose.connect(uri);

    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
};

export default connectDB;