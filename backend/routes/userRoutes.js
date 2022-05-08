const { register, login, avatar, getUser,searchUser } = require('../controllers/userController')

console.log(login);

const router = require('express').Router()

router.post('/register', register)

router.post('/login', login)

router.post('/setAvatar', avatar)

router.get('/getUsers/:id', getUser)

router.post('/SearchUser', searchUser)

module.exports = router
