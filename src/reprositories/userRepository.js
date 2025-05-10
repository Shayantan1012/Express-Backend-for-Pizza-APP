const User=require('../schema/useSchema');

async function findUser(parameters) {
    try{ 
        const response=await User.findOne({...parameters});
        return response;
    }catch(error){
console.log(error);
    }
} /////
async function createUser(userDetails){
    try{
        const userResponse=await User.create(userDetails);
        return userResponse;        
    }
catch(error){
    console.log(error);
}
}

module.exports={
    findUser,
    createUser,
}