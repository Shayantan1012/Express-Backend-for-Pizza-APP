const express=require('express');
const {getProduct,getProducts,deleteProduct,addProduct}=require('../controller/productController');
const { isLoggedIn, isAdmin } = require('../validation/authValidation');
const { uploader } = require('../Middlewere/multerMiddlewere');

const productRouter=express.Router();

productRouter.post('/',uploader.single('imageURL'),isLoggedIn,isAdmin,(req,res)=>addProduct(req,res));

productRouter.get('/:id',(req,res)=>getProduct(req,res));
productRouter.get('/',(req,res)=>getProducts(req,res));
productRouter.delete('/:id',(req,res)=>deleteProduct(req,res));

module.exports=productRouter;