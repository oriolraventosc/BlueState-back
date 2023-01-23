import type { NextFunction, Request, Response } from "express";
import path from "path";
import sharp from "sharp";
import CustomError from "../../../customError/customError.js";

const resize = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    next();
    return;
  }

  const { filename } = req.file;

  try {
    const fileExtension = path.extname(req.file.filename);

    const fileBaseName = path.basename(req.file.filename, fileExtension);
    const newFileName = `${fileBaseName}`;

    await sharp(path.join("assets", filename))
      .resize({ width: 400, height: 400, fit: "cover" })
      .webp({ quality: 80 })
      .toFormat("webp")
      .toFile(path.join("assets", `${newFileName}.webp`));

    req.body.logo = `${newFileName}.webp`;

    next();
  } catch {
    const customError = new CustomError(
      "Error resizing the image!",
      500,
      "Error resizing the image!"
    );
    next(customError);
  }
};

export default resize;
