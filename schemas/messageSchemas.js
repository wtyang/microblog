var mongoose = require('monoose');

var messagesSchemas = new mongoose.Schemas({
	title : String,
	context : String,
	date : {
		type: Date,
		default : Date.now
	}
})