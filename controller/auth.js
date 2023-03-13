/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */

const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    const token = signToken(newUser._id);

    res.status(201).json({
      token,
      user: newUser,
    });
  } catch (err) {
    res.status(404).json(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // console.log(user);
    const token = signToken(user._id);

    return res.status(200).json({
      token,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.protect = async (req, res, next) => {
  // console.log("function called");
  try {
    // console.log("function called");
    let token;
    // console.log(req.header.authorization);
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // eslint-disable-next-line prefer-destructuring
      token = req.headers.authorization.split(" ")[1];
      // console.log("token ", token);
    }
    // console.log("in try block");
    // console.log(token);
    if (!token) {
      return res.status(401).json({
        message: "you a re not login please login",
      });
      // return next(new AppError("you are not login please login", 401));
    }

    // console.log(token);
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);

    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return res.status(401).json({
        message: "The token belonging to this user does no longer exists",
      });
    }

    if (freshUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        message: "user changed password recently please log in again!",
      });
    }
    req.user = freshUser;
  } catch (err) {
    res.status(400).json({
      message: err,
    });
  }

  next();
};
