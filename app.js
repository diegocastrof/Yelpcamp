const   express       = require("express"),
        app           = express(),
        bodyParser    = require("body-parser"),
        mongoose      = require("mongoose"),
        flash         = require("connect-flash"),
        methodOverride = require("method-override"),
        passport      = require("passport"),
        LocalStrategy = require("passport-local"),
        Campground    = require("./models/campground"),
        Comment       = require("./models/comment"),
        User          = require("./models/user"),
        seedsDB       = require("./seeds"),
        eraseAll      = require("./eraseAll");
        

const   campgroundRoutes    =   require("./routes/campgrounds"),
        commentRoutes       =   require("./routes/comments"),
        indexRoutes         =   require("./routes/index");



mongoose.connect('mongodb://localhost/yelpcamp', {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log("we're connected!");
});

// eraseAll(); // delete all Campgrounds and Comments 
// seedsDB(); // seed the DB
app.use(bodyParser.urlencoded( {extended: true} ));
app.set("view engine", "ejs");
// habilita carpeta public (se usa para stylesheets y js)
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


// =============================================
// PASSPORT CONFIGURATION
// =============================================
app.use(require("express-session")({
    secret: "yelpcamppassport",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// entrega variable currentUser (proveniente de passport) y la añade globalmente a cada pagina renderizada 
app.use(function(req, res, next){
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    next();
});


// =============================================
// ROUTES
// =============================================
// habilita las rutas
app.get("/", function(req, res){
    res.render("home");
});

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

// =============================================
// Server
app.set('port', process.env.PORT || 3000);
app.listen(app.get("port"), process.env.IP, function(){
    console.log("server YelpCamp! is up bitches")
});

