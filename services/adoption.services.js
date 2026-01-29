import { createError } from "../utils/utils.js";
import { PET_MODEL } from "../schemas/pet.schema.js";
import { USER_MODEL } from "../schemas/user.schema.js";
import { DICT_ERRORS_USERS } from "../constants/constants.js";
import mongoose from "mongoose";

export const getAllAdoptionsService = async () => {
  const users = await USER_MODEL.find({ pets: { $ne: [] } });

  const adoptions = await Promise.all(
    users.map(async (user) => {
      const petsNames = await Promise.all(
        user.pets.map(async (petId) => {
          const petData = await PET_MODEL.findById(petId);
          return petData ? petData.name : null;
        })
      );

      return {
        user: user.name,
        pet: petsNames.filter(Boolean),
      };
    })
  );

  return adoptions;
};

export const createAdoptionService = async (userId, petId) => {
  try {
    if (!userId || !petId) throw createError(DICT_ERRORS_USERS.ERROR_VALIDATING_DATA, 400);

    let petIdObjectId;
    let userIdObjectId;
    try {
      petIdObjectId = new mongoose.Types.ObjectId(petId);
      userIdObjectId = new mongoose.Types.ObjectId(userId);
    } catch {
      throw createError(DICT_ERRORS_USERS.ERROR_VALIDATING_DATA, 400);
    }

    const user = await USER_MODEL.findById(userIdObjectId);
    if (!user) throw createError(DICT_ERRORS_USERS.ERROR_FINDING_USER, 404);
    
    if (user.pets.some(pet => pet.toString() === petIdObjectId.toString())) {
      throw createError(DICT_ERRORS_USERS.ERROR_PET_ALREADY_ADOPTED_BY_USER, 400);
    }

    const pet = await PET_MODEL.findById(petIdObjectId);
    if (!pet) throw createError(DICT_ERRORS_USERS.ERROR_FINDING_PET, 404);
    
    if (pet.owner !== null) {
      throw createError(DICT_ERRORS_USERS.ERROR_PET_ALREADY_ADOPTED, 400);
    }

    await USER_MODEL.findByIdAndUpdate(userIdObjectId, { $push: { pets: petIdObjectId } });
    await PET_MODEL.findByIdAndUpdate(petIdObjectId, { $set: { owner: userIdObjectId } });

    return `Adoption created successfully for user ${user.name} and pet ${pet.name}`;
  } catch (error) {
    const status = error.status || error.statusCode;
    throw createError(error.message || DICT_ERRORS_USERS.ERROR_CREATING_DATA, status);
  }
};