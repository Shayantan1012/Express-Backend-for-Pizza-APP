const express=require('express');

const {addProduct, getProduct, deleteProduct, getProducts}=require('../controller/productController');

const uploader = require('../Middleware/multerMiddleware');
const { isLoggedIn, isAdmin } = require('../validation/authValidation');

const productRouter=express.Router();

productRouter.post('/',isLoggedIn,isAdmin,uploader.single('productImage'),(req,res)=>addProduct(req,res));
productRouter.get('/:id',(req,res)=>getProduct(req,res));
productRouter.get('/',(req,res)=>getProducts(req,res));
productRouter.delete('/:id',(req,res)=>deleteProduct(req,res));

module.exports=productRouter;