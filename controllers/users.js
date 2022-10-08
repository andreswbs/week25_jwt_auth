import dotenv from 'dotenv'
dotenv.config()

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import mongoose from 'mongoose'
const mongodbConnection = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/?retryWrites=true&w=majority`

console.log('mongodbConnection', mongodbConnection)

import AuthUser from '../model/auth_users.js'

mongoose.connect(mongodbConnection)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection failed'))

const registerUser = ({username, password}) => {
    console.log('username', username)
    const passwordHash = bcrypt.hashSync(password, 10)
    console.log('passwordHash', passwordHash)
    AuthUser.create({
        username,
        passwordHash
    })
}

const getRegisteredUsers = async () => {
    return AuthUser.find({})
}

function generateAccessToken(username) {
    return jwt.sign(
        {username, shoppingCart: { products: ['mouse', 'tablet'] }}, 
        process.env.TOKEN_SECRET, 
        { expiresIn: '1800s' }
    );
  }

const validateUser = async ({username, password}) => {
    const user = await AuthUser.findOne({username})
    console.log(user)
    let isValid =false
    try {
        isValid = await bcrypt.compare(password, user.passwordHash)
    } catch (error) {
        return null

    }
    if (!isValid) {
        return null
    }

    return {token: generateAccessToken(username) }
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    let token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        token = req.cookies.access_token?.token
        console.log(token)
    }
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      req.user = user
  
      next()
    })
  }

export default {
    registerUser,
    getRegisteredUsers,
    validateUser, authenticateToken
}