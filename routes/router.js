import { Router } from "express";
import usersRouter from "./users.router.js";
import petsRouter from "./pets.router.js";
import loggerRouter from "./logger.router.js";
import adoptionRouter from "./adoption.router.js";
import sessionsRouter from "./sessions.router.js";

const router = Router();

router.use(usersRouter);
router.use(petsRouter);
router.use(adoptionRouter);
router.use(sessionsRouter);
router.use(loggerRouter);

export default router;