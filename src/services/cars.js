const carRepository = require("../repositories/cars");
const { imageUpload } = require("../utils/image-kit");
const { NotFoundError, InternalServerError } = require("../utils/request");

exports.getCars = (plate, manufacture, model) => {
  const cars = carRepository.getCars(plate, manufacture, model);

  // Check if cars array is empty or undefined
  if (!cars || cars.length === 0) {
    throw new NotFoundError("No cars found!");
  }

  return cars;
};

exports.getCarById = (id) => {
  const car = carRepository.getCarById(id);
  if (!car) {
    throw new NotFoundError("Car is Not Found!");
  }

  return car;
};

exports.createCar = async (data, file) => {
  // Upload file
  if (file?.image) {
    data.image = await imageUpload(file.image);
  }

  // Create the data
  return carRepository.createCar(data);
};

exports.updateCar = async (id, data, image) => {
  // find student is exist or not (validate the data)
  const existingCar = carRepository.getCarById(id);
  if (!existingCar) {
    throw new NotFoundError("Car is Not Found!");
  }

  // Handle car image if exist
  if (image) {
    const imageUrl = await imageUpload(image);
    data.image = imageUrl;
  }

  // if exist, we will delete the student data
  const updatedCar = carRepository.updateCar(id, data);
  if (!updatedCar) {
    throw new InternalServerError(["Failed to update Car!"]);
  }

  return updatedCar;
};

exports.deleteCarById = (id) => {
  // find student is exist or not (validate the data)
  const existingCar = carRepository.getCarById(id);
  if (!existingCar) {
    throw new NotFoundError("Car is Not Found!");
  }

  // if exist, we will delete the student data
  const deletedCar = carRepository.deleteCarById(id);
  if (!deletedCar) {
    throw new InternalServerError(["Failed to delete car!"]);
  }

  return deletedCar;
};
