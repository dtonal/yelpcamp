var express 		= require("express"),
	router			= express.Router({mergeParams: true}),
	Ground 			= require("../models/ground"),
	Comment 		= require("../models/comment"),
	middleware      = require("../middleware");

router.get("/new", function(req, res){
	Ground.findById(req.params.id, function(error, groundFromDb){
		if(error){
			console.log(error);
		}else{
			 res.render("comments/new" , {ground: groundFromDb});
		}
	});
})

router.post("/", middleware.isLoggedIn,  function(req, res){
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
router.get("/:commentid/edit", middleware.isUserCommentOwner, function(request, response){
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
router.put("/:commentid",middleware.isUserCommentOwner, function(request, response){
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
router.delete("/:commentid",middleware.isUserCommentOwner, function(request, response){
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