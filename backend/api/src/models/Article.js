const oracle = require('../lib/oracle')
const utilitiesResponse = require('../lib/responses')

const Article = {}

const oracledb = oracle.checkAvailability()

Article.getUserArticles = (dataset) => {
	return new Promise((resolve, reject) => {
		let sql = `SELECT
                    ID_ARTICULO,            --0
                    TITULO,                 --1
                    ENLACE_PERSONALIZADO,   --2
                    ID_USUARIO,             --3
                    PUBLICADO,              --4
                    FECHA_CREACION,         --5
                    FECHA_MODIFICACION,     --6
                    CONTENIDO               --7
                FROM ARTICULOS A
				WHERE A.ID_USUARIO = :userId
				ORDER BY FECHA_CREACION`
		let sqlParams = {
			userId: dataset.userId,
		}

		oracle
			.query(sql, sqlParams)
			.then((searchResponse) => {
				let userArticles = searchResponse.data.rows
				if (userArticles.length < 1) {
					resolve(utilitiesResponse.makeOkResponse('El usuario no cuenta con artículos', 2, []))
					return
				}
				const articles = userArticles.map((article) => {
					return {
						id: article[0],
						title: article[1],
						slug: article[2],
						userid: article[3],
						isPublished: article[4],
						createdAt: article[5],
						updateAt: article[6],
						content: article[7],
					}
				})

				resolve(utilitiesResponse.makeOkResponse('Artículos obtenidos', 1, articles))
			})
			.catch((err) => {
				console.log('getUserArticles error ->', err)
				reject(utilitiesResponse.makeErrorResponse('Ocurrio un error al obtener los articulos de los usuarios', -1, err))
			})
	})
}

Article.createOrUpdate = (dataset) => {
	return new Promise((resolve, reject) => {
		let articlePromise
		if (Number.isInteger(dataset.articleId) && dataset.articleId > 0) {
			articlePromise = Promise.resolve({ code: 1, message: '', data: {} })
		} else {
			articlePromise = Article.create(dataset)
		}
		articlePromise
			.then((response) => {
				resolve(response)
			})
			.catch((err) => {
				reject(err)
			})
	})
}

Article.create = (dataset) => {
	return new Promise((resolve, reject) => {
		let transaction
		let sql = `INSERT INTO ARTICULOS (TITULO, ENLACE_PERSONALIZADO, CONTENIDO, ID_USUARIO, PUBLICADO)
				VALUES(:title, :slug, :content, :userId, :isPublished)
				RETURNING ID_ARTICULO INTO :articleId`
		let sqlParams = {
			title: dataset.title,
			slug: dataset.slug,
			content: dataset.content,
			userId: dataset.userId,
			isPublished: dataset.isPublished === true ? 1 : 0,
			articleId: {
				type: oracledb.NUMBER,
				dir: oracledb.BIND_OUT,
			},
		}
		oracle
			.getTransaction()
			.then((sqlTransaction) => {
				transaction = sqlTransaction
				return transaction.query(sql, sqlParams)
			})
			.then((response) => {
				if (typeof response.data.outBinds.articleId[0] !== 'number') {
					reject(
						utilitiesResponse.workTheTransactionError(
							true,
							transaction,
							'El artículo no fue creado correctamente',
							-1,
							{}
						)
					)
				}
				const data = {
					articleId: response.data.outBinds.articleId[0],
				}
				transaction
					.commit()
					.then(function () {
						resolve(utilitiesResponse.makeOkResponse('Artículo creado con éxito', 1, data))
					})
					.catch(function (err) {
						reject(utilitiesResponse.makeErrorResponse('Error al revertir los cambios', -1, err))
					})
			})
			.catch((err) => {
				reject(
					utilitiesResponse.workTheTransactionError(true, transaction, 'Ocurrio un error al crear el artículo', -1, err)
				)
			})
	})
}

module.exports = Article
