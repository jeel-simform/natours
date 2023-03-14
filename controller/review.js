const Review = require("../models/Review");

exports.createReview = async (req, res) => {
  try {
    const newReview = await Review.create(req.body);
    res.status(201).json({
      data: newReview,
    });
    newReview.save();
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
};

exports.getReview = async (req, res, next) => {
  try {
    const reviews = await Review.find();

    if (!reviews) {
      return res.status(404).json({
        message: "No reviews found",
      });
    }
    res.status(200).json({
      data: reviews,
    });
  } catch (err) {
    res.status(500).json({
      messsage: err,
    });
  }
  return next;
};
