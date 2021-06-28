const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problemLink: { type: String },
    problemName: { type: String }
});

module.exports = mongoose.model("Todo", userSchema);
