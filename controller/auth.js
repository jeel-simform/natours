const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const sendEmail = require("../utils/email");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  // eslint-disable-next-line no-underscore-dangle
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  // eslint-disable-next-line no-param-reassign
  user.password = undefined;

  res.status(statusCode).json({
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm, role } = req.body;
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      role,
    });
    createSendToken(newUser, 201, res);
    await sendEmail({
      email: newUser.email,
      subject: "Welcome to the Natours Family!",
      message: `Dear ${newUser.name},
      Welcome to Natours! We are thrilled to have you join us and look forward to getting to know you.`,
    });
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

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    return createSendToken(user, 200, res);
  } catch (err) {
    return res.status(404).json({
      message: err,
    });
  }
  // return next();
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      [, token] = req.headers.authorization.split(" ");
    }
    if (!token) {
      return res.status(401).json({
        message: "you a re not login please login",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

  return next();
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "you do not have permission to perform this action",
      });
    }
    return next();
  };

exports.forgotPassword = async (req, res) => {
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

    // const resetURL = `${req.protocol}://${req.get(
    //   "host"
    // )}/api/v1/users/resetPassword/${resetToken}`;

    // const message = `Forgot your password? Click on the following link to reset your password: ${resetURL} \n If you didn't forgot your password please ignore this email`;

    try {
      const resetURL = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/resetPassword/${resetToken}`;

      const message = `Forgot your password? Click on the following link to reset your password: ${resetURL} \n If you didn't forgot your password please ignore this email`;

      await sendEmail({
        email: user.email,
        subject: "your password reset token (valid for 10 min)",
        message,
      });
      return res.status(200).json({
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
    return res.status(500).json({
      message: "There was an error sending the email. Try again later!",
    });
  }
  // return next();
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

  // next()
  return createSendToken(user, 200, res);
  // next();
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

  return createSendToken(user, 200, res);
};
