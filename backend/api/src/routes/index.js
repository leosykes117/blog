const {Router} = require('express')
const router = Router()
const oracle = require('../modules/oracle')

router.get('/', (req, res) => {

    const sql = 'select * from usuarios';
    
    oracle.query(sql, {})
        .then(result => {
            const users = result.data.rows
            console.log("users -->", JSON.stringify(users))
            let response = users.reduce((acc, curr) => {
                if (!acc.hasOwnProperty(curr[0])) {
                    acc[curr[0]] = {
                        id: curr[0],
                        email: curr[1],
                        name: curr[3],
                        lastname: curr[4],
                        gender: curr[5]
                    }
                }
                return acc
            }, {})
            response = Object.values(response)

            res.status(200).json({
                message: 'TODO OK',
                data: response
            })
        })
        .catch(err => {
            console.log(`\x1b[31mERROR ${err}\x1b[0m`)
            res.status(400).json({
                message: 'TODO MAL'
            })
        })
})

module.exports = router