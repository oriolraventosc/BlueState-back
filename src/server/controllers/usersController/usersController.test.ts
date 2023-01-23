import enviroment from "../../../loadEnviroment";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mockUser from "../../../mocks/mockUser";
import { userLogin, userRegister } from "./usersController";
import CustomError from "../../customError/customError";
import User from "../../../database/models/user/user";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const tokenPayload = {};

const token = jwt.sign(tokenPayload, enviroment.jwtSecretKey);

const next = jest.fn();

describe("Given a userLogin controller", () => {
  describe("When it receives a response", () => {
    test("Then it should call it's method with a status 200 and the token as the json", async () => {
      const status = 200;

      const req: Partial<Request> = {
        body: mockUser,
      };

      User.findOne = jest.fn().mockReturnValue(mockUser);
      jwt.sign = jest.fn().mockReturnValueOnce(token);
      bcrypt.compare = jest.fn().mockReturnValueOnce(true);

      await userLogin(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenLastCalledWith(status);
    });
  });

  describe("When it receives a response with an empty body", () => {
    test("Then it should call the next function with a customError", async () => {
      const customError = new CustomError(
        "Missing credentials",
        401,
        "Missing credentials"
      );
      const req: Partial<Request> = {
        body: {},
      };

      User.findOne = jest.fn().mockRejectedValue(customError);
      await userLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a response with username 'asdaf' and password 'asdaf'", () => {
    test("Then it should call it's next method with a custom error", async () => {
      const customError = new CustomError(
        "Wrong credentials!",
        401,
        "Wrong credentials!"
      );
      const req: Partial<Request> = {
        body: { username: "asdaf", password: "asdaf" },
      };

      User.findOne = jest.fn().mockReturnValueOnce(null);
      await userLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a response with an empty username and a password 'admin'", () => {
    test("Then it should call the next function with a customError", async () => {
      const customError = new CustomError(
        "Missing credentials",
        401,
        "Missing credentials"
      );
      const req: Partial<Request> = {
        body: { password: "admin" },
      };

      User.findOne = jest.fn().mockRejectedValue(customError);
      await userLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a response with an empty password and a username 'admin'", () => {
    test("Then it should call the next function with a customError", async () => {
      const customError = new CustomError(
        "Missing credentials",
        401,
        "Missing credentials"
      );
      const req: Partial<Request> = {
        body: { username: "admin" },
      };

      User.findOne = jest.fn().mockRejectedValue(customError);
      await userLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a response with a wrong password 'John'", () => {
    test("Then it should call the next function", async () => {
      const req: Partial<Request> = {
        body: { username: "admin", password: "AdmiN1" },
      };

      User.findOne = jest.fn().mockReturnValue({ username: "John" });
      await userLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a response with a wrong username 'John'", () => {
    test("Then it should call the next function", async () => {
      const req: Partial<Request> = {
        body: { username: "John", password: "" },
      };

      await userLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it recevies a response and an internal error happens", () => {
    test("Then it should respond with a 500 status", async () => {
      const customError = new CustomError(
        "Oops... General error",
        500,
        "Oops... General error"
      );

      const req: Partial<Request> = {
        body: { username: "admin", password: "admin" },
      };

      User.findOne = jest.fn().mockRejectedValue(customError);
      await userLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});

describe("Given a userRegister controller", () => {
  describe("When it receives a response with a username 'John' and a password 'john'", () => {
    test("Then it should register the user 'John'", async () => {
      const status = 201;
      const hashedPassword = await bcrypt.hash(mockUser.password, 10);
      const req: Partial<Request> = {
        body: mockUser,
      };

      User.create = jest.fn().mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      await userRegister(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });

  describe("When it receives a response with a empty body", () => {
    test("Then it should call it's next method", async () => {
      const customError = new CustomError(
        "Missing credentials",
        401,
        "Missing credentials"
      );
      const req: Partial<Request> = {
        body: {},
      };

      await userRegister(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a response with a empty username and password 'john'", () => {
    test("Then it should call it's next method", async () => {
      const customError = new CustomError(
        "Missing credentials",
        401,
        "Missing credentials"
      );
      const req: Partial<Request> = {
        body: { password: "john" },
      };

      await userRegister(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a response with a empty password and a username 'John'", () => {
    test("Then it should call it's next method", async () => {
      const customError = new CustomError(
        "Missing credentials",
        401,
        "Missing credentials"
      );
      const req: Partial<Request> = {
        body: { username: "John" },
      };

      await userRegister(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it recevies a response and an internal error happens", () => {
    test("Then it should respond with a 500 status", async () => {
      const customError = new CustomError(
        "Oops... General error",
        500,
        "Oops... General error"
      );

      const req: Partial<Request> = {
        body: { username: "Johnathan", password: "johnathan" },
      };

      User.create = jest.fn().mockRejectedValue(customError);
      await userRegister(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
