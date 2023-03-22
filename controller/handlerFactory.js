exports.deleteOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.updateOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true,
    });
    if (!doc) {
      return res.status(404).json({
        message: "No document found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
  return next();
};
exports.createOne = (Model) => async (req, res) => {
  try {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newDoc,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getOne = (Model, popOptions) => async (req, res) => {
  try {
    let query = Model.findById(req.params.id);
    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getAll = (Model) => async (req, res) => {
  try {
    let filterReview = {};
    if (req.params.tourId) filterReview = { tour: req.params.tourId };

    const { page, limit, sort, ...filter } = req.query;

    const skip = (page - 1) * limit;

    const sortBy = sort ? sort.split(",").join(" ") : "-createdAt";

    const doc = await Model.find(filter, filterReview)
      .limit(limit)
      .skip(skip)
      .sort(sortBy);

    res.status(200).json({
      data: {
        doc,
        count: doc.length,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// const createService = async ({ rating, title, comment }) => {
//   try {
//     createReview({ rating, title, comment });
//   } catch (err) {
//     throw new Error(err);
//   }
// };

// const createReview = async ({ rating, title, comment }) => {
//   review.create({});
// };
