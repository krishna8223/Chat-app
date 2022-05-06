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

    socket.on("removeUser", ({userId}) => {
        logout(userId);
    });
    
    socket.on("disconnect", () => {
        removeUser(socket.id);
      });
})




//   global.onlineUsers = new Map();
//   io.on("connection", (socket) => {
//     global.chatSocket = socket;
//     socket.on("add-user", (userId) => {
//       onlineUsers.set(userId, socket.id);
//     });
  
//     socket.on("send-msg", (data) => {
//       const sendUserSocket = onlineUsers.get(data.to);
//       if (sendUserSocket) {
//         socket.to(sendUserSocket).emit("msg-recieve", data.msg);
//       }
//     });
//   });