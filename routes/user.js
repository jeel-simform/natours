const express = require("express");

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} = require("../controller/user");

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = require("../controller/auth");

const router = express.Router();

router.post("/users/signup", signup);
router.post("/users/login", login);
router.post("/users/forgotPassword", forgotPassword);
router.patch("/users/resetPassword/:token", resetPassword);

router.use(protect);

router.patch("/users/updateMyPassword", updatePassword);

router.get("/users/me", getMe, getUser);
router.patch("/users/updateMe", uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete("/users/deleteMe", deleteMe);

router.use(restrictTo("admin"));

router.get("/users", getAllUsers);
router.post("/users", createUser);
router.get("/users/:id", getUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
