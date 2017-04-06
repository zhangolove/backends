const following = ['cl46', 'cl46test', 'guest']


const getFollowing = (req, res) => {
	const username = req.params.user ? req.params.user : 'guest'
	res.send({username, following})
}


const putFollowing = (req, res) => {
	const username = 'guest'
	res.send({username, 
		following: following.concat([req.params.user])})
}

const deleteFollowing = (req, res) => {
	const username = 'guest'
	res.send({username, 
		following:following.filter(f => f !== req.params.user)})
}

module.exports = app => {
	app.get('/following/:user?', getFollowing)
	app.route('/following/:user')
        .put(putFollowing)
        .delete(deleteFollowing)
}