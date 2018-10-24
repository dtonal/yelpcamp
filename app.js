var express = require("express");
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app

var grounds = [
	{
		name: "Allianz Arena",
		image: "https://pixabay.com/get/ea31b10b2df7043ed1584d05fb1d4e97e07ee3d21cac104491f0c270a1edb4bb_340.jpg"
	},
	{
		name: "Metz",
		image: "https://pixabay.com/get/e83db7092ff7093ed1584d05fb1d4e97e07ee3d21cac104491f0c270a1edb4bb_340.jpg"
	},
	{
		name: "Marseille",
		image: "https://pixabay.com/get/e830b80f2df3073ed1584d05fb1d4e97e07ee3d21cac104491f0c270a1edb4bb_340.jpg"
	},
	{
		name: "Metz",
		image: "https://pixabay.com/get/e83db7092ff7093ed1584d05fb1d4e97e07ee3d21cac104491f0c270a1edb4bb_340.jpg"
	},
	{
		name: "Marseille",
		image: "https://pixabay.com/get/e830b80f2df3073ed1584d05fb1d4e97e07ee3d21cac104491f0c270a1edb4bb_340.jpg"
	},
	{
		name: "Metz",
		image: "https://pixabay.com/get/e83db7092ff7093ed1584d05fb1d4e97e07ee3d21cac104491f0c270a1edb4bb_340.jpg"
	},
	{
		name: "Marseille",
		image: "https://pixabay.com/get/e830b80f2df3073ed1584d05fb1d4e97e07ee3d21cac104491f0c270a1edb4bb_340.jpg"
	},
		{
		name: "Allianz Arena",
		image: "https://pixabay.com/get/ea31b10b2df7043ed1584d05fb1d4e97e07ee3d21cac104491f0c270a1edb4bb_340.jpg"
	},
	{
		name: "Metz",
		image: "https://pixabay.com/get/e83db7092ff7093ed1584d05fb1d4e97e07ee3d21cac104491f0c270a1edb4bb_340.jpg"
	},
	{
		name: "Marseille",
		image: "https://pixabay.com/get/e830b80f2df3073ed1584d05fb1d4e97e07ee3d21cac104491f0c270a1edb4bb_340.jpg"
	},
	{
		name: "Metz",
		image: "https://pixabay.com/get/e83db7092ff7093ed1584d05fb1d4e97e07ee3d21cac104491f0c270a1edb4bb_340.jpg"
	},
	{
		name: "Marseille",
		image: "https://pixabay.com/get/e830b80f2df3073ed1584d05fb1d4e97e07ee3d21cac104491f0c270a1edb4bb_340.jpg"
	},
	{
		name: "Metz",
		image: "https://pixabay.com/get/e83db7092ff7093ed1584d05fb1d4e97e07ee3d21cac104491f0c270a1edb4bb_340.jpg"
	},
	{
		name: "Marseille",
		image: "https://pixabay.com/get/e830b80f2df3073ed1584d05fb1d4e97e07ee3d21cac104491f0c270a1edb4bb_340.jpg"
	}
];

app.get("/", function(request, response){
	response.render("landing");
});

app.get("/grounds", function(request, response){
	response.render("grounds" , {grounds: grounds});
});

app.get("/grounds/new", function(request, response){
	response.render("new");
});

app.post("/grounds", function(req, res){
	// adding ground
	var newName = req.body.name;
	var newImageUrl = req.body.image;
	grounds.push({
		name: newName,
		image: newImageUrl
	});
	// redirect to grounds
	res.redirect("/grounds");
});



app.get("*", function(request, response){
	response.send("Sorry... page not found!");
});

app.listen(4000);