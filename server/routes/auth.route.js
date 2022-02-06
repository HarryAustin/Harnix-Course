const express = require("express");
const multer = require("multer");
const {
  registerUser,
  loginUser,
  registerGetController,
  loginGetController,
} = require("../controllers/auth.controller");
const { loginLimitter } = require("../services/login_throttle");
const Route = express.Router();

const storage = multer.diskStorage({
  destination: "media/profile pictures",
  filename: (req, file, cb) => {
    cb(null, Math.floor(Math.random() * 100) + file.originalname);
  },
});
const upload = multer({ storage: storage });

// POST
Route.post("/register", upload.single("profile"), registerUser);
Route.post("/login", loginLimitter, loginUser);

// GET
Route.get("/register-page", registerGetController);
Route.get("/login-page", loginGetController);

module.exports = Route;
