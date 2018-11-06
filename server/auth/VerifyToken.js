var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../user/User');

function verifyToken(req, res, next) {
	var token = req.headers['authorization'];

	if (!token) return res.status(403).send({
			message : 'No token provided.'
		});

	jwt.verify(token, config.secret, function(err, decoded) {
		if (err) return res.status(500).send({
				message : 'Failed to authenticate token.'
			});
		req.userId = decoded.id;
		User.findById(req.userId, function(err, user) {
			if (err) return res.status(500).send({
					message : "There was a problem finding the user."
				});
			if (!user) return res.status(401).send({
					message : "No user found."
				});
			req.isAdmin = 'ROLE_ADMIN' == user.authority;
			req.projects = user.projects;
			next();
		});
	});
}

module.exports = verifyToken;