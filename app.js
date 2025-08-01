if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

console.log(process.env.SECRET) 

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const wrapAsync = require("./utils/wrapAsync.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash= require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local");
const user= require("./models/user.js"); 

const ExpressError = require("./utils/ExpressError.js");




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const dbUrl= process.env.ATLASDB_URL
main().then(() => {
    console.log("connected to DB");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}


const store= MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("Error in mogo session store",err);
   });
const sessionOption={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    Cookie:{
        expires:Date.now()+7 *24*60*60*1000,
        maxAge:7 *24*60*60*1000,
        httpOnly:true,
    },

};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
   res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");
   res.locals.currUser=req.user;
   next();
});
const listingRouter = require("./routes/listing.js"); 
const reviewRouter = require("./routes/review.js"); 
const userRouter= require("./routes/user.js"); 
const { error } = require('console');


const Listing = require("./models/listing.js"); // Add at the top with other requires

app.get("/", wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index", { allListings: listings });  // Adjust the view name if different
}));

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "PAGE NOT FOUND!"));
});
app.use((err, req, res, next) => {
    const { status = 500, Message = "Something went wrong" } = err
    res.render("./listings/error.ejs", { Message });
});

app.listen(8080, () => {
    console.log("port is listining");
})