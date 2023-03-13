const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      data: users,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createUser = (req, res) => {
  res.status(504).json({
    status: "error",
    message: "Not Implemented",
  });
};

exports.getUser = (req, res) => {
  res.status(504).json({
    status: "error",
    message: "Not Implemented",
  });
};

exports.updateUser = (req, res) => {
  res.status(504).json({
    status: "error",
    message: "Not Implemented",
  });
};

exports.deleteUser = (req, res) => {
  res.status(504).json({
    status: "error",
    message: "Not Implemented",
  });
};
