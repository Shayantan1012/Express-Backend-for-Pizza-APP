const User=require('../schema/useSchema');

async function findUser(parameters) {
    try{ 
        const response=await User.findOne({...parameters});

        return response;
    }catch(error){
console.log("This is repository--->",error);
return { success: false, error: error.message };
    }
} /////
async function createUser(userDetails){
    try{
        const userResponse=await User.create(userDetails);
        return userResponse;        
    }
catch(error){
    return { success: false, error: error.message }; // Retu
}
}

module.exports={
    findUser,
    createUser,
}