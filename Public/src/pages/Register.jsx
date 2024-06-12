/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import logo from '../assests/logo_snappy.svg';
import './Register.css';
import {toast,ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from '../utils/APIRoutes';
function Register() {
    const navigate=useNavigate();
    const [value,setValue]=useState({
        username:"",
        email:"",
        password:"",
        confirmPassword:"",
    })
    useEffect(()=>{
        if(localStorage.getItem('chat-app-user')){
          navigate('/');
        }
      },[]);
    async function onhandleSubmit(event){
        event.preventDefault();
        if(validation()){
            const {password,email,username}=value;
            const {data} = await axios.post(registerRoute,{
                username,
                email,
                password,
            });
            if(data.status===false){
                toast.error(data.msg,toastOption);
            }
            if(data.status===true){
                localStorage.setItem("chat-app-user",JSON.stringify(data.user));
                navigate("/");
            }
        }
    };
    const toastOption={
        draggable:true,
        position:'bottom-right',
        autoClose:5000,
        pauseOnHover:true,
        theme:"dark",
    }
    function validation(){
        const {password,confirmPassword,email,username}=value;
        if(password!==confirmPassword){
            toast.error("Password and Confirm Password should be same ",toastOption);
            return false;
        }else if(username.length<3){
            toast.error("Username should be more than 3 characters ",toastOption);
            return false;
        }else if(password.length<8){
            toast.error("Password should be more than or equal to 8 characters ",toastOption);
            return false;
        }else if(email===""){
            toast.error("Email is required ",toastOption);
            return false;
        }
        return true;
    }
    function handleChange(e){
        setValue({...value,[e.target.className]:e.target.value});
    }
  return (
    <>
    <div className='Formcontainer'>
    <form onSubmit={(event)=>{onhandleSubmit(event)}} className='form'>
        <div className="brand">
            <img src={logo} alt='Logo'/>
            <h1>CHATIFY</h1>
        </div>
            <input 
            type='text'
            placeholder='Username' 
            className='username' 
            onChange={(e)=>handleChange(e)}></input>
            <input 
            type='email' 
            placeholder='Email' 
            className='email' 
            onChange={(e)=>handleChange(e)}></input>
            <input 
            type='password' 
            placeholder='Password' 
            className='password' 
            onChange={(e)=>handleChange(e)}></input>
            <input 
            type='password' 
            placeholder='Confirm Password' 
            className='confirmPassword' 
            onChange={(e)=>handleChange(e)}></input>
        <button type='submit' className='submit'>Create User</button>
        <span className='already-account'>Already have an account ? <a href='/login'>Login</a></span>
    </form>
    </div>
    <ToastContainer/>
    </>
  )
}

export default Register