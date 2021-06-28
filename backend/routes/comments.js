const express = require("express");

const CommentController = require("../controllers/comments");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/add", checkAuth, CommentController.addComment);

router.get("/:postId", CommentController.getComments);

router.delete("/:postId/:commentId", CommentController.deleteComment);

module.exports = router;
