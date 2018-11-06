var cors = require('cors');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var config = require('../config');
var VerifyToken = require(__root + 'auth/VerifyToken');
var User = require('./User');
var Project = require('../project/Project');

router.all('*', cors());
router.use(bodyParser.json());

// CREATES A NEW ENTRY
router.post('/', VerifyToken, function(req, res) {
	if (false == req.isAdmin) return res.status(403).send({message: "Forbidden"}); 
	User.create({
		name : req.body.name,
		email : req.body.email,
		password : bcrypt.hashSync(req.body.password, 8),
		authority : req.body.authority,
		projects : req.body.projects || []
	},
		function(err, user) {
			if (err) return res.status(500).send({
					message : "There was a problem adding the user to the database."
				});
			res.status(200).send({
				message : "User: " + user.name + " has been created."
			});
		});
});

// RETURNS ALL ENTRIES
router.get('/', VerifyToken, function(req, res) {
	if (false == req.isAdmin) return res.status(403).send({message: "Forbidden"});
	User.find({}, '-password').populate('projects').exec(function(err, users) {
		if (err) return res.status(500).send({
				message : "There was a problem finding the users."
			});
		res.status(200).send(users);
	});
});

// GETS A SINGLE ENTRY
router.get('/:id', VerifyToken, function(req, res) {
	if (false == req.isAdmin) return res.status(403).send({message: "Forbidden"});
	User.findById(req.params.id, '-password', function(err, user) {
		if (err) return res.status(500).send({
				message : "There was a problem finding the user."
			});
		if (!user) return res.status(404).send({
				message : "No user found."
			});
		res.status(200).send(user);
	});
});

// DELETES AN ENTRY
router.delete('/:id', VerifyToken, function(req, res) {
	if (false == req.isAdmin) return res.status(403).send({message: "Forbidden"});
	if (req.params.id == req.userId) return res.status(500).send({
			message : "You can not delete yourself."
		});
	User.findByIdAndRemove(req.params.id, function(err, user) {
		if (err) return res.status(500).send({
				message : "There was a problem deleting the user."
			});
		res.status(200).send({
			message : "User: " + user.name + " has been deleted."
		});
	});
});

// UPDATES A SINGLE ENTRY
router.put('/:id', VerifyToken, function(req, res) {
	if (false == req.isAdmin) return res.status(403).send({message: "Forbidden"});
	if (req.params.id == req.userId && req.body.authority != "ROLE_ADMIN") {
		return res.status(500).send({
			message : "You can not change self authority."
		});
	}
	var user = req.body;
	if (user.password) user.password = bcrypt.hashSync(user.password, 8);
	User.findByIdAndUpdate(req.params.id, user, function(err, user) {
		if (err) return res.status(500).send({
				message : "There was a problem updating the user."
			});
		res.status(200).send({
			message : "User: " + user.name + " has been updated."
		});
	});
});

module.exports = router;