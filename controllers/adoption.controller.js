import { createError } from "../utils/utils.js";
import { DICT_ERRORS_USERS } from "../constants/constants.js";
import { createAdoptionService, getAllAdoptionsService } from "../services/adoption.services.js";

export const createAdoptionController = async (req, res, next) => {
  try {
    const { uid, pid } = req.params;
    const adoptionMsg = await createAdoptionService(uid, pid);
    res.status(201).json({ adoptionMsg, success: true });
  } catch (error) {
    const status = error.status || error.statusCode || 500;
    next(createError(error.message || DICT_ERRORS_USERS.ERROR_CREATING_DATA, status));
  }
};

export const getAllAdoptionsController = async (req, res, next) => {
  try {
    const adoptions = await getAllAdoptionsService();
    res.status(200).json({ adoptions, success: true });
  } catch (error) {
    next(createError(error.message || DICT_ERRORS_USERS.ERROR_GETTING_DATA, 500));
  }
};