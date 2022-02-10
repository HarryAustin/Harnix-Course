const express = require("express");
const Router = express.Router();
const { followUserController } = require("../controllers/user.controller");

// Router.post("/follow/:postUser", followUserController);
Router.post("/follow/:user", followUserController);

module.exports = Router;
