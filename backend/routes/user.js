const express = require("express");
const UserController = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.post("/edit", checkAuth, UserController.updateUser);

router.get("/:userId", UserController.getUser);

module.exports = router;
