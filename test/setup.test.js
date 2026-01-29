import mongoose from "mongoose";
import connectDB from "../lib/db.connection.js";
import { USER_MODEL } from "../schemas/user.schema.js";
import { PET_MODEL } from "../schemas/pet.schema.js";
import { before, after } from "mocha";

before(async function () {
  await connectDB();
});

after(async function () {
  const testUsers = await USER_MODEL.find({
    $or: [
      { name: { $regex: "_test_", $options: "i" } },
      { email: { $regex: "_test_", $options: "i" } }
    ]
  });
  
  const testUserIds = testUsers.map(u => u._id);
  
  await PET_MODEL.deleteMany({ 
    $or: [
      { owner: { $in: testUserIds } },
      { name: { $regex: "_test_", $options: "i" } }
    ]
  });
  
  await USER_MODEL.deleteMany({
    $or: [
      { name: { $regex: "_test_", $options: "i" } },
      { email: { $regex: "_test_", $options: "i" } }
    ]
  });

  await mongoose.connection.close();
});
