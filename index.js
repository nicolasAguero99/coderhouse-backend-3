import express from "express";
import mocksRouter from "./routes/mocks.router.js";
import router from "./routes/router.js";
import { BASE_URL_API, BASE_URL_MOCKS, HEALTH_BASE_URL } from "./routes/routes.js";
import { errorHandler } from "./middlewares/errors.js";
import morgan from "morgan";
import { addLogger } from "./middlewares/logger.js";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { API_DOCS_PATH } from "./routes/routes.js";
import healthRouter from "./routes/health.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerDocument = JSON.parse(readFileSync(join(__dirname, "./docs/swagger.json"), "utf-8"));

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(addLogger);
app.use(HEALTH_BASE_URL, healthRouter);
app.use(BASE_URL_API, router);
app.use(BASE_URL_MOCKS, mocksRouter);
app.use(API_DOCS_PATH, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler);

export default app;