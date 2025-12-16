import { createError, generateMockUsers } from "../utils/utils.js";
import { createUsersDB } from "../lib/db.users.js";
import { DICT_ERRORS_USERS } from "../constants/constants.js";
import { createPetsService } from "./pets.services.js";

export const getUsersService = async () => {
  const users = await generateMockUsers(50, 0, true);
  return users;
};

export const createUsersService = async (users, pets) => {
  const newUsers = await generateMockUsers(users, pets);
  const createdUsers = await createUsersDB(newUsers);
  if (createdUsers.length === 0) throw createError(DICT_ERRORS_USERS.ERROR_CREATING_DATA, 500);
  const petsList = [];
  createdUsers.forEach(user => {
    user.pets.forEach(pet => {
      petsList.push({ name: pet, owner: user._id });
    });
  });
  
  const createdPets = await createPetsService(petsList);
  
  if (createdPets.length === 0) throw createError(DICT_ERRORS_USERS.ERROR_CREATING_DATA, 500);

  return createdUsers;
};