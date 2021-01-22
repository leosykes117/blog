const jwt = require('jsonwebtoken')
const User = require('../models/User')
const config = require('../config/config')

export const verifyToken = (req, res, next) => {
	const token = req.headers['x-access-token']
	if (!token) {
		return res.status(403).json({
			message: 'No token provided',
		})
	}

	const decoded = jwt.verify(token, config.SECRET)
	console.log(decoded)

	next()
}
