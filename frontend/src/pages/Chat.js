import React, { useEffect, useRef, useState } from 'react'
import Mesages from '../components/Mesages'
import Users from '../components/Users'

import io  from 'socket.io-client';
const socket = io('http://localhost:5000')

const Chat = () => {

  const [currentSelectedUser,setCurrentSelectedUser] = useState(undefined)

  // we will get selected user from users component and we pass it to our messages component
  const currentSelected = (user) => {
    setCurrentSelectedUser(user)
  }

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
              // Passing socket and currentSelecteduUser
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