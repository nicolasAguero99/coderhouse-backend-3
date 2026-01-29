import { getUsersDBService, getUserService, updateUserService } from "../services/users.services.js";
import { createError } from "../utils/utils.js";
import { DICT_ERRORS_USERS } from "../constants/constants.js";

export const getUsersDBController = async (req, res, next) => {
  try {
    const users = await getUsersDBService();
    res.status(200).json(users);
  } catch (error) {
    const status = error.status || error.statusCode || 500;
    next(createError(error.message || DICT_ERRORS_USERS.ERROR_RETRIEVING_DATA, status));
  }
};

export const getUserController = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const user = await getUserService(uid);
    res.status(200).json(user);
  } catch (error) {
    const status = error.status || error.statusCode || 500;
    next(createError(error.message || DICT_ERRORS_USERS.ERROR_RETRIEVING_DATA, status));
  }
};

export const uploadUserDocumentController = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const { files } = req;

    const user = await getUserService(uid);
    if (!user) return next(createError(DICT_ERRORS_USERS.ERROR_USER_NOT_FOUND, 404));
    if (!files) return next(createError(DICT_ERRORS_USERS.ERROR_UPLOADING_DOCUMENT, 400));
    const newDocuments = [];
    files.forEach(file => {
      const { originalname, path: reference } = file;
      let name = originalname.split('.')[0];

      if (user.documents.some(document => document.name === name)) name = `${name}-${Date.now()}`;

      const newDocument = { name, reference };
      newDocuments.push(newDocument);
    });
    const updatedUser = await updateUserService(uid, { $push: { documents: { $each: newDocuments } } });
    res.status(200).json(updatedUser);
  } catch (error) {
    const status = error.status || error.statusCode || 500;
    next(createError(error.message || DICT_ERRORS_USERS.ERROR_UPLOADING_DOCUMENT, status));
  }
};