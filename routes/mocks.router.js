import { Router } from "express";
import { MOCKING_GENERATE_DATA_BASE_URL, USERS_BASE_URL } from "./routes.js";
import { getUsers, createUsers } from "../controllers/mocks/users.controller.js";

const router = Router();

router.route(USERS_BASE_URL)
.get(getUsers)

router.route(MOCKING_GENERATE_DATA_BASE_URL)
.post(createUsers);

export default router;