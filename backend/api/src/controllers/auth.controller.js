const jwt = require('jsonwebtoken')
const config = require('../config/config')
const User = require('../models/User')
const utilitiesResponse = require('../lib/responses')
const validations = require('../lib/validations')
const authController = {}

authController.signIn = (req) => {
	return new Promise((resolve, reject) => {
		console.log('req.body ->', req.body)
		const { email, passwordHash } = req.body

		let passwordHashStorage = ''
		let userData

		User.decryptPassword(passwordHash, email)
			.then((passwordDecResponse) => {
				console.log(JSON.stringify({ passwordDecResponse }))
				passwordHashStorage = passwordDecResponse.data
				return User.getUser({email})
			})
			.then((searchResponse) => {
				if (searchResponse.code != 1) {
					console.log('El correo no existe')
					reject(utilitiesResponse.makeErrorResponse('Error en el correo electrónico o password', -2))
					return
				}
				if (searchResponse.data.passwordHash !== passwordHashStorage) {
					console.log('Los hash de los passwords no coinciden')
					reject(utilitiesResponse.makeErrorResponse('Error en el correo electrónico o password', -3))
					return
				}
				userData = {
					name: searchResponse.data.name,
					lastname: searchResponse.data.lastname,
					gender: searchResponse.data.lastname.gender,
				}
				const payload = {
					id: searchResponse.data.id,
					email: searchResponse.data.email,
				}
				const token = jwt.sign(payload, config.SECRET, {
					expiresIn: 86400,
				})

				console.log('token ->', token)
				resolve(utilitiesResponse.makeOkResponse('Autenticado con éxito', 1, { token, userData }))
			})
			.catch((err) => {
				console.log(err)
				reject(utilitiesResponse.makeErrorResponse('Ocurrio un error al verificar el correo del usuario', -1, err))
			})
	})
}

authController.signUp = (req, res) => {
	return new Promise((resolve, reject) => {
		let errCode = -1,
			errMessage = ''
		const { email, passwordHash, name, lastname, gender } = req.body
		console.log('req.body ->', req.body)

		let validationResponse = validations.validateSignUpPayload(req.body)
		console.log('validationResponse ->', JSON.stringify(validationResponse))
		if (validationResponse.code < 1) {
			reject(utilitiesResponse.makeErrorResponse('El payload no tiene la estructura correcta', -3))
			return
		}

		User.findByEmail(email)
			.then((searchResponse) => {
				if (searchResponse.code != 2) {
					reject(utilitiesResponse.makeErrorResponse('El correo electrónico ya ha sido usado', -2))
					return
				}
				return User.decryptPassword(passwordHash, email)
			})
			.then((passwordDecResponse) => {
				console.log(JSON.stringify({ passwordDecResponse }))
				return User.create({
					email,
					passwordHash: passwordDecResponse.data,
					name,
					lastname,
					gender,
				})
			})
			.then((userInsertResponse) => {
				const payload = {
					id: userInsertResponse.data.id,
				}
				const token = jwt.sign(payload, config.SECRET, {
					expiresIn: 86400,
				})
				console.log(JSON.stringify({ userInsertResponse }))
				console.log('token ->', token)
				resolve(utilitiesResponse.makeOkResponse('Usuario creado con éxito', 1, { token }))
			})
			.catch((err) => {
				console.log(err)
				reject(utilitiesResponse.makeErrorResponse('Ocurrio un error al verificar el correo del usuario', -1, err))
			})
	})
}

module.exports = authController
