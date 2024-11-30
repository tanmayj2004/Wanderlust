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


main().then(() => {
    console.log("connected to DB");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Wandarlust');
}

const sessionOption={
    secret:"mysupersecret",
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


// app.get("/", (req, res) => {
//     res.send("Hii,i am root");
// });

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