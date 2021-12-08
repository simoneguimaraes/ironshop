const express = require("express");
const router = express.Router();

const ReviewModel = require("../models/Review.model");
const EstablishmentModel = require("../models/Establishment.model");
const UserModel = require("../models/User.model");

const isAuthenticated = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAuthenticated");

// Cria comentário apenas se o user não é o admin do estabelecimento
router.post("/review", isAuthenticated, async (req, res) => {

  try {
    const user = await UserModel.findOne({ _id: req.user._id });
    const { comment, establishmentId } = req.body;

    // Saber se o user é o dono do estabelecimento
    if (user.establishmentId.includes(req.body.establishmentId)) {
      return res.status(403).json({
        message:
          "Acesso negado: você não pode fazer comentário no seu próprio estabelecimento",
      });
    }

    const reviewCreated = await ReviewModel.create({
      comment: comment,
      establishmentId: establishmentId,
      userId: user._id,
      username: user.name,
    });

    await EstablishmentModel.findOneAndUpdate(
      { _id: reviewCreated.establishmentId },
      { $push: { reviews: reviewCreated._id } }
    );

    res.status(201).json(reviewCreated);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Atualizar comentário (só se for o dono do comentário)
router.patch("/review/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const review = await ReviewModel.findOne({ _id: req.params.id });

    // Verificar se o user é o dono do comentário
    if (review.userId != req.user._id) {
      return res.status(403).json({
        message:
          "Acesso negado: você não tem autorização para atualizar esse comentário",
      });
    }

    const reviewUpdated = await ReviewModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { comment: req.body.comment } },
      { new: true, runValidators: true }
    );

    res.status(200).json(reviewUpdated);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Comentário não encontrado" });
  }
});

// Excluir comentário (Só se o user for dono do comentário)

router.delete("/review/delete/:id", isAuthenticated, async (req, res) => {
  try {
    
    const review = await ReviewModel.findOne({ _id: req.params.id });
    const user = await UserModel.findOne({ _id: req.user._id });

    // Verificar se o user é o dono do comentário
    if (review.userId == user._id) {
      
      await EstablishmentModel.findOneAndUpdate(
        { _id: review.establishmentId },
        { $pull: { reviews: req.params.id } }
      );

      const deletedReview = await ReviewModel.deleteOne({ _id: req.params.id });

      if (deletedReview.deletedCount < 1) {
        return res.status(404).json({ message: "Comentário não encontrado" });
      }

      return res.status(200).json({});
    }

    res.status(403).json({
      message:
        "Acesso negado: você não tem autorização para excluir esse comentário",
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Comentário não encontrado" });
  }
});

module.exports = router;