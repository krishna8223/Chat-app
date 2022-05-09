import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { getMessages, setMessages } from '../utils/apiRoutes';
import Header from './Header';
import dateFormat from "dateformat";

const Mesages = ({ SelectedUser, Socket }) => {

    const User = JSON.parse(localStorage.getItem('user'))
    const [message, setMessage] = useState('')
    const [allMessages, setAllMessages] = useState([])

    const messageh2 = useRef()

    // ------   Handing message submit 
    const handeMsgSubmit = (e) => {
        e.preventDefault()

        if (message !== '') {

            // Post api to save our message to Database
            const { data } = axios.post(setMessages, {
                from: User.id,
                to: SelectedUser._id,
                message
            })

            // Event emitting to backend with our message and sender id and recievers id
            Socket.emit('send-msg', {
                from: User.id,
                to: SelectedUser._id,
                message: message,
                createdAt: new Date()
            })

            // Event for notification
            Socket.emit('notification', {
                from: User,
                to: SelectedUser._id
            })

            // Pushig our message to allMessages state
            const msg = [...allMessages]
            msg.push({
                message,
                fromSelf: true,
                createdAt: new Date()
            })
            setAllMessages(msg)
            setMessage('')
        }
    }
// ------   


// ------   Auto scroll to down when message is recievend or send
    useEffect(() => {                          
        messageh2.current?.scrollIntoView({ behavior: 'smooth' })
    }, [allMessages])
// ------   


    // ------    Recieving new message from socket
    Socket.on('recieve-msg', (payload) => {          
        // We check that sender and SelectedUser are same
        if (payload.from === SelectedUser._id) {

            setAllMessages([...allMessages, { message: payload.message, fromSelf: payload.fromSelf, createdAt: payload.createdAt }])
        }
    })
    // ------   


    // ------   This is api call to get all messages betwwen user and selectedUser 
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
    // ------


    return (
        <>
            <section className='h-full'>
                <div className="messageBoxWrapper over flex flex-col h-full ">

                    <div className="header basis-[10%]">
                        <Header selectedUser={SelectedUser} socket={Socket} />

                    </div>
                    <div className='mesageDiv mt-2 px-[4px] basis-[80%] flex flex-col gap-1 max-h-[750px] overflow-y-auto overflow-x-hidden'>
                        {
                            allMessages !== undefined ?
                                // allMessages.lenght < 0?
                                allMessages.map((msg, index) => {
                                    return <>
                                        <div className={`message ${msg.fromSelf ? 'right' : ''} w-fit text-white bg-slate-600 max-w-[300px] p-4 rounded-lg`}>
                                            <h2 ref={messageh2} className='break-all text-2xl' key={index}>{msg.message}</h2>
                                            <p className='text-right text-orange-400'>{dateFormat(new Date(msg.createdAt), " mmmm dS, h:MM:ss TT")}</p>
                                        </div>
                                    </>
                                })
                                :
                                <h2>Please start typing Message...</h2>
                        }

                    </div>
                    <form onSubmit={handeMsgSubmit} className='basis-[10%] flex items-center justify-center'>
                        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className='w-[70%] p-2 text-xl h-12 border-none outline-none rounded-l-md rounded-bl-md  ' />
                        <button className='h-12 bg-orange-300 rounded-r-md rounded-br-md px-4' type="submit">Submit</button>
                    </form>
                </div>
            </section>
        </>
    )
}

export default Mesages