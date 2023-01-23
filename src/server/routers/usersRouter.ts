import routes from "../routes/routes.js";
import express from "express";
import { validate } from "express-validation";
import {
  userLogin,
  userRegister,
} from "../controllers/usersController/usersController.js";
import userLoginSchema from "../schemas/userLoginSchema.js";
import userRegisterSchema from "../schemas/userRegisterSchema.js";

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.post(routes.login, validate(userLoginSchema), userLogin);

usersRouter.post(routes.register, validate(userRegisterSchema), userRegister);

export default usersRouter;
