import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import { PET_MODEL } from "../schemas/pet.schema.js";

export const generateMockUsers = async (numUsers, numPets, testMode = false) => {
  const users = [];
  for (let i = 0; i < numUsers; i++) {
    const userName = faker.person.fullName();
    const randomRole = Math.random() > 0.5 ? "user" : "admin";
    const encryptedPassword = await encryptPassword("coder123");
    const email = faker.internet.email();
  
    if (testMode) {
      const _id = new mongoose.Types.ObjectId();
      const petsIds = await generateMockPet(_id, numPets);

      users.push({
        _id,
        name: userName,
        role: randomRole,
        pets: petsIds,
        password: encryptedPassword,
        email: email,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      });
    } else {
      users.push({
        name: userName,
        role: randomRole,
        pets: [],
        password: encryptedPassword,
        email: email,
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

export const generateMockPet = async (owner, numPets = 1) => {
  if (numPets === 0) return [];
  const petsIds = [];
  for (let i = 0; i < numPets; i++) {
    const name = faker.animal.petName();
    const newPet = {
      name,
      owner,
    };
    const savedPet = await PET_MODEL.create(newPet);
    petsIds.push(savedPet._id);
  }
  return petsIds;
};

export const generateMockPetsToBeAdopted = async (numPets = 10) => {
  if (numPets === 0) return [];
  const pets = [];
  for (let i = 0; i < numPets; i++) {
    const name = faker.animal.petName();
    const newPet = {
      name,
      owner: null,
    };
    const savedPet = await PET_MODEL.create(newPet);
    pets.push(savedPet);
  }
  return pets;
};