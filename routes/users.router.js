import { Router } from "express";
import { DOCUMENTS_DB_BASE_URL, USERS_DB_BASE_URL } from "./routes.js";
import { getUserController, getUsersDBController, uploadUserDocumentController } from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.js";

const usersRouter = Router();

usersRouter.route(USERS_DB_BASE_URL)
  .get(getUsersDBController);

usersRouter.route(`${USERS_DB_BASE_URL}/:uid`)
  .get(getUserController)

usersRouter.route(`${USERS_DB_BASE_URL}/:uid${DOCUMENTS_DB_BASE_URL}`)
  .post(upload.array('files', 2), uploadUserDocumentController);

export default usersRouter;
