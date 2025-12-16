/* eslint-disable no-undef */
import dotenv from "dotenv";

const isDevFlag = process.argv.includes("--dev");
const isProdFlag = process.argv.includes("--prod");

if (isDevFlag) process.env.NODE_ENV = "development";
else if (isProdFlag) process.env.NODE_ENV = "production";

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 4000,
  ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
}