const Listing=require("../models/listing.js");
const review= require("../models/review.js")

module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = await review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("Review was saved");
    req.flash("success", "New Review is added");
    res.redirect(`/listings/${listing._id}`);
};
module.exports.deleteReview=async (req, res) => {
    const { id, reviewid } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });

    await review.findByIdAndDelete(reviewid);
    req.flash("success", "Review is Deleted");
    res.redirect(`/listings/${id}`);
};