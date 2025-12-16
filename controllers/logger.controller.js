import { createError } from "../utils/utils.js";
import { DICT_ERRORS_USERS } from "../constants/constants.js";
import { CONFIG } from "../config.js";

export const loggerTest = (req, res, next) => {
  try {
    req.logger.debug("Debug message");
    req.logger.http("HTTP message");
    req.logger.info("Info message");
    req.logger.warning("Warning message");
    req.logger.error("Error message");
    req.logger.fatal("Fatal message");
    res.status(200).json({ message: `Logs were generated, check console${CONFIG.ENV === "development" ? "" : " or errors.log file"}` });
  } catch (error) {
    next(createError(error.message || DICT_ERRORS_USERS.ERROR_CREATING_DATA, 500));
  }
};