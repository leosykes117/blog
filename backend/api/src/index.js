const app = require("./app")
const port = app.get("port")

const main = () => {
	return new Promise((resolve, reject) => {
		app.listen(port)
		resolve()
	})
}

main()
	.then(() => console.log(`Running on port ${port}`))
	.catch((err) => console.log("Cannot up server"))
