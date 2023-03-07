const express = require("express");
const {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
} = require("../controller/tour");

const router = express.Router();

router.get("/tours", getAllTours);
router.post("/tours", createTour);

router.get("/users:id", getTour);
router.patch("/users:id", updateTour);
router.delete("/users:id", deleteTour);

module.exports = router;
