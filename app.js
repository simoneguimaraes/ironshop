require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("./config/db.config")();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
// Não esquecer de criar variável de ambiente com o endereço do seu app React (local ou deployado no Netlify)
app.use(cors({ origin: process.env.REACT_APP_URL }));

const userRouter = require("./routes/user.routes");
const establishmentRouter = require("./routes/establishment.routes");
const deliveryRouter = require("./routes/delivery.routes")
const reviewRouter = require("./routes/review.routes");
const orderRouter = require("./routes/order.routes")
const productRouter = require("./routes/product.routes")

app.use("/api/", productRouter);
app.use("/api/user", userRouter);
app.use("/api/establishment", establishmentRouter);
app.use("/api/review", reviewRouter);
app.use("/api/delivery", deliveryRouter);
app.use("/api/order", orderRouter);

app.listen(Number(process.env.PORT), () =>
  console.log(`Server up and running at port ${process.env.PORT}`)
);
