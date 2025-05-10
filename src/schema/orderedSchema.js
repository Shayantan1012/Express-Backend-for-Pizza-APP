const mongoose=require('mongoose');
const orderSchema=new mongoose.Schema({
    user:{
type:mongoose.Schema.Types.ObjectId,
required:true,
ref:'User',
    },
    items:
    [
    {   
       product: {
        type:mongoose.Schema.Types.ObjectId,
          require:true,
            ref:'Product',
    },
    quantity: {
        type:Number,
        require:true,
        default:1,
    }
}
    ],
    totalPrice:{
        type:Number,
        require:true,
    },
    status:{
        type:String,
        default:'ORDERED',
        enum:["ORDERED","CANCELLED","DELEVERED","PROCESSING","OUT_FOR_DELIVERY"],
    },
    address:{
        type:String,
        minLength:[10,"Address should be atleast 10 charecters!!"],
    },
    paymentMethod:{
  type:String,
  enum:['ONLINE','OFFLINE'],
  default:'OFFLINE',
    }
},{
    timestamps:true,
})
const Order=mongoose.model("Order",orderSchema);
module.exports=Order;