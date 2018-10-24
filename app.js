var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(request, response){
	response.send("nothing here yet");
});

app.get("*", function(request, response){
	response.send("Sorry... page not found!");
});

app.listen(4000);