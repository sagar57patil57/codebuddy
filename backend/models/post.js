const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  //imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, index: true },  // 'pending', 'rejected', 'approved'  //Index
  likeCount: { type: Number },
  likes: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model("Post", postSchema);
