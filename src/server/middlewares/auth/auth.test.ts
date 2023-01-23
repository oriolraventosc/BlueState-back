import type { NextFunction, Request } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import CustomError from "../../../server/customError/customError";
import type { CustomRequest } from "../../controllers/usersController/types";
import auth from "./auth";

const next: NextFunction = jest.fn();
const req: Partial<Request> = {};
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzN2QxYjk2YTE4N2FlMmVhMTM1YTg5NyIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2Njk0ODgyMjIsImV4cCI6MTY2OTc0NzQyMn0.urLzzH_LrTvczS9InHEPr3_0J3DGfD4an4enMDTHVd4";

describe("Given an auth middleware", () => {
  const customError = new CustomError(
    "Authorization missing",
    401,
    "Authorization missing"
  );
  describe("When it receives a request with no Authorization in the header", () => {
    test("Then it should invoke next with status code 401 and 'Missing token'", () => {
      req.header = jest.fn();

      auth(req as CustomRequest, null, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a request with an Authorization that starts with cearer", () => {
    test("Then it should invoke next with status code 401 and 'Missing token'", () => {
      req.header = jest.fn().mockReturnValueOnce(`cearer ${token}`);

      auth(req as CustomRequest, null, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a request with an Authorization header with '12345456246'", () => {
    test("Then it should invoke next with status code 401 and 'Missing token'", () => {
      req.header = jest.fn().mockReturnValueOnce("12345456246");

      auth(req as CustomRequest, null, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a request with an Authorization header with 'Bearer '", () => {
    test("Then it should add the decoded user id to the request and call next", () => {
      req.header = jest.fn().mockReturnValueOnce(`Bearer ${token}`);

      const userId = new mongoose.Types.ObjectId();

      jwt.verify = jest.fn().mockReturnValueOnce({ id: userId });

      auth(req as CustomRequest, null, next);

      expect(req).toHaveProperty("userId", userId);
      expect(next).toHaveBeenCalled();
    });
  });
});
