import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { config } from '../config';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.db.mongoUri!);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error('Err connecting to MongoDB:', err);
    process.exit(1);
  }
};
