var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postsSchema = new Schema({
	author :  { 
		type: Schema.Types.ObjectId, 
		ref: 'User'
	},
	content : String,
	date : {
		type: Date,
		default: Date.now()
	}
});

postsSchema.statics = {
	fetch : function(cb){
		return this.find({}).populate('author').sort("-date").exec(cb);
	}
}
Posts = mongoose.model('Posts',postsSchema);

module.exports = Posts;