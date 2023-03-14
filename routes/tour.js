const express = require("express");
const {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
  getTourStats,
  getMonthlyPlan,
} = require("../controller/tour");

const { protect, restrictTo } = require("../controller/auth");

const router = express.Router();

router.get("/tours", protect, getAllTours);
router.post("/tours", createTour);
router.get("/tours/tour-stats", getTourStats);
router.get("/tours/monthly-plan/:year", getMonthlyPlan);

router.get("/tours/:id", getTour);
router.patch("/tours/:id", updateTour);
router.delete(
  "/tours/:id",
  protect,
  restrictTo("admin", "lead-guide"),
  deleteTour
);

module.exports = router;
