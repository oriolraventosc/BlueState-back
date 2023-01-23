import routes from "../routes/routes";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import connectToDatabase from "../../database";
import mongoose from "mongoose";
import app from "../app";
import User from "../../database/models/user/user";
import { userRegister } from "../controllers/usersController/usersController";
import type { NextFunction, Request, Response } from "express";

let server: MongoMemoryServer;

beforeAll(async () => {
  await mongoose.disconnect();
  server = await MongoMemoryServer.create();
  await connectToDatabase(server.getUri());
});

beforeEach(async () => {
  await User.deleteMany({});
});
afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

const next = jest.fn();

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given a POST /users/login endpoint", () => {
  describe("When it receives a request with username 'admin' and password 'admin'", () => {
    test("Then it should respond with a 200 status and return the token", async () => {
      const userdata = {
        username: "admin",
        password: "admin",
      };

      const req: Partial<Request> = {
        body: userdata,
      };

      await userRegister(req as Request, res as Response, next as NextFunction);

      const expectedStatus = 200;

      const response = await request(app)
        .post(`${routes.users}${routes.login}`)
        .send(userdata)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("accessToken");
    });
  });

  describe("When it recevies a request with a wrong username and password 'admin'", () => {
    test("Then it should respond with a 401 status and a CustomError", async () => {
      const userdata = {
        username: "AdmIn",
      };
      const expectedStatus = 401;

      User.findOne = jest.fn().mockReturnValue(userdata.username);

      const response = await request(app)
        .post(`${routes.users}${routes.login}`)
        .send(userdata)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual({ error: "Missing credentials" });
    });
  });

  describe("When it receives a request with a username 'admin' and a wrong password", () => {
    test("Then it should respond with a 401 status and a CustomError", async () => {
      const userdata = {
        username: "admin",
      };
      const expectedStatus = 401;

      User.findOne = jest.fn().mockReturnValue(userdata.username);

      const response = await request(app)
        .post(`${routes.users}${routes.login}`)
        .send(userdata)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual({
        error: "Missing credentials",
      });
    });
  });
});

describe("Given a POST /users/register endpoint", () => {
  describe("When it receives a request with a username 'John' and password 'john'", () => {
    test("Then it should respons with an object with the user username and password", async () => {
      const userdata = {
        username: "John",
        password: "john",
      };
      const expectedStatus = 201;

      const response = await request(app)
        .post(`${routes.users}${routes.register}`)
        .send(userdata)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("When it receives a request with a username 'John' and a empty password", () => {
    test("Then it should respond with a 401 status", async () => {
      const userdata = {
        username: "John",
      };
      const expectedStatus = 401;

      const response = await request(app)
        .post(`${routes.users}${routes.register}`)
        .send(userdata)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual({ error: "Missing credentials!" });
    });
  });

  describe("When it receives a request with a password 'john' and a empty username", () => {
    test("Then it should respond with a 401 status", async () => {
      const userdata = {
        password: "john",
      };
      const expectedStatus = 401;

      const response = await request(app)
        .post(`${routes.users}${routes.register}`)
        .send(userdata)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual({ error: "Missing credentials!" });
    });
  });
});
