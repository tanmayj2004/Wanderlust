const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const userController=require("../controller/user.js");

router.route("/signup")
.get(userController.rendersignupForm )
.post( wrapAsync(userController.signup));

router.route("/login")
.get( userController.renderloginForm)
.post( saveredirectUrl,passport.authenticate('local',
     { failureRedirect: '/login', failureFlash: true }),
userController.login );

router.get("/logout",userController.logout )
module.exports = router;