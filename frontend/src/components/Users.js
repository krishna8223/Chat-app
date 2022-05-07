import axios from 'axios'
import React, { useEffect , useState } from 'react'
import { GetUserApiRoute, SearchUser } from '../utils/apiRoutes'

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
    let cancelToken=undefined
    const handerUserSearch = async(e) =>{
      e.preventDefault()


      
      if (cancelToken !== undefined) {
        cancelToken.cancel('Cancelled for new request')
      }

      cancelToken  = axios.CancelToken.source()
      if(e.target.value!==''){
        
        const {data} =await axios.get(SearchUser+'/'+e.target.value,{
          cancelToken:cancelToken.token
        })
        console.log(data);
      }


    }

  return (

    <div className='allUsers flex-col justify-between flex h-full '>
      <div className="findInput basis-[50%]">
        <input type="text" onChange={handerUserSearch} placeholder='Search for Users' className=' border-none outline-none h-12 w-full p-2' />
      </div>
      <div className="activeUsers basis-[50%]">

      {
        contacts!==undefined ?
        contacts.map((users,index)=>{
          return <div  key={index} onClick={()=>{changeCurrentSelected(index,users)}} className={`w-full h-[100px] cursor-pointer py-4 flex flex-col items-center border-b-[1px] border-b-orange-300 ${currentUserSelected === index ? 'selected':''}`}>
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