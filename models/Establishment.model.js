const { Schema, model } = require("mongoose");

const EstablishmentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    pictureUrl: {
        type: String,
        trim: true,
        default: "https://safetyaustraliagroup.com.au/wp-content/uploads/2019/05/image-not-found.png"
    },
    address: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    openingTime: {
        type: String,
        validate: /^([01]?\d|2[0-3]):([0-5]\d)$/,
        required: true,
        trim: true
    },
    closingTime: {
        type: String,
        validate: /^([01]?\d|2[0-3]):([0-5]\d)$/,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ["mercado", "farmácia", "restaurante"],
        required: true,
        trim: true
    },
    products: [{type: Schema.Types.ObjectId, ref: "Product"}],
    orders: [{type: Schema.Types.ObjectId, ref: "Order"}],
    reviews: [{type: Schema.Types.ObjectId, ref: "Review"}],

})

const EstablishmentModel = model("Establishment", EstablishmentSchema);

module.exports = EstablishmentModel;