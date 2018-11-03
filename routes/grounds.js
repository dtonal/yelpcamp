var express 		= require("express"),
	router			= express.Router(),
	Ground 			= require("../models/ground");

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

router.get("/", function(request, response){
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

router.get("/new", isLoggedIn, function(request, response){
	response.render("grounds/new");
});

router.post("/", isLoggedIn, function(req, res){
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
			ground.author.id = req.user._id;
			ground.author.username = req.user.username;
			ground.save();
			console.log("new ground added");
			console.log(ground);
			// redirect to grounds
			res.redirect("/grounds");
		}
	});
});

// SHOW
router.get("/:id", function(request, response){
	var objectId = request.params.id;
	Ground.findById(objectId).populate("comments").exec(function(error, groundFromDb){
		if(error){
			console.log(error);
		}else{
			 response.render("grounds/show" , {ground: groundFromDb});
		}
	});
});

// Edit
router.get("/:id/edit", function(request, response){
	var objectId = request.params.id;
	Ground.findById(objectId, function(error, groundFromDb){
		if(error){
			console.log(error);
		}else{
			 response.render("grounds/edit" , {ground: groundFromDb});
		}
	});
});

// Update
router.put("/:id", function(request, response){
	var objectId = request.params.id;
	Ground.findByIdAndUpdate(objectId, {
			name: request.body.name,
			description: request.body.description,
			image: request.body.image
	}, function(error, updatedGround){
		if(error){
			console.log(error);
		}else{
			response.redirect("/grounds/"+objectId);
		}
	});
});

module.exports = router;