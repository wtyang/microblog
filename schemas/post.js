var mongoose = require('monoose');

var postSchemas = new mongoose.Schemas({
	author : Number,
	body : String,
	date : {
		type: Date,
		default : Date.now
	}
});

postSchemas.pre('save',function(next){
	this.date = Date.now()
})

postSchemas.statics = {
	fetch : function(cb){
		
	}
}