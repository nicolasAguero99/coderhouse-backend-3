import { getPetService, getPetsService } from "../services/pets.services.js";
import { createError, generateMockPetsToBeAdopted } from "../utils/utils.js";
import { DICT_ERRORS_USERS } from "../constants/constants.js";

export const getPetsDBController = async (req, res, next) => {
  try {
    const { adopted } = req.query;
    const pets = await getPetsService(adopted);
    res.status(200).json(pets);
  } catch (error) {
    next(createError(error.message || DICT_ERRORS_USERS.ERROR_RETRIEVING_DATA, 500));
  }
};

export const getPetController = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const pet = await getPetService(uid);
    if (!pet) return next(createError(DICT_ERRORS_USERS.ERROR_PET_NOT_FOUND, 404));
    res.status(200).json(pet);
  } catch (error) {
    next(createError(error.message || DICT_ERRORS_USERS.ERROR_RETRIEVING_DATA, 500));
  }
};

export const createPetsToBeAdoptedController = async (req, res, next) => {
  try {
    const { numPets } = req.body || 10;
    if (isNaN(numPets)) throw createError(DICT_ERRORS_USERS.ERROR_VALIDATING_DATA, 400);
    const pets = await generateMockPetsToBeAdopted(numPets);
    res.status(201).json(pets);
  } catch (error) {
    next(createError(error.message || DICT_ERRORS_USERS.ERROR_CREATING_DATA, 500));
  }
};