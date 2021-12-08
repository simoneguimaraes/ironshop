const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    username: {type: String},
    comment: { type: String, maxlength: 200, trim: true },
    rate: { type: Number, enum: [1, 2, 3, 4, 5] },
    establishmentId: { type: Schema.Types.ObjectId, ref: "Establishment" }
  });


  module.exports = mongoose.model("Review", reviewSchema);