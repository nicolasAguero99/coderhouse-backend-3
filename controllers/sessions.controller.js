import { registerUserService, loginUserService } from "../services/sessions.services.js";
import { createError } from "../utils/utils.js";
import { DICT_ERRORS_USERS } from "../constants/constants.js";
import { getPetByOwnerService } from "../services/pets.services.js";

export const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await registerUserService(name, email, password);
    res.status(201).json(newUser);
  } catch (error) {
    const status = error.status || error.statusCode || 500;
    next(createError(error.message || DICT_ERRORS_USERS.ERROR_REGISTERING_USER, status));
  }
}

export const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await loginUserService(email, password);
    const myPets = await getPetByOwnerService(user._id);
    res.status(200).json({ message: "Hi " + user.name + "! Welcome back", myPets, user });
  } catch (error) {
    const status = error.status || error.statusCode || 500;
    next(createError(error.message || DICT_ERRORS_USERS.ERROR_LOGIN_USER, status));
  }
}