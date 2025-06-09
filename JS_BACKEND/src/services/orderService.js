const { getCartByUserId, clearCart } = require("../reprositories/cartRepository");
const { createNewOrder, getOrderByUserId, getOrderById, updateOrderStatus } = require("../reprositories/orderRepository");
const { findUser } = require("../reprositories/userRepository");
const BadRequestError = require("../utils/badRequestError");
const InternalServerError = require("../utils/internalServerError");
const NotFoundError = require("../utils/notFoundError");

async function createOrder(userId,paymentMethod,address){
  const user=await findUser(userId);
  const cart=await getCartByUserId(userId);
        if(!cart){
            throw new NotFoundError('Cart');
        }
        if(cart.items.length==0){
            throw new BadRequestError("Cart is Empty ,please add some items to Cart!!!!");
        }
  const orderObject={};
  orderObject.user=cart.user;
  orderObject.items=cart.items.map(cartitem=>{
    return {product:cartitem.product._id,quantity:cartitem.quantity};
  });
  orderObject.status="ORDERED";
  orderObject.totalPrice=0;
  cart.items.forEach((cartItems)=>{
  orderObject.totalPrice+=(cartItems.quantity*cartItems.product.price);
  })
  orderObject.address=address;
  orderObject.paymentMethod=paymentMethod;
  const order= await createNewOrder(orderObject);
if(!order){
  throw new InternalServerError();
}
await clearCart(userId);
return order;

  }

async function getAllOrdersCreatedByUser(userId){
const order=await getOrderByUserId(userId);
if(!order){
  throw new NotFoundError("Order");
}
return order;
  }

  async function getOrderDetailsByID(orderId){
    const order=await getOrderById(orderId);
    if(!order){
      throw new NotFoundError("Order");
    }
    return order;
      }
      async function updateOrder(orderId,status){
        const order=await updateOrderStatus(orderId,status);
        if(!order){
          throw new NotFoundError("Order");
        }
        return order;
          }
      
  module.exports={
    createOrder,
    getAllOrdersCreatedByUser,
    getOrderDetailsByID,
    updateOrder
  }
    
    