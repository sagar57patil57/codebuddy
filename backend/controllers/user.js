const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      role: 'default'
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id, role: fetchedUser.role },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        success: true,
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      console.log("ERRRRRRRRROR", err, req.body)
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.userData.userId).select('-password');
    if (user._id.toString() !== req.body.id.toString()) {
      return res.status(200).json({
        message: "You are not authorized",
        data: null,
        success: false
      });
    }
    const updatedUser = {
      profile: req.body.profile,
    }
    const response = await User.updateOne({ _id: req.userData.userId }, updatedUser);
    return res.status(200).json({
      message: "Successfully updated",
      data: response,
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to update",
      data: null,
      success: false
    });
  }
}

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('_id username email profile');
    res.status(200).json(user);
    res.status(404).json({ message: "User not found!", success: false });
  } catch (err) {
    return res.status(500).json({
      message: "Fetching User failed!",
      success: false
    });
  }
};