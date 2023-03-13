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

const { protect } = require("../controller/auth");

const router = express.Router();

router.get("/tours", protect, getAllTours);
router.post("/tours", createTour);
router.get("/tours/tour-stats", getTourStats);
router.get("/tours/monthly-plan/:year", getMonthlyPlan);

router.get("/users:id", getTour);
router.patch("/users:id", updateTour);
router.delete("/users:id", deleteTour);

module.exports = router;
