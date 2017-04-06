'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var articles = require('../data/articles.json').articles;
var uCommentId = 0;

var getUniqueCommentId = function getUniqueCommentId() {
	//This is a naive uuid generator
	uCommentId += 1;
	return uCommentId;
};
var getArticles = function getArticles(req, res) {
	var query = req.params.id;
	console.log('query ' + query);
	console.log(articles);
	if (query) {
		var byAuthor = articles.filter(function (a) {
			return a.author == query;
		});
		if (byAuthor.length) {
			res.send({ articles: byAuthor });
			return;
		}
		var byId = articles.filter(function (a) {
			return a._id == query;
		});
		console.log(byId);
		if (byId.length) {
			res.send({ articles: byId });
			return;
		}
	}
	res.send({ articles: articles });
};

var addArticle = function addArticle(req, res) {
	var article = {
		_id: articles.length + 1,
		author: 'guest',
		text: req.body.text,
		date: new Date(),
		comments: []
	};
	articles = [].concat(_toConsumableArray(articles), [article]);
	res.send({ articles: [article] });
};

var updateComment = function updateComment(a, commentId, text) {
	if (commentId === -1) {
		//commentId == -1 indicates that it is a new comment
		return _extends({}, a, {
			comments: [].concat(_toConsumableArray(a.comments), [{
				commentId: getUniqueCommentId(),
				author: 'guest',
				date: new Date(),
				text: text
			}]) });
	} else {
		return _extends({}, a, {
			comments: a.comments.map(function (c) {
				return c.commentId === commentId ? _extends({}, c, { text: text }) : c;
			})
		});
	}
};

var updateArticle = function updateArticle(req, res) {
	articles = articles.map(function (a) {
		var text = req.body.text;
		if (a._id === req.params.id) {
			//TODO: check if commentId is valid
			var commentId = req.body.commentId;
			return commentId ? updateComment(a, commentId, text) : _extends({}, a, { text: text });
		}
	});
	var updated = articles.filter(function (a) {
		return a._id === req.params.id;
	});
	res.send({ articles: updated });
};

module.exports = function (app) {
	app.get('/articles/:id*?', getArticles);
	app.put('/articles/:id', updateArticle);
	app.post('/article', addArticle);
};