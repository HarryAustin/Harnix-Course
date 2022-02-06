const express = require("express");
const articleRoute = express.Router();
const multer = require("multer");

// configure multer

const storage = multer.diskStorage({
  destination: "media/cover_photo",
  filename: (req, file, cb) => {
    cb(null, Math.floor(Math.random() * 1000) + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Controller
const {
  articlesListController,
  listArticles,
  articlesBlog,
  createArticleGet,
  createArticlePost,
} = require("../controllers/article.controller");

// GET METHOD
articleRoute.get("/articles", articlesListController);

articleRoute.get("/article/:id", articlesBlog);
articleRoute.get("/createArticle", createArticleGet);

// POST
articleRoute.post(
  "/createArticle",
  upload.single("coverPhoto"),
  createArticlePost
);

module.exports = articleRoute;
