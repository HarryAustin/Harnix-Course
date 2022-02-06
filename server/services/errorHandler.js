const { passwordValidation } = require("../services/password_checker");

const regValidationError = (err) => {
  const errors = {
    username: null,
    email: null,
    password: null,
    confirmPassword: null,
  };
  let errorObj = err["details"][0];
  errors[errorObj["path"][0]] = errorObj["message"];
  const originalPassword = err["_original"]["password"];
  const { error } = passwordValidation(originalPassword);
  const modifiedError = Object.assign(errors, error); //Merge the password Checker error and the normal error
  return { error: modifiedError };
};

module.exports = {
  regValidationError,
};
