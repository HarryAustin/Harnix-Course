const limitter = require("express-rate-limit");

const loginLimitter = limitter({
  windowMs: 60 * 2000,
  max: 3,
  handler: (req, res, next) => {
    res.status(429).send("Sorry, please try again in 2 mins");
  },
});

exports.loginLimitter = loginLimitter;
