const express = require("express"); // Import express with non-module
require("express-async-errors");
const router = require("./routes");
const { errorHandler, notFoundURLHandler } = require("./middlewares/errors");

/* Make/initiate expess application */
const app = express();
const port = 4040;

/* We need to activate body parser/reader */
app.use(express.json());

// All routes define here
app.use("/", router);

// This function is for 404 handle URL
app.use("*", notFoundURLHandler);

// This function is to handle error when API hit, it always be the last middleware
app.use(errorHandler);

/* Run the express.js application */
app.listen(port, () => {
  console.log(`The express.js app is runing on port ${port}`);
});
