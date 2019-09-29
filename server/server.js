require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')
const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const midCtrl = require('./middleware/authMiddleware')

const app = express()

app.use(express.json())
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))
//end points
app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)
// treasure
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', treasureCtrl.getUserTreasure, midCtrl.userOnly)
app.post('/api/treasure/user', midCtrl.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', midCtrl.usersOnly, midCtrl.adminsOnly, treasureCtrl.getAllTreasure)

massive(CONNECTION_STRING).then(db => {
    app.set('db', db) 
    app.listen(SERVER_PORT, () => console.log(`${SERVER_PORT} is running, dont touch anything!`))
})
