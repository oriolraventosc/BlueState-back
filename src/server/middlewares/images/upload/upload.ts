import type { NextFunction, Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import enviroment from "../../../../loadEnviroment.js";
import { createClient } from "@supabase/supabase-js";
import type { ContactStructure } from "../../../controllers/contactsController/types";
import CustomError from "../../../customError/customError.js";

const supaBase = createClient(
  enviroment.supabaseUrl,
  enviroment.supabaseApiKey
);

export const bucket = supaBase.storage.from(enviroment.supabaseBucketImages);

const uploadLogo = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    next();
    return;
  }

  const { logo } = req.body as ContactStructure;

  try {
    const file = await fs.readFile(path.join("assets", logo));

    await bucket.upload(logo, file);

    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(logo);

    req.body.backUpLogo = publicUrl;

    next();
  } catch {
    const customError = new CustomError(
      "Error uploading the image!",
      500,
      "Error uploading the image!"
    );
    next(customError);
  }
};

export default uploadLogo;
