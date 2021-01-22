const oracle = require('../lib/oracle')
const utilitiesResponse = require('../lib/responses')
const cipherSuite = require('../lib/cipherSuite')

const User = {}

const oracledb = oracle.checkAvailability()

User.findById = (userId) => {
	return new Promise((resolve, reject) => {
		let sql = `SELECT
					ID_USUARIO --0
				FROM USUARIOS
				WHERE ID_USUARIO = :userId`
		let sqlParams = {
			userId,
		}
		oracle
			.query(sql, sqlParams)
			.then((queryResponse) => {
				console.log('queryResponse -->', queryResponse)
				let searchedUser = queryResponse.data.rows
				if (searchedUser.length === 0) {
					resolve(utilitiesResponse.makeOkResponse('El usuario no existe', 2, {}))
					return
				}
				const user = {
					id: searchedUser[0][0],
				}
				resolve(utilitiesResponse.makeOkResponse('Usuario encontrado', 1, user))
			})
			.catch((err) => {
				console.log('findByEmail error ->', err)
				reject(utilitiesResponse.makeErrorResponse('Ocurrio un error al buscar al usuario', -1, err))
			})
	})
}

User.findByEmail = (email) => {
	return new Promise((resolve, reject) => {
		let sql = `SELECT
					ID_USUARIO --0
				FROM USUARIOS
				WHERE EMAIL = :email`
		let sqlParams = {
			email,
		}
		oracle
			.query(sql, sqlParams)
			.then((queryResponse) => {
				console.log('queryResponse -->', queryResponse)
				let searchedUser = queryResponse.data.rows
				if (searchedUser.length === 0) {
					resolve(utilitiesResponse.makeOkResponse('El usuario no existe', 2, {}))
					return
				}
				const user = {
					id: searchedUser[0][0],
				}
				resolve(utilitiesResponse.makeOkResponse('Usuario encontrado', 1, user))
			})
			.catch((err) => {
				console.log('findByEmail error ->', err)
				reject(utilitiesResponse.makeErrorResponse('Ocurrio un error al buscar al usuario', -1, err))
			})
	})
}

User.create = (dataset) => {
	return new Promise((resolve, reject) => {
		let errCode = -1,
			errMessage = ''
		let transaction
		let sql = `INSERT INTO USUARIOS (EMAIL, PASSWORDHASH, NOMBRE, APELLIDOS, GENERO)
				VALUES(:email, :passwordHash, :name, :lastname, :gender) 
				RETURNING ID_USUARIO INTO :userId`
		let sqlParams = {
			email: dataset.email,
			passwordHash: dataset.passwordHash,
			name: dataset.name,
			lastname: dataset.lastname,
			gender: dataset.gender,
			userId: {
				type: oracledb.NUMBER,
				dir: oracledb.BIND_OUT,
			},
		}
		errMessage = 'No se pudo establecer conexión con la base de datos'
		oracle
			.getTransaction()
			.then((sqlTransaction) => {
				transaction = sqlTransaction
				errMessage = 'El registro del usuario no pudo ser creado'
				return transaction.query(sql, sqlParams)
			})
			.then((response) => {
				if (typeof response.data.outBinds.userId[0] !== 'number') {
					reject(
						utilitiesResponse.workTheTransactionError(
							true,
							transaction,
							'El registro del usuario no fue creado correctamente',
							-1,
							{}
						)
					)
				}
				const data = {
					id: response.data.outBinds.userId[0],
				}
				transaction
					.commit()
					.then(function () {
						resolve(utilitiesResponse.makeOkResponse('Usuario creado con éxito', 1, data))
					})
					.catch(function (err) {
						reject(utilitiesResponse.makeErrorResponse('Error al revertir los cambios', -1, err))
					})
			})
			.catch((err) => {
				reject(utilitiesResponse.workTheTransactionError(true, transaction, errMessage, errCode, err))
			})
	})
}

User.getUser = (dataset) => {
	return new Promise((resolve, reject) => {
		let sql = `SELECT
					ID_USUARIO		--0
					, EMAIL			--1
					, PASSWORDHASH	--2
					, NOMBRE		--3
					, APELLIDOS		--4
					, GENERO		--5
				FROM USUARIOS
				WHERE EMAIL = :email`
		let sqlParams = {
			email: dataset.email
		}
		oracle
			.query(sql, sqlParams)
			.then((queryResponse) => {
				console.log('queryResponse -->', queryResponse)
				let searchedUser = queryResponse.data.rows
				if (searchedUser.length === 0) {
					resolve(utilitiesResponse.makeOkResponse('El usuario no existe', 2, {}))
					return
				}
				const user = {
					id: searchedUser[0][0],
					email: searchedUser[0][1],
					passwordHash: searchedUser[0][2],
					name: searchedUser[0][3],
					lastname: searchedUser[0][4],
					gender: searchedUser[0][5],
				}
				resolve(utilitiesResponse.makeOkResponse('Usuario encontrado', 1, user))
			})
			.catch((err) => {
				console.log('findByEmail error ->', err)
				reject(utilitiesResponse.makeErrorResponse('Ocurrio un error al buscar al usuario', -1, err))
			})
	})
}

User.decryptPassword = (password, email) => {
	return new Promise((resolve, reject) => {
		try {
			const seedString = email.split('@')[0]
			console.log('seedString-->', seedString)
			let key = cipherSuite.createAESKeyFromString(seedString)
			console.log('key-->', JSON.stringify(key))
			const passwordEncrypted = cipherSuite.base64ToString(password)
			console.log('passwordEncrypted-->', JSON.stringify(passwordEncrypted))

			const resultPassword = cipherSuite.aesDecrypt(passwordEncrypted, key.key, key.IV)
			console.log('resultPassword-->', JSON.stringify(resultPassword))
			let passwordHash = ''
			if (resultPassword.code === 1) {
				passwordHash = resultPassword.data.plainText
			} else {
				reject(utilitiesResponse.makeErrorResponse('Ocurrió un error al obtener el hash del password', -1))
			}

			console.log({
				password,
				passwordEncrypted,
				passwordHash,
			})

			resolve(utilitiesResponse.makeOkResponse('Password descifrado correctamente', 1, passwordHash))
		} catch (err) {
			reject(utilitiesResponse.makeErrorResponse('Ocurrió un error al descifrar el password', -1, err))
		}
	})
}

module.exports = User
