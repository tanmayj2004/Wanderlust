const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLogedIN, isOwner,validateListing} = require("../middleware.js");
const listingController= require("../controller/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })

router.route("./")
.get( wrapAsync(listingController.index))
.post(  isLogedIN,upload.single("listing[image]"), wrapAsync(listingController.createListing));


router.get("/new", isLogedIN, listingController.renderNewform);
router.get("/search", wrapAsync(listingController.searchListings));

router.route("/:id")
.get( wrapAsync(listingController.showListings))
.put( isLogedIN,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.upadateListing))
.delete( isLogedIN, wrapAsync(listingController.deleteListing));


router.get("/:id/edit", isLogedIN, wrapAsync(listingController.renderEditform));

module.exports = router;