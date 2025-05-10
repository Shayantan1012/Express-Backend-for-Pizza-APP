const jwt=require('jsonwebtoken');

const { JWT_SECRET } = require('../config/serverConfig');
const serverConfig = require('../config/serverConfig');

async function isLoggedIn(req,res,next){
const token =req.cookies["authToken"];
if(!token){
    return res.status(401).json({
        success:false,
        data:{},
        error:"No Authentication!!!!!! ",
        message:"No Auth token Provided!!!",
    })
}
console.log("This is token->",token);
try{
var decoded=jwt.verify(token,JWT_SECRET);
console.log("this is decoded res->",decoded);

req.user={
    email:decoded.email,
    id:decoded.id,
    role:decoded.role,
   }
   
}catch(error){
    console.log(error);
    if(error.name==='TokenExpiredError'){
        res.cookie("authToken",null,{
            httpOnly:true,
            secure:serverConfig.COOKIE_SECURE,
            maxAge:7*24*60*60*1000,
        });
return res.status(200).json({
    success:true,
    message:'Log Out Successfully!!!',
    error:{},
    data:{},
})        
    }

return res.status(401).json({
    success:false,
    message:'',
    error:error,
    data:{},
})        
}

if(!decoded){
    return res.status(401).json({
        success:false,
        data:{},
        error:"No Authentication!!!!!! ",
        message:"Invalid token Provided!!!",
    })
}
//If reach allow them to access api//
next();
}

/*
This function checks is the autentication user is an Admin or not*/
//Because we will call is Admin after is Logged in thats why we will recieve user details//
async function isAdmin(req,res,next){
const loggedInUser=req.user;
if(loggedInUser.role==="ADMIN"){
    next();
}
else{
    return res.status(404).json({
        success:false,
        data:{},
        message:'You are not a Authorised User!!!!',
        error:{
            statusCode:401,
            reason:"Unauthorised user for this action!!",
        }
    })
    
}
}
module.exports={
    isLoggedIn,isAdmin
}
////