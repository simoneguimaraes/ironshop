const express = require("express");
const router = express.Router();
const DishModel = require("../models/Dish.model");

// CREATE a new dish
router.post("/dish", isAuthenticated, async (req, res) => {
    try {
      console.log(req.body);        
      const result = await DishModel.create(req.body);        
      res.status(201).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

// List of ALL dishes 
  router.get("/dish", isAuthenticated, async (req, res) => {
    try {
      
      const dishs = await DishModel.find();
  
      res.status(200).json(dishs);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

// FIND a specific dish  
  router.get("/dish/:id", isAuthenticated, async (req, res) => {
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

// UPDATE a dish's information
  router.patch("/dish/:id", isAuthenticated,  async (req, res) => {
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

// DELETE a specific dish  
  router.delete("/dish/:id", isAuthenticated,  async (req, res) => {
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

  // famsfklmamkdfa
  // fmasçlfdmdsaçmfkdlasmf
  // msdfkmasfmasklfmsadf
  // maskçldfmdasçklfmaslfd
  // fmsdlfmasçmfçsadmf
  // fkasmfçlsamfmsakf
  // kafmslkadmfsakçmkçfsdf
  
  module.exports = router;