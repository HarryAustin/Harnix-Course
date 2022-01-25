const { passwordStrength } = require("check-password-strength");

exports.passwordValidation = (password) => {
  const result = passwordStrength(password);
  if (result.id < 1) {
    return {
      error: {
        password:
          "password should contain atleast a character, number or a symbol",
      },
    };
  } else {
    return true;
  }
};
