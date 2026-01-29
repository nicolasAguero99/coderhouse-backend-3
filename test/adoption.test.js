import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../index.js";
import { BASE_URL_API, ADOPTION_BASE_URL } from "../routes/routes.js";
import { USER_MODEL } from "../schemas/user.schema.js";
import { PET_MODEL } from "../schemas/pet.schema.js";
import { encryptPassword } from "../utils/utils.js";

describe("Adoption Endpoints", function () {
  let testUserId;
  let testPetId;

  before(async function () {    
    const hashedPassword = await encryptPassword("testpassword123");
    const testUser = await USER_MODEL.create({
      name: "_test_ Adopter",
      email: `_test_adopter${Date.now()}@example.com`,
      password: hashedPassword,
      role: "user"
    });
    testUserId = testUser._id.toString();

    const adoptedPet = await PET_MODEL.create({
      name: "_test_ Adopted Pet",
      owner: testUserId
    });
    testPetId = adoptedPet._id.toString();
  });

  after(async function () {
    await USER_MODEL.deleteMany({ email: { $regex: "_test_", $options: "i" } });
    await PET_MODEL.deleteMany({
      name: { $regex: "_test_", $options: "i" }
    });
  });

  describe("GET /api/adoption", function () {
    it("should return 200 and an array of adoptions", async function () {
      const response = await request(app)
        .get(`${BASE_URL_API}${ADOPTION_BASE_URL}`)
        .expect(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("adoptions");
      expect(response.body).to.have.property("success");
      expect(response.body.success).to.be.true;
      expect(response.body.adoptions).to.be.an("array");
    });

    it("should return adoptions with correct structure", async function () {
      const response = await request(app)
        .get(`${BASE_URL_API}${ADOPTION_BASE_URL}`)
        .expect(200);

      expect(response.body.adoptions).to.be.an("array");
      response.body.adoptions.forEach((adoption) => {
        expect(adoption).to.have.property("user");
        expect(adoption).to.have.property("pet");
        expect(adoption.user).to.be.a("string");
        expect(adoption.pet).to.be.an("array");
        adoption.pet.forEach((petName) => {
          expect(petName).to.be.a("string");
        });
      });
    });
  });

  describe("POST /api/adoption/:uid/:pid", function () {
    it("should return 201 and create an adoption", async function () {
      const newPet = await PET_MODEL.create({
        name: `_test_ Pet Adoption ${Date.now()}`,
        owner: null
      });
      const newAvailablePetId = newPet._id.toString();

      const response = await request(app)
        .post(`${BASE_URL_API}${ADOPTION_BASE_URL}/${testUserId}/${newAvailablePetId}`)
        .expect(201);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("adoptionMsg");
      expect(response.body).to.have.property("success");
      expect(response.body.success).to.be.true;
      expect(response.body.adoptionMsg).to.be.a("string");
      expect(response.body.adoptionMsg).to.include("Adoption created successfully");

      const updatedPet = await PET_MODEL.findById(newAvailablePetId);
      expect(updatedPet.owner.toString()).to.equal(testUserId);

      const updatedUser = await USER_MODEL.findById(testUserId);
      expect(updatedUser.pets).to.include(newAvailablePetId);
    });

    it("should return 400 when pet is already adopted", async function () {
      const response = await request(app)
        .post(`${BASE_URL_API}${ADOPTION_BASE_URL}/${testUserId}/${testPetId}`)
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
      expect(response.body.status).to.equal(400);
    });

    it("should return 400 when user already has the pet", async function () {
      const newPet = await PET_MODEL.create({
        name: `_test_ Pet Adoption Duplicate ${Date.now()}`,
        owner: null
      });
      const newAvailablePetId = newPet._id.toString();

      await request(app)
        .post(`${BASE_URL_API}${ADOPTION_BASE_URL}/${testUserId}/${newAvailablePetId}`)
        .expect(201);

      const response = await request(app)
        .post(`${BASE_URL_API}${ADOPTION_BASE_URL}/${testUserId}/${newAvailablePetId}`)
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
      expect(response.body.status).to.equal(400);
    });

    it("should return 404 for non-existent user ID", async function () {
      const fakeUserId = "507f1f77bcf86cd799439999";
      const newPet = await PET_MODEL.create({
        name: `_test_ Pet Adoption ${Date.now()}`,
        owner: null
      });
      const newAvailablePetId = newPet._id.toString();
      const response = await request(app)
        .post(`${BASE_URL_API}${ADOPTION_BASE_URL}/${fakeUserId}/${newAvailablePetId}`)
        .expect(404);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
    });

    it("should return 404 for non-existent pet ID", async function () {
      const fakePetId = "507f1f77bcf86cd799439999";
      const response = await request(app)
        .post(`${BASE_URL_API}${ADOPTION_BASE_URL}/${testUserId}/${fakePetId}`)
        .expect(404);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
    });

    it("should return 400 when user ID is invalid", async function () {
      const newPet = await PET_MODEL.create({
        name: `_test_ Pet Adoption Invalid ${Date.now()}`,
        owner: null
      });
      const newAvailablePetId = newPet._id.toString();

      const response = await request(app)
        .post(`${BASE_URL_API}${ADOPTION_BASE_URL}/invalid-id/${newAvailablePetId}`)
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
    });

    it("should return 400 when pet ID is invalid", async function () {
      const response = await request(app)
        .post(`${BASE_URL_API}${ADOPTION_BASE_URL}/${testUserId}/invalid-id`)
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
    });
  });
});
