// all the middleware goes here
const middlewareObj = {};
const Campground = require('../models/campground');
const Comments = require('../models/comment');


middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // add message to indicate that user must log in
    req.flash("error", "Please log in first!");
    res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            }
            else {
                if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                
                // does user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You do not have permission to do that!!!");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "Please log in first!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comments.findById(req.params.commentId, function (err, foundComment) {
            if (err) {
                req.flash("error", "An error ocurred.  Sorry, please try again.");
                res.redirect("back");
            }
            else {
                // does user own the campground?
                if (foundComment.author.id.equals(req.user._id)) {
                    // res.render("campgrounds/edit", { campground: foundCampground });
                    next();
                }
                else {
                    req.flash("error", "You do not have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "Please log in first!");
        res.redirect("back");
    }
};


module.exports = middlewareObj;