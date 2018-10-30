var mongoose 	= require("mongoose");

//Schema definition
var commentSchema = new mongoose.Schema({
	text: String,
	author: String
});
 

module.exports = mongoose.model("comment", commentSchema);