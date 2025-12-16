import { getUsersDB } from "../lib/db.users.js";
import { createError } from "../utils/utils.js";
import { DICT_ERRORS_USERS } from "../constants/constants.js";

export const getUsersDBController = async (req, res, next) => {
  try {
    const users = await getUsersDB();
    res.status(200).json(users);
  } catch (error) {
    next(createError(error.message || DICT_ERRORS_USERS.ERROR_CREATING_DATA, 500));
  }
};