import supertest from "supertest";
import mongoose from "mongoose";
import  app from "./../app-test";
import { User } from "../services/schemas/user";

mongoose.set("strictQuery", false);

const { TEST_DB_HOST } = process.env;

describe("login", () => {

  beforeAll(async () => {
    console.log("Connect to database, clear old data and create new user");
    await mongoose.connect(TEST_DB_HOST);
    await User.deleteMany();
    
    const user = new User({ email: 'testUser1@gmail.com', password: '12345678' });
    await user.setPassword('12345678');
    await user.save();
  });

  afterAll(async () => {
    console.log("Disconnect from database");
    await mongoose.disconnect(TEST_DB_HOST);
  });

  it("should login user and return status code 200", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "testUser1@gmail.com",
      password: "12345678",
    });
    expect(response.statusCode).toBe(200);
  });

  it("should login user and return token", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "testUser1@gmail.com",
      password: "12345678",
    });
    expect(response.body.token).toBeDefined();
  });

  it("should login user and return object: email and subscription", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "testUser1@gmail.com",
      password: "12345678",
    });
    expect(response.body.user).toHaveProperty("email", "testUser1@gmail.com");
    expect(response.body.user).toHaveProperty("subscription");
    expect(response.body.user.subscription).toMatch(/starter|pro|business/);
  });

  it("Incorrect password: should try login user and return status code 401 and message: Email or password is wrong", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "testUser1@gmail.com",
      password: "123456XX",
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Email or password is wrong');
  });

  it("User not exists: should try login user and return status code 401 and message: Email or password is wrong", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "nonexistent@gmail.com",
      password: "12345678",
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Email or password is wrong');
  });

});