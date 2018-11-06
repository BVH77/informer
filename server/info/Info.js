var mongoose = require('mongoose');

module.exports = mongoose.model('Info', new mongoose.Schema({
	text : String,
	indefinite : Boolean,
    project : { 
    	type: mongoose.Schema.Types.ObjectId, 
    	ref: 'Project'
    },
	user : { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User'
	},
	accepted : [{
	    _id: false,
	    who : {
    		type : mongoose.Schema.Types.ObjectId,
    		ref: 'User'
	    },
	    when : {
	        type: Date, 
	        default: Date.now 
	    }
	}]
}, {
	versionKey : false,
	timestamps : true
}));