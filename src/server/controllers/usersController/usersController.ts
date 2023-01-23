import enviroment from "../../../loadEnviroment.js";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Credentials, UserTokenPayload } from "./types.js";
import CustomError from "../../customError/customError.js";
import User from "../../../database/models/user/user.js";
import debug from "debug";
import chalk from "chalk";

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as Credentials;

  if (!username || !password) {
    const customError = new CustomError(
      "Missing credentials",
      401,
      "Missing credentials"
    );
    next(customError);
    return;
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      const customError = new CustomError(
        "Wrong credentials!",
        401,
        "Wrong credentials!"
      );
      next(customError);
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const customError = new CustomError(
        "Wrong credentials!",
        401,
        "Wrong credentials!"
      );
      next(customError);
      return;
    }

    const tokenPayload: UserTokenPayload = {
      id: user._id.toString(),
      username,
    };
    const accessToken = jwt.sign(tokenPayload, enviroment.jwtSecretKey, {
      expiresIn: "3d",
    });

    res.status(200).json({ accessToken });
  } catch (error: unknown) {
    next(error);
  }
};

export const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as Credentials;
  try {
    if (!username || !password) {
      const customError = new CustomError(
        "Error registering",
        401,
        "Missing credentials!"
      );
      next(customError);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    });
    res.status(201).json({
      message: `${newUser.username} welcome to BlueState!`,
    });

    debug(chalk.greenBright(`User ${username} registered!`));
  } catch {
    const customError = new CustomError(
      "Oops... General error",
      500,
      "Oops... General error"
    );
    next(customError);
  }
};
