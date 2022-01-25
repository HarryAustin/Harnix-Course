const { registerValidation } = require("../services/validation");
const { passwordValidation } = require("../services/password_checker");
const { usernameGenerator } = require("../services/unique_username");
const passport = require("../services/passport");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

exports.registerUser = async (req, res, next) => {
  try {
    const data = registerValidation(req.body);
    const { error } = passwordValidation(req.body.password);
    if (error) {
      return res.status(400).json({ error: error });
    } else {
      data.password = await bcrypt.hash(data.password, 10);
      const user = await User.create(data);
      res.json({ message: "user created successfully" });
    }
  } catch (err) {
    if (err.code == 11000) {
      return res.status(400).json({
        errors: {
          username: `username ${req.body.username} is already taken`,
        },
        message: usernameGenerator(req.body.username),
      });
    }
    next(err);
  }
};

exports.loginUser = (req, res, next) => {
  try {
    passport.authenticate("local", (err, user, info) => {
      if (err) console.log(err);
      if (!user) return res.status(401).json({ info });
      req.logIn(user, (err) => {
        if (err) {
          console.log(err);
          return next(err);
        }
      });
      res.json({ message: "logged in success" });
    })(req, res, next);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
