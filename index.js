const express = require("express"); // Import express with non-module
const fs = require("fs");
const { z } = require("zod");
const { v4: uuidv4 } = require("uuid");
const cars = require("./data/cars.json"); // Import data student

/* Make/initiate expess application */
const app = express();
const port = 4040;

// Standarize response
const successResponse = (res, data) => {
  res.status(200).json({
    success: true,
    data,
  });
};

/* We need to activate body parser/reader */
app.use(express.json());

/* Make a routing and response */
app.get("/", (req, res) => {
  res.status(200).json({ message: "ping successfully" });
});

app.get("/cars", (req, res, next) => {
  try {
    // students?name=BAMARAMZY&nickName=ramzy
    // Validate the query
    const validateQuery = z.object({
      manufacture: z.string().optional(),
      model: z.string().optional(),
      type: z.string().optional(),
      plate: z.string().optional(),
    });

    const resultValidateQuery = validateQuery.safeParse(req.query);
    if (!resultValidateQuery.success) {
      // If validation fails, return error messages
      return res.status(400).json({
        message: "Validation failed",
        errors: resultValidateQuery.error.errors.map((err) => ({
          field: err.path[0],
          issue: err.message,
        })),
      });
    }

    const searchedCars = cars.filter((cars) => {
      // Do filter logic here
      let result = true;
      if (req.query.manufacture) {
        const isFoundManufacture = cars.manufacture
          .toLowerCase()
          .includes(req.query.manufacture.toLowerCase());
        result = result && isFoundManufacture;
      }
      if (req.query.model) {
        const isFoundModel = cars.model
          .toLowerCase()
          .includes(req.query.model.toLowerCase());
        result = result && isFoundModel;
      }
      if (req.query.type) {
        const isFoundType = cars.type
          .toLowerCase()
          .includes(req.query.type.toLowerCase());
        result = result && isFoundType;
      }
      if (req.query.plate) {
        const isFoundPlate = cars.plate
          .toLowerCase()
          .includes(req.query.plate.toLowerCase());
        result = result && isFoundPlate;
      }

      return result;
    });

    if (searchedCars.length === 0) {
      return res.status(404).json({
        message: "Car not found!",
      });
    }

    successResponse(res, searchedCars);
  } catch (error) {
    next(error);
  }
});

app.get("/cars/:id", (req, res) => {
  // Make a validation schema
  const validateParams = z.object({
    id: z.string(),
  });

  const result = validateParams.safeParse(req.params);
  if (!result.success) {
    // If validation fails, return error messages
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.errors.map((err) => ({
        field: err.path[0],
        issue: err.message,
      })),
    });
  }

  // Get the id from params
  const { id } = req.params;

  // find student by id
  const car = cars.find((car) => car.id == id);
  if (!car) {
    // If there is no student with the id that client request, it will response not found
    return res.status(404).json({ message: "Car not found!" });
  }

  // If student has been found, it will be response the student data
  successResponse(res, car);
});

app.post("/cars", (req, res) => {
  // Validation body schema
  const validateBody = z.object({
    plate: z.string(),
    manufacture: z.string(),
    model: z.string(),
    image: z.string().optional().nullable(),
    rentPerDay: z.number(),
    capacity: z.number(),
    description: z.string().optional().nullable(),
    avalableAt: z.string().optional().nullable(),
    transmission: z.string(),
    available: z.boolean(),
    type: z.string(),
    year: z.number(),
    options: z.array(z.string()).optional().nullable(),
    specs: z.array(z.string()).optional().nullable(),
  });

  // Validate
  const result = validateBody.safeParse(req.body);
  if (!result.success) {
    // If validation fails, return error messages
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.errors.map((err) => ({
        field: err.path[0],
        issue: err.message,
      })),
    });
  }

  // Find the max index to defnine the new data id
  const maxId = cars.reduce((max, car) => car.id > max && car.id, 0);

  // let max = 0;
  // for (let index = 0; index < students.length; index++) {
  //     if (students[index].id > max) {
  //         max = students[index].id;
  //     }
  // }
  // let max = 0;
  // students.map((student) => {
  //     if (student.id > max) {
  //         max = student.id;
  //     }
  // });

  try {
    // Create a new car with UUID
    const newCar = {
      id: uuidv4(), // Generate random UUID for id
      ...req.body,
    };

    // Add the new car to the array
    cars.push(newCar);

    // Save the updated array to the JSON file
    fs.writeFileSync(
      "./data/cars.json",
      JSON.stringify(cars, null, 4),
      "utf-8"
    );

    // Send success response
    successResponse(res, newCar);
  } catch (error) {
    console.error("Error writing to file:", error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a student: PUT /students/:id
app.put("/cars/:id", (req, res) => {
  // zod validation
  const validateParams = z.object({
    id: z.string(),
  });

  const resultValidateParams = validateParams.safeParse(req.params);
  if (!resultValidateParams.success) {
    // If validation fails, return error messages
    return res.status(400).json({
      message: "Validation failed",
      errors: resultValidateParams.error.errors.map((err) => ({
        field: err.path[0],
        issue: err.message,
      })),
    });
  }

  // Validation body schema
  const validateBody = z.object({
    plate: z.string(),
    manufacture: z.string(),
    model: z.string(),
    image: z.string().optional().nullable(),
    rentPerDay: z.number(),
    capacity: z.number(),
    description: z.string().optional().nullable(),
    avalableAt: z.string().optional().nullable(),
    transmission: z.string(),
    available: z.boolean(),
    type: z.string(),
    year: z.number(),
    options: z.array(z.string()).optional().nullable(),
    specs: z.array(z.string()).optional().nullable(),
  });

  // Validate
  const resultValidateBody = validateBody.safeParse(req.body);
  if (!resultValidateBody.success) {
    // If validation fails, return error messages
    return res.status(400).json({
      message: "Validation failed",
      errors: resultValidateBody.error.errors.map((err) => ({
        field: err.path[0],
        issue: err.message,
      })),
    });
  }

  // Find the existing car data
  const id = req.params.id;
  const car = cars.find((car) => car.id === id);
  if (!car) {
    return res.status(404).json({
      message: "Car not found!",
    });
  }

  // Update the data
  Object.assign(car, resultValidateBody.data);

  // Update the json data
  fs.writeFileSync("./data/cars.json", JSON.stringify(cars, null, 4), "utf-8");

  successResponse(res, car);
});

// Delete a student: DELETE /students/:id
app.delete("/cars/:id", (req, res) => {
  // Make a validation schema
  const validateParams = z.object({
    id: z.string(),
  });

  const result = validateParams.safeParse(req.params);
  if (!result.success) {
    // If validation fails, return error messages
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.errors.map((err) => ({
        field: err.path[0],
        issue: err.message,
      })),
    });
  }

  // Get the id from params
  const { id } = req.params;

  // Find index
  const carIndex = cars.findIndex((car) => car.id == id);

  if (carIndex < 0) {
    // If no index found
    return res.status.json({ message: "Car not found!" });
  }

  // If the index found
  const deletedCar = cars.splice(carIndex, 1);

  // Update the json
  fs.writeFileSync("./data/cars.json", JSON.stringify(cars, null, 4), "utf-8");

  successResponse(res, deletedCar);
});

// This function is to handle error when API hit
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const errors = err.errors || [];
  let message = err.message;
  if (status == 500) {
    message = "Internal Server Error";
  }

  res.status(status).json({
    success: false,
    data: null,
    message,
    errors,
  });
});

/* Run the express.js application */
app.listen(port, () => {
  console.log(`The express.js app is runing on port ${port}`);
});
