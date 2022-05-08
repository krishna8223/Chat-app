import React, { useEffect, useRef, useState } from 'react'
import Mesages from '../components/Mesages'
import Users from '../components/Users'
// import io from 'socket.io-client'
// import io from 'socket.io-client';


import io  from 'socket.io-client';
const socket = io('http://localhost:5000')


const Chat = () => {

  const [user, setuser] = useState(JSON.parse(localStorage.getItem('user')))


  // console.log(socket.id);
  const [currentSelectedUser,setCurrentSelectedUser] = useState(undefined)
  // const socket = useRef()

  // const user = 
  
  

  const currentSelected = (user) => {
    setCurrentSelectedUser(user)

  }
  // socket.current =  io.connect('http://localhost:5000')
  useEffect(()=>{
    // if(user){
    //   socket.on('connect',()=>{
    //     // socket.emit('addUser',{userName:user.userName,user:user.id,socketId:socket.id})
    //   })
    // }
    
    },[])
  

  return (
    <>
      <section className='h-[100vh] flex justify-center  bg-slate-900 w-[100vw]'>
        <div className='main-container m-auto grid w-[90%] h-[90%] max-h-[90%]  grid-cols-[21%,79%]'>
          <div className="contactsSide bg-slate-800 border-t-[1px] border-t-orange-300">
            <Users selectedUser= {currentSelected} Socket={socket}/>
          </div>
          <div className="MessagesSide bg-slate-700">
            {
              currentSelectedUser !== undefined ?
                <Mesages SelectedUser={currentSelectedUser} Socket={socket}/>:
                
                <h2 className='text-gray-400 p-12 text-3xl'>Start conversation by searching user with their userName</h2>
            }
          </div>
        </div>
      </section>
    </>
  )
}

export default Chat