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
		default: Date.now()
	}
});

postsSchema.statics = {
	fetch : function(cb){
		return this.find({}).sort("-date").exec(cb);
	}
}
Posts = mongoose.model('Posts',postsSchema);

module.exports = Posts;