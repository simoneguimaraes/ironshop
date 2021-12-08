const isAuthenticated = require("../middlewares/isAuthenticated");
const express = require("express");
const router = express.Router();
const ProductModel = require("../models/Product.model");

router.post("/product", isAuthenticated, async (req, res) => {
  try {
    console.log(req.body);
    const result = await ProductModel.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/product", isAuthenticated, async (req, res) => {
  try {
    const products = await ProductModel.find();

    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/product/:id", isAuthenticated, async (req, res) => {
  try {
    const product = await ProductModel.findOne({ _id: req.params.id });

    if (!product) {
      return res.status(404).json({ msg: "Produto não encontrado." });
    }

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.patch("/product/:id", isAuthenticated, async (req, res) => {
  try {
    const result = await ProductModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!result) {
      return res.status(404).json({ msg: "Produto não encontrado." });
    }

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/product/:id", isAuthenticated, async (req, res) => {
  try {
    const result = await ProductModel.deleteOne({ _id: req.params.id });

    if (result.deletedCount < 1) {
      return res.status(404).json({ msg: "Não encontrado" });
    }

    res.status(200).json({});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
