const cloudinary=require('../config/cloudinaryConfig');
const ProductRepositry=require('../reprositories/productRepository');
const fs=require('fs/promises');
const InternalServerError = require('../utils/internalServerError');
const NotFoundError = require('../utils/notFoundError');

async function createProduct(productDetails){
const imagePath=productDetails.imagePath;
console.log(imagePath);
if(imagePath){
    try{    const cloudanaryResponse= await  cloudinary.uploader.upload(imagePath);
            console.log(cloudanaryResponse);
            var productImage=cloudanaryResponse.secure_url;
            await fs.unlink(imagePath);
    }
    catch(error){
console.log(error);
throw new InternalServerError();
    }
}
console.log(productImage);
const product=await ProductRepositry.createProduct({
   ... productDetails,
  productImage:productImage,
})

return product;
}

async function getProductById(productId){
    var product=await ProductRepositry.getProductById(productId);
    if(!product){
        throw new NotFoundError('product');
    }
    return product;
}

async function getAllProductsData(){
    var product=await ProductRepositry.getAllProducts();
    if(!product){
        throw new NotFoundError('product');
    }
    return product;
}
async function deleteProductById(productId){
    var response=await ProductRepositry.deleteProductById(productId);
    if(!response || null){
        throw new NotFoundError('product');
    }
    return response;

}
    module.exports={
    createProduct,getProductById,deleteProductById,getAllProductsData
}
