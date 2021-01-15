/**
 * @module Api/responses
 * @description Módulo para generar las respuestas de las funciones en base a la conveción definida.
 * @version 1.0
 */

var responses = {}

/**
 * @function makeOkResponse
 * @name module:Api/responses#makeOkResponse
 * @description Wraper para generar la estructura de respuestas exitosas de las funciones.
 * @param {String} message Mensaje descriptivo con el detalle de la acción realizada.
 * @param {Number} [code] Número de código siempre debe ser mayor o igual a uno, en caso de no ser así se cambiará a 1 y enviará el error.
 * @param {Object} [data] Objeto de datos que regresará, el contenido de sus nodos dependerá de la lógica de cada función que lo mande llamar.
 * @return {Object} Dato de respuesta con la estructura {message: String, code: Number,data:*}
 */
responses.makeOkResponse = function (message, code, data) {
	if (code && !(Number(code) >= 1)) {
		console.log(
			"ERROR -> El código de resolve debe ser mayor igual a uno",
			message
		)
		code = 1
	}
	return {
		message: message || "",
		code: code || 1,
		data: data || {},
	}
}

/**
 * @function makeErrorResponse
 * @name module:Api/responses#makeErrorResponse
 * @description Wraper para generar la estructura de respuestas erroneas de las funciones.
 * @param {String} message Mensaje descriptivo con el detalle de la acción realizada.
 * @param {Number} [code] Número de código siempre debe ser mayor o igual a uno, en caso de no ser así se cambiará a 1 y enviará el error.
 * @param {*} [error] Objeto de datos que regresará, el contenido de sus nodos dependerá de la lógica de cada función que lo mande llamar.
 * @param {Boolean} [keepLastMessage=false] Mantener el último mensaje de respuesta enviado o remplazarla con el anterior en caso de tener la estructura adecuada.
 * @param {*} [data] Objeto de datos que regresará en la llave data del resultado en caso de ser necesario
 * @returns {{message: String, code: Number,error:*,data:*}} Dato de respuesta
 */
responses.makeErrorResponse = function (
	message,
	code,
	error,
	keepLastMessage,
	data
) {
	if (code && Number(code) >= 1) {
		console.log("ERROR -> El código debe ser menor a cero", message)
		code = -1
	}
	console.error("ERROR LOG -> ", error)
	keepLastMessage = keepLastMessage || false
	if (!keepLastMessage) {
		if (error && error.code < 0 && error.message) {
			message = error.message
		}
	}
	return {
		message: message || "",
		code: code || -1,
		error: error || null,
		data: data || null,
	}
}

/**
 * @function workTheTransactionOk
 * @name module:Api/responses#workTheTransactionOk
 * @description Función para trabajar el regreso funciones con transacciones de oracle.
 * @param {Boolean} doCommit Idenfificador de si la función que lo manda a llamar debe hacer el commit.
 * @param {Object} transaction Transacción que se está trabajando.
 * @param {String} message Mensaje.
 * @param {Number} [code]	Código.
 * @param {Object} [data] Datos que deberá regresar
 */
responses.workTheTransactionOk = function (
	doCommit,
	transaction,
	message,
	code,
	data
) {
	return new Promise(function (resolve, reject) {
		if (doCommit) {
			transaction
				.commit()
				.then(function () {
					resolve(responses.makeOkResponse(message, code, data))
					return
				})
				.catch(function (err) {
					responses
						.workTheTransactionError(
							doCommit,
							transaction,
							message,
							code,
							err
						)
						.catch(function (err) {
							reject(responses.makeErrorResponse(err))
							return
						})
				})
		} else {
			resolve(responses.makeOkResponse(message, code, data))
			return
		}
	})
}

/**
 * @function workTheTransactionError
 * @name module:Api/responses#workTheTransactionError
 * @description Función para trabajar el regreso de errores para funciones con transacciones de oracle.
 * @param {Boolean} doCommit Idenfificador de si la función que lo manda a llamar debe hacer el commit.
 * @param {Object} transaction Transacción que se está trabajando.
 * @param {String} message Mensaje de error.
 * @param {Number} code	Código de error.
 * @param {Object} [err] Error que genero el llamado de esta función.
 */
responses.workTheTransactionError = function (
	doCommit,
	transaction,
	message,
	code,
	err
) {
	return new Promise(function (resolve, reject) {
		if (doCommit) {
			transaction
				.rollback()
				.then(function () {
					reject(
						responses.makeErrorResponse(message, code - 0.01, err)
					)
					return
				})
				.catch(function (err) {
					reject(
						responses.makeErrorResponse(
							message + " (rc)",
							code - 0.02,
							err
						)
					)
					return
				})
		} else {
			reject(responses.makeErrorResponse(message, code - 0.03, err))
			return
		}
	})
}

module.exports = responses
