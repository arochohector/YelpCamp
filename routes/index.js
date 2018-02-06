var passport = require('passport');
var express = require('express');
var indexRouter = express.Router();
var User = require("../models/user");

// ===============================================
// ============= HOME ROUTES =====================
// ===============================================
indexRouter.get("/", (req, res, next) => {
    res.render("landing");
});

// ===============================================
// ============= AUTH ROUTES =====================
// ===============================================
// show register form
indexRouter.get('/register', (req, res) => {
    res.render('register');
});
// signup logic
indexRouter.post("/register", (req, res) => {
    var newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err.message);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});
// login route
indexRouter.get("/login", function (req, res) {
    res.render('login');
});

indexRouter.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),
    function (req, res) {
        // Nothing needed here, Middleware will take care.
    });

indexRouter.get('/logout', function (req, res) {
    req.logout();
    req.flash("success", "You have logged out!");
    res.redirect('/campgrounds');
});

module.exports = indexRouter;