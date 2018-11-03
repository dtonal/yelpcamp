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
						groundFromDb.comments.push(comment);
                        groundFromDb.save();
                        res.redirect("/grounds/"+groundFromDb._id);
					}
			});
}})});

module.exports = router;