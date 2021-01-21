const cipherSuite = require('./cipher-suite')

//import cipherSuite from './cipher-suite'

const auth = {}

auth.cipherPassword = (email, password) => {
	console.log('password -->', password)
	const seed = email.split('@')[0]
	console.log('seed ->', seed)
	const passwordHash = cipherSuite.hash(password)
	let key = cipherSuite.createAESKeyFromString(seed)
	let passwordEncrypted = cipherSuite.aesEncrypt(passwordHash, key.key, key.IV)
	let passwordB64 = cipherSuite.stringToBase64(passwordEncrypted.data.encryptedText)
	console.log('passwordHashEncrypt', passwordEncrypted)
	console.log('passwordB64', passwordB64)
	return {
		passwordHash,
		passwordEncrypted,
		passwordB64,
	}
}

auth.validateEmail = (rule, value, callback) => {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	if (typeof value !== 'string' || value.length < 1) {
		callback(new Error('Por favor ingresa un email'))
	} else if (!re.test(value)) {
		callback(new Error('El email no es válido'))
	} else {
		callback()
	}
}

export default auth
