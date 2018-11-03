var express 		= require("express"),
	router			= express.Router({mergeParams: true}),
	Ground 			= require("../models/ground"),
	Comment 		= require("../models/comment");

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function isUserOwner(request, response, next){
	var objectId = request.params.commentid;
	if(request.isAuthenticated()){
		Comment.findById(objectId, function(error, commentFromDb){
		if(error){
			console.log(error);
		}else{
			if(commentFromDb.author.id.equals(request.user._id)){
				next();
			}else{
				response.redirect("back");
			}
		}
		});
	}else{
		response.redirect("back");
	}
}

router.get("/new", function(req, res){
	Ground.findById(req.params.id, function(error, groundFromDb){
		if(error){
			console.log(error);
		}else{
			 res.render("comments/new" , {ground: groundFromDb});
		}
	});
})

router.post("/",isLoggedIn,  function(req, res){
	// adding ground
	Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
            	Ground.findById(req.params.id, function(error, groundFromDb){
					if(error){
						console.log(error);
					}else{
						comment.author.id = req.user._id;
						comment.author.username = req.user.username;
						comment.save();

						groundFromDb.comments.push(comment);
                        groundFromDb.save();
                        console.log(comment);
                        res.redirect("/grounds/"+groundFromDb._id);
					}
			});
}})});

// Edit
router.get("/:commentid/edit", isUserOwner, function(request, response){
	var objectId = request.params.commentid;
	console.log("editing comment: " + objectId);
		Comment.findById(objectId, function(error, commentFromDb){
		if(error){
			console.log(error);
		}else{
			console.log("COMMENT: ");
			console.log(commentFromDb);
			response.render("comments/edit" , {comment: commentFromDb, groundId: request.params.id});
		}
		});


});

// Update
router.put("/:commentid",isUserOwner, function(request, response){
	var objectId = request.params.commentid;
	Comment.findByIdAndUpdate(objectId, {
			text: request.body.text
	}, function(error, updatedComment){
		if(error){
			console.log(error);
			response.redirect("back");
		}else{
			response.redirect("/grounds/"+request.params.id);
		}
	});
});

// destroy
router.delete("/:commentid",isUserOwner, function(request, response){
	Comment.findByIdAndRemove(request.params.commentid, function(err){
		if(err){
			response.redirect("back");
		}else{
			console.log("Deleted!");
			response.redirect("/grounds/"+request.params.id);
		}
	});
});

module.exports = router;