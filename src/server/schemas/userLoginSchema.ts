import Joi from "joi";

const userLoginSchema = {
  body: Joi.object({
    username: Joi.string(),
    password: Joi.string(),
  }),
};

export default userLoginSchema;
