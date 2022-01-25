const express = require("express");
const Route = express.Router();
const { registerUser, loginUser } = require("../controllers/auth.controller");
const { loginLimitter } = require('../services/login_throttle')

Route.post("/register", registerUser);
Route.post("/login", loginLimitter, loginUser);
module.exports = Route;