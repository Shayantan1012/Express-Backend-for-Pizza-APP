const express=require('express');
const {getcartByUser, modifyProductToCart, clearCartById}=require('../controller/cartControllers');
const { isLoggedIn } = require('../validation/authValidation');
const cartRoute=express.Router();
cartRoute.get('/',isLoggedIn,(req,res)=>getcartByUser(req,res));
cartRoute.post('/:operation/:productId',isLoggedIn,(req,res)=>modifyProductToCart(req,res));
cartRoute.delete('/products',isLoggedIn,(req,res)=>clearCartById(req,res));
module.exports=cartRoute;