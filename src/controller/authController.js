const {loginUser}=require('../services/authService');
const{COOKIE_SECURE,FRONTEND_URL}=require('../config/serverConfig')

async function logout(req,res){
res.cookie("authToken",null,{
    httpOnly:true,
    secure:COOKIE_SECURE,
    maxAge:7*24*60*60*1000,
});
return res.status(200).json({
    success:true,
    message:"Log Out Successfully!!!!",
    error:{},
    data:{},
    }
)
}
async function login(req,res){
const loginPayload=req.body;

 try{
const response=await loginUser(loginPayload);
res.cookie("authToken",response.token,{
    httpOnly:true,
    secure:COOKIE_SECURE,
    maxAge:7*24*60*60*1000,
})
return res.status(200).json({
success:true,
message:'Logged IN successfully!!!!',
data:{
    userRole:response.userRole,
    userData:response.userData,
},
error:{},
})
 }///
 catch(error){
return res.status(error.statusCode || 500).json({
    success:false,
    message:error.message,
    data:{},
    error:error,
})
 }
}
module.exports={login,logout};