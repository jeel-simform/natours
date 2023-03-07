const morgan = require("morgan");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const { natoursLogger } = require("./logger/logger");

dotenv.config();
const app = express();

const DB_CONNECTION_URL = process.env.DATABASE;
const port = process.env.PORT;

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1", tourRouter);
app.use("/api/v1", userRouter);

mongoose
  .connect(DB_CONNECTION_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    natoursLogger.log("info", "connected to database");
    // console.log("connected to database");
  });

app.listen(port, () => {
  //   console.log("server is listen on port", port);
  natoursLogger.log("info", `server is listen on port ${port}`);
});

module.exports = app;
