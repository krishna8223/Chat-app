import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getMessages, setMessages } from '../utils/apiRoutes';

const Mesages = ({ SelectedUser, Socket }) => {

    const User = JSON.parse(localStorage.getItem('user'))
    const [message, setMessage] = useState('')
    const [allMessages, setAllMessages] = useState([])


    const messageh2 = useRef()

const navigate = useNavigate()



    const handeMsgSubmit = (e) => {
        e.preventDefault()

        const { data } = axios.post(setMessages, {
            from: User.id,
            to: SelectedUser._id,
            message
        })

        Socket.emit('send-msg', {
            from: User.id,
            to: SelectedUser._id,
            message: message
        })
        const msg = [...allMessages]
        msg.push({
            message,
            fromSelf: true
        })
        setAllMessages(msg)
        setMessage('')
        // scrollToBottom()
    }


    useEffect(() => {
        messageh2.current?.scrollIntoView({ behavior: 'smooth' })
        console.log('scrolled');
    }, [allMessages])


    Socket.on('recieve-msg', (payload) => {
        if (payload.from === SelectedUser._id) {
            setAllMessages([...allMessages, { message: payload.message, fromSelf: payload.fromSelf }])
        }
    })


    useEffect(() => {

        const getMessage = async () => {
            setAllMessages([])
            const { data } = await axios.post(getMessages, {
                from: User.id,
                to: SelectedUser._id
            })
            setAllMessages(data)
        }
        getMessage()
    }, [SelectedUser])

    const logout = () =>{
        localStorage.removeItem('user')
        Socket.emit('removeUser',{userId:User.id})
        navigate('/')
    }


    return (
        <>
            <section className='h-full'>
                <div className="messageBoxWrapper over flex flex-col h-full ">

                    <div className="header basis-[10%]">
                        <h2 onClick={logout}>Logout</h2>
                    </div>
                    <div  className='mesageDiv px-[4px] basis-[80%] flex flex-col gap-1 max-h-[750px] overflow-y-auto overflow-x-hidden'>
                        message
                        {
                            allMessages !== undefined ?
                                // allMessages.lenght < 0?
                                allMessages.map((msg, index) => {
                                    return <h2 ref={messageh2} className={`${msg.fromSelf ? 'right' : ''} text-white text-2xl bg-slate-600 max-w-[300px] p-4 rounded-lg`} key={index}>{msg.message}</h2>
                                })
                                :
                                <h2>empty</h2>
                        }

                    </div>
                    <form onSubmit={handeMsgSubmit} className='basis-[10%] flex items-center'>
                        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className='w-[90%] h-12  ' />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </section>
        </>
    )
}

export default Mesages