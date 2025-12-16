import winston from "winston";
import { CONFIG } from "../config.js";
import { CUSTOM_LEVELS } from "../constants/constants.js";

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.simple()
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

winston.addColors(CUSTOM_LEVELS.colors);

const loggerDevelopment = winston.createLogger({
  levels: CUSTOM_LEVELS.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: consoleFormat
    })
  ]
});


const loggerProduction = winston.createLogger({
  levels: CUSTOM_LEVELS.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: consoleFormat
    }),
    new winston.transports.File({
      filename: "logs.log",
      level: "error",
      format: fileFormat
    })
  ]
});


export const logger =
  CONFIG.ENV === "production"
    ? loggerProduction
    : loggerDevelopment;
