const express = require("express")
const router = express.Router()

const Order = require("../models/Order.model")
const Delivery = require("../models/Delivery.model")
const Product = require("../models/Product.model")
const isAuthenticated = require("../middlewares/isAuthenticated");

const attachCurrentUser = require("../middlewares/attachCurrentUser")


router.post("/", isAuthenticated, attachCurrentUser, async(req, res) => {
    try {
        if (!req.currentUser) {
            return res.status(400).json("Logar antes de fazer pedido.")
        }

        for (let i=0; i<req.body.itens; i++) {
            const currentProduct = await Product.find({_id: req.body.itens[i]})
            if (!currentProduct.available)
            return res.status(400).json(`Prato não disponível ${currentProduct.name}`)
        }

        const order = await Order.create(req.body)
        return res.status(200).json(order)
    }
    catch (error) {
        return res.status(400).json(error)
    }
})


router.get("/order", isAuthenticated, attachCurrentUser, async (req, res) => {
    try {
        if (!req.currentUser) {
            return res.status(400).json("Logar antes de fazer pedido.")
        }

        if (req.currentUser.role === "user"){
            const orderList = await Order.find({user: req.currentUser._id})
                return res.status(200).json(orderList);
        }

        if (req.currentUser.role === "admin"){
            const orderList = await Order.find({establishment: req.currentUser.userEstablishment})
                return res.status(200).json(orderList);
        
        }
        else{
            return res.status(400).json("Voce so possui acesso as deliverys");
        }

    }
    catch (error) {
      return res.status(400).json(error);
    }
  });



router.patch("/:_id", isAuthenticated, attachCurrentUser, async (req,res) => {

    try {
        
        if (!req.currentUser) {
            return res.status(400).json("Logar antes de fazer pedido.")
        }
        
    
        const updatedOrder = await Order.findOneAndUpdate({_id: req.params._id}, req.body, {new: true, runValidators:true})

        if (req.body.status) {
            if (req.body.status === "In Preparation") {
                try {
                    const newDelivery = await Delivery.create({
                        order_id: req.params._id,
                        client_id: updatedOrder.user,
                        establishment_id: req.currentUser.userEstablishment, //Limitação, só considera o primeiro establishment de um adm
                        status: "created"
                    })
                }
                catch (error) 
                {
                    return res.status(400).json(error)
                }
            }
        }
        
        return res.status(200).json(updatedOrder)
    }

    catch(error){
        res.status(400).json(error)
    }
})


module.exports = router