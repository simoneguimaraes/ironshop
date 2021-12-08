const express = require("express")
const router = express.Router()

const Order = require("../models/Order.model")
const Delivery = require("../models/Delivery.model")
const Dish = require("../models/Dish.model")

const attachCurrentUser = require("../middlewares/attachCurrentUser")


router.post("/order", attachCurrentUser, async(req, res) => {
    try {
        if (!req.currentUser) {
            return res.status(400).json("Logar antes de fazer pedido.")
        }

        for (let i=0; i<req.body.itens; i++) {
            const currentDish = await Dish.find({_id: req.body.itens[i]})
            if (!currentDish.available)
            return res.status(400).json(`Prato não disponível ${currentDish.name}`)
        }

        const order = await Order.create(req.body)
        return res.status(200).json(order)
    }
    catch (error) {
        return res.status(400).json(error)
    }
})

router.patch("/order/:_id", attachCurrentUser, async (req,res) => {

    try {
        
        if (!req.currentUser) {
            return res.status(400).json("Logar antes de fazer pedido.")
        }
    
        const updatedOrder = await Order.findOneAndUpdate({_id: req.params._id}, req.body, {new: true, runValidators:true})

        if (req.body.status) {
            if (req.body.status === "In Preparation") {
                const newDelivery = await Delivery.findCreate({
                    order_id: req.params._id,
                    client_id: updatedOrder.user,
                    establishment_id: user.establishments[0], //Limitação, só considera o primeiro establishment de um adm
                    status: "created"
                })
            }
        }
        
        return res.status(200).json(updatedOrder)
    }

    catch(error){
        res.status(400).json(error)
    }
})


module.exports = router