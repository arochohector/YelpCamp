var express = require('express');
var campgroundRouter = express.Router();
var Campground = require('../models/campground');

// -------------- MIDDLE WARE DEFINITIONS --------
var middleware = require('../middleware'); // no need to specify index.js, because its a special word that gets rquired once the folder is required.

// INDEX - Show all Campgrounds
campgroundRouter.get("/", (req, res, next) => {
    // Get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    });

});

// NEW - Show FORM to create campround
campgroundRouter.get("/new", middleware.isLoggedIn, (req, res, next) => {
    res.render("campgrounds/new");
});

// CREATE - Saves data to DB
campgroundRouter.post("/", middleware.isLoggedIn, (req, res, next) => {
    // get data from the from and add to DB
    var campName = req.body.campname;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCamp = { name: campName, price: price, image: image, description: description, author: author };
    // Create new campground and save to DB
    if (campName) {
        Campground.create(newCamp,
            function (err, newCampground) {
                if (err) {
                    console.log("Error CREATEING CAMPGROUND");
                    console.log(err);
                }
            });
    }
    // redirect back to campgrounds page (get)
    res.redirect("/campgrounds");
});

// SHOW - Display detail of specific item
campgroundRouter.get("/:id", (req, res, next) => {
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            // Render the show template
            if (!foundCampground) {        
                req.flash("error", "Campground not found!");
                return res.status(404).redirect("back");
            }

            res.render("campgrounds/show", { campground: foundCampground });
        }
    });

});
// EDIT - Display the FORM
campgroundRouter.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){   
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground }); 
    });
});
// UPDATE ROUTE
campgroundRouter.put("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    // find & update the campground
    console.log(req.body.campground);
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, foundCampground){
        if(err){
            req.flash("error", err.message);
            res.redirect("/campgrounds/" + req.params.id + "/edit");
        }
        else{
            if (!foundCampground) {
                req.flash("error", "Campground not found!");
                return res.status(404).redirect("back");
            }
            req.flash("success", "Campground has been modified!");
            res.redirect("/campgrounds/" + req.params.id );
        }
    });
});

// DESTROY ROUTE
campgroundRouter.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds/<%= req.params.id %>");
        }
        res.redirect("/campgrounds");
    });
});

module.exports = campgroundRouter;