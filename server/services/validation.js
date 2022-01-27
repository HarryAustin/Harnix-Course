const joi = require("joi");
const { regValidationError } = require("../services/errorHandler");
const { passwordValidation } = require("../services/password_checker");

const registerValidation = (body) => {
  const registerValidationSchema = joi.object({
    name: joi.string().required().messages({
      "string.empty": "Sorry, name must not be empty",
      "any.required": "Sorry, name is required",
    }),
    username: joi.string().required().min(3).messages({
      "string.empty": "String must not be empty",
      "any.required": "Please, enter a username",
      "string.min": "username must ne greater than 3 characters",
    }),
    email: joi.string().email().required().messages({
      "string.email": "please, enter a valid email",
      "any.required": "please an email is required for a complete registration",
    }),
    password: joi.string().min(5).required().messages({
      "string.min": "sorry, your password must be greater than 5 characters",
      "any.required": "password is required for the registration",
      "string.alphanum": "password must contain characters and numbers",
    }),
    confirmPassword: joi.any().valid(joi.ref("password")).required().messages({
      "any.required": "please, confirm your password",
      "any.only": "passwords do not match, please try again",
    }),
    trends: joi.string(),
    profilePicture: joi.string(),
  });
  const { error, value } = registerValidationSchema.validate(body);
  console.log(error);
  if (error) {
    return regValidationError(error);
  } else {
    return { value: value };
  }
};

module.exports = {
  registerValidation,
};
