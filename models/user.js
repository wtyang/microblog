var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
	name : String,
	password : String,
	face : {
		type : String,
		default : "http://static.oschina.net/uploads/user/462/924357_50.bmp?t=1402310022000"
	},
	date : {
		type: Date,
		default : Date.now()
	},
	group: {
		type : Number,
		default: 3    /* 1:Super Admin ; 2:Admin; 3:User*/
	},
	online : {
		type : Boolean,
		detault: false
	}
});
userSchema.statics = {
	fetch : function(cb){
		return this.find({}).sort('-date').exec(cb);
	},
	findByName: function(name,cb){
		return this.findOne({name:name}).exec(cb);
	},
	findOnline: function(cb){
		return this.find({online:true}).exec(cb);
	}
}
var User = mongoose.model('User',userSchema);
module.exports = User;