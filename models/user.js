var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userSchema = new Schema({
	id : Schema.ObjectId,
	name : String,
	face : String,
	date : {
		type: Date,
		default : Date.now
	}
});
var User = mongoose.model('User',userSchema);
module.exports = User;