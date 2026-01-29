import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../index.js";
import { BASE_URL_API, SESSIONS_BASE_URL, REGISTER_BASE_URL, LOGIN_BASE_URL } from "../routes/routes.js";
import { USER_MODEL } from "../schemas/user.schema.js";

describe("Sessions Endpoints", function () {
  let testUserPassword = "testpassword123";

  after(async function () {
    await USER_MODEL.deleteMany({ 
      $or: [
        { email: { $regex: "_test_", $options: "i" } },
        { name: { $regex: "_test_", $options: "i" } }
      ]
    });
  });

  describe("POST /api/sessions/register", function () {
    it("should return 201 and create a new user", async function () {
      const uniqueEmail = `_test_register${Date.now()}@example.com`;
      const response = await request(app)
        .post(`${BASE_URL_API}${SESSIONS_BASE_URL}${REGISTER_BASE_URL}`)
        .send({
          name: "_test_ User Register",
          email: uniqueEmail,
          password: testUserPassword
        })
        .expect(201);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("_id");
      expect(response.body).to.have.property("name");
      expect(response.body).to.have.property("email");
      expect(response.body).to.have.property("role");
      expect(response.body).to.have.property("password");
      expect(response.body.name).to.equal("_test_ User Register");
      expect(response.body.email).to.equal(uniqueEmail);
      expect(response.body.role).to.equal("user");
    });

    it("should return 400 when email is already in use", async function () {
      const duplicateEmail = `_test_duplicate${Date.now()}@example.com`;
      
      await request(app)
        .post(`${BASE_URL_API}${SESSIONS_BASE_URL}${REGISTER_BASE_URL}`)
        .send({
          name: "_test_ First User",
          email: duplicateEmail,
          password: testUserPassword
        })
        .expect(201);

      const response = await request(app)
        .post(`${BASE_URL_API}${SESSIONS_BASE_URL}${REGISTER_BASE_URL}`)
        .send({
          name: "_test_ Second User",
          email: duplicateEmail,
          password: testUserPassword
        })
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
      expect(response.body.status).to.equal(400);
    });

    it("should return 400 when name is missing", async function () {
      const response = await request(app)
        .post(`${BASE_URL_API}${SESSIONS_BASE_URL}${REGISTER_BASE_URL}`)
        .send({
          email: `_test_${Date.now()}@example.com`,
          password: testUserPassword
        })
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
    });

    it("should return 400 when email is missing", async function () {
      const response = await request(app)
        .post(`${BASE_URL_API}${SESSIONS_BASE_URL}${REGISTER_BASE_URL}`)
        .send({
          name: "_test_ User",
          password: testUserPassword
        })
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
    });

    it("should return 400 when password is missing", async function () {
      const response = await request(app)
        .post(`${BASE_URL_API}${SESSIONS_BASE_URL}${REGISTER_BASE_URL}`)
        .send({
          name: "_test_ User",
          email: `_test_${Date.now()}@example.com`
        })
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
    });
  });

  describe("POST /api/sessions/login", function () {
    let registeredUserEmail;
    let registeredUserPassword = "loginpassword123";

    before(async function () {
      registeredUserEmail = `_test_login${Date.now()}@example.com`;
      await request(app)
        .post(`${BASE_URL_API}${SESSIONS_BASE_URL}${REGISTER_BASE_URL}`)
        .send({
          name: "_test_ Login User",
          email: registeredUserEmail,
          password: registeredUserPassword
        });
    });

    it("should return 200 and login successfully", async function () {
      const response = await request(app)
        .post(`${BASE_URL_API}${SESSIONS_BASE_URL}${LOGIN_BASE_URL}`)
        .send({
          email: registeredUserEmail,
          password: registeredUserPassword
        })
        .expect(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("user");
      expect(response.body).to.have.property("myPets");
      expect(response.body.user).to.have.property("_id");
      expect(response.body.user).to.have.property("email");
      expect(response.body.user.email).to.equal(registeredUserEmail);
      expect(response.body.myPets).to.be.an("array");
      expect(response.body.message).to.include("Welcome back");
    });

    it("should return 401 with incorrect password", async function () {
      const response = await request(app)
        .post(`${BASE_URL_API}${SESSIONS_BASE_URL}${LOGIN_BASE_URL}`)
        .send({
          email: registeredUserEmail,
          password: "wrongpassword"
        })
        .expect(401);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
      expect(response.body.status).to.equal(401);
    });

    it("should return 401 with non-existent email", async function () {
      const response = await request(app)
        .post(`${BASE_URL_API}${SESSIONS_BASE_URL}${LOGIN_BASE_URL}`)
        .send({
          email: "nonexistent@example.com",
          password: "anypassword"
        })
        .expect(401);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
      expect(response.body.status).to.equal(401);
    });

    it("should return 400 when email is missing", async function () {
      const response = await request(app)
        .post(`${BASE_URL_API}${SESSIONS_BASE_URL}${LOGIN_BASE_URL}`)
        .send({
          password: registeredUserPassword
        })
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
    });

    it("should return 400 when password is missing", async function () {
      const response = await request(app)
        .post(`${BASE_URL_API}${SESSIONS_BASE_URL}${LOGIN_BASE_URL}`)
        .send({
          email: registeredUserEmail
        })
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("status");
    });

    it("should update last_connection on successful login", async function () {
      const beforeLogin = await USER_MODEL.findOne({ email: registeredUserEmail });
      const beforeConnection = beforeLogin.last_connection;

      await new Promise(resolve => setTimeout(resolve, 1000));

      await request(app)
        .post(`${BASE_URL_API}${SESSIONS_BASE_URL}${LOGIN_BASE_URL}`)
        .send({
          email: registeredUserEmail,
          password: registeredUserPassword
        })
        .expect(200);

      const afterLogin = await USER_MODEL.findOne({ email: registeredUserEmail });
      expect(afterLogin.last_connection.getTime()).to.be.greaterThan(beforeConnection.getTime());
    });
  });
});
