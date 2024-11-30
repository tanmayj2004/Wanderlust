const Listing= require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");

module.exports.isLogedIN= (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be login to create listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner= async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to edit this listing");
        return res.redirect(`/listings/${id}`);
    };
    next();
}
module.exports.validateListing = (req, res, next) => {
    let { err } = listingSchema.validate(req.body);

    if (err) {
        let { errMsg } = err.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    }
    else {
        next();
    }
}
module.exports.validateReview = (req, res, next) => {
    let { err } = reviewSchema.validate(req.body);

    if (err) {
        let { errMsg } = err.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    }
    else {
        next();
    }
}
module.exports.isAuthor= async(req,res,next)=>{
    let {id, reviewid } = req.params;
    let Review= await review.findById(reviewid);
    if (!Review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't create this review");
        return res.redirect(`/listings/${id}`);
    };
    next();
}