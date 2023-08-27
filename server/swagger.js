const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./index.js"]; // Path to your main application file

swaggerAutogen(outputFile, endpointsFiles);