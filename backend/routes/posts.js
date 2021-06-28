const express = require("express");

const PostController = require("../controllers/posts");

const checkAuth = require("../middleware/check-auth");
const checkAdmin = require("../middleware/check-admin");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, /*extractFile,*/ PostController.createPost);

router.put("/:id", checkAuth, /*extractFile,*/ PostController.updatePost);

router.delete("/:id", checkAuth, PostController.deletePost);

router.post("/like", checkAuth, PostController.likePost);

router.get("/top-contributors", PostController.getTopContributors);

router.post("/update-status", checkAuth, PostController.updatePostStatus);

router.get("/:id", checkAuth, PostController.getPost);

router.get("", checkAuth, PostController.getPosts);

module.exports = router;
