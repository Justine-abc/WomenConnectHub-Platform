// config/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WomenConnect Hub API",
      version: "1.0.0",
      description: "API documentation for the WomenConnect platform",
    },
    servers: [{ url: "http://localhost:5001/api" }],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };