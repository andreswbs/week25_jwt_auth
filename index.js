
import express, { urlencoded } from 'express'
import usersController from './controllers/users.js'
import cookieParser from 'cookie-parser'

const {authenticateToken} = usersController

import * as crypto from 'crypto'
import { urlToHttpOptions } from 'url'

crypto.randomBytes(64)

const app = express()
const port = process.env.PORT || 3030;

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send(`
    <h1>Hello</H1>
    `)
})

app.post('/api/register', (req, res) => {
    usersController.registerUser(req.body)
    res.sendStatus(201)
})

app.get('/api/registrered_users', authenticateToken, async (req, res) => {
    res.send(await usersController.getRegisteredUsers())
})

app.post('/api/login', async (req, res) => {
    const result = await usersController.validateUser(req.body)
    if (!result) {
        res.status(403).send({error: 'Authentication failed'})
        return
    }
    res.send(result)
})

app.get('/login', (req, res) => {
    res.render('pages/login')
})

app.post('/users_list', async (req, res) => {
    console.log(req.body)
    const result = await usersController.validateUser(req.body)
    if (!result) {
        return res.redirect('/login')
    }
    res.cookie(
        'access_token',
        result, {
            httpOnly: true,
            secure: false
        }
    ).render('pages/users-list')
})

app.get('/users_list', authenticateToken, async (req, res) => {
    const users = await usersController.getRegisteredUsers()
    console.log(users)
    res.render('pages/users-list', {users})
})

app.listen(port,  () => {
    console.log("Ready at port " + port)
})


