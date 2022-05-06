const { register, login, avatar, getUser } = require('../controllers/userController')

console.log(login);

const router = require('express').Router()

router.post('/register', register)

router.post('/login', login)

router.post('/setAvatar', avatar)

router.get('/getUsers/:id', getUser)

module.exports = router
