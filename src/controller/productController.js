const {createProduct,getProductById,deleteProductById, getAllProductsData}=require('../services/productService');
const AppError = require('../utils/appError');
 async function addProduct(req,res){
console.log("--------------->",req.body)
try{
    const product=await createProduct({
        productName:req.body.productName,
        description:req.body.description,
        price:req.body.price,
        catagory:req.body.catagory,
        inStock:(req.body.inStock==='true')?true:false,
        imagePath:req.file?.path,
        quantity:req.body.quantity,
    })
    return res.status(201).json({
        success:true,
        message:"Successfully created the product!!!",
        data:{product},
        error:{},
    })

}catch(error) {
if(error instanceof AppError){
return res.status(error.statusCode || 500).json({
success:false,
message:error.reason,
data:{},
error:error,
})
}
return res.status(error.statusCode || 500).json({
    success:false,
    message:"Something Went Wrong!!!",
    data:{},
    error:error,
    })
    
 }
}
 async function getProduct(req,res){
console.log(req.params.id);
try{
const response=await getProductById(req.params.id);
return res.status(201).json({
    success:true,
    message:"Product is present!!!",
    data:{response},
    error:{},
})}catch(error){
if(error instanceof AppError){
    return res.status(error.statusCode || 500).json({
        success:false,
        message:error.message,
        data:{},
        error:error,        
});
}
console.log(error);
return res.status(error.statusCode || 500).json({
success:false,
message:'Something went wrong!!',
data:{},
error:error,
})

}
 }

async function deleteProduct(req,res){
try{
    const response =await deleteProductById(req.params.id);
    return res.status(200).json({
        success:true,
        message:"Successfully Delete the product!!!",
        data:{response},
        error:{},
    })
}
catch(error){
    if(error instanceof AppError){
        return res.status(error.statusCode || 500).json({
            success:false,
            message:error.message,
            data:{},
            error:error,        
    });
    }
    console.log(error);
    return res.status(error.statusCode || 500).json({
    success:false,
    message:'Something went wrong!!',
    data:{},
    error:error,
    })
    
}
 }
 async function getProducts(req,res){
    try{
    const response=await getAllProductsData();
    return res.status(201).json({
        success:true,
        message:"Product is present!!!",
        data:{response},
        error:{},
    })}catch(error){
    if(error instanceof AppError){
        return res.status(error.statusCode || 500).json({
            success:false,
            message:error.message,
            data:{},
            error:error,        
    });
    }
    console.log(error);
    return res.status(error.statusCode || 500).json({
    success:false,
    message:'Something went wrong!!',
    data:{},
    error:error,
    })
    
    }
     }
    module.exports={addProduct,getProduct,getProducts,deleteProduct};
