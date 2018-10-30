
var mongoose 	= require("mongoose");

//Schema definition
var groundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "comment"
      }
   ]
});
 

module.exports = mongoose.model("ground", groundSchema);