const AsyncErrorHandler = require("../Middlewares/AsyncErrorHandler");
const CustomError = require("../Utils/CustomError");
const APIFeatures = require("../Utils/apiFeatures");

// POST document
exports.createDoc = (Model) => {
  return AsyncErrorHandler(async (req, res, next) => {
    const document = await Model.create(req.body);
    await document.save();

    res.status(201).json({ status: "success", data: document });
  });
};

// GET document
exports.getOneDoc = (Model, populateOptions) => {
  return AsyncErrorHandler(async (req, res, next) => {
    const queryFilter = { ...req.userFilter, ...req.statusFilter };

    let query = Model.find({ _id: req.params.id, ...queryFilter });
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const document = await query.exec();
    if (!document || document.length === 0) {
      const error = new CustomError(
        `There is NO document with this ID : ${req.params.id}`
      );
      return next(error);
    }

    res.status(200).json({ status: "success", data: document });
  });
};

// GET all documents
exports.getAllDoc = (Model, populateOptions) => {
  return AsyncErrorHandler(async (req, res) => {
    const queryFilter = { ...req.userFilter, ...req.statusFilter };

    // Initialize the APIFeatures class    
    const features = new APIFeatures(
      Model.find(queryFilter).populate(populateOptions),
      req.query
    )
      .filter()
      .search(["name", "quote","title"]) 
      .sort()
      .limitFields()
      .paginate();

    // Execute the query
    const documents = await features.query;

    // Get the total count for pagination info
    const totalDocuments = await Model.countDocuments(
      features.query._conditions
    );
    const totalPages = Math.ceil(
      totalDocuments / (parseInt(req.query.limit) || 10)
    );

    // Send the response
    res.status(200).json({
      status: "success",
      results: documents.length,
      totalPages,
      currentPage: req.query.page || 1,
      data: documents,
    });
  });
};

// PUT document
exports.updateDoc = (Model) => {
  return AsyncErrorHandler(async (req, res, next) => {
    delete req.body.password;
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).exec();

    if (!document) {
      return next(
        new CustomError(
          `The document could not be found for this ID ${req.params.id}`,
          404
        )
      );
    }
    await document.save();
    res.status(200).json({ status: "success", data: document });
  });
};

// DELETE document
exports.deleteDoc = (Model) => {
  return AsyncErrorHandler(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id).exec();
    if (!document) {
      return next(
        new CustomError(
          `The document could not be found for this id ${req.params.id}`,
          404
        )
      );
    }
    res.status(204).json({ status: "success", data: document });
  });
};

// DELETE document
exports.approveDoc = (Model) => {
  return AsyncErrorHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);

    if (!document) {
      return next(
        new CustomError(`No document found with ID: ${req.params.id}`, 404)
      );
    }

    document.status = "approved";
    await document.save();

    res.status(200).json({
      status: "success",
      message: "document approved successfully",
      data: document,
    });
  });
};
