const { registerValidation } = require("../services/validation");
const { passwordValidation } = require("../services/password_checker");
const { usernameGenerator } = require("../services/unique_username");
const passport = require("../services/passport");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

// Register GET controller to render hbs/html page

exports.registerGetController = (req, res, next) => {
  res.render("registration", { layout: false });
};

// Register POST controller to handle POST logic
exports.registerUser = async (req, res, next) => {
  try {
    const data = registerValidation(req.body);
    console.log(data);
    const { error } = passwordValidation(req.body.password);
    if (error) {
      return res.status(400).send(error);
    } else {
      const salt = await bcrypt.genSalt(10);
      console.log(data.password, salt);
      data.password = await bcrypt.hash(data.password, salt);
      const user = await User.create(data);
      res.send("User created sucessfully");
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

// GET Controller to render hns/html page

exports.loginGetController = (req, res, next) => {
  res.render("login", { layout: false });
};

// POST Controller to handle POST LOGIC with Data
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
      res.send("logged in success");
    })(req, res, next);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
