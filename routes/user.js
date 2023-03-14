const express = require("express");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require("../controller/user");

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require("../controller/auth");

const router = express.Router();

router.post("/users/signup", signup);
router.post("/users/login", login);

router.post("/users/forgotPassword", forgotPassword);
router.patch("/users/resetPassword/:token", resetPassword);

router.patch("/users/updateMyPassword", protect, updatePassword);
router.patch("/users/updateMe", protect, updateMe);
router.delete("/users/deleteMe", protect, deleteMe);

router.get("/users", getAllUsers);
router.post("/users", createUser);

router.get("/users/:id", getUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
