const {Router} = require('express')
const router = Router()
const pg_connector = require('../modules/pg_connector')

router.get('/', (req, res) => {
    pg_connector.checkConn()
        .then((result) => {
            res.json({
                message: result
            })
        })
        .catch((err) => {
            res.json({
                message: err
            })
        })
})

module.exports = router