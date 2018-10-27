var express 	= require("express"),
	app 		= express(),
    bodyParser  = require("body-parser"),
    mongoose 	= require("mongoose");

// Setup app
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Connect Mongodb
mongoose.connect("mongodb://localhost/yelp", { useNewUrlParser: true })
//Schema definition
var groundSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Ground = mongoose.model("ground", groundSchema);

app.get("/", function(request, response){
	response.render("landing");
});

app.get("/grounds", function(request, response){
	Ground.find({}, function(error, allGrounds){
		if(error){
			console.log(error);
		}else{
			response.render("grounds" , {grounds: allGrounds});
		}
	})
});

app.get("/grounds/new", function(request, response){
	response.render("new");
});

app.post("/grounds", function(req, res){
	// adding ground
	var newName = req.body.name;
	var newImageUrl = req.body.image;

	Ground.create({
		name: req.body.name,
		image: req.body.image
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



app.get("*", function(request, response){
	response.send("Sorry... page not found!");
});

app.listen(4000);