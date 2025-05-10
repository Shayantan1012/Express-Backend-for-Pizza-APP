const Order = require("../schema/orderedSchema");
const BadRequestError = require("../utils/badRequestError");
const InternalServerError = require("../utils/internalServerError");

async function createNewOrder(orderDetails){
    try{
        const order=await Order.create(orderDetails)
        return order;
    }catch(error){
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
async function getOrderByUserId(userId){
try{
const order=await Order.find({user:userId}).populate('items.product');
return order;
}catch(error){
    console.log(error);
throw new InternalServerError();
}
}

async function getOrderById(orderId){
    try{
    const order=await Order.findById(orderId).populate('items.product');
    return order;
    }catch(error){
        console.log(error);
    throw new InternalServerError();
    }
    }

    async function updateOrderStatus(orderId,status){
try{
const order=await Order.findByIdAndUpdate(orderId,{status:status},{new:true});
return order;
}catch(error){
    console.log(error);
    throw new InternalServerError();

}
    }
            
    module.exports={
        createNewOrder,
        getOrderById,
        getOrderByUserId,
        updateOrderStatus,
    }
    
    