import { getPet, getPetByOwner, getPetsDB } from "../lib/db.pets.js";
import { PET_MODEL } from "../schemas/pet.schema.js";

export const getPetsService = async (adopted) => {
  let type;
  if (adopted == 'true') type = { owner: { $ne: null } }
  else if (adopted == 'false') type = { owner: null }
  else type = {};

  const pets = await getPetsDB(type);
  return pets;
};

export const getPetService = async (uid) => {
  const pet = await getPet(uid);
  return pet;
};

export const getPetByOwnerService = async (owner) => {
  const pet = await getPetByOwner(owner);
  return pet;
};

export const createPetsService = async (pets) => {
  const newPets = await PET_MODEL.create(pets);
  return newPets;
};