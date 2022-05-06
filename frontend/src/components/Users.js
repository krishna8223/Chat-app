import axios from 'axios'
import React, { useEffect , useState } from 'react'
import { GetUserApiRoute } from '../utils/apiRoutes'

const Users = ({selectedUser, Socket}) => {
    const [contacts,setContacts] = useState(undefined)
    const [currentUserSelected,setCurrentUserSelected] = useState(undefined)
    const userId =JSON.parse( localStorage.getItem('user')).id
    const user =JSON.parse( localStorage.getItem('user'))
    Socket.emit('addUser',{userName:user.userName,user:user.id,socketId:Socket.id})



    useEffect( ()=>{
      const get = async() => {

        const {data} = await axios.get(`${GetUserApiRoute}/${userId}`);
        if(data.status){
          setContacts(data.users)
        }
      }
      get()
        
    },[])


    const changeCurrentSelected = (index,user) => {

      Socket.emit('changeActive',{user:userId,SelectedUser:user._id})
        
      setCurrentUserSelected(index)
      selectedUser(user)
    }

  return (

    <div className='allUsers flex-col flex  '>
      {
        contacts!==undefined ?
          contacts.map((users,index)=>{
            return <div  key={index} onClick={()=>{changeCurrentSelected(index,users)}} className={`w-fit cursor-pointer py-4 flex flex-col items-center border-b-[1px] border-b-orange-300 ${currentUserSelected === index ? 'selected':''}`}>
              <img className='w-1/4' src={`data:image/svg+xml;base64,${users.avatarImage}`} alt="" />
              <h2 className='text-3xl text-orange-400'>{users.userName}</h2>
            </div>
            
          }):
          ''
      }
    </div>
  )
}

export default Users