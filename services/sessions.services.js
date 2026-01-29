import { createError, encryptPassword } from "../utils/utils.js";
import { createUser, findUserByEmail, updateUserLastConnection, validateUserPassword } from "../lib/db.users.js";
import { DICT_ERRORS_USERS } from "../constants/constants.js";

export const registerUserService = async (name, email, password) => {
  if (!name || !email || !password) throw createError(DICT_ERRORS_USERS.ERROR_VALIDATING_DATA, 400);
  const isEmailAlreadyInUse = await findUserByEmail(email);
  if (isEmailAlreadyInUse) throw createError(DICT_ERRORS_USERS.ERROR_EMAIL_ALREADY_IN_USE, 400);
  const encryptedPassword = await encryptPassword(password);
  const newUser = await createUser(name, email, encryptedPassword, "user");
  return newUser;
}

export const loginUserService = async (email, password) => {
  if (!email || !password) throw createError(DICT_ERRORS_USERS.ERROR_VALIDATING_DATA, 400);
  const user = await findUserByEmail(email)
  if (!user) throw createError(DICT_ERRORS_USERS.ERROR_LOGIN_USER, 401);
  const isPasswordValid = await validateUserPassword(password, user.password);
  if (!isPasswordValid) throw createError(DICT_ERRORS_USERS.ERROR_LOGIN_USER, 401);
  await updateUserLastConnection(user._id);
  const userwithLastConnectionFormatted = {
    ...user._doc,
    last_connection: user.last_connection.toLocaleString('es-ES', { timeZone: 'America/Buenos_Aires' }).replace(',', ' -'),
  };
  return userwithLastConnectionFormatted;
}