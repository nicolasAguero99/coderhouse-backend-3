import { PET_MODEL } from "../schemas/pet.schema.js";

export const getPetsService = async () => {
  const pets = await PET_MODEL.find();
  return pets;
};

export const createPetsService = async (pets) => {
  const newPets = await PET_MODEL.create(pets);
  return newPets;
};