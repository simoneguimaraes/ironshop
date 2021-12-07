const express = require("express");

// Configura um roteador
const router = express.Router();

// Importar o modelo da coleção
const StoreItemModel = require("../models/StoreItem.model");

// Crud Create (POST)

router.post("/store-item", async (req, res) => {
    try {
      // Extrair as informações do corpo da requisição
      console.log(req.body);
  
      // Inserir no banco
      const storeItem = await StoreItemModel.create(req.body);
  
      // Responder a requisição
      // Pela regra do REST, a resposta de uma inserção deve conter o registro recém-inserido com status 201 (Created)
      res.status(201).json(storeItem);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  

// cRud Read (GET) (Lista)

router.get("/store-item", async (req, res) => {
    try {
      // Buscar as informações no banco
      const storeItems = await StoreItemModel.find().populate({
          path: "establishment",
          model: "EstablishmentModel",
        });
  
      // Responder a requisição
      res.status(200).json(storeItems);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  // cRud Read (GET) (Detalhe)
  
  router.get("/store-item/:id", async (req, res) => {
    try {
      // Buscar as informações no banco
      const storeItem = await StoreItemModel.findOne({ _id: req.params.id }).populate({
          path: "establishment",
          model: "EstablishmentModel",
        });
  
      // Verificar se o banco encontrou o produto
      if (!storeItem) {
        return res.status(404).json({ msg: "Item não encontrado." });
      }
  
      // Responder a requisição
      res.status(200).json(storeItem);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  // PUT => substituição (destrutiva)
  // PATCH => atualização (não-destrutiva)
  
  // crUd Update (PATCH)
  router.patch("/store-item/:id", async (req, res) => {
    try {
      // Extrair os dados do corpo da requisição
  
      // Atualizar o registro
      const storeItem = await StoreItemModel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true, runValidators: true }
      );
  
      if (!storeItem) {
        return res.status(404).json({ msg: "Item não encontrado." });
      }
  
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  // cruD Delete (DELETE)
  
  router.delete("/store-item/:id", async (req, res) => {
    try {
      const storeItem = await StoreItemModel.deleteOne({ _id: req.params.id });
  
      if (storeItem.deletedCount < 1) {
        return res.status(404).json({ msg: "Item não encontrado" });
      }
  
      // Pela regra do REST, deleções devem retornar um objeto vazio
      res.status(200).json({});
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  module.exports = router;