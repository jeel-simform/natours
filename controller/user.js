const User = require("../models/User");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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
exports.updateMe = async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return res.status(400).json({
      message:
        "this route is not for password update please use /updateMyPassword",
    });
  }

  const filteredBody = filterObj(req.body, "name", "email");
  console.log(filteredBody);

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    data: updatedUser,
  });
  return next();
};
exports.deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    data: null,
  });
  return next();
};
