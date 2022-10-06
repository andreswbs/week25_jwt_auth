import mongoose from 'mongoose'

const Schema = mongoose.Schema

const authUserSchema = new Schema({
    username: String,
    passwordHash: String
})

export default mongoose.model('AuthUser', authUserSchema )