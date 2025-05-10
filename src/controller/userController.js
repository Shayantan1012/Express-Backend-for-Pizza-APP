const UserService=require('../services/userService');

 async function createUser(req,res){
    console.log("Create User Control called!!");
    console.log(req.body);
    const userService= new UserService();
    try{ 
    const response=await userService.registerUser(req.body);
    return res.status(201).json({
        message:"Successfully register the User",
        success:true,
        data:response,
        error:{},
    })
}catch(error){
    return res.status(error.statusCode).json({
        success:false,
        message:error.reason,
        data:{},
        error:error,
    })
}
}
module.exports={createUser};
