import mongoose from "mongoose";
import { CONFIG } from "../config.js";
import { logger } from "../utils/logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(`${CONFIG.MONGO_URI}${CONFIG.MONGO_DB_NAME}`);
    logger.debug(`Connected to MongoDB - database: ${CONFIG.MONGO_DB_NAME}`);
  } catch (error) {
    logger.error("Error connecting to MongoDB", error);
  }
};

export default connectDB;