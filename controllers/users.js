import dotenv from 'dotenv'
dotenv.config()

import bcrypt from 'bcrypt'
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

const validateUser = async ({username, password}) => {
    const user = await AuthUser.findOne({username})
    console.log(user)
    let isValid =false
    try {
        isValid = await bcrypt.compare(password, user.passwordHash)
    } catch (error) {
        return null

    }
    return {status: 'Valid', isValid}
}

export default {
    registerUser,
    getRegisteredUsers,
    validateUser
}