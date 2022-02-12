const express = require("express");
const articleRoute = express.Router();
const multer = require("multer");
const { cloudinaryMediaStorage } = require("../services/cloudinarySetup");

const storage = cloudinaryMediaStorage("media/article cover");
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
