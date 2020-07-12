var mongoose    =   require("mongoose");
var Campground  =   require("./models/campground");
var Comment     =   require("./models/comment");

function eraseAll(){
    Campground.deleteMany({}, function(err){
        if (err){ console.log(err); }
        console.log("campgrounds deleted");
        Comment.deleteMany({}, function(err){
            if (err) { console.log(err); }
            console.log("comments deleted");
        });
    });
}



module.exports = eraseAll;