const User = require('../models/userModel')
const bcrypt = require('bcrypt')


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

        console.log(error);

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

        console.log(error);

    }
}

const avatar = async (req, res, next) => {

    try {

        const { email, image } = req.body
        const update = { isAvatarImageSet: true, avatarImage: image }

        const user = await User.findOneAndUpdate({ email }, update)
        res.json({ message: 'Sussesfully avatar set', status: true })
    } catch (error) {
        console.log(error.message);
        res.json({ message: 'Something went wrong', status: false })
    }



}

const getUser = async (req, res, next) => {

    try {
        console.log(req.params.id);
        const users = await User.find({ _id: { $ne: req.params.id } }).select(['id', 'userName', 'avatarImage', 'email'])
        res.json({ status: true, users })
    } catch (error) {
        console.log(error.message);
        res.json({ message: 'Something went wrong', status: false })
    }



}


const searchUser = async (req,res,next) =>{
    const {username} = req.params 
    // console.log(typeof username);
    try {
        // const users =await User.find({userName:{ $regex : /^username/}})
        const users =await User.find({userName:new RegExp('^'+username,'i')})
        res.json({users,status:true})
    } catch (error) {
        console.log(error);
        res.json({status:false})
        
    }

}

module.exports = { register, login, avatar, getUser,searchUser }