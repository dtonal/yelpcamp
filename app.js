var express 	= require("express"),
	app 		= express(),
    bodyParser  = require("body-parser"),
    Ground  	= require("./models/ground"),
    Comment  	= require("./models/comment"),
    SeedDb  	= require("./seeds"),
    mongoose 	= require("mongoose");

SeedDb();

// Setup app
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Connect Mongodb
mongoose.connect("mongodb://localhost/yelp", { useNewUrlParser: true })

app.get("/", function(request, response){
	response.render("landing");
});

app.get("/grounds", function(request, response){
	Ground.find({}, function(error, allGrounds){
		if(error){
			console.log(error);
		}else{
			response.render("grounds/index" , {grounds: allGrounds});
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

app.post("/grounds/:id/comments", function(req, res){
	// adding ground
	var newText = req.body.text;
	var newAuthor = req.body.author;

	Comment.create(
        {
            text: newText,
            author: newAuthor
        }, function(err, comment){
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

app.get("*", function(request, response){
	response.send("Page not found");
});


app.listen(4000);