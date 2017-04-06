'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

var allowedOrigin = 'http://localhost:8080';

var cors = function cors(req, res, next) {
	res.header('Access-Control-Allow-Origin', allowedOrigin);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,\
									 Content-Type, Accept');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	if (req.method === 'OPTIONS') {
		res.status(200).send('OK');
	} else {
		next();
	}
};

var app = express();
app.use(bodyParser.json());
require('./articles.js')(app);
require('./profile.js')(app);
require('./auth.js')(app);
require('./following.js')(app);

// Get the port from the environment, i.e., Heroku sets it
var port = process.env.PORT || 3000;
app.listen(port, function () {});