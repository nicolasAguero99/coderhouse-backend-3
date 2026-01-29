import { Router } from "express";
import { LOGIN_BASE_URL, REGISTER_BASE_URL, SESSIONS_BASE_URL } from "./routes.js";
import { registerUserController, loginUserController } from "../controllers/sessions.controller.js";

const sessionsRouter = Router();

sessionsRouter.route(`${SESSIONS_BASE_URL}${REGISTER_BASE_URL}`)
  .post(registerUserController);

sessionsRouter.route(`${SESSIONS_BASE_URL}${LOGIN_BASE_URL}`)
  .post(loginUserController);

export default sessionsRouter;
