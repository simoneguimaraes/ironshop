const express = require("express");
const router = express.Router();
const DishModel = require("../models/Dish.model");

router.post("/dish", async (req, res) => {
    try {
      console.log(req.body);        
      const result = await DishModel.create(req.body);        
      res.status(201).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  router.get("/dish", async (req, res) => {
    try {
      
      const dishs = await DishModel.find();
  
      res.status(200).json(dishs);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  router.get("/dish/:id", async (req, res) => {
    try {

      const dish = await DishModel.findOne({ _id: req.params.id });
  
      if (!dish) {
        return res.status(404).json({ msg: "Prato não encontrado." });
      }
  
      res.status(200).json(dish);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  router.patch("/dish/:id", async (req, res) => {
    try {

      const result = await DishModel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true, runValidators: true }
      );
  
      if (!result) {
        return res.status(404).json({ msg: "Prato não encontrado." });
      }
  
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  router.delete("/dish/:id", async (req, res) => {
    try {
      const result = await DishModel.deleteOne({ _id: req.params.id });
  
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