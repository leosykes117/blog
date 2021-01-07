/**
 * @module Api/OracleDb
 * @description Módulo encargado de la conexión y actualización en la base de datos Oracle
 * @version 1.0
 *<b>MÓDULOS npm NECESARIOS:</b>
 * --------------------------------------------------
 * 1. oracledb
 * --------------------------------------------------
 */

const { createPool } = require('oracledb')

var Oracle = {}
let debug = true
var oracledb

/**
 * @function checkAvailability
 * @description Función para validar que se tiene lo necesario para usar oracle.
 * @returns {Boolean} <b>Objeto oracledb</b> cuando fue posible cargar el módulo de oracle y <b>false</b> cuando no.
 */

Oracle.checkAvailability = function () {
	console.log('on Oracle.checkAvailability')
	var respuesta = false
	if (oracledb) {
		return oracledb
	}
	try {
		oracledb = require('oracledb')
		oracledb.fetchAsString = [oracledb.CLOB]
		// @ts-ignore
		respuesta = oracledb
	} catch (e) {
		console.log('Failed to load oracledb:')
		console.log(e)
		respuesta = false
	}
	return respuesta
}

/**
 * @typedef {Promise<Object>} connectResult
 * @name module:Api/OracleDb#connectResult
 * @description respuesta de la función {@link module:Api/OracleDb#connect|connect}.
 * @property {Number} code Positivo para operaciones exitosas, negativo para operaciones erroneas.
 * @property {String} message Mensaje de respuesta [Imprimible]
 * @property {*} error Respuesta con los errores que se obtienen del código externo a esta functión.
 */

/**
 * @function connect
 * @name module:Api/OracleDb#connect
 * @description Función para realizar la conexión a la base de datos.
 * @param {Boolean} debugStatus
 * @returns {connectResult} {@link module:Api/OracleDb#connectResult|connectResult}.
 */

Oracle.setDebug = function (debugStatus) {
	debug = debugStatus
}
/**
 * @function connect
 * @name module:Api/OracleDb#connect
 * @description Función para realizar la conexión a la base de datos.
 * @param {Object} options
 * @param {Object} options.connectionParams
 * @param {String} options.connectionParams.user Usuario para conección a la base de datos.
 * @param {String} options.connectionParams.password Contaseña para conección a la base de datos.
 * @param {String} options.connectionParams.connectString  URL de conección para oracle debe incluir el esquema (Ej. "localhost/XEPDB1").
 * @param {Object} [options.dataConnection] Para el caso de esté dato será usado para tracear las operaciones realizadas en está conexión, para los 3 casos puden setearse y recuperarse en los LOGs de Oracle. No es necesario usarlos de manera específica de modo que pueden definirse a gusto del integrador.
 * @param {String} options.dataConnection.clientId
 * @param {String} options.dataConnection.action
 * @param {String} options.dataConnection.module
 * @returns {connectResult} {@link module:Api/OracleDb#connectResult|connectResult}.
 */

Oracle.connect = function (options) {
	console.log('Oracle.connect')
	return new Promise(function (resolve, reject) {
		if (!options) {
			// @ts-ignore
			options = {}
		}
		if (!options.connectionParams) {
			try {
				options.connectionParams = require('../config/oracle.json')
				console.log('SCHEMA', options.connectionParams.user)
			} catch (err) {
				reject({
					code: -1,
					message: 'No se encontraron parámetros de conexión',
					error: err
				})
				return
			}
		}
		if (!oracledb) {
			if (!Oracle.checkAvailability()) {
				reject({
					code: -1,
					message: 'No fue posible inicializar oracle'
				})
				return
			}
		}
		oracledb.getConnection(options.connectionParams, function (err, conn) {
			if (err) {
				reject({
					code: -2,
					message: 'No fue posible conectarse a la base de datos',
					error: err
				})
				return
			}
			if (options.dataConnection) {
				if (options.dataConnection.clientId) {
					conn.clientId = options.dataConnection.clientId
				}
				if (options.dataConnection.module) {
					conn.module = options.dataConnection.module
				}
				if (options.dataConnection.action) {
					conn.action = options.dataConnection.action
				}
			}
			resolve({
				code: 1,
				data: {
					connection: conn
				},
				message: 'Conexión generada'
			})
			return
		})
	})
}

