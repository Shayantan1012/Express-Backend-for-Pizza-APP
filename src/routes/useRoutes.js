const express=require('express');

const {createUser}=require('../controller/userController');

const userRouter=express.Router();

userRouter.post('/',(req,res)=>createUser(req,res));

module.exports=userRouter;