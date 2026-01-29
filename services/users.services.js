import { createError, generateMockPet, generateMockUsers } from "../utils/utils.js";
import { createUsersDB, getUser, getUsersDB, updateUser } from "../lib/db.users.js";
import { DICT_ERRORS_USERS } from "../constants/constants.js";

// Service para obtener usuarios de la DB
export const getUsersDBService = async () => {
  const users = await getUsersDB();
  return users;
};

export const getUserService = async (uid) => {
  const user = await getUser(uid);
  if (!user) throw createError(DICT_ERRORS_USERS.ERROR_USER_NOT_FOUND, 404);
  return user;
};

export const updateUserService = async (uid, attributesToUpdate) => {
  const user = await updateUser(uid, attributesToUpdate);
  return user;
};

// Service para mocks
export const getUsersService = async () => {
  const users = await generateMockUsers(50, 0, true);
  return users;
};

export const createUsersService = async (users, pets) => {
  const newUsers = await generateMockUsers(users, pets);
  const createdUsers = await createUsersDB(newUsers);
  if (createdUsers.length === 0) throw createError(DICT_ERRORS_USERS.ERROR_CREATING_DATA, 500);
  const updatedUsers = [];
  for (const user of createdUsers) {
    const petsIds = await generateMockPet(user._id, pets);
    const updatedUser = await updateUser(user._id, { pets: petsIds });
    updatedUsers.push(updatedUser);
  }
  return updatedUsers;
};