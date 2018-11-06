var cors = require('cors');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var VerifyToken = require('./VerifyToken');
var User = require('../user/User');
var Project = require('../project/Project');

router.all('*', cors());
router.use(bodyParser.json());

router.post('/login', function(req, res) {

	User.findOne({email : req.body.email}).populate('projects').exec(function(err, user) {
		if (err) return res.status(500).send({
				message : 'Error on the server.'
			});
		if (!user) return res.status(401).send({
				message : 'Wrong email and/or password.'
			});

		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) return res.status(401).send({
				message : 'Wrong email and/or password.'
			});

		var token = jwt.sign({
			id : user._id
		}, config.secret, {
			expiresIn : 86400 // 24 hours
		});
		if ('ROLE_ADMIN' != user.authority) { 
			return res.status(200).send({
				id : user._id,
				name : user.name,
				authority : user.authority,
				projects : user.projects, 
				token : token
			});
		}
		// For admins populate all projects
		Project.find().exec(function(err, projects) {
			if (err) return res.status(500).send({
				message : 'Error on the server.'
			});
			return res.status(200).send({
				id : user._id,
				name : user.name,
				authority : user.authority,
				projects : projects, 
				token : token
			});
		});
	});

});

router.get('/logout', function(req, res) {
	res.status(200).send({
		auth : false,
		token : null
	});
});

router.post('/register', function(req, res) {
	// If no admins, next registered user become admin by default 
	User.count({authority: 'ROLE_ADMIN'}, function(err, count) {
		if (err) return res.status(500).send({
			message : "There was a problem registering the user."
		});
		const authority = count > 0 ? "ROLE_USER" : "ROLE_ADMIN";
		User.create({
			name : req.body.name,
			email : req.body.email,
			password : bcrypt.hashSync(req.body.password, 8),
			authority : authority,
			projects : req.body.projects || []
		},
		function(err, user) {
			if (err) return res.status(500).send({
					message : "There was a problem registering the user."
				});
			res.status(200).send({
				message : "User: " + user.name + " has been registered."
			});
		});
	});
});

module.exports = router;