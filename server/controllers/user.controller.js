const userModel = require("../models/user.model");

exports.followUserController = async (req, res, next) => {
  try {
    const authUser = req.user.id;
    const toFollow = req.params.user;
    const followingSuccess = await userModel.findByIdAndUpdate(authUser, {
      $addToSet: { following: toFollow },
    });
    if (followingSuccess) {
      const followersSucess = await userModel.findByIdAndUpdate(toFollow, {
        $addToSet: { followers: authUser },
      });
      if (followersSucess) {
        return res.json({ success: true, following: "Following" });
      }
    }
    return res.json({ success: false });
  } catch (err) {
    console.log(err);
  }
};
