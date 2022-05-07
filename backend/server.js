const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const socket = require('socket.io')
const app = express()
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/messageRoutes')
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use('/api/auth',userRoutes)
app.use('/api/message',messageRoutes)

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('connected to mongoDb')
}).catch((err)=>{
    console.log(err.message);
})

const server = app.listen(process.env.PORT,()=>{
    console.log('server started');
})


                    // Socket.io 



const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  
  let users = []


 

const getUser = (data) => {
  const u =   users.find((user)=>{
     return user.user === data.to}
      )
  return u
}

const removeUser = (socket) => {    
    // console.log("######remove");
    users = users.filter((user) => {
        return user.id !== socket
    })
    // console.log(users);
    // console.log("######remove");
}

const logout = (userid) => {
    // console.log("######logout");
    users = users.filter((user) => {
        console.log(user.user  +  '$$$' + userid);
        return user.user !== userid
    })
    // console.log(users);
    // console.log("######logout");
}

const changeActiveUser = (user) => {
    const index =users.findIndex((e)=>{
        // console.log(e.user + '===' + user.user);
        return e.user === user.user
    })
    if(index !== -1){
        users[index].activeUserId = user.SelectedUser
        // console.log('#######Change active user #########');
        // console.log(user);
        // console.log('#######Change active user #########');
    }
}

// Socket Events 

io.on("connection",(socket) => {

    socket.on('addUser',(user)=>{
        const userIndex = users.findIndex((u)=>{
           return u.user === user.user
        })
        // console.log("addUser#######");
        if(userIndex == -1){
            users.push({userName:user.userName,user:user.user,id:user.socketId})
            // console.log('user Updated');
        }else{
            users[userIndex].id = user.socketId
        }

            // Showing online staus when a user joint

        allActiveUsers = users.filter((User)=>{
            return User.activeUserId === user.user
        })
        if(allActiveUsers.length>0){
            for (let i = 0; i < allActiveUsers.length; i++) {
                io.to(allActiveUsers[i].id).emit('getOnlineStatus',{status:true})
            }
        }
        // console.log(users);
        // console.log("addUser#######");
    })

    socket.on('changeActive',(user)=>{
        changeActiveUser(user)
    })

    socket.on('send-msg',(data)=>{
        const user = getUser(data)
        if(user && user.activeUserId === data.from){

            io.to(user.id).emit('recieve-msg',{
                message:data.message,
                fromSelf:false,
                from:data.from
            })
        }
    })


    socket.on('checkOnline',({selectedUserId,userSocketId})=>{
        // console.log(selectedUserId);
        // console.log(users);

        // Checking the user is online or not 

        const is = users.findIndex((user)=>{
            return user.user === selectedUserId
        })
            if(is!== -1){
                // console.log(true);
                io.to(userSocketId).emit('getOnlineStatus',{status:true})
            }
            else{
                // console.log(false);
                io.to(userSocketId).emit('getOnlineStatus',{status:false})
            }
    })

    socket.on("removeUser", ({userId}) => {
        logout(userId);

        //  Removing online status when a user logout

        allActiveUsers = users.filter((user)=>{
            return user.activeUserId === userId
        })
        if(allActiveUsers.length>0){
            for (let i = 0; i < allActiveUsers.length; i++) {
                io.to(allActiveUsers[i].id).emit('getOnlineStatus',{status:false})
            }
        }
    
    });
    
    socket.on("disconnect", () => {

        // Removing online status when a user disconnect
        
        const disconnectedUserIndex = users.findIndex((user)=>{
            return user.id === socket.id
        })

        if(disconnectedUserIndex!==-1){

            const allActiveUsers = users.filter((user)=>{
                return user.activeUserId === users[disconnectedUserIndex].user
            })
            if(allActiveUsers.length>0){
                for (let i = 0; i < allActiveUsers.length; i++) {
                    io.to(allActiveUsers[i].id).emit('getOnlineStatus',{status:false})
                }
            }
        }

        removeUser(socket.id);

      });



})

