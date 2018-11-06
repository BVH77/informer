var cors = require('cors');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var VerifyToken = require(__root + 'auth/VerifyToken');
var Info = require('./Info');
var User = require('../user/User');
var Project = require('../project/Project');

router.all('*', cors());
router.use(bodyParser.json());

// RETURNS ALL ENTRIES
router.get('/:accepted/:project', VerifyToken, function (req, res) {
    const accepted = ('true' === req.params.accepted);
    const project = ('null' === req.params.project ? null : req.params.project);
    Info.find(accepted
        ? (project == null
            ? (req.isAdmin
                ? {}
                : { $or: [{ 'project': { $in: req.projects } }, { 'project': { $exists: false } }] }
            )
            : { $or: [{ 'project': project }, { 'project': { $exists: false } }] }
        )
        : (project == null
            ? (req.isAdmin
                ? { $or: [{ 'accepted.who': { $ne: req.userId } }, { 'indefinite': true }] }
                : {
                    $and: [
                        { $or: [{ 'accepted.who': { $ne: req.userId } }, { 'indefinite': true }] },
                        { $or: [{ 'project': { $in: req.projects } }, { 'project': { $exists: false } }] }
                    ]
                }
            )
            : {
                $and: [
                    { $or: [{ 'accepted.who': { $ne: req.userId } }, { 'indefinite': true }] },
                    { $or: [{ 'project': project }, { 'project': { $exists: false } }] }
                ]
            }
        )
    )
        .populate('user').populate('project').populate('accepted.who', 'name')
        .sort({ project: 1, createdAt: -1 }).exec(function (err, entries) {
            if (err) return res.status(500).send({
                message: "There was a problem finding the infos.",
                err: err
            });
            res.status(200).send(entries);
        });
});

// GETS A SINGLE ENTRY
router.get('/:id', VerifyToken, function (req, res) {
    Info.findById(req.params.id).populate('user').exec(function (err, entry) {
        if (err) return res.status(500).send({
            message: "There was a problem finding the info."
        });
        if (!entry) return res.status(404).send({
            message: "No info found."
        });
        res.status(200).send(entry);
    });
});

//CREATES A NEW ENTRY
router.post('/', VerifyToken, function (req, res) {
    Info.create({
        text: req.body.text,
        indefinite: req.body.indefinite,
        user: req.userId,
        project: req.body.project
    },
        function (err, entry) {
            if (err) return res.status(500).send({
                message: "There was a problem adding the info to the database."
            });
            res.status(200).send({
                message: "Info id: " + entry._id + " has been created."
            });
        });
});

// DELETES AN ENTRY
router.delete('/:id', VerifyToken, function (req, res) {
    if (false == req.isAdmin) return res.status(403).send({
        message: "Forbidden"
    });
    Info.findByIdAndRemove(req.params.id, function (err, entry) {
        if (err) return res.status(500).send({
            message: "There was a problem deleting the info."
        });
        res.status(200).send({
            message: "Info id: " + entry._id + " has been deleted."
        });
    });
});

// UPDATES A SINGLE ENTRY
router.put('/:id', VerifyToken, function (req, res) {
    if (false == req.isAdmin) return res.status(403).send({
        message: "Forbidden"
    });
    Info.findByIdAndUpdate(req.params.id, req.body, function (err, entry) {
        if (err) return res.status(500).send({
            message: "There was a problem updating the info."
        });
        res.status(200).send({
            message: "Info id: " + entry._id + " has been updated."
        });
    });
});

// SET READED BY USER FOR INFO
router.put('/accept/:id', VerifyToken, function (req, res) {
    Info.findByIdAndUpdate(req.params.id, { $push: { accepted: { who: req.userId } } }, function (err, entry) {
        if (err) return res.status(500).send({
            message: "There was a problem finding the info."
        });
        if (!entry) return res.status(404).send({
            message: "No info found."
        });
        res.status(200).send({
            message: "Info id: " + req.params.id + " has been mark as accepted."
        });
    });
});

module.exports = router;