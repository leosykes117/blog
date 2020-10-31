const app = require('./app')

const main = () => {
    return new Promise((resolve, reject) => {
        app.listen(3000)
        resolve()
    })
}

main()
    .then(() => console.log('Running on port 3000'))
    .catch(err => console.log('Cannot up server'))