import { PET_MODEL } from "../schemas/pet.schema.js";

export const getPetsDB = async () => {
  const pets = await PET_MODEL.find();
  return pets;
};