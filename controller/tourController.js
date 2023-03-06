const { log } = require("console");
const { query } = require("express");
const fs = require("fs");
const Tour = require("./../models/tourModel");

// const tours= JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

exports.chechID = (req, res, next, val) => {
  // if(req.params.id *1 > tours.length){
  //     return res.status(404).json({
  //         status:"fail",
  //         message:"invalid ID"
  //     })
  // }
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const queryObj={...req.query};
    const excludedFields=['page','sort','limit','fields'];
     excludedFields.forEach(el=>delete queryObj[el]);

     let queryStr=JSON.stringify(queryObj);
    queryStr= queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);
  
    const query =  Tour.find(JSON.parse(queryStr));
    const tours=await query;

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
    const id = req.params.id;
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
    console.log(err);
  }
};

exports.updateTour = async(req, res) => {
  // console.log(req.body);
  try{
    // console.log(req.params.id);
  const tour= await Tour.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidator:true
    })

    res.status(200).json({
      status: "success",
      data: {
        tour
      },
    });
  }catch(err){
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
  
  
};

exports.deleteTour = async(req, res) => {
  try{
    // console.log(req.params.id);
  const tour= await Tour.findByIdAndDelete(req.params.id)

    res.status(200).json({
      status: "success",
      data: {
        tour
      },
    });
  }catch(err){
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
