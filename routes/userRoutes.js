const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

router.get("/users", userController.getAllUsers);
router.post("/users", userController.createUser);

router.get("/users/:id", userController.getUser);
router.patch("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

module.exports = router;
