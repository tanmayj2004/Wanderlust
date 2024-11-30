class ExpressError extends Error{
    constructor(status, Message){
        super();
        this.status=status;
        this.Message=Message;
    }
};
module.exports=ExpressError;