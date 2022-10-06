import bcrypt from 'bcrypt'


const registerUser = ({username, password}) => {
    console.log('username', username)
    const passwordHash = bcrypt.hashSync(password, 10)
    console.log('passwordHash', passwordHash)
}

export default {
    registerUser
}