const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLogedIN , isAuthor } = require('../middleware.js');
const reviewcontroller= require("../controller/review.js");





router.post("/", validateReview, isLogedIN, wrapAsync(reviewcontroller.createReview));

router.delete("/:reviewid", isLogedIN, isAuthor,wrapAsync(reviewcontroller.deleteReview));

module.exports = router;
