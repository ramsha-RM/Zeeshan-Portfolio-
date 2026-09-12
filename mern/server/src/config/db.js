import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({
  path: new URL('../../.env', import.meta.url),
});

const fallbackMongoUri = 'mongodb://127.0.0.1:27017/portfolio';

const connectDB = async () => {
  const uri = process.env.MONGO_URI || fallbackMongoUri;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 20000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    console.log('MongoDB Connected');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

export default connectDB;