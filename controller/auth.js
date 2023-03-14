/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../models/User");
const sendEmail = require("../utils/email");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // console.log(token);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // console.log(cookieOptions);
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  // eslint-disable-next-line no-param-reassign
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
    });
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(404).json(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(req.body);

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    // console.log(user);

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // console.log(user);
    createSendToken(user, 200, res);
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

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        message: "The token belonging to this user does no longer exists",
      });
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        message: "user changed password recently please log in again!",
      });
    }
    req.user = currentUser;
  } catch (err) {
    res.status(400).json({
      message: err,
    });
  }

  next();
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "you do not have permission to perform this action",
      });
    }
    next();
  };

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "no user found with this email",
      });
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Click on the following link to reset your password: ${resetURL} \n If you didn't forgot your password please ignore this email`;
    // console.log(user.email);

    try {
      await sendEmail({
        email: user.email,
        subject: "your password reset token (valid for 10 min)",
        message,
      });
      // console.log(temp);

      res.status(200).json({
        message: "Token sent to mail",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        message: "there was an error sending the email Try again later!",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
  next();
};
exports.resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return res.status(400).json({
      message: "Token is invalid or has expired",
    });
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);
};

exports.updatePassword = async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return res.status(401).json({
      message: "your current password is wrong",
    });
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  createSendToken(user, 200, res);
};
