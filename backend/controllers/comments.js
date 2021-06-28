const Comment = require("../models/comments");

exports.addComment = async (req, res) => {

    try {
        console.log(req.body)
        const comment = new Comment({
            postId: req.body.postId,
            creatorId: req.userData.userId,
            creatorName: req.userData.email,
            content: req.body.content
        });
        console.log(comment)
        const result = await comment.save();
        console.log(result)
        return res.status(200).json({
            message: result ? 'comment added successfully' : 'failed'
        });
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            message: 'failed to make a comment'
        });
    }

}

exports.getComments = async (req, res) => {

    const postId = req.params.postId;
    try {
        const comments = await Comment.find({ postId }).sort('-timeStamp');
        return res.status(200).json({
            data: comments,
            message: 'successfully fetched'
        });
    } catch (err) {
        return res.status(500).json({
            message: 'failed to load comments'
        });
    }

}

exports.deleteComment = async (req, res) => {

    try {
        const result = await Comment.deleteOne({ postId: req.params.postId, _id: req.params.commentId });
        return res.status(200).json({
            message: `Deleted ${result.deletedCount} comments`
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'failed to delete comment'
        });
    }

}