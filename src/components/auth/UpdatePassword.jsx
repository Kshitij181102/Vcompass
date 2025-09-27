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
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false);
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
        <div className="auth_main min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4">
            <form onSubmit={submitHandler} className="w-full max-w-md">
                <div className="auth_container bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 relative">
                    {/* Decorative top border */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-3xl"></div>
                    
                    {/* Decorative background overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-orange-50/30 rounded-3xl pointer-events-none"></div>
                    
                    <div className="auth_header text-center mb-8 relative z-10">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <p className="auth_heading text-3xl font-bold text-amber-900 mb-2">New Password</p>
                        <p className="auth_title text-amber-700/80 text-sm">Enter at least 6 characters long password</p>
                    </div>
                    
                    <div className="auth_item mb-6 relative z-10">
                        <label className="block text-sm font-semibold text-amber-700 mb-2">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Input 
                                onChange={passwordChange} 
                                type={showPassword ? "text" : "password"} 
                                placeholder="New password"
                                className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-amber-200/50 rounded-xl focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all duration-200 text-amber-900 placeholder-amber-600/50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-amber-700 focus:outline-none focus:text-amber-700 transition-colors duration-200"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5 text-amber-600/60 hover:text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-amber-600/60 hover:text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    <div className="auth_item mb-8 relative z-10">
                        <label className="block text-sm font-semibold text-amber-700 mb-2">
                            Confirm password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Input 
                                onChange={confirmPasswordChange} 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Confirm Password" 
                                required
                                className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-amber-200/50 rounded-xl focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all duration-200 text-amber-900 placeholder-amber-600/50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-amber-700 focus:outline-none focus:text-amber-700 transition-colors duration-200"
                            >
                                {showConfirmPassword ? (
                                    <svg className="w-5 h-5 text-amber-600/60 hover:text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-amber-600/60 hover:text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    <div className="auth_action mb-6 relative z-10">
                        <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                            <LoadingButton loading={loading} title="Update Password"/>
                        </Button>
                    </div>
                    
                    <div className="text-center relative z-10">
                        <BackToLogin className="inline-flex items-center text-amber-700 hover:text-amber-800 transition-colors duration-200 font-medium text-sm">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to login
                        </BackToLogin>
                    </div>
                </div>
            </form>
        </div>    
  )
}

export default UpdatePassword