const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    creatorName: { type: String, required: true },
    content: { type: String, required: true },
    timeStamp: { type: Date, default: Date.now }
});

//getComments
//Comment.find({ postId })

module.exports = mongoose.model("Comment", commentSchema);
