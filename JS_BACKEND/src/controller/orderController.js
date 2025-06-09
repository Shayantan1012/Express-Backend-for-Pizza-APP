const { createOrder, updateOrder, getAllOrdersCreatedByUser, getOrderDetailsByID } = require("../services/orderService");
const AppError = require("../utils/appError");

async function createNewOrder(req,res){
try{
    console.log("This is request->",req.body);
const order=await createOrder(req.user.id,req.body.paymentMethod,req.body.address)
return res.status(201).json({
 success:true,
 message:"Successfully created the Order!!!",
error:{},
data:order,
})
}
catch(error){
    console.log(error);
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
async function getOrderByUser(req,res){
    try{
        const order=await getAllOrdersCreatedByUser(req.user.id)
        return res.status(201).json({
         success:true,
         message:"Successfully fetched the Order!!!",
        error:{},
        data:order,
        })
        }
        catch(error){
            console.log(error);
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
async function getOrder(req,res){
    try{
        const order=await getOrderDetailsByID(req.params.orderId)
        return res.status(201).json({
         success:true,
         message:"Successfully fetched the Order!!!",
        error:{},
        data:order,
        })
        }
        catch(error){
            console.log(error);
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
async function changeOrderStatus(req,res){
        try{
            const order=await updateOrder(req.params.orderId,req.body.status);
            return res.status(201).json({
             success:true,
             message:"Successfully updateded the Order!!!",
            error:{},
            data:order,
            })
            }
            catch(error){
                console.log(error);
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
async function cancelOrder(req,res){
    try{
        const order=await updateOrder(req.params.orderId,"CANCELLED");
        return res.status(201).json({
         success:true,
         message:"Successfull CANCELLED the Order!!!",
        error:{},
        data:order,
        })
        }
        catch(error){
            console.log(error);
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
module.exports={createNewOrder,getOrderByUser,getOrder,changeOrderStatus,cancelOrder};