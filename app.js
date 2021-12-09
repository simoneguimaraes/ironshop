require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("./config/db.config")();

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
// Não esquecer de criar variável de ambiente com o endereço do seu app React (local ou deployado no Netlify)
app.use(cors({ origin: process.env.REACT_APP_URL }));

const router = require("./router");

app.use("/", router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(Number(process.env.PORT), () =>
  console.log(`Server up and running at port ${process.env.PORT}`)
);
