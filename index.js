
import express from 'express'
import usersController from './controllers/users.js'

const app = express()
const port = process.env.PORT || 8080;

app.use(express.json())

app.get('/', (req, res) => {
    res.send(`
    <h1>Hello</H1>
    `)
})

app.post('/register', (req, res) => {
    usersController.registerUser(req.body)
    res.sendStatus(201)
})

app.get('/registrered_users', async (req, res) => {
    res.send(await usersController.getRegisteredUsers())
})

app.post('/login', async (req, res) => {
    const result = await usersController.validateUser(req.body)
    if (!result) {
        res.status(403).send({error: 'Authentication failed'})
        return
    }
    res.send(result)
})

app.listen(port, () => {
    console.log("Ready at port " + port)
})


