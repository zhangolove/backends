const user = {
	username: 'guest',
	headline: 'my status message',
	email: 'guest@rice.edu',
	zipcode: 77005,
	avatar: 'https://webdev-dummy.herokuapp.com/img/owl.png',
	dob: new Date().getTime()
}
//in memory database
const db = {}

const fetchDb = (username, key) => {
	if (!(username in db)) {
		db[username] = {...user, username}
	}
	return db[username][key]
}

const updateDb = (username, key, value) => {
	fetchDb(username, key)
	db[username][key] = value
	return value
}

const index = (req, res) => {
	res.send({ hello: 'world' })
}

const getHeadline = (req, res) => 
	_getFieldForMultipleUsers(req, res, 'headlines', 'headline')

const _getFieldForMultipleUsers = (req, res, fields, field) => {
	//default to use hardcoded name
	if (!req.user) req.user = user.username

	const users = req.params.users ? req.params.users.split(',') : [req.user]

	const fieldList = users.map(username => {
		const payload = {username}
		payload[field] = fetchDb(username, field)
		return payload
	})
	const payload = {}
	payload[fields] = fieldList
	res.send(payload)
}


const _getField = (req, res, field) => {
	const username = req.params.user ? req.params.user : user.username
	const payload = {username}
	payload[field] = fetchDb(username, field)
	res.send(payload)
}

const _setField = (req, res, field) => {
	const username = user.username
	const payload = {username}
	payload[field] = updateDb(username, field, req.body[field])
	res.send(payload)
}

const getZipcode = (req, res) => 
	_getField(req, res, 'zipcode')

const getEmail = (req, res) => 
	_getField(req, res, 'email')

const getAvatars = (req, res) => 
	_getFieldForMultipleUsers(req, res, 'avatars', 'avatar')

const getDob = (req, res) => 
	_getField(req, res, 'dob')

const setHeadline = (req, res) => 
	_setField(req, res, 'headline')

const setZipcode = (req, res) => 
	_setField(req, res, 'zipcode')

const setEmail = (req, res) => 
	_setField(req, res, 'email')

const setAvatar = (req, res) => 
	_getField(req, res, 'avatar')

module.exports = app => {
	app.get('/', index)
	app.get('/headlines/:users?', getHeadline)
	app.put('/headline', setHeadline)
	app.get('/dob', getDob)
	app.get('/zipcode/:user?', getZipcode)
	app.put('/zipcode', setZipcode)
	app.get('/email/:user?', getEmail)
	app.put('/email', setEmail)
	app.get('/avatars/:user?', getAvatars)
	app.put('/avatar', setAvatar)
}