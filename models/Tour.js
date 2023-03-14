/* eslint-disable func-names */
const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require("./User");
// const validator = require("validator");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "a tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name can not be more than 40 characters"],
      minlength: [5, "A tour name can not be less than 5 characters"],
      // validate: [validator.isAlpha, "name can only contain letters"],
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      requires: [true, "a tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "a tour must have a maxGroupSize"],
    },
    difficulty: {
      type: String,
      required: [true, "a tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "hard"],
        message: "Difficulty is either easy medium or difficulty",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, "A tour must have below 5 ratings"],
      min: [1, "A tour must have above 1 rating"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "a tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator(val) {
          return val < this.price;
        },
        message: "Discount price should be below price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "a tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "a tour must have an imageCover"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// eslint-disable-next-line func-names
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

// doucment middleware : runs before save command and create command
// eslint-disable-next-line func-names
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map(async (id) => User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

// Query middleware

// eslint-disable-next-line func-names
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});

// aggregation middleware
// eslint-disable-next-line func-names
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
