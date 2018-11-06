var mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
	name : String,
	email : { type: String, unique: true },
	password : String,
	authority : String,
	projects : [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project'
    }]
}, {
	versionKey : false,
	timestamps : true
}));