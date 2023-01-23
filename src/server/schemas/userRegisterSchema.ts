import Joi from "joi";

const userRegisterSchema = {
  body: Joi.object({
    username: Joi.string(),
    password: Joi.string(),
  }),
};

export default userRegisterSchema;
