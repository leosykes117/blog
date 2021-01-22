const { Router } = require('express')
const router = Router()
const articleController = require('../controllers/article.controller')

router.post('/articles', (req, res) => {
	articleController
		.getUserArticles(req)
		.then((response) => {
			res.status(200).json(response)
		})
		.catch((err) => {
			res.status(400).json(err)
		})
})

router.put('/edit', (req, res) => {
	articleController
		.createOrUpdateArticle(req)
		.then((response) => {
			res.status(200).json(response)
		})
		.catch((err) => {
			res.status(400).json(err)
		})
})

module.exports = router
