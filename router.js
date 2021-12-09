const express = require("express");
const router = express.Router();

const userRouter = require("./routes/user.routes");
const establishmentRouter = require("./routes/establishment.routes");
const deliveryRouter = require("./routes/delivery.routes");
const reviewRouter = require("./routes/review.routes");
const orderRouter = require("./routes/order.routes");
const productRouter = require("./routes/product.routes");

router.use("/api/", productRouter);
router.use("/api/user", userRouter);
router.use("/api/establishment", establishmentRouter);
router.use("/api/review", reviewRouter);
router.use("/api/delivery", deliveryRouter);
router.use("/api/order", orderRouter);

module.exports = router;
