import resize from "./resize";
import type { Request, Response, NextFunction } from "express";
import CustomError from "../../../customError/customError";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a resize middleware", () => {
  describe("When it receives a filename 'contact-123456.jpg'", () => {
    test("Then it should call it's next method", async () => {
      const file: Partial<Express.Multer.File> = {
        filename: "contact-123456.jpg",
      };

      const req: Partial<Request> = {
        body: {
          file,
        },
      };
      req.file = file as Express.Multer.File;

      await resize(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a filename 'contact-123456.jpg' and an internal server error happens", () => {
    test("Then it should call it's next method with a customError", async () => {
      const customError = new CustomError(
        "Error resizing the image!",
        500,
        "Error resizing the image!"
      );

      const file: Partial<Express.Multer.File> = {
        filename: "contact-123456.jpg",
      };
      const req: Partial<Request> = {
        body: {
          file,
        },
      };
      req.file = file as Express.Multer.File;

      const toFileImage = jest.fn().mockRejectedValue(customError);
      jest.mock("sharp", () => () => ({
        resize: jest.fn().mockReturnValue({
          webp: jest.fn().mockReturnValue({
            toFormat: jest.fn().mockReturnValue({
              toFile: toFileImage,
            }),
          }),
        }),
      }));
      await resize(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
