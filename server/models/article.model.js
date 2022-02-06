const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema({
  title: String,
  body: String,
  coverPhoto: String,
  trends: [],
  comments: [{ content: String }],
  likes: [{ type: Schema.Types.ObjectId, ref: "user" }],
  user: { type: Schema.Types.ObjectId, ref: "user" },
  userDetails: {
    name: String,
    profilePicture: String,
  },
  views: Number,
  dateCreated: { type: Date, default: Date.now() },
});

module.exports = model("posts", postSchema);
