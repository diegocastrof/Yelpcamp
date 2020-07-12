const   Campground  = require("../models/campground"),
        Comment     = require("../models/comment"),
        middlewareObj = {};



middlewareObj.isLoggedIn =   function(req, res, next){
    if (req.isAuthenticated()){
        return next()
    }
    req.flash("error", "You need to log in first :)");
    res.redirect("/login");
}

middlewareObj.checkCredentials = function(req, res, next){
    // is the user log in ? 
    if (req.isAuthenticated()){
        // does the user own the campground?
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err || !foundCampground) { 
                req.flash("error", "Campground can't be found");
                res.redirect("/campgrounds");
            }
            else {
                if (foundCampground.author.id.equals(req.user._id)){
                    next();
                } else { 
                    req.flash("error","You don't have the permissions !");
                    res.redirect("back"); 
                }
            }
        });
    } else {
        req.flash("error", "You need to login in order to complete this !");
        res.redirect("/campgrounds");
    }
}

middlewareObj.checkCommentsCredentials = function(req, res, next){
    // is the user log in ? 
    if (req.isAuthenticated()){
        // does the user own the comment?
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err || !foundComment) { 
                req.flash("error", "We can't found the comment you're refering to...");
                res.redirect("/campgrounds/req.params.id"); 
            }
            else {
                if (foundComment.author.id.equals(req.user._id)){
                    next();
                } else { 
                    req.flash("error","You don't have the permissions !");
                    res.redirect("back"); 
                }
            }
        });
    } else {
        req.flash("error", "You need to login in order to complete this !");
        res.redirect("back");
    }
}

module.exports = middlewareObj;