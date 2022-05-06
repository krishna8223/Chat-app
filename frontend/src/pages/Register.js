import React, { useState , useEffect } from 'react'
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link , useNavigate } from 'react-router-dom'
import axios from 'axios'
import { RegisterApiRoute } from '../utils/apiRoutes';



const Register = () => {

  const navigate = useNavigate()

  const [user, setUser] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [CPassword, setCPassword] = useState('')

  useEffect(()=>{
    const user = localStorage.getItem('user')
    if(user){
      navigate('/chat')
    }
  },[])

  const handleSubmit =async (e) => {
    e.preventDefault()
    
    if (!handleValidation()) {
      return
    }

    const {data} =await axios.post(RegisterApiRoute,{
      user,email,password
    })  

    console.log(data);

    if(data.status == false){
      toast(data.message,{
        position:'bottom-right'
      })
    }
    else{
      toast('Successfully! Registration done.. PLease Login',{
        position:'bottom-right'
      })
      navigate('/')
    }
  }

  const handleValidation = () => {
    if (password !== CPassword) {
      toast.error('Passwords are not matching', {
        position: 'bottom-right'
      });
      return false

    }
    else if (password.length < 4) {
      toast.error('Password must have 4 charactors', {
        position: 'bottom-right'
      });
      return false

    }
    else if (user.length < 2) {
      toast.error('UserName must have 2 charactors', {
        position: 'bottom-right'
      });
      return false

    }
    else if (email == '') {
      toast.error('Email is required', {
        position: 'bottom-right'
      });
      return false

    }
    return true
  }

  return (
    <>
      <section className="h-[100vh] flex justify-center  bg-slate-900 w-[100vw]">
        <div className="formWrapper border-[#3e3c3a] border bg-slate-800 h-fit rounded-lg px-[1.5rem] py-[2rem] sm:px-[3rem] mt-40 flex justify-center ">
          <form onSubmit={handleSubmit} className=' flex gap-8 flex-col' >
            <div className='flex flex-col gap-2'>
              <label className='font-medium text-gray-300'>UserName</label>
              <input className='[width:clamp(18rem,30vw,20rem)] p-2  rounded-lg bg-slate-200 text-slate-900 border-none outline-none' type="text" placeholder='UserName' required onChange={(e) => setUser(e.target.value)} />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-gray-300'>Email</label>
              <input className='[width:clamp(18rem,30vw,20rem)] p-2 rounded-lg bg-slate-200 text-slate-900 border-none outline-none' type="email" placeholder='Email' required onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-gray-300'>Password</label>
              <input className='[width:clamp(18rem,30vw,20rem)] p-2 rounded-lg bg-slate-200 text-slate-900 border-none outline-none' type="password" required placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-gray-300'>Conform Password</label>
              <input className='[width:clamp(18rem,30vw,20rem)] p-2 rounded-lg bg-slate-200 text-slate-900 border-none outline-none' type="password" required placeholder='Confirm Password' onChange={(e) => setCPassword(e.target.value)} />
            </div>
            <button className='p-2 bg-orange-500 text-white rounded-lg w-[50%] border-orange-600 border' type="submit">Register</button>
            <span className='text-gray-300'>Already have an account <Link className='text-orange-600 ' to='/'>Login Here</Link></span>
          </form>
        </div>
      </section>

    </>
  )
}

export default Register