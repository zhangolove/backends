let articles = require('../data/articles.json').articles
let uCommentId = 0

const getUniqueCommentId = () => {
	//This is a naive uuid generator
	uCommentId += 1
	return uCommentId
}
const getArticles = (req, res) => {
	const query = req.params.id
	if (query) {
		const byAuthor = articles.filter(a => a.author == query)
		if (byAuthor.length) {
			res.send({articles: byAuthor})
			return
		} 
		const byId = articles.filter(a => a._id == query)
		if (byId.length) {
			res.send({articles: byId})
			return
		}
	}
	res.send({ articles })
}

const addArticle = (req, res) => {
	const article = {
		_id: articles.length + 1,
		author: 'guest',
		text: req.body.text,
		date: new Date(),
		comments: []
	}	
	articles = [...articles, article]
	res.send({ articles: [ article ] })
}


const updateComment = (a, commentId, text) => {
	if (commentId === -1) {
		//commentId == -1 indicates that it is a new comment
		return { ...a, 
			comments: [...a.comments, {
				commentId: getUniqueCommentId(),
				author: 'guest',
				date: new Date(),
				text
			}]}
	} else {
		return {...a,
			comments: a.comments.map(c => {
				return c.commentId === commentId ? 
					{...c, text} : c
			})
		}
	}
}

const updateArticle = (req, res) => {
	articles = articles.map(a => {
		const text = req.body.text
		if (a._id === req.params.id) {
			//TODO: check if commentId is valid
			const commentId = req.body.commentId
			return commentId ? 
				updateComment(a, commentId, text) : {...a, text}
		} 
	})
	const updated = articles.filter(a => a._id === req.params.id)
	res.send({articles: updated})

}

module.exports = app => {
	app.get('/articles/:id*?', getArticles)
	app.put('/articles/:id', updateArticle)
	app.post('/article', addArticle)
}
