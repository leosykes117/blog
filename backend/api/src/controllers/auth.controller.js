const jwt = require('jsonwebtoken')
const config = require('../config/config')
const User = require('../models/User')
const utilitiesResponse = require('../lib/responses')
const validations = require('../lib/validations')
const authController = {}

authController.signIn = (req, res) => {
	return new Promise((resolve, reject) => {
		resolve()
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
				resolve(utilitiesResponse.makeOkResponse('Usuario creado con éxito', 1, { token }))
			})
			.catch((err) => {
				console.log(err)
				reject(utilitiesResponse.makeErrorResponse('Ocurrio un error al verificar el correo del usuario', -1, err))
			})
	})
}

module.exports = authController
