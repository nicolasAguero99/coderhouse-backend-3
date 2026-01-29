import mongoose from "mongoose";

export const USER_SCHEMA = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true,
    default: "user",
  },
  pets: {
    type: Array,
    required: true,
    default: [],
  },
  password: {
    type: String,
    required: true,
  },
  documents: {
    type: Array,
    required: true,
    default: [],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  last_connection: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, { timestamps: true });

export const USER_MODEL = mongoose.model('User', USER_SCHEMA);