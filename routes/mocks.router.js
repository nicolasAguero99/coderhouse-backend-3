import { Router } from "express";
import { MOCKING_GENERATE_DATA_BASE_URL, PETS_TO_BE_ADOPTED_BASE_URL, USERS_BASE_URL } from "./routes.js";
import { getUsers, createUsers } from "../controllers/mocks/users.controller.js";
import { createPetsToBeAdoptedController } from "../controllers/pets.controller.js";

const router = Router();

router.route(USERS_BASE_URL)
.get(getUsers)

router.route(PETS_TO_BE_ADOPTED_BASE_URL)
.post(createPetsToBeAdoptedController);

router.route(MOCKING_GENERATE_DATA_BASE_URL)
.post(createUsers);

export default router;