const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'TODO OK'
    })
})

module.exports = router