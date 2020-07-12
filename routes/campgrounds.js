const { route } = require("./comments");
const { findOneAndDelete, findOneAndRemove } = require("../models/campground");
const comment = require("../models/comment");
const middlewareObj = require("../middleware");

const   express = require("express"),
        router  = express.Router({mergeParams: true}),
        Campground = require("../models/campground"),
        Comment = require("../models/comment"),
        middleware = require("../middleware");

// =============================================
//          Campground Routes
// index route 
router.get("/", function(req, res){
    Campground.find({}, function (err, allCampgrounds){
        if (err){ console.log(err); }
        else { res.render("campground/index", {campgrounds: allCampgrounds}); }
    });   
});

// new route
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campground/new");
});

// create route
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds DB
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const price = req.body.price;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampground = {name: name, image: image, description: description, price:price, author: author}
    Campground.create(newCampground, function(err, newlyCreated){
        if (err) { 
            req.flash("error", "Oops! Something went wrong!");
            res.redirect("/campgrounds");  
        }
        //redirect back to campgrounds page
        else { 
            req.flash("success", "Your campground has been successfully created !");
            res.redirect("/campgrounds"); 
        }
    });
});

// show route
router.get("/:id", function(req, res){
    // find the campg with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground) { 
            req.flash("error", "Campground can't be found");
            res.redirect("/campgrounds"); 
        }
        // render the show template with that campground
        else { 
            res.render("campground/show", { campground: foundCampground }); 
        }
    });
});

// Edit route - shows form
router.get("/:id/edit", middleware.checkCredentials, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){ 
            req.flash("error", "Oops! Something went wrong!");
            res.redirect("back"); 
        }
        else {
            res.render("campground/edit", {campground: foundCampground});
        }
    }); 
});

// Update route - PUT method that updates campground info
router.put("/:id", middleware.checkCredentials, function(req, res){
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const updatedCampground = {
                                name: req.body.name,
                                image: req.body.image,
                                description: req.body.description,
                                author: author
                            }
    Campground.findByIdAndUpdate(req.params.id, updatedCampground, function(err, newCampground){
        if (err) { 
            req.flash("error", "Oops! Something went wrong!");
            res.redirect("back"); 
        }
        else { 
            req.flash("success", "Your campground has been edited successfully");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});
// Delete route - Delete a Campground based on his id
router.delete("/:id", middleware.checkCredentials, function (req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) { 
            req.flash("error", "Oops! Something went wrong!");
            res.redirect("back"); 
        }
        else { 
                foundCampground.comments.forEach(function(comment){
                    Comment.findByIdAndRemove(comment, function(err){
                        if (err) { 
                            req.flash("error", "Oops! Something went wrong!");
                            res.redirect("back");  
                        }
                    });
                });
                Campground.findByIdAndRemove(req.params.id, function(err){
                    if (err) { 
                        req.flash("error", "Oops! Something went wrong!");
                        res.redirect("back");  
                    }
                    else { 
                        req.flash("success", "The campground has been removed");
                        res.redirect("/campgrounds"); 
                    }
                });
            }
    });
});

module.exports = router;