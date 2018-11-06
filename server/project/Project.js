var mongoose = require('mongoose');

module.exports = mongoose.model('Project', new mongoose.Schema({
	name : String,
	desc : String
}, {
	versionKey : false,
	timestamps : true
}));