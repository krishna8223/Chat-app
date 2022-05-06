import React, { useState , useEffect } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginApiRoute } from '../utils/apiRoutes';
import axios from 'axios'

const Login = () => {

  const navigate = useNavigate()
  useEffect(()=>{
    const user = localStorage.getItem('user')
    console.log(user);
    if(user){
      navigate('/chat')
    }
  },[])


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit =async (e) => {
    e.preventDefault()
    
    if (!handleValidation()) {
      return
    }

    const {data} =await axios.post(LoginApiRoute,{
      email,password
    })  

    console.log(data);

    if(data.status == false){
      toast(data.message,{
        position:'bottom-right'
      })
    }
    else{
      toast('Successfully! Login done',{
        position:'bottom-right'
      })
      localStorage.setItem('user',JSON.stringify(data.user))
      if(data.user.isAvatar){
        navigate('/chat')
      }else{
        navigate('/setAvatar')
      }
    }
  }

  const handleValidation = () => {
   
     if (password=='') {
      toast.error('Please Enter password', {
        position: 'bottom-right'
      });
      return false

    }
    else if (email=='') {
      toast.error('Please Enter email', {
        position: 'bottom-right'
      });
      return false

    }
    
    return true
  }
  
   return (
      <>
        <section className="h-[100vh] flex justify-center  bg-slate-900 w-[100vw]">
          <div className="formWrapper border-[#3e3c3a] border bg-slate-800 h-fit rounded-lg px-[1.5rem] py-[2rem] sm:px-[3rem]  mt-40 flex justify-center ">
              <form onSubmit={handleSubmit} className=' flex gap-8 flex-col' >
               
                <div className='flex flex-col gap-1'>
                  <label className='text-gray-300'>Email</label>
                  <input className='[width:clamp(18rem,30vw,20rem)] p-2 rounded-lg bg-slate-200 text-slate-900 border-none outline-none' type="email" placeholder='Email' required onChange={(e)=>setEmail(e.target.value)} />
                </div>
                <div className='flex flex-col gap-1'>
                  <label className='text-gray-300'>Password</label>
                  <input className='[width:clamp(18rem,30vw,20rem)] p-2 rounded-lg bg-slate-200 text-slate-900 border-none outline-none' type="password" required placeholder='Password' onChange={(e)=>setPassword(e.target.value)} />
                </div>
               
                <button className='p-2 bg-orange-500 text-white rounded-lg w-[50%] border-orange-600 border'   type="submit">Login</button>
                <span className='text-gray-300'>Not have an account <Link className='text-orange-600 ' to='/register'>Register Here</Link></span>
              </form>
          </div>

        </section>

      </>
  )
}

export default Login