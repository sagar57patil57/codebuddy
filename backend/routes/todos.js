const express = require("express");
const TodosController = require("../controllers/todos");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/add", checkAuth, TodosController.addTodo);

router.delete("/:todoId", checkAuth, TodosController.deleteTodo);

router.get("/list", checkAuth, TodosController.getTodos);

module.exports = router;