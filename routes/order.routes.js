const express = require("express")
const router = express.Router()

const Order = require("../models/Order.model")
const Delivery = require("../models/Delivery.model")

const attachCurrentUser = require("../middlewares/attachCurrentUser")

router.patch("order/:_id", attachCurrentUser, async (req,res) => {

    try {
    
    const updatedOrder = await Order.findOneAndUpdate({_id: req.params._id}, req.body, {new: true, runValidators:true})
        
    if (req.body.status) {
        if (req.body.status === "In Preparation") {
            const newDelivery = await Delivery.findCreate({
                order_id: req.params._id,
                userName: user.name,
                userAddress: user.Address,
                deliveryPerson_id: "",
                establishment_id: user.establishments[0], //Limitação, só considera o primeiro establishment de um adm
                status: "created"
            })
        }
    }
    
    res.status(200).json(updatedOrder)
    }

    catch(error){
        res.status(400).json(error)
    }
})


module.exports = router