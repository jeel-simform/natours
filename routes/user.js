const express = require("express");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controller/user");

const { signup, login } = require("../controller/auth");

const router = express.Router();

router.post("/users/signup", signup);
router.post("/users/login", login);

router.get("/users", getAllUsers);
router.post("/users", createUser);

router.get("/users/:id", getUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
