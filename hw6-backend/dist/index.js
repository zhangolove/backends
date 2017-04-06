'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();
app.use(logger('default'));
app.use(bodyParser.json());

require('./articles.js')(app);
require('./profile.js')(app);
require('./auth.js')(app);
require('./following.js')(app);

// Get the port from the environment, i.e., Heroku sets it
var port = process.env.PORT || 3000;
app.listen(port, function () {
	//const addr = server.address()
	//console.log(`Server listening at http://${addr.address}:${addr.port}`)
});