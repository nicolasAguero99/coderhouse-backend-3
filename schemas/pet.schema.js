import mongoose from "mongoose";

export const PET_SCHEMA = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

export const PET_MODEL = mongoose.model('Pet', PET_SCHEMA);