const express = require('express')
const bodyParser = require('body-parser')
const massive = require('massive')
const session = require('express-session')
require('dotenv').config()

const AuthCtrl = require('./controllers/auth')

const {CONNECTION_STRING, SERVER_PORT, SESSION_SECRET} = process.env

const app = express()

app.use(bodyParser.json())
app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 12312323
    }
}))

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('db connected')
})

app.post('/auth/signup', AuthCtrl.signup)
app.post('/auth/login', AuthCtrl.login)
app.get('/auth/logout', AuthCtrl.logout)
app.get('/auth/current', AuthCtrl.current)

app.listen(SERVER_PORT, () => {
    console.log('sweeettt')
})