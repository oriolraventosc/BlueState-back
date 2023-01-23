import type {
  CustomRequest,
  UserTokenPayload,
} from "../../controllers/usersController/types.js";
import jwt from "jsonwebtoken";
import type { Response, NextFunction } from "express";
import CustomError from "../../customError/customError.js";
import enviroment from "../../../loadEnviroment.js";

const { jwtSecretKey } = enviroment;

const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader: string = req.header("Authorization");

    if (!authorizationHeader) {
      const customError = new CustomError(
        "Authorization missing",
        401,
        "Authorization missing"
      );
      next(customError);
      return;
    }

    if (!authorizationHeader.startsWith("Bearer ")) {
      const customError = new CustomError(
        "Missing Bearer",
        401,
        "Missing Bearer"
      );
      next(customError);
    }

    const token: string = authorizationHeader.replace(/^Bearer\s*/, "");

    const user = jwt.verify(token, jwtSecretKey) as UserTokenPayload;

    req.userId = user.id;

    next();
  } catch {
    const customError = new CustomError("Invalid token", 500, "Invalid token");
    next(customError);
  }
};

export default auth;
