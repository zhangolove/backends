'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var user = {
	username: 'guest',
	headline: 'my status message',
	email: 'guest@rice.edu',
	zipcode: 77005,
	avatar: 'https://webdev-dummy.herokuapp.com/img/owl.png',
	dob: new Date().getTime()
};
//in memory database
var db = {};

var fetchDb = function fetchDb(username, key) {
	if (!(username in db)) {
		db[username] = _extends({}, user, { username: username });
	}
	return db[username][key];
};

var updateDb = function updateDb(username, key, value) {
	fetchDb(username, key);
	db[username][key] = value;
	return value;
};

var index = function index(req, res) {
	res.send({ hello: 'world' });
};

var getHeadline = function getHeadline(req, res) {
	return _getFieldForMultipleUsers(req, res, 'headlines', 'headline');
};

var _getFieldForMultipleUsers = function _getFieldForMultipleUsers(req, res, fields, field) {
	//default to use hardcoded name
	if (!req.user) req.user = user.username;

	var users = req.params.users ? req.params.users.split(',') : [req.user];

	var fieldList = users.map(function (username) {
		var payload = { username: username };
		payload[field] = fetchDb(username, field);
		return payload;
	});
	var payload = {};
	payload[fields] = fieldList;
	res.send(payload);
};

var _getField = function _getField(req, res, field) {
	var username = req.params.user ? req.params.user : user.username;
	var payload = { username: username };
	payload[field] = fetchDb(username, field);
	res.send(payload);
};

var _setField = function _setField(req, res, field) {
	var username = user.username;
	var payload = { username: username };
	payload[field] = updateDb(username, field, req.body[field]);
	res.send(payload);
};

var getZipcode = function getZipcode(req, res) {
	return _getField(req, res, 'zipcode');
};

var getEmail = function getEmail(req, res) {
	return _getField(req, res, 'email');
};

var getAvatars = function getAvatars(req, res) {
	return _getFieldForMultipleUsers(req, res, 'avatars', 'avatar');
};

var getDob = function getDob(req, res) {
	return _getField(req, res, 'dob');
};

var setHeadline = function setHeadline(req, res) {
	return _setField(req, res, 'headline');
};

var setZipcode = function setZipcode(req, res) {
	return _setField(req, res, 'zipcode');
};

var setEmail = function setEmail(req, res) {
	return _setField(req, res, 'email');
};

var setAvatar = function setAvatar(req, res) {
	return _getField(req, res, 'avatar');
};

module.exports = function (app) {
	app.get('/', index);
	app.get('/headlines/:users?', getHeadline);
	app.put('/headline', setHeadline);
	app.get('/dob', getDob);
	app.get('/zipcode/:user?', getZipcode);
	app.put('/zipcode', setZipcode);
	app.get('/email/:user?', getEmail);
	app.put('/email', setEmail);
	app.get('/avatars/:user?', getAvatars);
	app.put('/avatar', setAvatar);
};