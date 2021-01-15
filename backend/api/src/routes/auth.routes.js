const { Router } = require("express")
const router = Router()
const authController = require("../controllers/auth.controller")

router.post("/signin", (req, res) => {
	authController
		.signIn(req, res)
		.then((response) => {
			res.status(200).json("signin")
		})
		.catch((err) => {
			res.status(400).json(err)
		})
})

router.post("/signup", (req, res) => {
	authController
		.signUp(req, res)
		.then((response) => {
			res.status(200).json(response)
		})
		.catch((err) => {
			res.status(400).json(err)
		})
})

module.exports = router
