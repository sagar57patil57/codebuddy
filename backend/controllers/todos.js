const Todo = require("../models/todo");

exports.addTodo = async (req, res) => {
    try {
        const todo = new Todo({
            creator: req.userData.userId,
            problemName: req.body.problemName,
            problemLink: req.body.problemLink
        });
        const result = await todo.save();
        
        if (res) {
            return res.status(200).json({
                message: "Added Successfully",
                data: null,
                success: true
            });            
        } else {
            return res.status(200).json({
                message: "Failed to add",
                success: false
            });
        }
    } catch (error) {
        console.log(error,6565)
        return res.status(500).json({
            message: "Failed to add",
            success: false
        });
    }
}

/*
    deletes a todo
*/
exports.deleteTodo = async (req, res) => {
    try {
        //@TODO: req.body.id to req.userData.userId everywhere
        const result = await Todo.deleteOne({ "creator": req.userData.userId });
        console.log(result);
        return res.status(200).json({
            message: "deleted",
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            message: err
        });
    }
}

exports.getTodos = async (req, res) => {
    try {
        const result = await Todo.find({ creator: req.userData.userId });
        console.log("ss",result)
        return res.status(200).json({
            message: "success",
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            message: err
        });
    }
}