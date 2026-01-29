import { Router } from "express";
import { ADOPTION_BASE_URL } from "./routes.js";
import { createAdoptionController, getAllAdoptionsController } from "../controllers/adoption.controller.js";

const router = Router();

router.route(`${ADOPTION_BASE_URL}/:uid/:pid`)
.post(createAdoptionController);

router.route(`${ADOPTION_BASE_URL}`)
.get(getAllAdoptionsController);

export default router;