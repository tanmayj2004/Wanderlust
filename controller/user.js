const user=require("../models/user");

module.exports.rendersignupForm=(req, res) => {
    res.render("./listings/user.ejs");
};

module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body.listing;

        let newUser = new user({ email, username });

        const registerUser = await user.register(newUser, password);

        console.log(registerUser);
        req.login(registerUser, (err) => {
            if(err){
                return next(err);
            }
            
            req.flash("success", "welcome to Wandarlust!");
            res.redirect("/listings");
        })

    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");

    }
};
module.exports.renderloginForm=(req, res) => {
    res.render("./listings/login.ejs")
};
module.exports.login=async (req, res) => {
    req.flash("success", "welcome to Wandarlust1!");
    let redirectUrl= res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
};
module.exports.logout=(req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you successfully loged out");
        res.redirect("listings");
    });

};