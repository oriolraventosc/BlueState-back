import Joi from "joi";

const businessSchema = {
  body: Joi.object({
    name: Joi.string().min(1),
    email: Joi.string()
      .email()
      .pattern(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/),
    telephone: Joi.number().min(5),
    sector: Joi.string(),
    service: Joi.string(),
    website: Joi.string().pattern(
      /^(?:(ftp|http|https):\/\/)?(?:[\w-]+\.)+[a-z]{2,6}$/
    ),
  }),
};

export default businessSchema;
