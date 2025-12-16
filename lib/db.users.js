import { USER_MODEL } from "../schemas/user.schema.js";

export const getUsersDB = async () => {
  const users = await USER_MODEL.find();
  return users;
};

export const createUsersDB = async (users) => {
  const newUsers = await USER_MODEL.insertMany(users);
  return newUsers;
};