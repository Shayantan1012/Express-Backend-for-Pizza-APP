const express=require('express');
const { isLoggedIn, isAdmin } = require('../validation/authValidation');
const { createNewOrder, getOrderByUser, getOrder, cancelOrder, changeOrderStatus } = require('../controller/orderController');
const orderRoute=express.Router();


orderRoute.post('/',isLoggedIn,(req,res)=>createNewOrder(req,res));
orderRoute.get('/',isLoggedIn,(req,res)=>getOrderByUser(req,res));
orderRoute.get('/:orderId',isLoggedIn,(req,res)=>getOrder(req,res));
orderRoute.put('/:orderId/cancel',isLoggedIn,(req,res)=>cancelOrder(req,res));
orderRoute.put('/:orderId/status',isLoggedIn,isAdmin,(req,res)=>changeOrderStatus(req,res));
module.exports=orderRoute;