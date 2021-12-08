const router = require("express").Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const EstablishmentModel = require("../models/Establishment.model");
const UserModel = require("../models/User.model");

// CRUD

// Crud Create (POST) - só admin
router.post("/create", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.currentUser._id });

    if (!user.userEstablishment) {
      const result = await EstablishmentModel.create({
        ...req.body,
        userAdmin: req.currentUser._id,
      });

      await UserModel.findOneAndUpdate(
        {
          _id: req.currentUser._id,
        },
        { role: "admin", userEstablishment: result._id }
      );

      res.status(201).json(result);
    } else {
      res.status(409).json({ message: "User already have a establishment." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// cRud Read (GET) (Lista)

router.get("/infos", isAuthenticated, async (req, res) => {
  try {
    const establishments = await EstablishmentModel.find()
      .populate({
        path: "products",
        model: "Product",
      })
      .populate({
        path: "reviews",
        model: "Review",
      });

    res.status(200).json(establishments);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// cRud Read (GET) (Lista) - Admin
router.get(
  "/info/userEstablishment",
  isAuthenticated,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const user = await UserModel.findOne({ _id: req.currentUser._id });
      const establishment = await EstablishmentModel.findOne({
        _id: user.userEstablishment,
      })
        .populate({
          path: "products",
          model: "Product",
        })
        .populate({
          path: "reviews",
          model: "Review",
        })
        .populate({
          path: "orders",
          model: "Order",
        });

      res.status(200).json(establishment);
    } catch (err) {
      console.log(err);
      res.status(404).json(err);
    }
  }
);

// cRud Read (GET) (Detalhe) - Não é admin
router.get(
  "/details/:id",
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
          model: "Review",
        });
      if (!establishment) {
        return res.status(404).json({ message: "Establishment not found." });
      }
      res.status(200).json(establishment);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);
// // cRud Read (GET) (Detalhe) - Admin -> mostrar os dados do pedido
// router.get(
//   "/admin/orderDetails/:id",
//   isAuthenticated,
//   attachCurrentUser,
//   isAdmin,
//   async (req, res) => {
//     try {
//       const establishment = await EstablishmentModel.findOne({
//         _id: req.params.id,
//       })
//         .populate({
//           path: "products",
//           model: "Product",
//         })
//         .populate({
//           path: "reviews",
//           model: "Review",
//         })
//         .populate({
//           path: "orders",
//           model: "Order",
//         });
//       if (!establishment) {
//         return res.status(404).json({ msg: "Estabelecimento não encontrado." });
//       }
//       res.status(200).json(establishment);
//     } catch (err) {
//       console.log(err);
//       res.status(500).json(err);
//     }
//   }
// );

// crUd Update (PATCH) - só admin
router.patch(
  "/:id",
  isAuthenticated,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const result = await EstablishmentModel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!result) {
        return res.status(404).json({ message: "Establishment not found" });
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
  "/:id",
  isAuthenticated,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const result = await EstablishmentModel.deleteOne({ _id: req.params.id });

      if (result.deletedCount < 1) {
        return res.status(404).json({ msg: "Establishment not found" });
      }

      res.status(200).json({ message: "Establishment deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

module.exports = router;
