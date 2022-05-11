import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Buffer } from 'buffer'
import { useNavigate } from 'react-router-dom'
import { SetAvatarApiRoute } from '../utils/apiRoutes'
import { toast } from 'react-toastify'
const SetAvatar = () => {

  const navigate = useNavigate()

  const user = localStorage.getItem('user')
  
  const [loading, setLoading] = useState(true)
  
  const api = 'https://api.multiavatar.com'
  const [avatar, setAvatar] = useState([])
  
  const handleAvatarSelection = async(image) => {

    
    const email =JSON.parse( localStorage.getItem('user')).email
    
    const {data} = await axios.post(SetAvatarApiRoute,{
      email,image
    })
    
    if(data.status == true){
      navigate('/chat')
      toast('Successfully! Avatar added',{
        position:'bottom-right'
      })
    }
    
  }
  
  useEffect(()=>{

    const getAvatars = async () =>{
        if(!user || user == null){
          navigate('/')
          return
        }



        const avatars = []
        for (let i = 0; i <= 4; i++) {
          
          const {data} = await axios.get(`${api}/${Math.floor(Math.random()*1000)}`)
          const buffer = new Buffer(data)
          avatars.push(buffer.toString('base64'))
          // setAvatar([...avatar,buffer.toString('base64')])
        }
        setAvatar(avatars)
        setLoading(false)
      }
      getAvatars()

    },[])
  

  return (
    <>
      <section className='h-[100vh] flex items-center flex-col justify-center   bg-slate-900 w-[100vw]'>
        <h1 className='text-orange-400 text-2xl text-center mt-4'>Choose your Avatar</h1>
      {
        loading?
        <h2 className='text-4xl text-gray-300'>Loading.....</h2>
        :
        <>

        <div className="avatars grid grid-cols-2 mt-5 w-fit h-fit gap-4">

      {
        avatar.map((image,index)=>{
          return <img onClick={()=>handleAvatarSelection(image)} className='cursor-pointer h-[200px]' src={`data:image/svg+xml;base64,${image}`} alt="" />
        })
      }
      </div>
      <div>
        <button onClick={()=>navigate('/chat')} className= 'text-2xl p-2 mt-4 rounded-xl bg-slate-600 text-orange-500'>Skip For Now</button>
      </div>
        </>
      }


      </section>
    </>
  )
}

export default SetAvatar