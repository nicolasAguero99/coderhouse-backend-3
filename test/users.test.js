import { describe, it, before, after, afterEach } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../index.js";
import { 
  BASE_URL_API, 
  BASE_URL_MOCKS, 
  MOCKING_GENERATE_DATA_BASE_URL, 
  USERS_DB_BASE_URL,
  USERS_BASE_URL,
  DOCUMENTS_DB_BASE_URL
} from "../routes/routes.js";
import { USER_MODEL } from "../schemas/user.schema.js";
import { PET_MODEL } from "../schemas/pet.schema.js";
import { Buffer } from "buffer";

describe("Users Endpoints", function () {
  after(async function () {
    await USER_MODEL.deleteMany({ 
      $or: [
        { email: { $regex: "_test_", $options: "i" } },
        { name: { $regex: "_test_", $options: "i" } }
      ]
    });
    const testUsers = await USER_MODEL.find({ 
      $or: [
        { email: { $regex: "_test_", $options: "i" } },
        { name: { $regex: "_test_", $options: "i" } }
      ]
    });
    const testUserIds = testUsers.map(u => u._id);
    await PET_MODEL.deleteMany({ owner: { $in: testUserIds } });
  });

  describe("GET /api/usersDB", function () {
    it("should return 200 and an array of users", async function () {
      const response = await request(app)
        .get(`${BASE_URL_API}${USERS_DB_BASE_URL}`)
        .expect(200);

      expect(response.body).to.be.an("array");
      if (response.body.length > 0) {
        expect(response.body[0]).to.have.property("_id");
        expect(response.body[0]).to.have.property("name");
        expect(response.body[0]).to.have.property("role");
      }
    });

    it("should return users with correct structure", async function () {
      const response = await request(app)
        .get(`${BASE_URL_API}${USERS_DB_BASE_URL}`)
        .expect(200);

      expect(response.body).to.be.an("array");
      response.body.forEach((user) => {
        expect(user).to.have.property("_id");
        expect(user).to.have.property("name");
        expect(user).to.have.property("email");
        expect(user).to.have.property("role");
        expect(user).to.have.property("pets");
        expect(user).to.have.property("documents");
        expect(user).to.have.property("last_connection");
        expect(user.role).to.be.oneOf(["user", "admin"]);
        expect(user.pets).to.be.an("array");
        expect(user.documents).to.be.an("array");
      });
    });
  });

  describe("GET /api/usersDB/:uid", function () {
    let testUserId;

    before(async function () {
      const testUser = await USER_MODEL.create({
        name: "_test_ User",
        email: `test${Date.now()}@example.com`,
        password: "hashedpassword",
        role: "user"
      });
      testUserId = testUser._id.toString();
    });

    it("should return 200 and a single user by ID", async function () {
      const response = await request(app)
        .get(`${BASE_URL_API}${USERS_DB_BASE_URL}/${testUserId}`)
        .expect(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("_id");
      expect(response.body._id).to.equal(testUserId);
      expect(response.body).to.have.property("name");
      expect(response.body).to.have.property("email");
      expect(response.body).to.have.property("role");
    });

    it("should return 404 for non-existent user ID", async function () {
      const fakeId = "507f1f77bcf86cd799439999";
      const response = await request(app)
        .get(`${BASE_URL_API}${USERS_DB_BASE_URL}/${fakeId}`)
        .expect(404);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
    });

    it("should return 500 for invalid user ID format", async function () {
      const response = await request(app)
        .get(`${BASE_URL_API}${USERS_DB_BASE_URL}/invalid-id`)
        .expect(500);

      expect(response.body).to.have.property("message");
    });
  });

  describe("POST /api/usersDB/:uid/documents", function () {
    let testUserId;

    before(async function () {
      const testUser = await USER_MODEL.create({
        name: "_test_ User Documents",
        email: `_test_doc${Date.now()}@example.com`,
        password: "coder123",
        role: "user"
      });
      testUserId = testUser._id.toString();
    });

    it("should return 200 and upload documents to user", async function () {
      const testFile1 = Buffer.from("test file content 1");
      const testFile2 = Buffer.from("test file content 2");

      const response = await request(app)
        .post(`${BASE_URL_API}${USERS_DB_BASE_URL}/${testUserId}${DOCUMENTS_DB_BASE_URL}`)
        .attach("files", testFile1, "test1.txt")
        .attach("files", testFile2, "test2.txt")
        .expect(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("_id");
      expect(response.body).to.have.property("documents");
      expect(response.body.documents).to.be.an("array");
      expect(response.body.documents.length).to.be.at.least(2);
      
      response.body.documents.forEach((doc) => {
        expect(doc).to.have.property("name");
        expect(doc).to.have.property("reference");
        expect(doc.reference).to.include("uploads/");
      });
    });

    it("should return 400 when no files are provided", async function () {
      const response = await request(app)
        .post(`${BASE_URL_API}${USERS_DB_BASE_URL}/${testUserId}${DOCUMENTS_DB_BASE_URL}`)
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
    });

    it("should return 404 for non-existent user ID", async function () {
      const fakeId = "507f1f77bcf86cd799439999";
      const testFile = Buffer.from("test file content");

      const response = await request(app)
        .post(`${BASE_URL_API}${USERS_DB_BASE_URL}/${fakeId}${DOCUMENTS_DB_BASE_URL}`)
        .attach("files", testFile, "test.txt")
        .expect(404);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
    });
  });

  describe("GET /api/mocks/mockingusers", function () {
    it("should return 200 and an array of 50 mock users", async function () {
      this.timeout(10000);
      const response = await request(app)
        .get(`${BASE_URL_MOCKS}${USERS_BASE_URL}`)
        .expect(200);

      expect(response.body).to.be.an("array");
      expect(response.body.length).to.equal(50);
    });

    it("should return mock users with correct structure", async function () {
      this.timeout(10000);
      const response = await request(app)
        .get(`${BASE_URL_MOCKS}${USERS_BASE_URL}`)
        .expect(200);

      expect(response.body).to.be.an("array");
      if (response.body.length > 0) {
        const user = response.body[0];
        expect(user).to.have.property("_id");
        expect(user).to.have.property("name");
        expect(user).to.have.property("role");
        expect(user).to.have.property("password");
        expect(user).to.have.property("pets");
        expect(user.pets).to.be.an("array");
        expect(user.role).to.be.oneOf(["user", "admin"]);
      }
    });
  });

  describe("POST /api/mocks/generateData", function () {
    let createdUserIds = [];

    afterEach(async function () {
      if (createdUserIds.length > 0) {
        const users = await USER_MODEL.find({ _id: { $in: createdUserIds } });
        const allPetIds = [];
        users.forEach(user => {
          if (user.pets && user.pets.length > 0) {
            allPetIds.push(...user.pets.map(p => p.toString()));
          }
        });
        if (allPetIds.length > 0) {
          await PET_MODEL.deleteMany({ _id: { $in: allPetIds } });
        }
        await USER_MODEL.deleteMany({ _id: { $in: createdUserIds } });
        createdUserIds = [];
      }
    });

    it("should return 201 and create users with pets", async function () {
      const response = await request(app)
        .post(`/api/mocks${MOCKING_GENERATE_DATA_BASE_URL}`)
        .query({ users: 5, pets: 2 })
        .expect(201);

      expect(response.body).to.be.an("array");
      expect(response.body.length).to.equal(5);
      
      response.body.forEach((user) => {
        expect(user).to.have.property("_id");
        expect(user).to.have.property("name");
        expect(user).to.have.property("pets");
        expect(user.pets).to.be.an("array");
        expect(user.pets.length).to.equal(2);
        createdUserIds.push(user._id);
      });
    });

    it("should return 201 with valid parameters", async function () {
      const response = await request(app)
        .post(`/api/mocks${MOCKING_GENERATE_DATA_BASE_URL}`)
        .query({ users: 3, pets: 1 })
        .expect(201);

      expect(response.body).to.be.an("array");
      expect(response.body.length).to.equal(3);
      response.body.forEach((user) => {
        createdUserIds.push(user._id);
      });
    });

    it("should return 400 when users parameter is 0", async function () {
      const response = await request(app)
        .post(`/api/mocks${MOCKING_GENERATE_DATA_BASE_URL}`)
        .query({ users: 0, pets: 2 })
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
      expect(response.body.status).to.equal(400);
    });

    it("should return 400 when users parameter is negative", async function () {
      const response = await request(app)
        .post(`/api/mocks${MOCKING_GENERATE_DATA_BASE_URL}`)
        .query({ users: -1, pets: 2 })
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
      expect(response.body.status).to.equal(400);
    });

    it("should return 400 when pets parameter is 0", async function () {
      const response = await request(app)
        .post(`/api/mocks${MOCKING_GENERATE_DATA_BASE_URL}`)
        .query({ users: 5, pets: 0 })
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
      expect(response.body.status).to.equal(400);
    });

    it("should return 400 when pets parameter is negative", async function () {
      const response = await request(app)
        .post(`/api/mocks${MOCKING_GENERATE_DATA_BASE_URL}`)
        .query({ users: 5, pets: -1 })
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
      expect(response.body.status).to.equal(400);
    });

    it("should return 400 when users parameter is missing", async function () {
      const response = await request(app)
        .post(`/api/mocks${MOCKING_GENERATE_DATA_BASE_URL}`)
        .query({ pets: 2 })
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
    });

    it("should return 400 when pets parameter is missing", async function () {
      const response = await request(app)
        .post(`/api/mocks${MOCKING_GENERATE_DATA_BASE_URL}`)
        .query({ users: 5 })
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
    });

    it("should return 400 when parameters are not numbers", async function () {
      const response = await request(app)
        .post(`/api/mocks${MOCKING_GENERATE_DATA_BASE_URL}`)
        .query({ users: "abc", pets: "xyz" })
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
      expect(response.body.status).to.equal(400);
    });
  });
});