/**
 * @function commit
 * @name module:Api/Oracle#commit
 * @description Generar el comit de las consultas ejecutadas anteriormente
 * @returns {Object} {message:"Mesaje",code:-1|1}
 */

Oracle.commit = function (connection) {
	return new Promise(function (resolve, reject) {
		if (!connection) {
			reject({
				'message': 'Debe iniciarse la conexión',
				'code': -1
			})
			return
		}
		connection
			.commit()
			.then(function () {
				resolve({
					code: 1,
					message: 'Consultas confirmadas'
				})
			})
			.catch(function (err) {
				reject({
					code: -1,
					message: 'Error al generar el commit'
				})
			})
	})
}

/**
 * @typedef {Promise<Object>} queryResult
 * @name module:Api/OracleDb#queryResult
 * @description Respuesta de la función {@link module:Api/OracleDb#query|query}.
 * @property {Number} code Positivo para operaciones exitosas, negativo para operaciones erroneas.
 * @property {String} message Mensaje de respuesta [Imprimible].
 * @property {Object} data Respuesta de la consulta en caso de ser UPDATE o DELETE regresara el número de filas afectadas en un  y en caso de ser un INSERT regresará el resultado en un objeto {metadata:[...],rows:[...]} donde rows serán los valores de la consulta. En caso de ser un PL-SQL el resultado será el que se deifina en la creación del mismo.
 * @property {*} error Respuesta con los errores que se obtienen del código externo a esta functión.
 */

/**
 * @function query
 * @name module:Api/OracleDb#query
 * @description Función para generar consultas SQL.
 * @param {String} sql SQL a ejecutar
 * <pre>
 * Ejemplo :
 * var sql = "SELECT manager_id, department_id, department_name
 * FROM departments
 * WHERE manager_id = :id";
 * </pre>
 * @param {Object} [params] Parámetros del SQL
 *  <pre>
 * Ejemplo :
 * var params = {id:103};
 * </pre>
 * @param {Object} [options]
 * @param {Object} [dataConnection] Datos para generación de la conexión
 * @param {Boolean} [returnConnection] Valor que define si se regresa o no la conexión, en caso de regresarla es necesario cerrarla.
 * @returns {connectResult} {@link module:Api/OracleDb#queryResult|queryResult}.
 */

Oracle.query = function (sql, params, options, dataConnection, returnConnection) {
	console.log('oracleConnection.query')
	return new Promise(function (resolve, reject) {
		if (!sql) {
			reject({
				code: -1,
				message: 'Debe enviar la consulta'
			})
			return
		}
		params = params || {}
		// @ts-ignore
		Oracle.connect({
			dataConnection: dataConnection
		})
			.then(function (result) {
                console.log('connect result -->', result)
				var connection = result.data.connection
				if (debug) {
					console.log('sql', sql)
					console.log('params', JSON.stringify(params))
				}

				connection.execute(sql, params, options || {}, function (err, result) {
					if (err) {
                        console.log('ERROR', err)
						console.log('ERROR query', sql)
						console.log('ERROR params', JSON.stringify(params))
						connection
							.rollback()
							.then(function () {
								Oracle.closeConnection(connection)
									.then(function () {
										reject({
											code: -2,
											message: 'No se pudo generar la consulta',
											error: err
										})
										return
									})
									.catch(function () {
										reject({
											code: -3,
											message: 'No se pudo generar la consulta',
											error: err
										})
										return
									})
							})
							.catch(function () {
								Oracle.closeConnection(connection)
									.then(function () {
										reject({
											code: -4,
											message: 'No se pudo generar la consulta',
											error: err
										})
										return
									})
									.catch(function () {
										reject({
											code: -5,
											message: 'No se pudo generar la consulta',
											error: err
										})
										return
									})
							})
					} else {
						var resultOracle = {
							code: 1,
							message: 'Consulta ejecutada',
							data: {}
						}
						resultOracle.data = result
						if (returnConnection === true) {
							resultOracle.data.connection = connection
							resultOracle.data.oracle = Oracle
							resolve(resultOracle)
							return
						} else {
							Oracle.commit(connection)
								.then(function () {
									Oracle.closeConnection(connection)
										.then(function () {
											resolve(resultOracle)
											return
										})
										.catch(function (err) {
											console.error(err)
											resolve(resultOracle)
											return
										})
								})
								.catch(function (err) {
									console.error(err)
									resolve(resultOracle)
									return
								})
						}
					}
				})
			})
			.catch(function (err) {
                console.log('ERROR', err)
				console.log('ERROR query', sql)
				console.log('ERROR params', JSON.stringify(params))
				reject({
					code: -6,
					message: 'No se pudo generar la consulta',
					error: err
				})
				return
			})
	})
}
/**
 * @function getColumnByName
 * @name module:Api/OracleDb#getColumnByName
 * @description Función para obtener el valor de una columna a partir del nombre.
 * @param {Array} metadata Parámetro metaData de la respuesta de un select de {@link module:Api/OracleDb#queryResult}.
 * @param {Array} row Parámetro rows[N] de la respuesta de un select de {@link module:Api/OracleDb#queryResult}.
 * @param {String} columnName Nombre de la columna que se desea obtener.
 * @returns null en caso de no encontrarlo y el valor en caso de encontrar el nombre de la columna.
 */

