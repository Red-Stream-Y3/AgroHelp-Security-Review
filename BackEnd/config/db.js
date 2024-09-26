import mongoose from 'mongoose';
import colors from 'colors';
import logger from '../controllers/logger.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {});
    logger.info(
      `MongoDB database connection established successfully: ${conn.connection.host}`
        .cyan.underline
    );
  } catch (error) {
    logger.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
