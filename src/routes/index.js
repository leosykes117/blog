const {Router} = require('express')
const router = Router()
const pg_connector = require('../modules/pg_connector')

router.get('/', (req, res) => {
    pg_connector.checkConn()
        .then((result) => {
            res.status(200).json({
                message: result
            })
        })
        .catch((err) => {
            res.status(500).json({
                message: `💥💥 ${err} 💥`
            })
        })
})

module.exports = router