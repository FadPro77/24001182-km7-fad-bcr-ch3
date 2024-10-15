const carService = require("../services/cars");
const { successResponse } = require("../utils/response");

exports.getCars = (req, res, next) => {
  // Call the usecase or service
  const data = carService.getCars(
    req.query?.plate,
    req.query?.manufacture,
    req.query?.model
  );
  successResponse(res, data);
};

exports.getCarById = (req, res, next) => {
  // Get the id from params
  const { id } = req.params;
  const data = carService.getCarById(id);
  successResponse(res, data);
};

exports.createCar = async (req, res, next) => {
  try {
    console.log("Received request to create car:", req.body); // Log incoming data
    const data = await carService.createCar(req.body, req.files);
    successResponse(res, data);
  } catch (error) {
    console.error("Error creating car:", error); // Log error details
    next(error); // Pass the error to the error handling middleware
  }
};

exports.updateCar = async (req, res, next) => {
  try {
    // Get the id from params
    const { id } = req.params;

    let image;
    if (req.files && req.files.image) {
      image = req.files.image;
    }

    const data = await carService.updateCar(id, req.body, image);
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

exports.deleteCarById = (req, res, next) => {
  // Get the id from params
  const { id } = req.params;
  const data = carService.deleteCarById(id);
  successResponse(res, data);
};
