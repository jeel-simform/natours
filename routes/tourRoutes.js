const express = require("express");
const tourController = require("../controller/tourController");

const router = express.Router();

router.get("/tours", tourController.getAllTours);
router.post("/tours", tourController.createTour);

router.get("/users:id", tourController.getTour);
router.patch("/users:id", tourController.updateTour);
router.delete("/users:id", tourController.deleteTour);

module.exports = router;
