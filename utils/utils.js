import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

export const generateMockUsers = async (numUsers, numPets, testMode = false) => {
  const users = [];
  for (let i = 0; i < numUsers; i++) {
    const userName = faker.person.fullName();
    const randomRole = Math.random() > 0.5 ? "user" : "admin";
    const petsMock = Array.from({ length: numPets }, () => faker.animal.petName());
    const encryptedPassword = await encryptPassword("coder123");
    if (testMode) {
      users.push({
        _id: new mongoose.Types.ObjectId(),
        name: userName,
        role: randomRole,
        pets: [],
        password: encryptedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      });
    } else {
      users.push({
        name: userName,
        role: randomRole,
        pets: petsMock,
        password: encryptedPassword,
      });
    }
  }
  return users;
};

export const encryptPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

/**
 * Crea un error personalizado con status code
 * @param {string} message - Mensaje de error
 * @param {number} status - Status code HTTP (por defecto 500)
 * @returns {Error} Error con propiedad status
 */
export const createError = (message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  error.statusCode = status;
  return error;
};