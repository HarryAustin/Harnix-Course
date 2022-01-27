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
    const { error, value } = registerValidation(req.body);
    if (error) {
      return res.status(400).send(error);
    } else {
      value.trends = value.trends
        .split("#")
        .slice(1)
        .map((values) => values.trim());
      const salt = await bcrypt.genSalt(10);
      value.password = await bcrypt.hash(value.password, salt);
      value.profilePicture = req.file.path;
      console.log(req.file);
      const user = await User.create(value);
      res.redirect("login-page");
    }
  } catch (err) {
    if (err.code == 11000) {
      return res
        .status(400)
        .send(
          `errors: username ${
            req.body.username
          } is already taken \n use message: ${usernameGenerator(
            req.body.username
          )} instead`
        );
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
