const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("../../models/Tour");
const User = require("../../models/User");
const Review = require("../../models/Review");

const { natoursLogger } = require("../../logger/logger");

dotenv.config();

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    natoursLogger.log("info", "connected to database");
  });

const tours = fs.readFileSync(`${__dirname}/tours.json`, "utf-8");
const users = fs.readFileSync(`${__dirname}/users.json`, "utf-8");
const reviews = fs.readFileSync(`${__dirname}/reviews.json`, "utf-8");

const importData = async () => {
  try {
    await Tour.create(JSON.parse(tours));
    await User.create(JSON.parse(users, { validateBeforeSave: false }));
    await Review.create(JSON.parse(reviews));
    natoursLogger.log("info", "data imported");
  } catch (err) {
    natoursLogger.log("error", err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
  } catch (err) {
    throw new Error(err);
  }
  process.exit();
};
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
