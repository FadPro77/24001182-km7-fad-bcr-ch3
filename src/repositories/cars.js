const fs = require("fs");
const cars = require("../../data/cars.json");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

exports.getCars = (plate, manufacture, model) => {
  const searchedCar = cars.filter((car) => {
    // Do filter logic here
    let result = true;
    if (plate) {
      const isFoundPlate = car.plate
        .toLowerCase()
        .includes(plate.toLowerCase());
      result = result && isFoundPlate;
    }
    if (manufacture) {
      const isFoundManufacture = car.manufacture
        .toLowerCase()
        .includes(manufacture.toLowerCase());
      result = result && isFoundManufacture;
    }
    if (model) {
      const isFoundModel = car.model
        .toLowerCase()
        .includes(model.toLowerCase());
      result = result && isFoundModel;
    }

    return result;
  });
  return searchedCar;
};

exports.getCarById = (id) => {
  // find student by id
  const car = cars.find((car) => car.id == id);
  return car;
};

exports.createCar = (data) => {
  try {
    // Find the max index to define the new data id
    const maxId = cars.reduce((max, car) => (car.id > max ? car.id : max), 0);

    const newCar = {
      id: uuidv4(),
      ...data,
    };

    // Add data to current array cars
    cars.push(newCar);

    // Save the latest data to json
    fs.writeFileSync(
      path.resolve(__dirname, "../../data/cars.json"),
      JSON.stringify(cars, null, 4),
      "utf-8"
    );

    return newCar;
  } catch (error) {
    console.error("Failed to save car data:", error); // Log file saving error
    throw new InternalServerError("Failed to save data: " + error.message);
  }
};

exports.updateCar = (id, data) => {
  // Find the existing student data
  const car = cars.find((car) => car.id === id);
  if (!car) {
    // Make a error class
    throw new NotFoundError("Car is Not Found!");
  }

  // Update the data
  Object.assign(car, data);

  // Update the json data
  fs.writeFileSync(
    path.resolve(__dirname, "../../data/cars.json"),
    JSON.stringify(cars, null, 4),
    "utf-8"
  );

  return car;
};

exports.deleteCarById = (id) => {
  // Find index
  const carIndex = cars.findIndex((car) => car.id == id);

  if (carIndex < 0) {
    // If no index found
    return null;
  }

  const deletedCar = cars.splice(carIndex, 1);

  // Update the json
  fs.writeFileSync(
    path.resolve(__dirname, "../../data/cars.json"),
    JSON.stringify(cars, null, 4),
    "utf-8"
  );
  return deletedCar;
};
