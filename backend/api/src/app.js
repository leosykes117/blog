const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

// settings
app.set('port', 3000)
app.set('json spaces', 2)

// middlewares
app.use(cors())
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// routes
app.use(require("./routes/index"))
app.use("/api/auth", require('./routes/auth.routes'))

module.exports = app
