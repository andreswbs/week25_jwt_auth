
import express from 'express'
import usersController from './controllers/users.js'

const {authenticateToken} = usersController

import * as crypto from 'crypto'

crypto.randomBytes(64)

const app = express()
const port = process.env.PORT || 8080;

app.use(express.json())
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

app.listen(port, () => {
    console.log("Ready at port " + port)
})


