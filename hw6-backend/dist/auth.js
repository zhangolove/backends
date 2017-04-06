'use strict';

var md5 = require('md5');
var cookieKey = 'sid';
var getSalt = function getSalt() {
	return new Date().toString();
};
var getHash = function getHash(p, s) {
	return md5(p + s);
};
var db = {};
var sessionUser = {};

var generateCode = function generateCode(username) {
	return username + Math.random().toString();
};
var register = function register(req, res) {

	var username = req.body.username;
	var password = req.body.password;
	if (!username || !password) {
		res.sendStatus(400);
		return;
	}
	if (username in db) {
		res.sendStatus(401);
	} else {
		var salt = getSalt();
		var hash = getHash(password, salt);
		db[username] = { username: username, salt: salt, hash: hash };
		res.send({ result: 'success', username: username });
	}
};

var login = function login(req, res) {

	var username = req.body.username;
	var password = req.body.password;
	if (!username || !password || !(username in db)) {
		res.sendStatus(400);
		return;
	}
	var _db$username = db[username],
	    salt = _db$username.salt,
	    hash = _db$username.hash;

	if (getHash(password, salt) !== hash) {
		res.sendStatus(400);
		return;
	}
	var sessionId = generateCode(username);
	sessionUser[sessionId] = username;
	res.cookie(cookieKey, sessionId, { maxAge: 3600000, httpOnly: true });
	res.send({ username: username, result: 'success' });
};

var isLoggedIn = function isLoggedIn(req, res, next) {
	var sid = req.cookies[cookieKey];
	if (!sid || !sessionUser[sid]) {
		return res.sendStatus(401);
	}
	req.username = sessionUser[sid];
	next();
};

var logout = function logout(req, res) {
	var sid = req.cookies[cookieKey];
	delete sessionUser[sid];
	res.send('OK');
};

var changePassword = function changePassword(req, res) {
	res.send({ username: req.username, status: 'will not change' });
};

module.exports = function (app) {
	var cookieParser = require('cookie-parser');
	app.use(cookieParser());
	app.post('/register', register);
	app.post('/login', login);
	app.put('/logout', isLoggedIn, logout);
	app.put('/password', isLoggedIn, changePassword);
};