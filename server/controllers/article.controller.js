const articleModel = require("../models/article.model");
const userModel = require("../models/user.model");

// Find articles/Start logic with trends and followers
exports.articlesListController = async (req, res, next) => {
  try {
    // find all the blog posts with my trends
    const userId = req.user.id;
    const { trends, following, profilePicture } = await userModel.findById(
      userId
    );
    const posts = await articleModel
      .find({
        $or: [{ trends: { $in: trends } }, { user: { $in: following } }],
      })
      .sort({ dateCreated: -1 })
      .lean();
    res.render("index", {
      layout: false,
      profilePicture: profilePicture,
      posts: posts,
    });
  } catch (err) {
    console.log(err);
  }
};

// Article single Blog
exports.articlesBlog = async (req, res, next) => {
  try {
    let bool;
    let following = "Follow";
    const blogId = req.params.id;
    if (!blogId || blogId.length !== 24) {
      return res.send("Sorry Article does not exist");
    }
    const user = await userModel.findById(req.user.id).lean();
    const blog = await articleModel.findById(blogId).lean();
    const userId = blog.user;
    const postOwner = await userModel.findById(userId).lean();
    const otherPost = await articleModel
      .find({
        user: userId,
        _id: { $ne: blogId },
      })
      .lean();
    // To show Btn or not
    if (userId == req.user.id) {
      bool = false;
    } else {
      bool = true;
    }
    // end
    res.render("article", {
      layout: false,
      user: user,
      blog: blog,
      bool: bool,
      postOwner: postOwner,
      otherPost: otherPost,
      following: following,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.createArticleGet = (req, res, next) => {
  try {
    res.render("createArticle", { layout: false });
  } catch (err) {
    console.log(err);
  }
};

exports.createArticlePost = async (req, res, next) => {
  try {
    const data = req.body;
    const user = req.user.id;
    data.trends = data.trends.split("#").slice(1);
    data.user = user;
    data.coverPhoto = req.file.path;
    data.userDetails = {
      name: req.user.username,
      profilePicture: req.user.profilePicture,
    };
    const Blog = await articleModel.create(data);
    res.send(Blog);
  } catch (err) {
    console.log(err);
  }
};
