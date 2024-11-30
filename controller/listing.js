const { render } = require("ejs");
const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewform = (req, res) => {

    res.render("./listings/new.ejs")
};

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "listing does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing })
}

module.exports.createListing = async (req, res) => {
    let url = req.file.path; // Corrected typo
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();

    req.flash("success", "New listing is added");
    res.redirect("/listings");
};

module.exports.renderEditform = async (req, res) => {

    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing does not exist");
        res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload", "/upload/c_fill,w_100");
    res.render("./listings/edit.ejs", { listing, originalImage });
};
module.exports.upadateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path; // Corrected typo
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "New listing is updated");
    res.redirect(`/listings/${id}`);
};
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", " listing is deleted");
    res.redirect("/listings");
};