const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

app.use(morgan("dev"))

app.use(require("./routes/index"))

module.exports = app
