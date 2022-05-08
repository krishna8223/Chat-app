const User = require('../models/userModel')
const Message = require('../models/messageModel')
const ObjectId = require('mongoose').ObjectId
const bcrypt = require('bcrypt')
const  mongoose  = require('mongoose')


// Register 

const register = async (req, res, next) => {
    try {

        const { user: userName, email, password } = req.body
        const userCheck = await User.findOne({ userName })

        if (userCheck) {
            return res.json({ message: 'UserName already exists', status: false })
        }

        const emailCheck = await User.findOne({ email })
        if (emailCheck) {
            return res.json({ message: 'email already exists', status: false })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const saveUser = new User({ userName, email, password: hashedPassword }).save()

        const user = {
            userName, email
        }

        return res.status(200).json({ status: true, user })


    } catch (error) {


    }
}

// Login

const login = async (req, res, next) => {
    try {

        const { email, password } = req.body

        const userDetail = await User.findOne({ email })
        if (!userDetail) {
            return res.json({ message: 'Invalid Credentials', status: false })
        }

        const CheckPassword = await bcrypt.compare(password, userDetail.password)

        if (!CheckPassword) {
            return res.json({ message: 'Invalid Credentials', status: false })
        }

        const user = {
            id: userDetail.id,
            userName: userDetail.userName,
            email: userDetail.email,
            isAvatar: userDetail.isAvatarImageSet
        }
        return res.status(200).json({ status: true, user })



    } catch (error) {


    }
}

const avatar = async (req, res, next) => {

    try {

        const { email, image } = req.body
        const update = { isAvatarImageSet: true, avatarImage: image }

        const user = await User.findOneAndUpdate({ email }, update)
        res.json({ message: 'Sussesfully avatar set', status: true })
    } catch (error) {
        res.json({ message: 'Something went wrong', status: false })
    }



}

const getUser = async (req, res, next) => {

    try {
        const users = await Message.find({users:{$all:[req.params.id]}}).select(['users','-_id'])
        let activeUsers = []
        
        users.forEach((user)=>{
            const act = user.users.filter((e)=>{
                return e !== req.params.id
            })
            activeUsers.push(act)
        })

        const allUsers = [...new Set(activeUsers.flat())] 

        let Users = []

            for (let i = 0; i < allUsers.length; i++) {
                
                const user = await User.find({_id:mongoose.Types.ObjectId(allUsers[i])})
                Users.push(user)
            }

        await res.json({Users:Users.flat(),status:true})

    } catch (error) {
    }
}


const searchUser = async (req,res,next) =>{
    try {
        const {query,userName} = req.body 
        // const users =await User.find({userName:{ $regex : /^usernamN/}})
        const users =await User.find({userName:new RegExp('^'+query,'i')})
        const check = users.findIndex((user)=>{
            return user.userName === userName
        })
        if(check != '-1'){
             users.splice(check,1)
        }
        res.json({users,status:true})
    } catch (error) {
        res.json({status:false})
        
    }

}

module.exports = { register, login, avatar, getUser,searchUser }