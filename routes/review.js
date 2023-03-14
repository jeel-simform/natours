const express = require("express");
const { createReview, getReview } = require("../controller/review");
const { protect, restrictTo } = require("../controller/auth");

const router = express.Router();

router.get("/reviews", getReview);
router.post("/reviews", protect, restrictTo("user"), createReview);

module.exports = router;
