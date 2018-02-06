var express = require('express');
var commentRouter = express.Router({mergeParams: true});
var middleware = require('../middleware');

var Campground = require("../models/campground");
var Comments = require("../models/comment");

// NEW ROUTE
commentRouter.get("/new", middleware.isLoggedIn, (req, res, next) => {
    // Find the campground by Id, to send to the form
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", { campground: campground });
        }
    });
});
// CREATE ROUTE
commentRouter.post("/", middleware.isLoggedIn, (req, res, next) => {
    // lookup campground with the id
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            req.flash("error", "Something went wrong.");
            res.redirect("/campgrounds/" + req.params.id);
        }
        else {
            // create new comments
            Comments.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", "Something went wrong.");
                    return res.status(500).redirect("/campgrounds/" + req.params.id);
                }
                else {
                    // add username and id to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save(); // Update the comment with the user information
                    console.log("New comment - " + comment);
                    // Add the new comment to the campground
                    foundCampground.comments.push(comment._id);
                    console.log("Campground list of comments: " + foundCampground.comments);
                    foundCampground.save();
                    req.flash("success", "Comment has been saved");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

// EDIT ROUTE
commentRouter.get("/:commentId/edit", middleware.checkCommentOwnership, (req, res) => {
    Comments.findById(req.params.commentId, function(err, foundComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }
    });
    
});
// UPDATE ROUTE
commentRouter.put("/:commentId", middleware.checkCommentOwnership, (req, res) => {
    console.log(req.body.comment);
    Comments.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else {
            
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY ROUTE
commentRouter.delete("/:commentId", middleware.checkCommentOwnership, (req, res) =>{
    Comments.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Comment has been removed.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = commentRouter;