const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Types.ObjectId, ref: "Order",
        required: true
    },
    client_id: {
        type: mongoose.Types.ObjectId, ref: "User",
        required: true
    } ,
    deliveryPerson_id: {
        type: mongoose.Types.ObjectId, ref: "User",
    },
    establishment_id: {
        type: mongoose.Types.ObjectId, ref: "Establishment",
        required: true
    } ,
    status: {
        type: "string",
        default: "created",
        enum: ["created", "accepted", "done"],
        required: true
    }
})

const Delivery = mongoose.model("Delivery", deliverySchema)

module.exports = Delivery