/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import logo from '../assests/logo_snappy.svg';
import './Register.css';
import {toast,ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from '../utils/APIRoutes';
function Login() {
    const navigate=useNavigate();
    const [value,setValue]=useState({
        username:"",
        password:"",
    })

    useEffect(()=>{
      if(localStorage.getItem('chat-app-user')){
        navigate('/');
      }
    },[]);

    async function onhandleSubmit(event){
        event.preventDefault();
        if(validation()){
            const {password,username}=value;
            const {data} = await axios.post(loginRoute,{
                username,
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
        const {password,username}=value;
        if(password===""){
            toast.error("Password is required ",toastOption);
            return false;
        }else if(username===""){
            toast.error("Username is required ",toastOption);
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
            type='username' 
            placeholder='Username' 
            className='username' 
            onChange={(e)=>handleChange(e)}></input>
            <input 
            type='password' 
            placeholder='Password' 
            className='password' 
            onChange={(e)=>handleChange(e)}></input>
        <button type='submit' className='submit'>Login</button>
        <span className='already-account'>Don't have an account ? <a href='/Register'>Register</a></span>
    </form>
    </div>
    <ToastContainer/>
    </>
  )
}

export default Login