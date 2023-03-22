const express = require("express");
const {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
  getTourStats,
  getMonthlyPlan,
  getTourWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
} = require("../controller/tour");

const { protect, restrictTo } = require("../controller/auth");

const router = express.Router();
const reviewRouter = require("./review");

router.use("/tours/:tourId", reviewRouter);

router.get("/tours", getAllTours);
router.post("/tours", protect, restrictTo("admin", "lead-guide"), createTour);
router.get("/tours/tour-stats", getTourStats);
router.get(
  "/tours/monthly-plan/:year",
  protect,
  restrictTo("admin", "lead-guide", "guide"),
  getMonthlyPlan
);

router.get(
  "/tours/tours-within/:distance/center/:latlng/unit/:unit",
  getTourWithin
);

router.get("/tours/distances/:latlng/unit/:unit", getDistances);

router.get("/tours/:id", getTour);
router.patch(
  "/tours/:id",
  protect,
  restrictTo("admin", "lead-guide"),
  uploadTourImages,
  resizeTourImages,
  updateTour
);
router.delete(
  "/tours/:id",
  protect,
  restrictTo("admin", "lead-guide"),
  deleteTour
);

module.exports = router;
