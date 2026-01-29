import { PET_MODEL } from "../schemas/pet.schema.js";

export const getPetsDB = async (type) => {
  const pets = await PET_MODEL.find(type);
  return pets;
};

export const getPet = async (uid) => {
  const pet = await PET_MODEL.findById(uid);
  return pet;
};

export const getPetByOwner = async (owner) => {
  const pet = await PET_MODEL.find({ owner });
  return pet;
};