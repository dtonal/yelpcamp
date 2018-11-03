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
mongoose.connect("mongodb://localhost/yelp", { useNewUrlParser: true })

app.get("/", function(request, response){
	response.render("landing");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.get("/grounds", function(request, response){
	Ground.find({}, function(error, allGrounds){
		if(error){
			console.log(error);
		}else{
			response.render("grounds/index" , 
				{
					grounds: allGrounds,
					user: request.user
				});
		}
	})
});

app.get("/grounds/new", function(request, response){
	response.render("grounds/new");
});

app.post("/grounds", function(req, res){
	// adding ground
	var newName = req.body.name;
	var newImageUrl = req.body.image;

	Ground.create({
		name: req.body.name,
		image: req.body.image,
		description: req.body.description
	}, function (error, ground){
		if(error){
			console.log(error);
		}else{
			console.log("new ground added");
			console.log(ground);
			// redirect to grounds
			res.redirect("/grounds");
		}
	});
});

// SHOW
app.get("/grounds/:id", function(request, response){
	var objectId = request.params.id;
	Ground.findById(objectId).populate("comments").exec(function(error, groundFromDb){
		if(error){
			console.log(error);
		}else{
			 response.render("grounds/show" , {ground: groundFromDb});
		}
	});
});

// =========== COMMENTS ROUTES =====================

app.get("/grounds/:id/comments/new", function(req, res){
	Ground.findById(req.params.id, function(error, groundFromDb){
		if(error){
			console.log(error);
		}else{
			 res.render("comments/new" , {ground: groundFromDb});
		}
	});
})

app.post("/grounds/:id/comments",isLoggedIn,  function(req, res){
	// adding ground
	Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
            	console.log("trying find ground with id " + req.params.id);
            	Ground.findById(req.params.id, function(error, groundFromDb){
					if(error){
						console.log(error);
					}else{                      
						console.log("found ground: " + groundFromDb);             
						groundFromDb.comments.push(comment);
                        groundFromDb.save();
                        console.log("Created new comment");
                        console.log(comment);
                        res.redirect("/grounds/"+groundFromDb._id);
					}
			});
}})});

// AUTH Routes

app.get("/register", function(req, res){
	res.render("register");
});

app.post("/register", function(req, res){
	User.register({username: req.body.username}, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/grounds");
		});
	});
});

app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login",
	passport.authenticate("local",
		{
			successRedirect: "/grounds",
	 		failureRedirect: "/login"
		}
		), 
	function(req, res){

	}
);

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/grounds");
});

app.get("*", function(request, response){
	response.send("Page not found");
});


app.listen(4000);