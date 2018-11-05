var	Ground 			= require("../models/ground");
var	Comment			= require("../models/comment");

var middleware = {};

middleware.isUserCommentOwner = function(request, response, next){
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
};

middleware.isUserGroundOwner = function(request, response, next){
	var objectId = request.params.id;
	if(request.isAuthenticated()){
		Ground.findById(objectId, function(error, groundFromDb){
		if(error){
			console.log(error);
		}else{
			if(groundFromDb.author.id.equals(request.user._id)){
				next();
			}else{
				response.redirect("back");
			}
		}
		});
	}else{
		response.redirect("back");
	}
};

middleware.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You must be logged in.");
	res.redirect("/login");
}

module.exports = middleware;
