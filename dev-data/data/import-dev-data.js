const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("../../models/Tour");
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

const importData = async () => {
  try {
    await Tour.create(JSON.parse(tours));
    natoursLogger.log("info", "data imported");
  } catch (err) {
    natoursLogger.log("error", err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
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
