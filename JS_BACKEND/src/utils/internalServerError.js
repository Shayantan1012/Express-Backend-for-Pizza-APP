const AppError=require('./appError');

class InternalServerError extends AppError{
    constructor(){
        super('InterNal Server Error!!!',500);
    }
}
module.exports=InternalServerError;