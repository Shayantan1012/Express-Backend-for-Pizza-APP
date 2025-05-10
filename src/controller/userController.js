const UserService=require('../services/userService');

 async function createUser(req,res){
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
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.reason || 'Internal Server Error',
    });
}
}
module.exports={createUser};
