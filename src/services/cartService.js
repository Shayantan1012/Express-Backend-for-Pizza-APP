

const {getCartByUserId, clearCart}=require('../reprositories/cartRepository');
const AppError = require('../utils/appError');
const BadRequestError = require('../utils/badRequestError');
const NotFoundError = require('../utils/notFoundError');
const { getProductById } = require('./productService');

async function getCart(userId){
const cart=await getCartByUserId(userId);
if(!cart){
    throw new NotFoundError('Cart');
}
return cart;
}

async function modifyCart(userId,productId,shouldAdd=true){
const quantityValue=(shouldAdd==true) ? 1:-1;
const cart=await getCart(userId);
const product=await getProductById(productId);
if(!product){
    throw new NotFoundError('product');
}
if(!product.inStock && product.quantity<=0){
    throw new BadRequestError(["Product Not Available in Stock!!!"]);
}
let foundProduct=false;
cart.items.forEach(item=>{
    if(item.product._id==productId){
console.log(shouldAdd);
        if(shouldAdd){
            console.log(item);
            if((product.quantity>=item.quantity+1))item.quantity+=quantityValue;
            else {throw new AppError("The quantity of product  is not available!!!"),404};
        }else{
            if(item.quantity>0){
            item.quantity+=quantityValue;
            console.log(item.quantity);
            if(item.quantity==0){
                cart.items=cart.items.filter(item=>item.product._id!=productId);
                foundProduct=true;
                return;
            }
        }
            else{
                throw new AppError("The quantity of the item requested is not available!!!!!",404);
            }
        
    }
    foundProduct=true;
}
});
if(!foundProduct){
    if(shouldAdd){
    cart.items.push({
        product: productId,
        quantity:1,
    });
}else{
    throw new NotFoundError("Product Not in the cart!!!");
}
}

await cart.save();

product.quantity-=quantityValue;

await product.save();
console.log(cart);
return cart;
}

async function clearProductsFromCart(userId){
try{
    const response=await clearCart(userId);
    return response;
}catch(error){
console.log(error);
throw new AppError("Unable to Delete cart!!!!");
}
}
module.exports={getCart,modifyCart,clearProductsFromCart};