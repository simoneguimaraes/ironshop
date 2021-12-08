const router = require("express").Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAuthenticated");

const EstablishmentModel = require("../models/Establishment.model");

// CRUD

// Crud Create (POST) - só admin
router.post("/establishment", isAuthenticated, isAdmin, async (req, res) => {
  try {
    console.log(req.body);

    const result = await EstablishmentModel.create(req.body);

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// cRud Read (GET) (Lista)

router.get("/establishment", isAuthenticated, async (req, res) => {
  try {
    const establishments = await EstablishmentModel.find()
      .populate({
        path: "products",
        model: "Product",
      })
      .populate({
        path: "reviews",
        model: "Reviews",
      });

    res.status(200).json(establishments);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// cRud Read (GET) (Lista) - Admin
router.get(
  "/establishment/admin",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const establishments = await EstablishmentModel.find()
        .populate({
          path: "products",
          model: "Product",
        })
        .populate({
          path: "reviews",
          model: "Reviews",
        })
        .populate({
          path: "orders",
          model: "Order",
        });

      res.status(200).json(establishments);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

// cRud Read (GET) (Detalhe) - Não é admin
router.get(
  "/establishment/details/:id",
  isAuthenticated,
  
  async (req, res) => {
    try {
      const establishment = await EstablishmentModel.findOne({
        _id: req.params.id,
      })
        .populate({
          path: "products",
          model: "Product",
        })
        .populate({
          path: "reviews",
          model: "Reviews",
        });
      if (!establishment) {
        return res.status(404).json({ msg: "Estabelecimento não encontrado." });
      }
      res.status(200).json(establishment);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);
// cRud Read (GET) (Detalhe) - Admin -> mostrar os dados do pedido
router.get("/establishment/admin/details/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const establishment = await EstablishmentModel.findOne({
      _id: req.params.id,
    })
      .populate({
        path: "products",
        model: "Product",
      })
      .populate({
        path: "reviews",
        model: "Reviews",
      })
      .populate({
        path: "orders",
        model: "Order",
      });
    if (!establishment) {
      return res.status(404).json({ msg: "Estabelecimento não encontrado." });
    }
    res.status(200).json(establishment);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// crUd Update (PATCH) - só admin
router.patch(
  "/establishment/:id",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const result = await EstablishmentModel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!result) {
        return res.status(404).json({ msg: "Estabelecimento não encontrado." });
      }

      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

// cruD Delete (DELETE) - só admin

router.delete(
  "/establishment/:id",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const result = await EstablishmentModel.deleteOne({ _id: req.params.id });

      if (result.deletedCount < 1) {
        return res.status(404).json({ msg: "Estabelecimento não encontrado" });
      }

      res.status(200).json({});
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

module.exports = router;
