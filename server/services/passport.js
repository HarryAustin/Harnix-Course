const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const authHandler = async (username, password, cb) => {
  try {
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });
    if (!user) {
      return cb(null, false, {
        error: { username: `Sorry ${username} does not exist` },
      });
    }
    let isMatchedPasswords = await bcrypt.compare(password, user.password);
    if (!isMatchedPasswords) {
      return cb(null, false, { error: { password: "wrong credentials" } });
    }
    cb(null, user);
  } catch (err) {
    console.log(err);
  }
};

passport.use(new LocalStrategy(authHandler));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  const user = await User.findById(id);
  cb(null, user);
});

module.exports = passport;
