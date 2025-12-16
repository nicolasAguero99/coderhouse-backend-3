import { Router } from "express";
import { LOGGER_TEST_BASE_URL, PETS_DB_BASE_URL, USERS_DB_BASE_URL } from "./routes.js";
import { loggerTest } from "../controllers/logger.controller.js";
import { getUsersDBController } from "../controllers/users.controller.js";
import { getPetsDBController } from "../controllers/pets.controller.js";

const router = Router();

router.route(USERS_DB_BASE_URL)
  .get(getUsersDBController)

router.route(PETS_DB_BASE_URL)
  .get(getPetsDBController)  

router.route(LOGGER_TEST_BASE_URL)
  .get(loggerTest);

export default router;