const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        require:[true,"The Firstname is required!!!"],
        minlength:[5,"The Name must be minimum 5 charecters!!!"],
        lowercase:[true],
        trim:[true],
        maxlength:[20,"First name must be less than or equal to 20 charecters!!!"],
    },
    lastName:{
        type:String,
       // require:[true,"The Firstname is required!!!"],
        minlength:[5,"The Name must be minimum 5 charecters!!!"],
        lowercase:[true],
        trim:[true],
        maxlength:[20,"First name must be less than or equal to 20 charecters!!!"],
    },
    mobileNumber:{
        type:String,
        trim:[true],
        unique:[true,"Mobile number must be unique!!!"],
        require:[true,"Mobile number shuold be provided!!"],
        maxlength:[10,"Please give a valid mobile number!!!"],
        minlength:[10,"Please give a valid mobile number!!!"],

    },
    email:{
        type:String,
        trim:[true],
        unique:[true,"Email should be provided!!"],
        require:[true,"Email should be provided!!"],
        match:  [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address']    },
    password:{
        type:String,
        require:[true,"Password is manditory!!!"],
        minlength:[6,"Password should be minimum six charecter long!!!"],
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER',
    },
    address:{
        type:String,
     //   require:true,
        
    }
},{
    timestamps:true,
})

userSchema.pre('save',async function (){
    console.log("Executing the Pre !!!");
    this.password= await bcrypt.hash(this.password,10);//hashed Password//
    console.log(this.password);
console.log(this);
})


const User=mongoose.model("User",userSchema);
module.exports=User;
//Shayantan
