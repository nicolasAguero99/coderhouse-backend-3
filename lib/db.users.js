import { USER_MODEL } from "../schemas/user.schema.js";
import bcrypt from "bcrypt";

export const getUsersDB = async () => {
  const users = await USER_MODEL.find();
  return users;
};

export const getUser = async (uid) => {
  const user = await USER_MODEL.findById(uid);
  return user;
};

export const createUsersDB = async (users) => {
  const newUsers = await USER_MODEL.insertMany(users);
  return newUsers;
};

export const createUser = async (name, email, password, role) => {
  const newUser = await USER_MODEL.create({ name, email, password, role});
  return newUser;
};

export const updateUser = async (uid, attributesToUpdate) => {
  const user = await USER_MODEL.findByIdAndUpdate(uid, attributesToUpdate, { new: true });
  return user;
};

export const findUserByEmail = async (email) => {
  const user = await USER_MODEL.findOne({ email });
  return user;
}

export const validateUserPassword = async (rawPassword, userPassword) => {
  return await bcrypt.compare(rawPassword, userPassword);
}

export const updateUserLastConnection = async (uid) => {
  const user = await USER_MODEL.findByIdAndUpdate(uid, { last_connection: Date.now() }, { new: true });
  return user;
}