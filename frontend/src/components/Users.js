import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { GetUserApiRoute, SearchUser } from '../utils/apiRoutes'
import { HiOutlineUserCircle } from 'react-icons/hi'



const Users = ({ selectedUser, Socket }) => {

  const [contacts, setContacts] = useState([])
  const [currentUserSelected, setCurrentUserSelected] = useState(undefined)
  const [users, setUsers] = useState([])

  const userId = JSON.parse(localStorage.getItem('user')).id
  const user = JSON.parse(localStorage.getItem('user'))

  // ------   Sending login user detail and socket id to backend

  Socket.emit('addUser', { userName: user.userName, user: user.id, socketId: Socket.id })

  // ------   



  // ------   Api calls to get contacts that are Chatting previously

  useEffect(() => {
    const get = async () => {
      const { data } = await axios.get(`${GetUserApiRoute}/${userId}`);
      if (data.status) {
        setContacts(data.Users)
      }
    }
    get()
  }, [])
  // ------   



  // ------   Getting old selectedUser from localstorage and setting it to CurrentSelectedUser

  useEffect(() => {
    const getActiveuser = JSON.parse(localStorage.getItem('activeUser'))
    if (getActiveuser) {
      selectedUser(getActiveuser)
      setCurrentUserSelected(getActiveuser)
      Socket.emit('changeActive', { user: userId, SelectedUser: getActiveuser._id })
    }
  }, [])
  // ------   



  // ------  Recieving notificatin of incoming message when our currentSelectedUser is not selected as from where the messages are recieving
  Socket.off('receiveNotification').on('receiveNotification', ({ from }) => {
    // First checking that the sender is in our Contacts list or not
    const check = contacts.findIndex((user) => {
      return user._id == from._id
    })

    if (check == -1) {
      // If the sender is not in our contacts list we add that user to our contacts list 
      setContacts([from, ...contacts])
    } else {

      // If sender is in our contacts list

      // Checking that any user is selected or not
      if (currentUserSelected == undefined) {

        add()
        return
      } else {
        // Checking is our sender and Selected user are same or not 

        if (from._id == currentUserSelected._id) {
          // If same we do nothgig
        }
        else {
          // If sender and Selected user are not same we add nodify field in contacts object and increases in by 1 on every message recieve
          add()
        }
      }
    }

    // Function to add notify field in our user object 
    function add(params) {
      let news = [...contacts]
      news[check].notify ? news[check].notify += 1 : news[check].notify = news[check].notify = 1
      setContacts(news)
    }
  })
  // ------   


  
  // ------ To select user as currentSelectedUser to start chat   
  const changeCurrentSelected = (index, user, userType) => {
    // User is the user objext

    // If we add a user to currentSelectedUser from search results
    // First we check the user that it is in our contacts or not by findIndex method
    if (userType === 'newUser') {

      const checkIfUserExist = contacts.findIndex((User) => {
        return User._id == user._id
      })
      // If selected user is not in our contacts we add user to our contact
      if (checkIfUserExist == '-1') {
        setContacts([user, ...contacts])
      }
    }

    // We also add currentSelectedUser to localstorage to get in again anytime
    localStorage.setItem('activeUser', JSON.stringify(user))

    // Also set our currentSelectedUser to bakend
    Socket.emit('changeActive', { user: userId, SelectedUser: user._id })

    setCurrentUserSelected(user)
    // Sending back selected user to main chat component
    selectedUser(user)


    // Removing notify value from our object on selectedUserChange
    // first we get index of user that we select in contacts
    const check = contacts.findIndex((User) => {
      return User._id == user._id
    })
    if (check != '-1') {
      let updatedContactsArray = [...contacts]
      // After getting index we remove notigy field from our user object and make it clear
      delete updatedContactsArray[check].notify
      setContacts(updatedContactsArray)
    }
  }
  // ------   



  // ------   This is api call when we start searching for users and set the response to our users state
  const handerUserSearch = async (e) => {
    e.preventDefault()

    /////////////////////
    //  Not usefull
    // if (cancelToken !== undefined) {
    //   cancelToken.cancel('Cancelled for new request')
    // }

    // cancelToken  = axios.CancelToken.source()
    ///////////////////

    if (e.target.value !== '') {

      const { data } = await axios.post(SearchUser, {
        query: e.target.value,
        userName: user.userName
      })
      setUsers(data.users)
    }
    if (e.target.value == '') {
      setUsers([])
    }
  }

  return (

    <div className='allUsers flex-col   flex h-full '>

    {/* Showing search results*/}

      <div className={`findInput h-[50%] max-h-[437px] overflow-y-auto     ${users.length > 0 ? 'shadow-2xl' : ''}`}>
        <input type="text" onChange={handerUserSearch} placeholder='Search for Users' className=' border-none outline-none h-8 w-full p-2' />
        <div className="serarchResult overflow-y-auto   ">
          {
            users.length > 0 ?
              users.map((user, index) => {
                return <div key={user._id} onClick={() => { changeCurrentSelected(index, user, 'newUser') }} className='flex  p-4 cursor-pointer hover:bg-slate-700  items-center gap-4'>
                  {
                    user.isAvatarImageSet ?
                      <img className='w-[60px]' src={`data:image/svg+xml;base64,${user.avatarImage}`} alt="" />
                      :
                      <div className='h-[60px] w-[60px] rounded-[50%] bg-gray-400'> <HiOutlineUserCircle className='h-full w-full text-gray-200 rounded-[50%] bg-gray-400' /></div>

                  }
                  <p className='text-[1.5rem] text-orange-400'>{user.userName}</p>
                </div>
              })
              :
              <h3 className='text-center text-2xl text-gray-400 p-4'>Search by userName</h3>
          }
        </div>
      </div>

        {/* Showing contacts */}

      <div className="activeUsers max-h-[449px] overflow-y-auto h-[50%]">
        <h3 className='text-center text-green-500 text-2xl p-2 font-bold '>Users that you are talking</h3>
        {
          contacts.length > 0 ?
            contacts.map((users, index) => {
              return <div key={index} onClick={() => { changeCurrentSelected(index, users, 'oldUser') }} className={`w-full h-[100px] hover:bg-slate-600 cursor-pointer py-4 flex gap-8 items-center ${currentUserSelected !== undefined ? currentUserSelected.userName === users.userName ? 'selected' : '' : ''}`}>
                {
                  users.avatarImage !== '' ?
                    <img className='w-[20%]' src={`data:image/svg+xml;base64,${users.avatarImage}`} alt="" />
                    :
                    <div className='h-[50px] w-[50px] rounded-[50%] bg-gray-400'> <HiOutlineUserCircle className='h-full w-full text-gray-200 rounded-[50%] bg-gray-400' /></div>

                }
                <h2 className='text-3xl text-orange-400'>{users.userName}</h2>
                {
                  users.notify ?
                    <p className='bg-green-500 h-5 w-5 rounded-[50%] flex justify-center items-center p-4 text-2xl text-white'>{users.notify}</p>
                    :
                    // <p>no</p>
                    ''
                }
              </div>

            }) :
            <h2 className='text-gray-400 p-4 text-2xl'>You have no active Users please send message to any user. Find users by search above</h2>
        }
      </div>
    </div>
  )
}

export default Users