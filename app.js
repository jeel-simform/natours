const morgan = require("morgan");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const tourRouter = require("./routes/tour");
const userRouter = require("./routes/user");
const reviewRouter = require("./routes/review");

const { natoursLogger } = require("./logger/logger");

dotenv.config();
const app = express();

const DB_CONNECTION_URL = process.env.DATABASE;
const port = process.env.PORT;

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this ip please try again an hour!",
});
app.use("/api", limiter);

app.use(
  express.json({
    limit: "10kb",
  })
);

// data sanitization again nosql query injection

app.use(mongoSanitize());
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(express.static(`${__dirname}/public`));
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1", tourRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", reviewRouter);

mongoose
  .connect(DB_CONNECTION_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    natoursLogger.log("info", "connected to database");
  });

app.listen(port, () => {
  natoursLogger.log("info", `server is listen on port ${port}`);
});
