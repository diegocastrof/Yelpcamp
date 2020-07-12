const   express = require("express"),
        router  = express.Router({mergeParams: true}),
        Campground = require("../models/campground"),
        Comment = require("../models/comment"),
        middleware = require("../middleware");
// ======================================
//          COMMENTS ROUTES

// new route
router.get("/new", middleware.isLoggedIn, function (req, res) { 
    Campground.findById(req.params.id, function(err, campground){
        if (err) { 
            req.flash("error", "Oops! Something went wrong!");
            res.redirect("back");
        }
        else {
            res.render("comments/new", {campground: campground})
        }
    });
});

// create route
router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup campground by id
    Campground.findById(req.params.id, function(err, campground){
        if (err) { console.log(err) }
        else { 
            Comment.create(req.body.comment, function(err, comment){
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                campground.comments.push(comment);
                campground.save();
                res.redirect("/campgrounds/"+ campground._id)
            });
        }
    });
});

// Edit route - shows form for comments
router.get("/:comment_id/edit", middleware.checkCommentsCredentials, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err || !foundCampground){ 
            req.flash("error", "Campground can't be found");
            res.redirect("/campgrounds")
         }
        else {
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if (err) { console.log(err); }
                else{
                    res.render("comments/edit", { 
                        campground: foundCampground, 
                        comment: foundComment 
                    });
                }
            })
        }
    }); 
});

//  Update route - Shows the comments with the updates
router.put("/:comment_id", middleware.checkCommentsCredentials, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err){
        if (err) { res.send(err); }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentsCredentials, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function (err){
        if (err) { console.log(err); }
        else { res.redirect("/campgrounds/" + req.params.id); }
    });
});


module.exports = router;