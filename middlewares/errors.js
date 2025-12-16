import { DICT_ERRORS_USERS } from "../constants/constants.js";
import { logger } from "../utils/logger.js";

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || DICT_ERRORS_USERS.ERROR_UNKNOWN_ERROR || "Internal server error";

  logger.error(`${status} - ${message} - ${req.method} ${req.originalUrl}`);

  return res.status(status).json({
    success: false,
    status,
    message,
  });
};
