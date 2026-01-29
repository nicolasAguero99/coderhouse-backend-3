import { Router } from "express";
import { LOGGER_TEST_BASE_URL } from "./routes.js";
import { loggerTest } from "../controllers/logger.controller.js";

const loggerRouter = Router();

loggerRouter.route(LOGGER_TEST_BASE_URL)
  .get(loggerTest);

export default loggerRouter;
