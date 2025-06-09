const { findUser } = require("../reprositories/userRepository");
const {JWT_EXPIN,JWT_SECRET}=require("../config/serverConfig");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
/////

async function loginUser(authDetails){
const email=authDetails.email;
const plainPassword=authDetails.password;
//If there is a Registered User with Given Email//
const user= await findUser({email});
if(!user){
    throw{message:"No User found With given Email!!!",statusCode: 404};
}

//2.If the user will found we need to compare the password.
const isPasswordValid=await bcrypt.compare(plainPassword,user.password);
console.log(isPasswordValid);
if(!isPasswordValid){
    throw{message:'Invalid Password !!!! Please try again!!!',statusCode: 401};
}

const userRole=user.role?user.role:"USER";
//3.If the password is validated create a token in jwt
const token = jwt.sign({ email: user.email, id: user._id ,role:userRole}, JWT_SECRET,  { expiresIn: JWT_EXPIN });

return {token,userRole,userData:{
    email:user.email,
    firstName:user.firstName,
}
}
}
module.exports={
    loginUser
};