Oracle.getColumnByName = function (metadata, row, columnName) {
	console.log('Oracle.getColumnByName')
	for (var i in metadata) {
		if (metadata[i].name.toLowerCase() == columnName.toLowerCase()) {
			return row[i]
		}
	}
	return null
}

/**
 * @function getIndexColumnByName
 * @name module:Api/OracleDb#getIndexColumnByName
 * @description Función para obtener el index asociado al nombre de la columna.
 * @param {Array} metadata Parámetro metaData de la respuesta de un select de {@link module:Api/OracleDb#queryResult}.
 * @param {String} columnName Nombre de la columna que se desea obtener.
 * @returns null en caso de no encontrarlo y un entero en caso de encontrarlo.
 */

Oracle.getIndexColumnByName = function (metadata, columnName) {
	console.log('Oracle.getIndexColumnByName')
	for (var i in metadata) {
		if (metadata[i].name.toLowerCase() == columnName.toLowerCase()) {
			return Number(i)
		}
	}
	return null
}

/**
 * @typedef {Promise<Object>} closeConnectionResult
 * @name module:Api/OracleDb#closeConnectionResult
 * @description Respuesta de la función {@link module:Api/OracleDb#closeConnection|closeConnection}.
 * @property {Number} code Positivo para operaciones exitosas, negativo para operaciones erroneas.
 * @property {String} message Mensaje de respuesta [Imprimible].
 * @property {*} error Respuesta con los errores que se obtienen del código externo a esta functión.
 */

/**
 * @function closeConnection
 * @name module:Api/OracleDb#closeConnection
 * @description Función para cerrar la conexión de oracle
 * @returns {closeConnectionResult} {@link module:Api/OracleDb#closeConnectionResult|closeConnectionResult}
 */

Oracle.closeConnection = function (connection) {
	return new Promise(function (resolve, reject) {
		console.log('Oracle.closeConnection')
		if (!connection) {
			reject({
				'message': 'Debe iniciarse la conexión',
				'code': -1
			})
			return
		}
		console.log('Conexión Iniciada, iniciar con el connection.release')
		connection.release(function (err) {
			console.log('Respuesta de connection.release. Error=', err)
			if (err) {
				reject({
					code: -2,
					message: 'No fue posible cerrar la conexión',
					error: err
				})
				return
			}
			resolve({
				code: 1,
				message: 'Conexión cerrada'
			})
			connection = null
			return
		})
	})
}
/**
 * @function getTransaction
 * @name module:Api/Oracle#getTransaction
 * @description Función para generar una conexión sin commit y poder administrarla manualmente.
 * @param {Object} [dataConnection] Para el caso de esté dato será usado para tracear las operaciones realizadas en está conección, para los 3 casos puden setearse y recuperarse en los LOGs de Oracle. No es necesario usarlos de manera específica de modo que pueden definirse a gusto del integrador.
 * @param {String} dataConnection.clientId
 * @param {String} dataConnection.action
 * @param {String} dataConnection.module
 * @returns {Promise<Object>} Objeto con 4 funciones (query,commit,rollback,closeConnection) para administración manual de las operaciones de oracle.
 */
