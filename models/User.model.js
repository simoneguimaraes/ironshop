const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["delivery-person", "user", "admin"],
    required: true,
    default: "user",
  },
  address: { type: String, required: true },
  userEstablishment: { type: Schema.Types.ObjectId, ref: "Establishment" }
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
