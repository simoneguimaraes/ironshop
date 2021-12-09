const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.0",
    title: "IronShop API",
    description:
      "App para um aplicativo de delivery, criado junto com os alunos da turma 59 de Web Development da Ironhack São Paulo",
  },
  host: "localhost:4000",
  basePath: "/",
  schemes: ["http"],
};

const outputFile = "./swagger_output.json";
const endpointsFiles = [
  "./routes/user.routes.js",
  "./routes/establishment.routes.js",
  "./routes/delivery.routes.js",
  "./routes/review.routes.js",
  "./routes/order.routes.js",
  "./routes/product.routes.js",
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./app.js"); // Your project's root file
});
