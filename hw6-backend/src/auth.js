const md5 = require('md5')
const cookieKey = 'sid'
const getSalt = () => new Date().toString()
const getHash = (p, s) => md5(p+s)
const db = {}
const sessionUser = {}


const generateCode = (username) => username + Math.random().toString()
const register = (req, res) => {

	const username = req.body.username
	const password = req.body.password
	if (!username || !password) {
		res.sendStatus(400)
		return
	}
	if (username in db) {
		res.sendStatus(401)
	}else {
		const salt = getSalt()
		const hash = getHash(password,salt)
		db[username] = {username, salt, hash}
		res.send({result: 'success', username})
	}
}


const login = (req, res) => {

	const username = req.body.username
	const password = req.body.password
	if (!username || !password 
        || !(username in db)) {
		res.sendStatus(400)
		return
	}
	const {salt, hash} = db[username]
	if (getHash(password,salt) !== hash) {
		res.sendStatus(400)
		return
	}
	const sessionId = generateCode(username)
	sessionUser[sessionId] = username
	res.cookie(cookieKey, sessionId ,
        {maxAge: 3600000, httpOnly: true})
	res.send({username, result: 'success'})
}

const isLoggedIn = (req, res, next) => {
	const sid = req.cookies[cookieKey]
	if (!sid || !sessionUser[sid]) {
		return res.sendStatus(401)
	}
	req.username = sessionUser[sid]
	next()
}

const logout = (req, res) => {
	const sid = req.cookies[cookieKey]
	delete sessionUser[sid]
	res.send('OK')
}

const changePassword = (req, res) => {
	res.send({username:req.username, status: 'will not change' })
}

module.exports = (app) => {
	const cookieParser = require('cookie-parser')
	app.use(cookieParser())
	app.post('/register', register)
	app.post('/login', login)
	app.put('/logout', isLoggedIn, logout)
	app.put('/password', isLoggedIn, changePassword)
}