import { Router } from "express";
import { PETS_DB_BASE_URL } from "./routes.js";
import { getPetController, getPetsDBController } from "../controllers/pets.controller.js";

const petsRouter = Router();

petsRouter.route(PETS_DB_BASE_URL)
  .get(getPetsDBController);

petsRouter.route(`${PETS_DB_BASE_URL}/:uid`)
  .get(getPetController);

export default petsRouter;
