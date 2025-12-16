import express from "express";
import { CONFIG } from "./config.js";
import mocksRouter from "./routes/mocks.router.js";
import router from "./routes/router.js";
import { BASE_URL_API, BASE_URL_MOCKS } from "./routes/routes.js";
import { errorHandler } from "./middlewares/errors.js";
import morgan from "morgan";
import { addLogger } from "./middlewares/logger.js";
import connectDB from "./lib/db.connection.js";
import { logger } from "./utils/logger.js";

const app = express();

connectDB();
app.use(express.json());
app.use(morgan("dev"));
app.use(addLogger);
app.use(BASE_URL_API, router);
app.use(BASE_URL_MOCKS, mocksRouter);
app.use(errorHandler);

app.listen(CONFIG.PORT, () => logger.debug(`${CONFIG.ENV === "development" ? "" : "\x1b[31mProduction mode\x1b[0m"} Server is running on port ${CONFIG.PORT}`));