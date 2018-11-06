var express = require('express');
var path = require('path');
var app = express();
var db = require('./db');
global.__root   = __dirname + '/';

var AuthController = require(__root + 'auth/AuthController');
app.use('/api/auth', AuthController);

var UserController = require(__root + 'user/UserController');
app.use('/api/users', UserController);

var ProjectController = require(__root + 'project/ProjectController');
app.use('/api/projects', ProjectController);

var InfoController = require(__root + 'info/InfoController');
app.use('/api/infos', InfoController);

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../dist/index.html'));
});

module.exports = app;