const mongoose= require ('mongoose');

const cartSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'User',
        unique:true,
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
},{
    timestamps:true,
})
const Cart=mongoose.model('Cart',cartSchema);
module.exports=Cart;