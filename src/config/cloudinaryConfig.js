const { CLOUDINARY_CLOUDE_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = require('./serverConfig');

const clodinary=require('cloudinary').v2;
console.log("This is cloudinary->");
clodinary.config({
    cloud_name: CLOUDINARY_CLOUDE_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET,
})
module.exports=clodinary;