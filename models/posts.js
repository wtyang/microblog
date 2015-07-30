var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postsSchema = new Schema({
	author : {
		type : String,
		default : "visitor"
	},
	content : String,
	date : {
		type: Date,
		default: Date.now
	}
});

Posts = mongoose.model('Posts',postsSchema);

module.exports = Posts;