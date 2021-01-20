let validations = {}

validations.validateSignUpPayload = (payload) => {
	let result = {}
	try {
		let messages = []
		const { email, passwordHash, name, lastname, gender } = payload
		const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		if (typeof email !== 'string' || email.length < 1) {
			messages.push('El email está vacio o no es un string')
		} else if (!emailRegex.test(email)) {
			messages.push('El email no es válido')
		} else {
			console.log('correo válido ✅')
		}

		if (typeof passwordHash !== 'string' || passwordHash.length < 1) {
			messages.push('El password está vacio o no es un string')
		} else if (!emailRegex.test(email)) {
			messages.push('El email no es válido')
		} else {
			console.log('passwordHash válido ✅')
		}

		if (typeof name !== 'string' || name.length < 1) {
			messages.push('El nombre está vacio o no es un string')
		} else if (name.length < 3 && name.length > 50) {
			messages.push('El nombre no está dentro del rango de caracteres permitido')
		} else {
			console.log('name válido ✅')
		}

		if (typeof lastname !== 'string' || lastname.length < 1) {
			messages.push('El apellido está vacio o no es un string')
		} else if (lastname.length < 3 && lastname.length > 80) {
			messages.push('El apellido no está dentro del rango de caracteres permitido')
		} else {
			console.log('lastname válido ✅')
		}

		if (typeof gender !== 'string') {
			if (gender.length !== 1) {
				messages.push('El genero no es un caracter')
			}
			if (gender !== 'M' || gender !== 'F') {
				messages.push('El valor del genero no es válido')
			}
		}

		if (messages.length > 0) {
			result.code = -1
			result.messages = messages.join('\n')
		} else {
			result.code = 1
			result.messages = 'El objeto tiene la estructura correcta'
		}
	} catch (err) {
		console.log('validateSignUpPayload ERROR ->', err)
		result.code = -1
		result.messages = 'Ocurrió un error al validar el objeto del signup'
		result.error = err
	}
	return result
}

module.exports = validations
