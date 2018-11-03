var express 		= require("express"),
	app 			= express(),
    bodyParser  	= require("body-parser"),
    Ground  		= require("./models/ground"),
    Comment  		= require("./models/comment"),
    SeedDb  		= require("./seeds"),
    passport 		= require("passport"),
    LocalStrategy	= require("passport-local"),
    User 			= require("./models/user"),
    mongoose 		= require("mongoose");


var commentsRoutes = require("./routes/comments");
var authRoutes = require("./routes/auth");
var groundsRoutes = require("./routes/grounds");

SeedDb();

// Setup app
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Configure Passport
app.use(require("express-session")({
	secret: "Bamboo is very cute",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect Mongodb
mongoose.connect("mongodb://localhost/yelp", { useNewUrlParser: true });

app.use("/grounds/", groundsRoutes);
app.use("/grounds/:id/comments", commentsRoutes);
app.use(authRoutes);



app.get("*", function(request, response){
	response.send("Page not found");
});


app.listen(4000);