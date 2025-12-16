import { getPetsDB } from "../lib/db.pets.js";
import { createError } from "../utils/utils.js";
import { DICT_ERRORS_USERS } from "../constants/constants.js";

export const getPetsDBController = async (req, res, next) => {
  try {
    const pets = await getPetsDB();
    res.status(200).json(pets);
  } catch (error) {
    next(createError(error.message || DICT_ERRORS_USERS.ERROR_CREATING_DATA, 500));
  }
};