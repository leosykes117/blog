const cipherSuite = require('./lib/cipherSuite')
const bcrypt = require('bcryptjs')

const compareHash = (passwordHash) => {
	return new Promise((resolve, reject) => {
		bcrypt
			.genSalt(10)
			.then((salt) => {
				return bcrypt.hash(passwordHash, salt)
			})
			.then((hash) => {
				resolve(hash)
			})
			.catch((err) => {
				reject(err)
			})
	})
}

const cipherHash = (password, email) => {
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

const encryptPassword = () => {
	return new Promise((resolve, reject) => {
		bcrypt
			.genSalt(10)
			.then((salt) => {
				return bcrypt.hash('100%JS', salt)
			})
			.then((hash) => {
				console.log('hash ->', hash)
				const result = cipherHash(hash)
				resolve(result)
			})
			.catch((err) => {
				console.log('gensalt err ->', err)
				reject(err)
			})
	})
}


let passwordHash = cipherHash('SnYnbe7VOWkS3gV', 'adela47@gmail.com')
console.log({passwordHash})

/* let firstHash, secondHash
compareHash('100%JS')
	.then((fHash) => {
		firstHash = fHash
		return compareHash('100%JS')
	})
	.then((sHash) => {
		secondHash = sHash
		console.log({ firstHash, secondHash })
		console.log(firstHash === secondHash)
	})
	.catch((err) => {}) */

/* encryptPassword()
	.then((response) => {
		console.log("passoword cifrada")
		console.log(response)
	})
	.catch((err) => {
		console.log("Ocurrio un error al cifrar el password")
	}) */
