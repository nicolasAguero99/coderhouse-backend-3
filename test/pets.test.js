import { describe, it, before, after, afterEach } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../index.js";
import { BASE_URL_API, PETS_DB_BASE_URL, BASE_URL_MOCKS, PETS_TO_BE_ADOPTED_BASE_URL } from "../routes/routes.js";
import { PET_MODEL } from "../schemas/pet.schema.js";

describe("Pets Endpoints", function () {
  after(async function () {
    await PET_MODEL.deleteMany({ 
      name: { $regex: "_test_", $options: "i" }
    });
  });
  describe("GET /api/petsDB", function () {
    it("should return 200 and an array of pets", async function () {
      const response = await request(app)
        .get(`${BASE_URL_API}${PETS_DB_BASE_URL}`)
        .expect(200);

      expect(response.body).to.be.an("array");
      if (response.body.length > 0) {
        expect(response.body[0]).to.have.property("_id");
        expect(response.body[0]).to.have.property("name");
        expect(response.body[0]).to.have.property("owner");
      }
    });

    it("should return pets with correct structure", async function () {
      const response = await request(app)
        .get(`${BASE_URL_API}${PETS_DB_BASE_URL}`)
        .expect(200);

      expect(response.body).to.be.an("array");
      response.body.forEach((pet) => {
        expect(pet).to.have.property("_id");
        expect(pet).to.have.property("name");
        expect(pet).to.have.property("owner");
        expect(pet.name).to.be.a("string");
        expect(pet.owner === null || typeof pet.owner === "string").to.be.true;
      });
    });

    it("should filter pets by adopted=true", async function () {
      const response = await request(app)
        .get(`${BASE_URL_API}${PETS_DB_BASE_URL}`)
        .query({ adopted: "true" })
        .expect(200);

      expect(response.body).to.be.an("array");
      response.body.forEach((pet) => {
        expect(pet.owner).to.not.be.null;
      });
    });

    it("should filter pets by adopted=false", async function () {
      const response = await request(app)
        .get(`${BASE_URL_API}${PETS_DB_BASE_URL}`)
        .query({ adopted: "false" })
        .expect(200);

      expect(response.body).to.be.an("array");
      response.body.forEach((pet) => {
        expect(pet.owner).to.be.null;
      });
    });

    it("should return pets with timestamps when available", async function () {
      const response = await request(app)
        .get(`${BASE_URL_API}${PETS_DB_BASE_URL}`)
        .expect(200);

      expect(response.body).to.be.an("array");
      if (response.body.length > 0) {
        const pet = response.body[0];
        if (pet.createdAt) {
          expect(pet.createdAt).to.be.a("string");
        }
        if (pet.updatedAt) {
          expect(pet.updatedAt).to.be.a("string");
        }
      }
    });
  });

  describe("GET /api/petsDB/:uid", function () {
    let testPetId;

    before(async function () {
      const testPet = await PET_MODEL.create({
        name: "Test Pet",
        owner: null
      });
      testPetId = testPet._id.toString();
    });

    it("should return 200 and a single pet by ID", async function () {
      const response = await request(app)
        .get(`${BASE_URL_API}${PETS_DB_BASE_URL}/${testPetId}`)
        .expect(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("_id");
      expect(response.body._id).to.equal(testPetId);
      expect(response.body).to.have.property("name");
      expect(response.body).to.have.property("owner");
    });

    it("should return 404 for non-existent pet ID", async function () {
      const fakeId = "507f1f77bcf86cd799439999";
      const response = await request(app)
        .get(`${BASE_URL_API}${PETS_DB_BASE_URL}/${fakeId}`)
        .expect(404);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
    });

    it("should return 500 for invalid pet ID format", async function () {
      const response = await request(app)
        .get(`${BASE_URL_API}${PETS_DB_BASE_URL}/invalid-id`)
        .expect(500);

      expect(response.body).to.have.property("message");
    });
  });

  describe("POST /api/mocks/generatePetsToBeAdopted", function () {
    let createdPetIds = [];

    afterEach(async function () {
      if (createdPetIds.length > 0) {
        await PET_MODEL.deleteMany({ _id: { $in: createdPetIds } });
        createdPetIds = [];
      }
    });

    it("should return 201 and create pets without owner", async function () {
      const response = await request(app)
        .post(`${BASE_URL_MOCKS}${PETS_TO_BE_ADOPTED_BASE_URL}`)
        .send({ numPets: 5 })
        .expect(201);

      expect(response.body).to.be.an("array");
      expect(response.body.length).to.equal(5);
      
      response.body.forEach((pet) => {
        expect(pet).to.have.property("_id");
        expect(pet).to.have.property("name");
        expect(pet).to.have.property("owner");
        expect(pet.owner).to.be.null;
        createdPetIds.push(pet._id);
      });
    });

    it("should create pets with correct structure", async function () {
      const response = await request(app)
        .post(`${BASE_URL_MOCKS}${PETS_TO_BE_ADOPTED_BASE_URL}`)
        .send({ numPets: 3 })
        .expect(201);

      expect(response.body).to.be.an("array");
      response.body.forEach((pet) => {
        expect(pet).to.have.property("_id");
        expect(pet).to.have.property("name");
        expect(pet).to.have.property("owner");
        expect(pet.name).to.be.a("string");
        expect(pet.owner).to.be.null;
        createdPetIds.push(pet._id);
      });
    });
  });
});
