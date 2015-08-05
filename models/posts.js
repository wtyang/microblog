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
	},
	fetchLimit : function(limitCount,currentPage,cb){
		//limitCount 每页显示几条
		//currentPage 当前第几页
		//skipCount 从第几条开始
		var skipCount = (currentPage-1) * limitCount;
		return  this.find({}).sort("-date").skip(skipCount).limit(limitCount).populate('author').exec(cb);
	}
}
Posts = mongoose.model('Posts',postsSchema);

module.exports = Posts;