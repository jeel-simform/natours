const express = require("express");
const {
  setTourUserIds,
  createReview,
  getReview,
  getAllReviews,
  updateReview,
  deleteReview,
} = require("../controller/review");
const { protect, restrictTo } = require("../controller/auth");

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get("/reviews", getAllReviews);
router.post("/reviews", restrictTo("user"), setTourUserIds, createReview);
router.get("/reviews/:id", getReview);
router.patch("/reviews/:id", restrictTo("user", "admin"), updateReview);
router.delete("/reviews/:id", restrictTo("user", "admin"), deleteReview);

module.exports = router;
