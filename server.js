import app from "./index.js";
import { CONFIG } from "./config.js";
import connectDB from "./lib/db.connection.js";
import { logger } from "./utils/logger.js";

connectDB();

app.listen(CONFIG.PORT, () => 
  logger.debug(`${CONFIG.ENV === "development" ? "" : "\x1b[31mProduction mode\x1b[0m"} Server is running on port ${CONFIG.PORT}`)
);
