// const { query } = require("express");
const Tour = require("../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const limit = +req.query.limit || 10;
    const page = +req.query.page || 1;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sort
      ? req.query.sort.split(",").join(" ")
      : "-createdAt";

    const fields = req.query.fields
      ? req.query.fields.split(",").join(" ")
      : "-__v";

    const tours = await Tour.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort(sortBy)
      .select(fields);

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    // const id = req.params.id;
    // console.log(id);
    const tour = await Tour.findById(req.params.id);
    // console.log(tour);

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    // console.log(req.params.id);
    // console.log("before",Tour.findById(req.params.id));
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true,
    });
    // console.log("after",tour);

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    // console.log(req.params.id);
    const tour = await Tour.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
