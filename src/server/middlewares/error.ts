import enviroment from "../../loadEnviroment.js";
import type { Request, Response, NextFunction } from "express";
import debugCreator from "debug";
import chalk from "chalk";
import type CustomError from "../customError/customError.js";
import { ValidationError } from "express-validation";

const debug = debugCreator(`${enviroment.debug}middlewares`);

export const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).json({ message: "Endpoint not found" });
  debug(chalk.red("Endpooint not found"));
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(chalk.red(`Error ${error.message}`));
  const status = error.state ?? 500;
  let message = error.customMessage || "Opps...General Error";

  if (error instanceof ValidationError) {
    if (error.details.body) {
      message = error.details.body.map((error) => error.message).join("");
    }
  }

  res.status(status).json({ error: message });
  next();
};
