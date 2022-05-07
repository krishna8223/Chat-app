import axios from 'axios'
import React, { useEffect , useState } from 'react'
import { GetUserApiRoute, SearchUser } from '../utils/apiRoutes'

import {HiOutlineUserCircle} from 'react-icons/hi'

const Users = ({selectedUser, Socket}) => {
    const [contacts,setContacts] = useState(undefined)
    const [currentUserSelected,setCurrentUserSelected] = useState(undefined)
    const [users, setUsers] = useState([])
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
    let cancelToken=undefined
    const handerUserSearch = async(e) =>{
      e.preventDefault()


      
      // if (cancelToken !== undefined) {
      //   cancelToken.cancel('Cancelled for new request')
      // }

      cancelToken  = axios.CancelToken.source()
      if(e.target.value!==''){
        
        const {data} =await axios.get(SearchUser+'/'+e.target.value,{
          cancelToken:cancelToken.token
        })
        console.log(data);
        setUsers(data.users)
      }
      if(e.target.value == ''){
        setUsers([])

      }


    }

  return (

    <div className='allUsers flex-col   flex h-full '>
      <div className={`findInput h-[50%] max-h-[437px] overflow-y-auto     ${users.length>0?'shadow-2xl':''}`}>
        <input type="text" onChange={handerUserSearch} placeholder='Search for Users' className=' border-none outline-none h-8 w-full p-2' />
        <div className="serarchResult overflow-y-auto   ">
          {
            users.length>0?
             users.map((user,index)=>{
              return <div key={user._id} className='flex  p-4 cursor-pointer hover:bg-slate-700  items-center gap-4'>
                {
                  user.avatarImage !== ''?
                  <img className='w-[60px]' src={`data:image/svg+xml;base64,${user.avatarImage}`} alt="" />
                  :
                  <div className='h-[60px] w-[60px] rounded-[50%] bg-gray-400'> <HiOutlineUserCircle className='h-full w-full text-gray-200 rounded-[50%] bg-gray-400'/></div>

                }
              <p className='text-[1.5rem] text-orange-400'>{user.userName}</p>
              </div>
            })
            :
            <h3 className='text-center text-2xl text-gray-600 p-4'>Search by userName or Email</h3>
          }
        </div>
      </div>
      <div className="activeUsers max-h-[449px] overflow-y-auto h-[50%]">
        <h3 className='text-center text-green-500 text-2xl p-2 font-bold '>Active Users</h3>
      {
        contacts!==undefined ?
        contacts.map((users,index)=>{
          return <div  key={index} onClick={()=>{changeCurrentSelected(index,users)}} className={`w-full h-[100px] hover:bg-slate-700 cursor-pointer py-4 flex flex-col items-center ${currentUserSelected === index ? 'selected':''}`}>
              <img className='w-[12%]' src={`data:image/svg+xml;base64,${users.avatarImage}`} alt="" />
              <h2 className='text-3xl text-orange-400'>{users.userName}</h2>
            </div>
            
          }):
          ''
        }
        </div>
    </div>
  )
}

export default Users