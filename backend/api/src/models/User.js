const oracle = require("../lib/oracle")
const utilitiesResponse = require("../lib/responses")
const cipherSuite = require("../lib/cipherSuite")

const User = {}

const oracledb = oracle.checkAvailability();

User.findByEmail = (email) => {
	return new Promise((resolve, reject) => {
		let sql = `SELECT
					ID_USUARIO --0
				FROM USUARIOS
				WHERE EMAIL = :email`
		let sqlParams = { 
			email
		}
		oracle
			.query(sql, sqlParams)
			.then((queryResponse) => {
				console.log("queryResponse -->", queryResponse)
				let searchedUser = queryResponse.data.rows
				if (searchedUser.length === 0) {
					resolve(utilitiesResponse.makeOkResponse("El usuario no existe", 2, {}))
					return
				}
				const user = {
					id: searchedUser[0][0],
				}
				resolve(utilitiesResponse.makeOkResponse("Usuario encontrado", 1, user))
			})
			.catch((err) => {
				console.log("findByEmail error ->", err)
				reject(utilitiesResponse.makeErrorResponse("Ocurrio un error al buscar al usuario", -1, err))
			})
	})
}

User.create = (dataset) => {
	return new Promise((resolve, reject) => {
		let errCode = -1, errMessage = ""
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
				dir: oracledb.BIND_OUT
			}
		}
		errMessage = "No se pudo establecer conexión con la base de datos"
		oracle.getTransaction()
			.then((transaction) => {
				errMessage = "El registro del usuario no pudo ser creado"
				return transaction.query(sql, sqlParams)
			})
			.then((response) => {
				if (typeof response.data.outBinds.userId[0] !== 'number') {
					reject(utilitiesResponse.workTheTransactionError(true, transaction, "El registro del usuario no fue creado correctamente", -1, {}))
				}
				const data = {
					id: response.data.outBinds.userId[0]
				}
				resolve(utilitiesResponse.workTheTransactionOk(true, transaction, "Usuario creado con éxito", 1, data))
			})
			.catch((err) => {
				reject(utilitiesResponse.workTheTransactionError(true, transaction, errMessage, errCode, err))
			})
	})
}

User.decryptPassword = (password, seedString) => {
	return new Promise((resolve, reject) => {
		try {
			let key = cipherSuite.createAESKeyFromString(seedString)
			console.log("key-->", JSON.stringify(key))
			let passwordEncrypted = cipherSuite.base64ToString(dataset.password)
			console.log("passwordEncrypted-->", JSON.stringify(passwordEncrypted))
			var resultPassword = cipherSuite.aesDecrypt(passwordEncrypted, key.key, key.IV)
			resolve(utilitiesResponse.makeOkResponse())
		} catch (err) {
			reject(utilitiesResponse.makeErrorResponse("Ocurrió un error al validar el password", -1, err))
		}
	})
}

module.exports = User
