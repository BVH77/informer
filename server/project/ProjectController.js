var cors = require('cors');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var VerifyToken = require(__root + 'auth/VerifyToken');
var Project = require('./Project');

router.all('*', cors());
router.use(bodyParser.json());

//CREATES A NEW ENTRY
router.post('/', VerifyToken, function(req, res) {
	if (false == req.isAdmin) return res.status(403).send({message: "Forbidden"});
	Project.create({
		name : req.body.name,
		desc : req.body.desc
	},
		function(err, entry) {
			if (err) return res.status(500).send({
					message : "There was a problem adding the project to the database."
				});
			res.status(200).send({
				message : "Project: " + entry.name + " has been created."
			});
		});
});

//RETURNS ALL ENTRIES
router.get('/', VerifyToken, function(req, res) {
	if (false == req.isAdmin) return res.status(403).send({message: "Forbidden"});
	Project.find({}, function(err, entries) {
		if (err) return res.status(500).send({
				message : "There was a problem finding the projects."
			});
		res.status(200).send(entries);
	});
});

//GETS A SINGLE ENTRY
router.get('/:id', VerifyToken, function(req, res) {
	if (false == req.isAdmin) return res.status(403).send({message: "Forbidden"});
	Project.findById(req.params.id, function(err, entry) {
		if (err) return res.status(500).send({
				message : "There was a problem finding the project."
			});
		if (!entry) return res.status(404).send({
				message : "No project found."
			});
		res.status(200).send(entry);
	});
});

//DELETES AN ENTRY
router.delete('/:id', VerifyToken, function(req, res) {
	if (false == req.isAdmin) return res.status(403).send({message: "Forbidden"});
	Project.findByIdAndRemove(req.params.id, function(err, entry) {
		if (err) return res.status(500).send({
				message : "There was a problem deleting the project."
			});
		res.status(200).send({
			message : "Project: " + entry.name + " was deleted."
		});
	});
});

//UPDATES A SINGLE ENTRY
router.put('/:id', VerifyToken, function(req, res) {
	if (false == req.isAdmin) return res.status(403).send({message: "Forbidden"});
	Project.findByIdAndUpdate(req.params.id, req.body, function(err, entry) {
		if (err) return res.status(500).send({
			message : "There was a problem updating the project."
		});
		res.status(200).send({
			message : "Project: " + entry.name + " has been updated."
		});
	});
});

module.exports = router;