Oracle.getTransaction = function (dataConnection) {
	var _this = this
	_this.connection = null
	return new Promise(function (resolve, reject) {
		// @ts-ignore
		Oracle.connect({
			dataConnection: dataConnection
		})
			.then(function (result) {
				_this.connection = result.data.connection
				_this.returnObject = {
					query: function (sql, params, options, dataConnection, returnConnection) {
						console.log('on transacion.query')
						params = params || {}
						return new Promise(function (resolve, reject) {
							if (debug) {
								console.log('transaction -> sql', sql)
								console.log('transaction -> params', params)
							}

							if (!_this.connection) {
								reject({
									code: -1,
									message: 'La conexión fue cerrada por un error en las consultas anteriores'
								})
								return
							}
							_this.connection.execute(sql, params, {}, function (err, result) {
								if (debug) {
									console.log('oracleConnection.query -> result ', result)
								}
								if (err) {
									console.log('err-->', err)
								}
								if (err) {
									_this.returnObject
										.rollback()
										.then(function (result) {
											reject({
												code: -2,
												message: 'No se pudo generar la consulta',
												error: err
											})
										})
										.catch(function (err) {
											reject({
												code: -1,
												message: 'No se pudo generar la consulta',
												error: err
											})
										})
									return
								}
								resolve({
									code: 1,
									message: 'Consulta ejecutada',
									data: result
								})
								return
							})
						})
					},
					rollback: function () {
						console.log('on transacion.rollback')
						return new Promise(function (resolve, reject) {
							if (!_this.connection) {
								resolve({
									code: 2,
									message: 'RollBack y cierre de conexión ejecutado generado anteriormente'
								})
								return
							}
							_this.connection
								.rollback()
								.then(function (result) {
									_this.returnObject
										.closeConnection()
										.then(function (result) {
											resolve({
												code: 1,
												message: 'RollBack y cierre de conexión ejecutado'
											})
										})
										.catch(function (err) {
											reject({
												code: -1,
												message: 'Ocurrió un error al cerrar la conexión RB',
												error: err
											})
										})
								})
								.catch(function (err) {
									reject({
										code: -2,
										message: 'Ocurrió un error al cerrar la conexión RB',
										error: err
									})
								})
						})
					},
					commit: function () {
						console.log('on transacion.commit')
						return new Promise(function (resolve, reject) {
							if (!_this.connection) {
								reject({
									code: -3,
									message: 'La conexión fue cerrada por un error en las consultas anteriores'
								})
								return
							}
							_this.connection.commit(function (err) {
								if (err) {
									reject({
										code: -1,
										message: 'Ocurrió un error hacer commit',
										error: err
									})
									_this.returnObject.closeConnection()
									return
								}
								_this.returnObject
									.closeConnection()
									.then(function (result) {
										resolve({
											code: 1,
											message: 'Commit y cierre de conexión ejecutado'
										})
									})
									.catch(function (err) {
										reject({
											code: -2,
											message: 'Ocurrió un error al cerrar la conexión C',
											error: err
										})
									})
							})
						})
					},
					closeConnection: function () {
						console.log('on transacion.closeConnection')
						return new Promise(function (resolve, reject) {
							if (!_this.connection) {
								reject({
									code: -4,
									message: 'La conexión fue cerrada por un error en las consultas anteriores'
								})
								return
							}
							_this.connection.release(function (err) {
								if (err) {
									reject({
										code: -2,
										message: 'No fue posible cerrar la conexión',
										error: err
									})
									return
								}
								_this.connection = null
								resolve({
									code: 1,
									message: 'Conexión cerrada'
								})
								return
							})
						})
					}
				}
				resolve(_this.returnObject)
			})
			.catch(function (err) {
				reject({
					'message': 'Ocurrió un error al generar el objeto de transacción',
					'code': -1,
					'error': err
				})
				return
			})
	})
}

exports.query = Oracle.query
exports.commit = Oracle.commit
exports.connect = Oracle.connect
exports.closeConnection = Oracle.closeConnection
exports.getColumnByName = Oracle.getColumnByName
exports.getIndexColumnByName = Oracle.getIndexColumnByName
exports.checkAvailability = Oracle.checkAvailability
exports.getTransaction = Oracle.getTransaction
exports.setDebug = Oracle.setDebug
