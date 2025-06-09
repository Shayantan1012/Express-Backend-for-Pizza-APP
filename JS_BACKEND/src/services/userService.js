const {findUser,createUser}=require('../reprositories/userRepository');
const {createCart}=require('../reprositories/cartRepository');
class UserService{
///
async registerUser(userDetails) {
    try {

        // Check if user already exists
        const user_email = await findUser({
            email: userDetails.email,
        });
        if (user_email) {
            throw { reason: 'User with this  email already exists!', statusCode: 400 };
        }
        const user_mobile = await findUser({
            mobileNumber: userDetails.mobileNumber,
        });

        // If user exists, throw a 400 error
        if (user_mobile) {
            throw { reason: 'User with this same mobile number  already exists!', statusCode: 400 };
        }

        // Create a new user
        const newUser = await createUser({
            email: userDetails.email,
            password: userDetails.password,
            firstName: userDetails.firstName,
            mobileNumber: userDetails.mobileNumber,
            role: userDetails.role,
        });

        // If user creation fails, throw a 500 error
        if (!newUser) {
            throw { reason: 'Something went wrong, cannot create user', statusCode: 500 };
        }

        // Create a cart for the user
        await createCart(newUser._id);

        // Return newly created user
        return newUser;
    } catch (error) {
        // Throw error to be handled by the controller
        console.log(error)
        throw error;
    }
}


}
module.exports=UserService;

// It will create a brand New DB
// 1.We need to check if the user and mobite number is present or not.....
// 2.If not then create a user in the database
// 3.Return the details of creat
