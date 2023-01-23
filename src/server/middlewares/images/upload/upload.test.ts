import uploadLogo from "./upload";
import fs from "fs/promises";
import type { Request, Response, NextFunction } from "express";
import CustomError from "../../../customError/customError";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a uploadLogo middleware", () => {
  describe("When it receives a logo 'contact-123456.webp'", () => {
    test("Then it should call it's next method", async () => {
      const file: Partial<Express.Multer.File> = {
        filename: "contact-123456.webp",
        originalname: "contact-123456.webp",
      };
      const req: Partial<Request> = {
        body: {
          logo: file,
        },
      };
      req.file = file as Express.Multer.File;

      await uploadLogo(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a logo 'contact-123456.webp' and the readfile failes", () => {
    test("Then it should cal it's next method with a customError", async () => {
      const customError = new CustomError(
        "Error uploading the image!",
        500,
        "Error uploading the image!"
      );
      const file: Partial<Express.Multer.File> = {
        filename: "contact-123456.webp",
        originalname: "contact-123456.webp",
      };
      const req: Partial<Request> = {
        body: {
          logo: file,
        },
      };
      req.file = file as Express.Multer.File;
      fs.readFile = jest.fn().mockRejectedValue(customError);

      await uploadLogo(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
