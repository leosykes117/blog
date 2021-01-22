const jwt = require('jsonwebtoken')
const config = require('../config/config')
const Article = require('../models/Article')
const User = require('../models/User')
const utilitiesResponse = require('../lib/responses')
const articleController = {}

articleController.getUserArticles = (req) => {
	return new Promise((resolve, reject) => {
		console.log('req.body ->', req.body)
		const token = req.headers['x-access-token']
		if (!token) {
			reject(utilitiesResponse.makeErrorResponse('No token provided', -2))
			return
		}

		const decoded = jwt.verify(token, config.SECRET)
		console.log(decoded)

		User.findById(decoded.id)
			.then((searchResponse) => {
				if (searchResponse.code !== 1) {
					reject(utilitiesResponse.makeErrorResponse('El usuario no existe', -2))
					return
				}
				return Article.getUserArticles({ userId: decoded.id })
			})
			.then((response) => {
				resolve(utilitiesResponse.makeOkResponse('Artículos obtenidos con éxito', 1, response.data))
			})
			.catch((err) => {
				reject(utilitiesResponse.makeErrorResponse('No token provided', -2))
			})
	})
}

articleController.createOrUpdateArticle = (req) => {
	return new Promise((resolve, reject) => {
		console.log('req.body ->', req.body)
		const token = req.headers['x-access-token']
		if (!token) {
			reject(utilitiesResponse.makeErrorResponse('No token provided', -2))
			return
		}

		const decoded = jwt.verify(token, config.SECRET)
		console.log(decoded)

		const { title, slug, content, isPublished } = req.body

		User.findById(decoded.id)
			.then((searchResponse) => {
				if (searchResponse.code !== 1) {
					reject(utilitiesResponse.makeErrorResponse('El usuario no existe', -2))
					return
				}
				return Article.createOrUpdate({ title, slug, content, isPublished, userId: decoded.id })
			})
			.then((response) => {
				resolve(utilitiesResponse.makeOkResponse('Artículos guardado con éxito', 1, response.data))
			})
			.catch((err) => {
				reject(utilitiesResponse.makeErrorResponse('No token provided', -2))
			})
	})
}

module.exports = articleController
