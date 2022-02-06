const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: String,
  username: { type: String, unique: true },
  email: String,
  password: String,
  profilePicture: String,
  followers: [],
  following: [],
  posts: [],
  trends: [],
  dateJoined: { type: Date, default: Date.now() },
});

module.exports = model("users", userSchema);
