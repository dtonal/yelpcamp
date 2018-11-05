var express 		= require("express"),
	router			= express.Router(),
    passport 		= require("passport"),
	User 			= require("../models/user");

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
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

router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login",
	passport.authenticate("local",
		{
			successRedirect: "/grounds",
	 		failureRedirect: "/login"
		}
		), 
	function(req, res){
	}
);

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Succesfully logged out!");
	res.redirect("/grounds");
});

router.get("/", function(request, response){
	response.render("landing");
});

module.exports = router;