const express = require("express")

const router = express.Router()
const Delivery = require("../models/Delivery.model")
const Order = require("../models/Order.model")
const attachCurrentUser = require("../middlewares/attachCurrentUser")


router.get("/delivery", attachCurrentUser , async (req, res) => {
    try {
    
        if (!req.currentUser) {
            res.status(400).json("Usuário não logado")
        }

        if ( req.currentUser.role === "DELIVERYPERSON") {
            if (req.currentUser.available) {
                const deliveries = await Delivery.find({$or: [{deliveryPerson_id: req.currentUser._id}, {status: "Created"}]})
            }
            if (!req.currentUser.available) {
                const deliveries = await Delivery.find({deliveryPerson_id: req.currentUser._id})
            }
        }
        if ( req.currentUser.role === "ADMIN") {
            const deliveries = await Delivery.find({establishment_id : { $in : req.currentUser.establishments}})
        }
        res.status(200).json(deliveries)

    }

    catch(error) {
        res.status(400).json(error)
    }
})

router.patch("/delivery/:_id", attachCurrentUser, async (req, res) => {
    try {

        if (!req.currentUser) {
            return res.status(400).json("Usuário não logado.")
        }

        const updatedDelivery = await Delivery.findOneAndUpdate({$and: [{_id: req.params._id}, {deliveryPerson_id: req.currentUser._id}]}, req.body, {new: true, runValidators:true})

        if (req.body.status) {
            if (req.body.status === "accepted"){
                Order.findOneAndUpdate({_id: updatedDelivery.order_id}, {status: "in delivery"})
            }
            if (req.body.status === "done") {
                Order.findOneAndUpdate({_id: updatedDelivery.order_id}, {status: "delivered"})
            }
        }
    }
    catch(error){
        res.status(400).json(error)
    }
})


module.exports = router