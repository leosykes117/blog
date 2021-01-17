const User = require("../models/User")
const utilitiesResponse = require("../lib/responses")
const authController = {}

authController.signIn = (req, res) => {
	return new Promise((resolve, reject) => {
		resolve()
	})
}

authController.signUp = (req, res) => {
	return new Promise((resolve, reject) => {
		let errCode = -1, errMessage = ""
		const { email, passwordHash, name, lastname, gender } = req.body
		console.log("req.body ->", req.body)
		User.findByEmail(email)
			.then((searchResponse) => {
				if (searchResponse.code != 2) {
					reject(utilitiesResponse.makeErrorResponse("El correo electrónico ya ha sido usado", -2))
					return
				}
				resolve(utilitiesResponse.makeOkResponse("Se puede crear el usuario", 1, {}))
			})
			.catch((err) => {
				reject(utilitiesResponse.makeErrorResponse("Ocurrio un error al verificar el correo del usuario", -1, err))
			})
	})
}

module.exports = authController
