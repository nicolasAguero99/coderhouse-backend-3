import { DICT_ERRORS_USERS } from "../../constants/constants.js";
import { getUsersService, createUsersService } from "../../services/users.services.js";
import { createError } from "../../utils/utils.js";

const getUsers = async (req, res, next) => {
  try {
    const users = await getUsersService();
    res.status(200).json(users);
  } catch (error) {
    if (error.status) {
      return next(error);
    }
    next(createError(DICT_ERRORS_USERS.ERROR_RETRIEVING_DATA, 500));
  }
};

const createUsers = async (req, res, next) => {
  try {
    const { users, pets } = req.query;
    
    if (users <= 0) {
      throw createError(DICT_ERRORS_USERS.ERROR_USERS_MUST_BE_GREATER_THAN_0, 400);
    }
    if (pets <= 0) {
      throw createError(DICT_ERRORS_USERS.ERROR_PETS_MUST_BE_GREATER_THAN_0, 400);
    }
    if (isNaN(users) || isNaN(pets)) {
      throw createError(DICT_ERRORS_USERS.ERROR_VALIDATING_DATA, 400);
    }
    
    const createdUsers = await createUsersService(users, pets);
    res.status(201).json(createdUsers);
  } catch (error) {
    if (error.status) {
      return next(error);
    }
    next(createError(error.message || DICT_ERRORS_USERS.ERROR_CREATING_DATA, 500));
  }
};

export { getUsers, createUsers };