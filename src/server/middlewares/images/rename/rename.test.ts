import type { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import CustomError from "../../../customError/customError";
import rename from "./rename";

const next = jest.fn();

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given a rename middleware", () => {
  describe("When it receives a file 'contact.jpg'", () => {
    test("Then it should rename the image and call it's next method", async () => {
      const file: Partial<Express.Multer.File> = {
        originalname: "contact.jpg",
      };

      const req: Partial<Request> = {
        body: {
          file,
        },
      };

      req.file = file as Express.Multer.File;

      await rename(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a file 'contact.jpg' and an internal server error happens", () => {
    test("Then it should call it's next method with a customError", async () => {
      const customError = new CustomError(
        "Error renaming the image",
        500,
        "Error renaming the image"
      );

      const file: Partial<Express.Multer.File> = {
        originalname: "contact.jpg",
      };

      const req: Partial<Request> = {
        body: {
          file,
        },
      };

      req.file = file as Express.Multer.File;

      fs.rename = jest.fn().mockRejectedValue(customError);

      await rename(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
