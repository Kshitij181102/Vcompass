import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import BackToLogin from "../ui/BackToLogin";
import { useNavigate } from "react-router-dom";
import apis from "../../utils/apis";
import toast from "react-hot-toast";
import LoadingButton from "../ui/LoadingButton"
const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading,setLoading] = useState("");
  const navigate = useNavigate();
  const emailChanger = (event) => {
    setEmail(event.target.value);
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(apis().forgetPassword,{
        method: 'POST',
        body:JSON.stringify({email}),
        headers: {'Content-Type': 'application/json'}
      })
      const result = await response.json();
      setLoading(false);
      if(!response.ok) {
        throw new Error(result?.message)
      }
      if(result?.status) {
        toast.success(result?.message)
        console.log(result);
        localStorage.setItem("passToken",result?.token);
        localStorage.setItem("email",email);
        navigate('/otp/verify');
      }
    } catch (error) {
      toast.error(error.message)
    }
    //
  };
  return (
    <div className="auth_main">
      <form onSubmit={submitHandler}>
        <div className="auth_container">
          <div className="auth_header">
            <p className="auth_heading text-yellow-900">Forgot your password</p>
            <p className="auth_title text-yellow-900">
              Enter your registered Email for 6 digit otp
            </p>
          </div>
          <div className="auth_item">
            <label className="text-yellow-900 ">Email</label>
            <Input
              onChange={emailChanger}
              placeholder="enter your email"
              type="email"
              required
            />
          </div>
          <div className="auth_action">
            <Button>
              
            <LoadingButton loading={loading} title="Send OTP"/>
            </Button>
          </div>
          
          <div>
            <BackToLogin />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgetPassword;
