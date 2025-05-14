import React, { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import BackToLogin from '../ui/BackToLogin'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import apis from '../../utils/apis'
import LoadingButton from '../ui/LoadingButton'
const UpdatePassword = () => {
    const[password,setPassword]=useState('')
    const[confirmPassword,setConfirmPassword]=useState('')
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();
    const passwordChange = (event)=>{
        setPassword(event.target.value)
    }
    const confirmPasswordChange = (event)=>{
        setConfirmPassword(event.target.value)
        }
    const submitHandler = async(event)=>{
        event.preventDefault()
        try {
            setLoading(true);
            const response = await fetch(apis().updatePassword,{
                method: 'POST',
                body:JSON.stringify({password,confirmPassword,token:localStorage.getItem('passToken')}),
                headers: {'Content-Type': 'application/json'}
              })
              const result = await response.json();
              setLoading(false)
          if (!response.ok) {
            throw new Error(result?.message)
          }
          if (result?.status) {
           
            toast.success(result?.message);
            navigate('/login')
            localStorage.removeItem('email');
            localStorage.removeItem('passToken');
          }


        } catch (error) {
            toast.error(error.message)
        }
      
    }
  return (
        <div className="auth_main">
            <form onSubmit={submitHandler}>
                <div className="auth_container">
                    <div className="auth_header">
                        <p className="auth_heading text-yellow-950">New Password</p>
                        <p className="auth_title text-yellow-950">enter at least 6 disigt long password</p>
                    </div>
                    <div className="auth_item">
                        <label>Password *</label>
                        <Input onChange={passwordChange} type="text" placeholder="new password"/>
                    </div>
                    <div className="auth_item">
                        <label>confirm password *</label>
                        <Input onChange={confirmPasswordChange} type="text" placeholder="confirm Password" required/>
                    </div>
                    <div className="auth_action">
                        <Button>
                            <LoadingButton loading={loading} title="Update Password"/>
                        </Button>
                    </div>
                    
                    <BackToLogin/>
                </div>
            </form>

        </div>    
  )
}

export default UpdatePassword