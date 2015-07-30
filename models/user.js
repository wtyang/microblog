var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
	name : String,
	face : {
		type : String,
		default : "http://static.oschina.net/uploads/user/462/924357_50.bmp?t=1402310022000"
	},
	date : {
		type: Date,
		default : Date.now
	}
});
userSchema.pre('save',function(next){
	next()
})
userSchema.statics = {
	fetch : function(cb){
		return this.find({}).exec(cb);
	},
	findByName: function(name,cb){
		return this.findOne({name:name}).exec(cb);
	}
}
var User = mongoose.model('User',userSchema);
module.exports = User;