//Módulos requeridos
import forge from 'node-forge'
forge.options.usePureJavaScript = true;
//fin de módulos requeridos

var cipherSuite = {
	/**
	 * @function createRandomBytes
	 * @name module:ArchivoElectronico/components/cipherSuite#createRandomBytes
	 * @public
	 * @description - Función para obtener de manera aleatoria (por parte del módulo forge) una cadena de strings en codificación UTF-8.
	 * @param {Number} nbytes - Cantidad de bytes que se quieres generar.
	 * <pre>
	 * Para un IV (vector de inicialización para algoritmo de cifrado AES) el  nbytes es 16.
	 * Para una llave que funcione con AES-256 el número de nbytes es 32.
	 * </pre>
	 * @returns {String} - Cadena de string en codificación UTF-8.
	 * Este string puede regresar caracteres no imprimibles.
	 */
	createRandomBytes: function (nbytes) {
		var seed = forge.random.getBytesSync(nbytes);
		return seed
	},
	/**
	 * @function stringToBase64
	 * @name module:ArchivoElectronico/components/cipherSuite#stringToBase64
	 * @public
	 * @description - Función para convertir un string en UTF-8 a base 64
	 * @param {String} input - Cadena a codificar.
	 * @returns {String} - Cadena codificada a base64, cadena vacía en caso de no ingresar el parámetro de entrada.
	 */
	stringToBase64: function (input) {
		const _input = input ? input : ""
		return forge.util.encode64(_input);
	},
	/**
	 * @function encodeBase64
	 * @name module:ArchivoElectronico/components/cipherSuite#encode64
	 * @public
	 * @description - Función para codificar un archivo binario o cadena de texto a base64.
	 * @param {String} input - Cadena o binario a codificar.
	 * @returns {String} - Cadena codificada a base64, cadena vacía en caso de no ingresar el parámetro de entrada.
	 */
	encodeBase64: function (input) {
		const _input = input ? input : ""
		return forge.util.encode64(_input);
	},
	/**
	 * @function base64ToString
	 * @name module:ArchivoElectronico/components/cipherSuite#base64ToString
	 * @public
	 * @description - Función para convertir un string en base64 a UTF-8
	 * @param {String} input - Cadena a codificar.
	 * @returns {String} - Cadena codificada en UTF-8, cadena vacía en caso de no ingresar el parámetro de entrada.
	 */
	base64ToString: function (input) {
		const _input = input ? input : ""
		return forge.util.decode64(_input);
	},
	/**
	 * @function hash
	 * @name module:ArchivoElectronico/components/cipherSuite#hash
	 * @public
	 * @description - Función para obtener el SHA-256 de una cadena de caracteres
	 * @param {String} input - Cadena de caracteres que se quiere procesar.
	 * @param {Boolean} [flgMd=false] - Bandera para decidir el retorno de la función.En caso de ser verdadero se regresa el objeto nativo de forge en caso contrario el resultado de la función hash .
	 * @returns {(String|Object)} - Resultado de la función SHA-256
	 */
	hash: function (input, flgMd) {
		var _flgMd = !!flgMd //Valor booleano de flgMd
		var md = forge.md.sha256.create();
		md.update(input);
		if (_flgMd === true) {
			return md
		}
		return md.digest().toHex()
	},
	/**
	 * @function hashMD5
	 * @name module:Components/cipherSuite#hashMD5
	 * @public
	 * @description - Función para obtener el valor hash MD5 de una cadena de caracteres
	 * @param {String} input - Cadena de caracteres que se quiere procesar.
	 * @param {Boolean} [flgMd=false] - Bandera para decidir el retorno de la función.En caso de ser verdadero se regresa el objeto nativo de forge en caso contrario el resultado de la función hash .
	 * @returns {String|Object} - Resultado de la función MD5
	 */
	hashMD5: function (input, flgMd) {
		var _flgMd = !!flgMd //Valor booleano de flgMd
		var md = forge.md.md5.create();
		md.update(input);
		if (_flgMd === true) {
			return md
		}
		return md.digest().toHex()
	},
	/**
	 * @function createAESKeyFromString
	 * @name module:ArchivoElectronico/components/cipherSuite#createAESKeyFromString
	 * @public
	 * @description - Función para obtener una llave de cifrado para AES-256 a partir de una cadena de caracteres.
	 * Para cadenas menos de 8 caracteres o que valores que no sean string se regresará false
	 * @param {String} input - Cadena de caracteres que servirá como semilla para la creación de una llave.
	 * @returns {Object|Boolean}
	 * {
	 * 	key:...
	 * 	IV:....
	 * }
	 */
	createAESKeyFromString: function (input) {
		var _this = this
		if (!(typeof input === "string")) {
			return false
		}
		var IV = forge.util.hexToBytes(_this.hash(input.substring(0, 8))).substring(0, 16)
		var key = forge.util.hexToBytes(_this.hash(input))
		return {
			IV: IV,
			key: key
		}
	},

	/**
	 * @function hexToString
	 * @name module:ArchivoElectronico/components/cipherSuite#hexToString
	 * @public
	 * @description - Función para convertir hexadecimal a string UTF-8.
	 * @param {String} hex - Hexadecimal.
	 * @returns {String} - Resultado de la conversión.
	 */
	hexToString: function (hex) {
		var _hex = hex.toString(); //se convierte a string
		var str = '';
		for (var i = 0;
			(i < _hex.length && _hex.substr(i, 2) !== '00'); i += 2) { //de dos en dos
			str += String.fromCharCode(parseInt(_hex.substr(i, 2), 16));
		}
		return str;
	},



	/**
	 * @typedef {Object} aesEncryptResult
	 * @name  module:ArchivoElectronico/components/cipherSuite#aesEncryptResult
	 * @property {Number} code - En caso de que el cifrado se realice de manera correcta se regresa 1,  en caso de que exista algún error  -1.
	 * @property {String} message - Descripción del resultado. (IMPRIMIBLE)
	 * @property {Object} data
	 * @property {String} data.encryptedText - Texto cifrado.
	 * @property {*} error - Error generado por el método. (NO IMPRIMIBLE PARA EL USUARIO) (Solamente se tendrá esta propiedad en caso de existir algún error).
	 */

	/**
	 * @function aesEncrypt
	 * @name module:ArchivoElectronico/components/cipherSuite#aesEncrypt
	 * @public
	 * @description - Función para cifrar con el algoritmo AES-256 con el modo de operación CTR.
	 * @param {String} input - Cadena de caracteres a cifrar.
	 * Si se desea cifrar un objeto utilizar la función JSON.stringify(input).
	 * @param {String} key - Llave para cifrar.
	 * @param {String} IV - Vector de inicialización. Tamaño = 16 bytes.
	 * @param {Boolean} [validateKey=true] - Bandera para especificar
	 * que se requiere la validación al descifrar de que la llave sea correcta o no.
	 * Solamente modificar a false en caso de que se vaya a  utilizar otro módulo o
	 * herramienta para el descifrado.
	 * @returns {aesEncryptResult}  - Descripción de resultado de cifrado.  {@link module:ArchivoElectronico/components/cipherSuite#aesEncryptResult}
	 */

	aesEncrypt: function (input, key, IV, validateKey) {
		try {
			var _validateKey = true
			var _this = cipherSuite;
			var inputAES = {}
			var result = {
				data: {
					encryptedText: null
				},
				code: -1,
				message: "",
			}

			if (!(key && input && IV)) {
				result.message = "Parámetros incompletos"
				return result
			}

			if (!(typeof input === "string" && typeof key === "string" && typeof IV === "string")) {
				result.message = "Parámetros inválidos"
				return result
			}
			//se valida el tamaño de la llave
			if (key.length !== 32) {
				result.message = "Tamaño de llave inválida"
				return result
			}
			//se valida el tamaño del vector de inicialización
			if (IV.length !== 16) {
				result.message = "Tamaño de IV inválido"
				return result
			}

			if (typeof validateKey == "boolean") {
				_validateKey = validateKey
			}
			if (_validateKey) { //Se añaden parámetros para poder validar la llave
				//Dentro del objeto a cifrar se inserta el hash
				// para que al descifrar se valide que la llave
				// con la que se descifra ha sido correcta.
				var _inputToEncrypt = _this.stringToBase64(forge.util.encodeUtf8(input))
				inputAES.inputHash = _this.hash(_inputToEncrypt);
				inputAES.data = _inputToEncrypt;
				inputAES = JSON.stringify(inputAES)
			} else {
				inputAES = _this.stringToBase64(forge.util.encodeUtf8(input))
			}
			var cipher = forge.cipher.createCipher('AES-CTR', key);
			cipher.start({
				iv: IV
			});
			cipher.update(forge.util.createBuffer(inputAES));
			cipher.finish();
			var encrypted = cipher.output.data;
			result.data.encryptedText = encrypted
			result.message = "Cifrado correctamente"
			result.code = 1
			return result

		} catch (err) {
			console.log("ERROR : ", err)
			result.error = err;
			result.message = "Ocurrió un error al cifrar"
			return result
		}
	},

	/**
	 * @typedef {Object} aesDecryptResult
	 * @name  module:ArchivoElectronico/components/cipherSuite#aesDecryptResult
	 * @property {Number} code - En caso de que el descifrado se realice de manera correcta se regresa 1,  en caso de que exista algún error  -1.
	 * @property {String} message - Descripción del resultado. (IMPRIMIBLE)
	 * @property {Object} data
	 * @property {String} data.plainText - Texto descifrado.
	 * @property {*} error - Error generado por el método. (NO IMPRIMIBLE PARA EL USUARIO) (Solamente se tendrá esta propiedad en caso de existir algún error).
	 */

	/**
	 * @function aesDecrypt
	 * @name module:ArchivoElectronico/components/cipherSuite#aesDecrypt
	 * @public
	 * @description - Función para descifrar con el algoritmo AES-256 con el modo de operación  CTR.
	 * @param {String} encrypted - Cadena de caracteres a descifrar.
	 * @param {String} key - Llave para descifrar.
	 * @param {String} IV - Vector de inicialización. Tamaño = 16 bytes.
	 * @param {Boolean} [validateKey=true]  - Bandera para validar que la llave corresponda con el texto cifrado.
	 * En caso de  descifrar algún texto cifrado con otra herramienta diferente a este módulo no se podrá realizar la verificación
	 * de la llave.
	 * Para descifrar algún texto cifrado con otra herramienta es necesario colocar este valor en false.
	 * @returns {aesDecryptResult} - Resultado del descifrado. {@link module:ArchivoElectronico/components/cipherSuite#aesDecryptResult}
	 */

	aesDecrypt: function (encrypted, key, IV, validateKey) {
		try {
			var _validateKey = true
			var _this = cipherSuite;
			var result = {
				data: {
					plainText: null
				},
				code: -1,
				message: "",
			}

			if (!(key && encrypted && IV)) {
				result.message = "Parámetros incompletos"
				return result
			}
			if (!(typeof encrypted === "string" && typeof key === "string" && typeof IV === "string")) {
				result.message = "Parámetros inválidos"
				return result
			}
			//se valida el tamaño de la llave
			if (key.length !== 32) {
				result.message = "Tamaño de llave inválida"
				return result
			}
			//se valida el tamaño del vector de inicialización
			if (IV.length !== 16) {
				result.message = "Tamaño de IV inválido"
				return result
			}
			if (typeof validateKey == "boolean") {
				_validateKey = validateKey
			}

			//Dentro del objeto a cifrar se encuentra el hash
			// del texto en plano con esto se realiza la validación
			// de que la llave sea la correcta.
			var decipher = forge.cipher.createDecipher('AES-CTR', key);
			decipher.start({
				iv: IV
			});
			decipher.update(forge.util.createBuffer(encrypted));
			var resultDecrypted = decipher.finish();
			if (resultDecrypted == false) { //ocurrió algún error
				result.message = "Ocurrió un error descifrando el texto"
				return result
			} else {
				var plainText = _this.hexToString(decipher.output.toHex())
				if (_validateKey) { //Se verifica si se va a validar o no la llave.
					try {
						var plainTextObject = JSON.parse(plainText)
						if (typeof plainTextObject == "object") {
							//Es muy poco probable que se lleguen a estas líneas de código
							//debido a que al descifrar con una llave incorrecta y realizar
							//el JSON.parse en la mayoría de los casos no nos daría un objeto, sin embargo
							// se realiza la validación correspondiente del hash
							var inputHash = plainTextObject["inputHash"] || null
							var data = plainTextObject["data"] || null
							if (inputHash && data) {
								var hash = _this.hash(data)
								if (hash === inputHash) {
									result.data.plainText = forge.util.decodeUtf8(_this.base64ToString(data))
									result.message = "Texto descifrado correctamente"
									result.code = 1
									return result
								} else {
									result.message = "Llave incorrecta (h)"
									return result
								}
							} else {
								result.message = "Llave incorrecta (i)"
								return result
							}
						} else {
							result.message = "Llave incorrecta (o)"
							return result
						}
					} catch (err) {
						console.log("Error : ", err)
						result.error = err
						result.message = "Llave incorrecta (c)"
						return result
					}
				} else {
					result.data.plainText = forge.util.decodeUtf8(_this.base64ToString(plainText))
					result.message = "Texto descifrado correctamente (vf)"
					result.code = 1
					return result
				}
			}
		} catch (err) {
			console.log("ERROR : ", err)
			result.error = err;
			result.message = "Ocurrió un error al descifrar el texto"
			return result
		}
	},
	/**
	 * @function getBase64EncodedFromBuffer
	 * @name module:ArchivoElectronico/components/cipherSuite#getBase64EncodedFromBuffer
	 * @private
	 * @description -  Función para obtener el base64 de un Buffer .
	 * @param {Object} file - Buffer de un archivo.
	 * <pre>
	 *  .cer , .key
	 * Ejemplo fs.readFile(pathPem, function (error, cer){
	 * var certificate= cer
	 * })
	 * </pre>
	 * @returns {String|Boolean} - Base64 del archivo en caso de que los valores de entrada sean correctos, false en caso de ser erroneos.
	 *
	 */
	getBase64EncodedFromBuffer: function (file) {
		if (typeof file == "object") {
			var base64 = forge.util.binary.base64.encode(file)
			return base64
		} else {
			return false
		}
	},
	/**
	 * @function getForgeObjectFromCer
	 * @name module:ArchivoElectronico/components/cipherSuite#getForgeObjectFromCer
	 * @private
	 * @description -  Función para convertir un certificado en formato der a uno con el formato de la librería forge.
	 * @param {(Object|String)} certificate - Buffer del certificado con formato der ó Base64 del certificado
	 * <pre>
	 * Ejemplo con Buffer
	 * fs.readFile(pathPem, function (error, cer){
	 * var certificate= cer
	 * })
	 * </pre>
	 * <pre>
	 *Ejemplo para Base64
	 *const certificateFile = fs.File.fromPath(documents + "FIEL_Pruebas_AAQM610917QJA.cer");
	 *var certificate = certificateFile.readSync(function (error) {})
	 *certificate = utilities.base64EncodeFromNativeBinary(certificate)
	 * </pre>
	 * @returns {Object|Boolean} - Objeto nativo de la librería Forge, false en caso de no ingresar un certificado.
	 */
	getForgeObjectFromCer: function (certificate) {
		try {
			var _this = cipherSuite
			if (typeof certificate === "object" || typeof certificate === "string") {
				var certificateBase64 = null
				if (typeof certificate === "object") { //Buffer
					certificateBase64 = _this.getBase64EncodedFromBuffer(certificate)
				} else { //Base64
					certificateBase64 = certificate
				}
				var certificateBinary = forge.util.decode64(certificateBase64);
				var asn1 = forge.asn1.fromDer(certificateBinary);
				var cert = forge.pki.certificateFromAsn1(asn1);
				return cert
			} else {
				return false
			}
		} catch (err) {
			console.log("Ocurrió un error obteniendo el certificado : ", err)
			return false
		}
	},
	/**
	 * @function getForgePrivateKeyFromKey
	 * @name module:ArchivoElectronico/components/cipherSuite#getForgePrivateKeyFromKey
	 * @private
	 * @description -  Función para convertir una llave privada en formato PKCS#8 a uno con el formato de la librería forge.
	 * @param {Object|String} key - Buffer de la llave .key ó Base64 de la llave
	 * <pre>
	 * Ejemplo para Buffer
	 * fs.readFile(pathPem, function (error, file){
	 * var key= file
	 * })
	 * </pre>
	 *<pre>
	 * Ejemplo para Base64
	 *const privateKeyFileInput = fs.File.fromPath("./FIEL_Pruebas_AAQM610917QJA.key");
	 *var privateKey = privateKeyFileInput.readSync(function (error) {})
	 *var key = utilities.base64EncodeFromNativeBinary(privateKey)
	 * </pre>
	 * @param {String} password - Contraseña para descifrar la llave.
	 * @returns {Object|Boolean} - Objeto nativo de la librería Forge, false en caso de no ingresar un parámetro o que la contraseña de la llave sea incorrecta.
	 */
	getForgePrivateKeyFromKey: function (key, password) {
		try {
			var _this = cipherSuite
			if ((typeof key === "object" || typeof key === "string") && typeof password == "string") {
				var keyBase64 = ""
				if (typeof key === "object") {
					keyBase64 = _this.getBase64EncodedFromBuffer(key)
				} else { //BASE 64. Dispositivos móviles
					keyBase64 = key
				}
				var keyBinary = forge.util.decode64(keyBase64);
				var asn1 = forge.asn1.fromDer(keyBinary);
				var privateKeyInfo = forge.pki.decryptPrivateKeyInfo(asn1, password);
				if (privateKeyInfo) {
					var pem = forge.pki.privateKeyInfoToPem(privateKeyInfo);
					var privateKey = forge.pki.privateKeyFromPem(pem);
					return privateKey
				} else {
					console.log("Contraseña de la clave incorrecta")
					return false
				}
			} else {
				console.log("Parámetros incompletos (gfe)")
				return false
			}
		} catch (err) {
			console.log("Ocurrió un error convirtiendo la llave : ", err)
			return false
		}
	},

	/**
	 * @typedef {Object} rsaEncryptResult
	 * @name  module:ArchivoElectronico/components/cipherSuite#rsaEncryptResult
	 * @property {Number} code - En caso de que el cifrado se realice de manera correcta se regresa 1,  en caso de que exista algún error  -1.
	 * @property {String} message - Descripción del resultado. (IMPRIMIBLE)
	 * @property {Object} data
	 * @property {String} data.encryptedText - Texto cifrado.
	 * @property {*} error - Error generado por el método. (NO IMPRIMIBLE PARA EL USUARIO) (Solamente se tendrá esta propiedad en caso de existir algún error).
	 */

	/**
	 * @function rsaEncrypt
	 * @name module:ArchivoElectronico/components/cipherSuite#rsaEncrypt
	 * @public
	 * @description -  Función para cifrar con LLAVE PÚBLICA  con el algoritmo RSA con el padding RSAES PKCS#1 v1.5.
	 * @param {String} plainText - Cadena de caracteres a cifrar.
	 * @param {Object|String} certificate - Certificado  donde se obtendrá la llave pública para cifrar. (Buffer)  ó Base64 del Certificado
	 * <pre>
	 * Ejemplo fs.readFile(pathPem, function (error, cer){
	 * var _certificate= cer
	 * })
	 * </pre>
	 *<pre>
	 * Ejemplo con Base64
	 *const certificateFile = fs.File.fromPath(documents + "FIEL_Pruebas_AAQM610917QJA.cer");
	 *var certificate = certificateFile.readSync(function (error) {})
	 *certificate = utilities.base64EncodeFromNativeBinary(certificate)
	 *</pre>
	 * @returns {rsaEncryptResult} - Resultado del cifrado. {@link module:ArchivoElectronico/components/cipherSuite#rsaEncryptResult}
	 */

	rsaEncrypt: function (plainText, certificate) {
		try {
			var result = {
				data: {
					encryptedText: null
				},
				code: -1,
				message: "",
			}
			if (!(plainText && certificate)) {
				result.message = "Error en los parámetros de entrada (pre)"
				return result
			}
			if (!(typeof plainText == "string" && (typeof certificate == "object" || typeof certificate == "string"))) {
				result.message = "Error en los parámetros de entrada (pret)"
				return result
			}

			var _this = cipherSuite
			var _certificate = _this.getForgeObjectFromCer(certificate)
			if (_certificate) {
				var publicKey = _certificate.publicKey
				var encrypted = publicKey.encrypt(plainText);
				result.message = "Texto cifrado correctamente"
				result.code = 1
				result.data.encryptedText = encrypted
				return result
			} else {
				result.message = "Ocurrió un error cifrando el texto (re)"
				return result
			}
		} catch (err) {
			console.log("Ocurrió un error", err)
			result.error = err
			result.message = "Ocurrió un error cifrando el texto (rc)"
		}
	},

	/**
	 * @typedef {Object} rsaDecryptResult
	 * @name  module:ArchivoElectronico/components/cipherSuite#rsaDecryptResult
	 * @property {Number} code - En caso de que el descifrado se realice de manera correcta se regresa 1,  en caso de que exista algún error  -1.
	 * @property {String} message - Descripción del resultado. (IMPRIMIBLE)
	 * @property {Object} data
	 * @property {String} data.plainText - Texto descifrado.
	 * @property {*} error - Error generado por el método. (NO IMPRIMIBLE PARA EL USUARIO) (Solamente se tendrá esta propiedad en caso de existir algún error).
	 */

	/**
	 * @function rsaDecrypt
	 * @name module:ArchivoElectronico/components/cipherSuite#rsaDecrypt
	 * @public
	 * @description -  Función para descifrar con el algoritmo RSA con el padding RSAES PKCS#1 v1.5.
	 * @param {String} encryptedText - Cadena de caracteres a descifrar.
	 * @param {Object|String} privateKey - Llave para descifrar cadena cifrada. .key (Buffer) ó Base64 de la llave
	 * <pre>
	 * Ejemplo fs.readFile(pathPem, function (error, key){
	 * var privateKey= key
	 * })
	 * </pre>
	 * <pre>
	 * Ejemplo con Base64
	 *const privateKeyFileInput = fs.File.fromPath("./FIEL_Pruebas_AAQM610917QJA.key");
	 *var privateKey = privateKeyFileInput.readSync(function (error) {})
	 *privateKey = utilities.base64EncodeFromNativeBinary(privateKey)
	 * </pre>
	 * @param {String} passwordKey - Clave para descifrar llave privada.
	 * @returns {rsaDecryptResult} - Resultado del descifrado. {@link module:ArchivoElectronico/components/cipherSuite#rsaDecryptResult}
	 */

	rsaDecrypt: function (encryptedText, privateKey, passwordKey) {
		try {
			var result = {
				data: {
					plainText: null
				},
				code: -1,
				message: "",
			}
			var _this = cipherSuite
			if (!(encryptedText && privateKey && passwordKey)) {
				result.message = "Error en los parámetros de entrada para descrifrar"
				return result
			}
			if (!(typeof encryptedText === "string" && (typeof privateKey === "object" || typeof privateKey === "string") && typeof passwordKey === "string")) {
				result.message = "Error en los parámetros de entrada para descrifrar (ns)"
				return result
			}
			var _key = _this.getForgePrivateKeyFromKey(privateKey, passwordKey)
			if (_key) {
				var plainText = _key.decrypt(encryptedText)
				result.data.plainText = plainText
				result.code = 1
				result.message = "Datos descifrados correctamente"
				return result
			} else {
				result.message = "Ocurrió un error descifrando la llave"
				return result
			}

		} catch (err) {
			console.log("Ocurrió un error", err)
			result.error = err
			result.message = "Ocurrió un error descifrando el texto (rdc)"
		}
	},

	/**
	 * @typedef {Object} rsaSignResult
	 * @name  module:ArchivoElectronico/components/cipherSuite#rsaSignResult
	 * @property {Number} code - En caso de que el firmado se realice de manera correcta se regresa 1,  en caso de que exista algún error  -1.
	 * @property {String} message - Descripción del resultado. (IMPRIMIBLE)
	 * @property {Object} data
	 * @property {String} data.signature - Firma.
	 * @property {*} error - Error generado por el método. (NO IMPRIMIBLE PARA EL USUARIO) (Solamente se tendrá esta propiedad en caso de existir algún error).
	 */

	/**
	 * @function rsaSign
	 * @name module:ArchivoElectronico/components/cipherSuite#rsaSign
	 * @public
	 * @description -  Función para firmar con el algoritmo RSA.
	 * @param {String} dataToSign - Cadena de caracteres a firmar.
	 * @param {Object|String} privateKey - Llave para firmar cadena .key (Buffer) ó base64 de la llave
	 * <pre>
	 * Ejemplo con Buffer
	 * fs.readFile(pathPem, function (error, key){
	 * var privateKey= key
	 * })
	 * </pre>
	 * <pre>
	 * Ejemplo con Base64
	 *const privateKeyFileInput = fs.File.fromPath("./FIEL_Pruebas_AAQM610917QJA.key");
	 *var privateKey = privateKeyFileInput.readSync(function (error) {})
	 *privateKey = utilities.base64EncodeFromNativeBinary(privateKey)
	 * </pre>
	 * @param {String} passwordKey - Clave para descifrar llave privada.
	 * @returns {rsaSignResult} - Resultado de la firma. {@link module:ArchivoElectronico/components/cipherSuite#rsaSignResult}
	 */
	rsaSign: function (dataToSign, privateKey, passwordKey) {
		try {
			var result = {
				data: {
					signature: null
				},
				code: -1,
				message: "",
			}
			var _this = cipherSuite
			if (!(privateKey && passwordKey && dataToSign)) {
				result.message = "Error en los parámetros de entrada para firmar"
				return result
			}
			if (!((typeof privateKey === "object" || typeof privateKey === "string") && typeof passwordKey === "string")) {
				result.message = "Error en los parámetros de entrada para firmar (rs)"
				return result
			}
			var _key = _this.getForgePrivateKeyFromKey(privateKey, passwordKey)
			if (_key) {
				const hash = _this.hash(dataToSign, true)
				var signature = _key.sign(hash)
				result.data.signature = signature
				result.code = 1
				result.message = "Datos firmados correctamente"
				return result
			} else {
				result.message = "Ocurrió un error firmando el dato"
				return result
			}
		} catch (err) {
			console.log(err)
			result.error = err
			result.message = "Ocurrió un error firmando el dato (c)"
			return result
		}

	},

	/**
	 * @typedef {Object} rsaVerifySignatureResult
	 * @name  module:ArchivoElectronico/components/cipherSuite#rsaVerifySignatureResult
	 * @property {Number} code - En caso de que la verificación sea correcta se regresa 1,  en caso contrario o de que exista algún error  -1.
	 * @property {String} message - Descripción del resultado. (IMPRIMIBLE)
	 * @property {Object} data
	 * @property {Boolean} data.signatureIsValid - Bandera que verifica si la firma es válida o no.
	 * @property {*} error - Error generado por el método. (NO IMPRIMIBLE PARA EL USUARIO) (Solamente se tendrá esta propiedad en caso de existir algún error).
	 */

	/**
	 * @function rsaVerifySignature
	 * @name module:ArchivoElectronico/components/cipherSuite#rsaVerifySignature
	 * @public
	 * @description -  Función para verificar el proceso de firma digital con el algoritmo RSA.
	 * @param {String} dataToVerify - Cadena de caracteres firmados.
	 * @param {String} signature - Firma realizada a los datos.
	 * @param {Object|String} certificate - Certificado  donde se obtendrá la llave pública para verificar la firma. (Buffer) ó Base64 del certificado
	 * <pre>
	 * Ejemplo con Buffer
	 * fs.readFile(pathPem, function (error, cer){
	 * var certificate= cer
	 * })
	 * </pre>
	 * <pre>
	 * Ejemplo con PEM
	 * fs.readFile(pathPem, 'utf8', function (error, cer){
	 * var certificate= cer
	 * })
	 * </pre>
	 *<pre>
	 * Ejemplo con Base64
	 *const certificateFile = fs.File.fromPath(documents + "FIEL_Pruebas_AAQM610917QJA.cer");
	 *var certificate = certificateFile.readSync(function (error) {})
	 *certificate = utilities.base64EncodeFromNativeBinary(certificate)
	 *</pre>
	 * @returns {rsaVerifySignatureResult} - Resultado de la firma. {@link module:ArchivoElectronico/components/cipherSuite#rsaVerifySignatureResult}
	 */

	rsaVerifySignature: function (dataToVerify, signature, certificate) {
		try {
			var result = {
				data: {
					signatureIsValid: null
				},
				code: -1,
				message: "",
			}
			var _this = cipherSuite
			if (!(dataToVerify && signature && certificate)) {
				result.message = "Error en los parámetros de verificar la firma digital"
				return result
			}
			if (!(typeof dataToVerify === "string" && (typeof certificate === "object" || typeof certificate === "string") && typeof signature === "string")) {
				result.message = "Error en los parámetros de entrada para verificar firma (rvs)"
				return result
			}
			// Validar el formato PEM
			var getCertificate = null
			if (_this.validatePemFormat(certificate)) {
				getCertificate = forge.pki.certificateFromPem
			} else {
				getCertificate = _this.getForgeObjectFromCer
			}
			var _certificate = getCertificate(certificate)
			if (_certificate) {
				var publicKey = _certificate.publicKey
				const hash = _this.hash(dataToVerify, true)
				const verified = publicKey.verify(hash.digest().bytes(), signature);
				if (verified === true) {
					result.message = "Firma correcta"
					result.code = 1
				} else {
					result.message = "Firma incorrecta"
				}
				result.data.signatureIsValid = verified
				return result
			} else {
				result.message = "Ocurrió un error la información del certificado (rvse)"
				return result
			}
		} catch (err) {
			console.log(err)
			result.error = err
			result.message = "Ocurrió un error verificando la firma  (rvsc)"
			return result
		}
	},
	/**
	 * @typedef {Object} rsaSignHashResult
	 * @name  module:ArchivoElectronico/components/cipherSuite#rsaSignHashResult
	 * @property {Number} code - En caso de que el firmado se realice de manera correcta se regresa 1,  en caso de que exista algún error  -1.
	 * @property {String} message - Descripción del resultado. (IMPRIMIBLE)
	 * @property {Object} data
	 * @property {String} data.signature - Firma.
	 * @property {*} error - Error generado por el método. (NO IMPRIMIBLE PARA EL USUARIO) (Solamente se tendrá esta propiedad en caso de existir algún error).
	 */

	/**
	 * @function rsaSignHash
	 * @name module:ArchivoElectronico/components/cipherSuite#rsaSignHash
	 * @public
	 * @description -  Función para firmar el valor de entrada directamente (valor hash del algoritmo SHA256 codificado en Hexadecimal) con el algoritmo RSA. Tiene la diferencia con la función rsaSign que este no realiza la función SHA256 de la entrada si no solamente  firma el valor de entrada.
	 * @param {String} hash - Cadena de 64 caracteres (Codificado en hexadecimal).
	 * @param {Object|String} privateKey - Llave para firmar cadena .key (Buffer) ó base64 de la llave
	 * <pre>
	 * Ejemplo con Buffer
	 * fs.readFile(pathPem, function (error, key){
	 * var privateKey= key
	 * })
	 * </pre>
	 * <pre>
	 * Ejemplo con Base64
	 *const privateKeyFileInput = fs.File.fromPath("./FIEL_Pruebas_AAQM610917QJA.key");
	 *var privateKey = privateKeyFileInput.readSync(function (error) {})
	 *privateKey = utilities.base64EncodeFromNativeBinary(privateKey)
	 * </pre>
	 * @param {String} passwordKey - Clave para descifrar llave privada.
	 * @returns {rsaSignHashResult} - Resultado de la firma. {@link module:ArchivoElectronico/components/cipherSuite#rsaSignHashResult}
	 */
	rsaSignHash: function (hash, privateKey, passwordKey) {
		try {
			var result = {
				data: {
					signature: null
				},
				code: -1,
				message: "",
			}
			var _this = cipherSuite
			if (!(privateKey && passwordKey && typeof hash === "string" && hash.length === 64)) {
				result.message = "Error en los parámetros de entrada para firmar (rshp)"
				return result
			}
			if (!((typeof privateKey === "object" || typeof privateKey === "string") && typeof passwordKey === "string")) {
				result.message = "Error en los parámetros de entrada para firmar (rshp2)"
				return result
			}
			var _key = _this.getForgePrivateKeyFromKey(privateKey, passwordKey)
			if (_key) {
				//Se crea el objecto md de un hash ya generado
				var bytes = forge.util.hexToBytes(hash)
				var md = forge.md.sha256.create();
				md.digest = function () {
					return {
						getBytes: function () {
							return bytes
						}
					}
				}
				//firma
				var signature = _key.sign(md)
				result.data.signature = signature
				result.code = 1
				result.message = "Datos firmados correctamente"
				return result
			} else {
				result.message = "Ocurrió un error firmando el dato"
				return result
			}
		} catch (err) {
			console.log(err)
			result.error = err
			result.message = "Ocurrió un error firmando el dato (rshpc)"
			return result
		}
	},
	/**
	 * @typedef {Object} rsaVerifySignatureHashResult
	 * @name  module:ArchivoElectronico/components/cipherSuite#rsaVerifySignatureHashResult
	 * @property {Number} code - En caso de que la verificación de la firma sea correcta se regresa 1,  en caso contrario o de que exista algún error  -1.
	 * @property {String} message - Descripción del resultado. (IMPRIMIBLE)
	 * @property {Object} data
	 * @property {Boolean} data.signatureIsValid - Bandera que verifica si la firma es válida o no.
	 * @property {*} error - Error generado por el método. (NO IMPRIMIBLE PARA EL USUARIO) (Solamente se tendrá esta propiedad en caso de existir algún error).
	 */

	/**
	 * @function rsaVerifySignatureHash
	 * @name module:ArchivoElectronico/components/cipherSuite#rsaVerifySignatureHash
	 * @public
	 * @description -  Función para verificar una firma digital con el algoritmo RSA. Tiene la diferencia con rsaVerifySignature de que para corroborar la firma se ingresa el hash de la información firmada, NO la información en claro.
	 * @param {String} hash - Hash de la información firmada.
	 * @param {String} signature - Firma realizada a los datos.
	 * @param {Object|String} certificate - Certificado  donde se obtendrá la llave pública para verificar la firma. (Buffer, Base64 del binario del certificado ó  valor PEM del certificado)
	 * <pre>
	 * Ejemplo con Buffer
	 * fs.readFile(pathDer, function (error, cer){
	 * var certificate= cer
	 * })
	 * </pre>
	 * <pre>
	 * Ejemplo con PEM
	 * fs.readFile(pathPem, 'utf8', function (error, cer){
	 * var certificate= cer
	 * })
	 * </pre>
	 *<pre>
	 * Ejemplo con Base64
	 *const certificateFile = fs.File.fromPath(documents + "FIEL_Pruebas_AAQM610917QJA.cer");
	 *var certificate = certificateFile.readSync(function (error) {})
	 *certificate = utilities.base64EncodeFromNativeBinary(certificate)
	 *</pre>
	 * @returns {rsaVerifySignatureHashResult} - Resultado de la firma. {@link module:ArchivoElectronico/components/cipherSuite#rsaVerifySignatureHashResult}
	 */
	rsaVerifySignatureHash: function (hash, signature, certificate) {
		try {
			var result = {
				data: {
					signatureIsValid: null
				},
				code: -1,
				message: "",
			}
			var _this = cipherSuite
			if (!(hash && signature && certificate)) {
				result.message = "Error en los parámetros de verificar la firma digital (rvshp)"
				return result
			}
			if (!(typeof hash === "string" && (typeof certificate === "object" || typeof certificate === "string") && typeof signature === "string")) {
				result.message = "Error en los parámetros de entrada para verificar firma (rvshp2)"
				return result
			}
			// Validar el formato PEM
			var getCertificate = null
			if (_this.validatePemFormat(certificate)) {
				getCertificate = forge.pki.certificateFromPem
			} else {
				getCertificate = _this.getForgeObjectFromCer
			}
			var _certificate = getCertificate(certificate)
			if (_certificate) {
				var publicKey = _certificate.publicKey
				//Se obtienen lo bytes del hash ingresado
				var bytes = forge.util.hexToBytes(hash)
				const verified = publicKey.verify(bytes, signature);
				if (verified === true) {
					result.message = "Firma correcta"
					result.code = 1
				} else {
					result.message = "Firma incorrecta"
				}
				result.data.signatureIsValid = verified
				return result
			} else {
				result.message = "Ocurrió un error la información del certificado (rvshpe)"
				return result
			}
		} catch (err) {
			console.log(err)
			result.error = err
			result.message = "Ocurrió un error verificando la firma  (rvshpc)"
			return result
		}
	},
	/**
	 * @function validatePemFormat
	 * @name module:ArchivoElectronico/components/cipherSuite#validatePemFormat
	 * @public
	 * @description - Función para validar si un certificado está en formato PEM.
	 * @param {String} certificate - Cadena de certificado a validar.
	 * @returns {Boolean} - True en caso de ser un certificado con formato PEM, false en caso contrario.
	 */
	validatePemFormat: function (certificate) {
		if (typeof certificate === "string") {
			const validatePEMFormat1 = "-----BEGIN CERTIFICATE-----"
			const validatePEMFormat2 = "-----END CERTIFICATE-----"
			if (certificate.indexOf(validatePEMFormat1) !== -1 && certificate.indexOf(validatePEMFormat2) !== -1) {
				return true
			} else {
				return false
			}
		}
		return false
	},

	convertUint8ArrayToBinaryString: function (u8Array){
		var i, len = u8Array.length, b_str = "";
		for (i=0; i<len; i++) {
			b_str += String.fromCharCode(u8Array[i]);
		}
		return b_str;
	},
	/**
	 * @function calculateEtagMultipart
	 * @name  module:ArchivoElectronico/components/cipherSuite#calculateEtagMultipart
	 * @public
	 * @description - Función para calcular el Etag de un archivo que se almacena en S3
	 * @param {Object} file - Buffer del archivo
	 * @param {Number} [blockSize] - Tamaño del bloque en bytes en caso de que se haya subido por multipartes
	 * @returns {Object}
	 */
	calculateEtag: function (file, blockSize) {
		var result = {
			code: -1,
			message: "",
			data: {}
		}
		if (!(typeof file === "object")) {
			//result.message = "Datos insuficientes para calcular el Etag del multipart"
			//return result
		}

		//result.data.MD5 = cipherSuite.hashMD5(cipherSuite.convertUint8ArrayToBinaryString(file))
		console.log("CS: before MD5", new Date().getTime())
		result.data.MD5 = cipherSuite.hashMD5(file)
		console.log("CS: after MD5", new Date().getTime())
		console.log(result.data.MD5)

		if (!blockSize) {
			result.code = 1
			result.message = "Etag de un archivo calculado de manera correcta"
			result.data.etag = result.data.MD5
			return result
		}


		const fileSize = file.length
		var md5s = []
		const parts = Math.ceil(fileSize / blockSize)
		for (var start = 0; start < file.length; start += blockSize) {
			const end = Math.min(start + blockSize, file.length)
			let part = file.slice(start, end)
			//part = cipherSuite.convertUint8ArrayToBinaryString(part)
			console.log("CS: before part MD5", new Date().getTime())
			md5s.push(cipherSuite.hashMD5(part, true))
			console.log("CS: after part MD5", new Date().getTime())
		}
		if (md5s.length === 1) {
			result.code = 1
			result.message = "Etag de una archivo de una parte calculado correctamente"
			result.data.etag = result.data.MD5
		} else {
			result.code = 1
			result.message = "Etag de una archivo con múltiples partes calculado correctamente"

			const etagParts = md5s.map(function (md5) {
				return md5.digest().toHex()
			}).join(",")

			const digests = md5s.map(function (md5) {
				return md5.digest().data
			}).join("")

			const digests_md5 = cipherSuite.hashMD5(digests) + "-" + parts
			result.data.etag = digests_md5
			result.data.etagParts = etagParts
		}
		return result
	},

}

export const stringToBase64 = cipherSuite.stringToBase64
export const encodeBase64 = cipherSuite.encodeBase64
export const base64ToString = cipherSuite.base64ToString
export const hash = cipherSuite.hash
export const createRandomBytes = cipherSuite.createRandomBytes
export const hexToString = cipherSuite.hexToString
export const getBase64EncodedFromBuffer = cipherSuite.getBase64EncodedFromBuffer
export const aesEncrypt = cipherSuite.aesEncrypt
export const aesDecrypt = cipherSuite.aesDecrypt
export const rsaEncrypt = cipherSuite.rsaEncrypt
export const rsaDecrypt = cipherSuite.rsaDecrypt
export const rsaSign = cipherSuite.rsaSign
export const rsaVerifySignature = cipherSuite.rsaVerifySignature
export const rsaSignHash = cipherSuite.rsaSignHash
export const rsaVerifySignatureHash = cipherSuite.rsaVerifySignatureHash
export const createAESKeyFromString = cipherSuite.createAESKeyFromString
export const calculateEtag = cipherSuite.calculateEtag
export const convertUint8ArrayToBinaryString = cipherSuite.convertUint8ArrayToBinaryString
export const hashMD5 = cipherSuite.hashMD5