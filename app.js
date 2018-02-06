var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require('method-override');
var flash = require('connect-flash');
// var seedDB = require("./seeds");
// -- Models
var Comment = require("./models/comment");
var Campground = require("./models/campground");
var User = require('./models/user');

var passport = require('passport');
var LocalStrategy = require('passport-local');

// Passport configuration
app.use(require("express-session")({
    secret: "I Need a Job!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// sends user object to all the pages
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// ----- IMPORT THE ROUTERS
var indexRoutes = require('./routes/index');
var campgroundRoutes = require('./routes/campgrounds')
var commentRoutes = require('./routes/comments');

const PORT = process.env.PORT || 8080;
mongoose.Promise = global.Promise;
// Local database
// To create an environment variable: EXPORT <varname>=<value>
var dbUrl = process.env.DATABASEURL || "mongodb://localhost/yelpcamp_v13" ;
mongoose.connect(dbUrl);
// Cloud database
//mongoose.connect("mongodb://ochoAdmin:dvaa1227@ds231725.mlab.com:31725/ocho_development");
//mongoose.connect(process.env.DATABASEURL);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
// routes use
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
// seedDB(); // Seeds the database.

// ===============================================
// ============ START SERVER =====================
// ===============================================

app.listen(PORT, process.env.IP, () =>{
   console.log("Yelp camp v11 Server has started on port: " + PORT);
});
