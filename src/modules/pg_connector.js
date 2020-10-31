const { Client } = require('pg')
const db_conn = require('../config/db_conn.json')

if (process.env.DB_URL) {
    console.log(`\x1b[34m postgres host: ${process.env.DB_URL}`)
    db_conn.host = process.env.DB_URL
} else {
    console.log(`\x1b[33m default postgres host: ${db_conn.host}`)
}

const client = new Client(db_conn)
const pg_connector = {}

const conn = () => {
    return new Promise((resolve, reject) => {
        client.connect()
            .then(() => {
                console.log('pg connected')
                resolve()
            })
            .catch(err => {
                console.log('connection error 💥💥💥', err.stack)
                reject(err.stack)
            })
    })
}

const disc = () => {
    return new Promise((resolve, reject) => {
        client
            .end()
            .then(() => {
                console.log('client has disconnected')
                resolve()
            })
            .catch(err => {
                console.log('error during disconnection 💥💥💥', err.stack)
                reject(err.stack)
            })
    })
}


pg_connector.checkConn = () => {
    return new Promise((resolve, reject) => {
        conn()
            .then(() => disc())
            .then(() => resolve('connect was successful!'))
            .catch((err) => reject(err))
    })
}

module.exports = pg_connector