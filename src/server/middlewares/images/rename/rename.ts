import type { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import CustomError from "../../../customError/customError.js";

const rename = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    next();
    return;
  }

  const timeStamp = Date.now();

  const fileExtension = path.extname(req.file.originalname);
  const fileBaseName = path.basename(req.file.originalname, fileExtension);
  const newFileName = `${fileBaseName}-${timeStamp}${fileExtension}`;

  const newFilePath = path.join("assets", newFileName);

  try {
    await fs.rename(path.join("assets", req.file.filename), newFilePath);

    req.file.filename = newFileName;
    next();
  } catch {
    const customError = new CustomError(
      "Error renaming the image",
      500,
      "Error renaming the image"
    );
    next(customError);
  }
};

export default rename;
