const InternalServerError = require('../utils/internalServerError');
const Product=require('../schema/productSchema');
const BadRequestError=require('../utils/badRequestError');
const mongoose=require('mongoose')
async function createProduct(productDetails){
    try{

        const response=await Product.create(productDetails);

        return response;        
    }
catch(error){
    if(error.name==="ValidationError"){
        const errorMessageList=Object.keys(error.errors).map((property)=>{
            return error.error[property].message;
        })
        throw new BadRequestError(errorMessageList);
    }
    console.log(error);
    throw new InternalServerError();
}
}

async function getProductById(productId){
    try{
        const response=await Product.findById(productId);
        return response;        
    }
catch(error){
    console.log(error);
    throw new InternalServerError();
}
}
async function getAllProducts(){
    try{
        const products=await Product.find({});
        return products;        
    }
catch(error){
    console.log(error);
    throw new InternalServerError();
}
}

async function deleteProductById(productId){
    try{
        await Product.findByIdAndDelete(productId);
        return true ;       
    }
catch(error){
    console.log(error);
    throw new InternalServerError();
}
}

    module.exports={
    createProduct,getProductById,deleteProductById,getAllProducts
}