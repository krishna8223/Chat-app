import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { HiOutlineUserCircle } from 'react-icons/hi'



const Header = ({ selectedUser, socket }) => {

    const [online, setonline] = useState(false)
    const User = JSON.parse(localStorage.getItem('user'))


    useEffect(() => {
        socket.emit('checkOnline', { selectedUserId: selectedUser._id, userSocketId: socket.id })

    }, [selectedUser])


    socket.off("getOnlineStatus").on('getOnlineStatus', ({ status }) => {
        setonline(status)
    })


    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('activeUser')
        socket.emit('removeUser', { userId: User.id })
        navigate('/')
    }
    return (
        <header className='flex items-center justify-between p-4 shadow-lg'>
            <div className="leftSide flex items-center gap-4">
                {
                    selectedUser.avatarImage !== '' ?
                        <img className=' w-[60px] p-1 border-orange-400 border-2 rounded-[50%] ' src={`data:image/svg+xml;base64,${selectedUser.avatarImage}`} alt="" />
                        :
                        <div className='w-[60px] h-[60px] rounded-[50%] bg-gray-400 p-1 border-orange-400 border-2'>
                            <HiOutlineUserCircle className='h-full w-full text-gray-200 rounded-[50%] bg-gray-400' />
                        </div>
                }
                <div>
                    <p className='text-xl text-orange-400'>{selectedUser.userName}</p>
                    {
                        online ?
                            <p className='text-sm text-orange-300'>Online</p>
                            :
                            ''
                    }
                </div>
            </div>
            <div className="rigntSide">
                <h2 className='cursor-pointer text-xl text-orange-300' onClick={logout}>Logout</h2>
            </div>
        </header>
    )
}

export default Header