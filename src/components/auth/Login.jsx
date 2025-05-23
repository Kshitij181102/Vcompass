import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Link, useNavigate } from "react-router-dom";
import apis from "../../utils/apis";
import toast from "react-hot-toast";
import LoadingButton from "../ui/LoadingButton";
import logo from '../../Assets/logo.png';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailChange = (event) => setEmail(event.target.value);
  const passwordChange = (event) => setPassword(event.target.value);

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(apis().loginUser, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        toast.error(result?.message);
        return;
      }

      if (result?.status && result?.token) {
        toast.success(result.message);
        localStorage.setItem("accessToken", result.token); // FIXED: use lowercase `token`
        localStorage.setItem("disId", result.disId);
        navigate("/main");
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth_main">
      <form onSubmit={submitHandler}>
        <div className="auth_conatiner">
          <div className="auth_header">
            <img src={logo} alt="Company Logo" style={{ maxWidth: "150px", height: "auto", marginBottom: "10px" }} />
            <p className="auth_heading text-yellow-900">Welcome back</p>
            <p className="auth_title text-yellow-900">Login to continue</p>
          </div>
          <br />
          <div className="auth_item">
            <label className="text-yellow-900">
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <Input onChange={emailChange} type="email" required placeholder="Enter your email" />
          </div>
          <div className="auth_item text-yellow-900 relative">
            <label>
              Password <span style={{ color: "red" }}>*</span>
            </label>
            <div className="relative">
              <Input
                onChange={passwordChange}
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <br />
          <div className="auth_action">
            <Button>
              <LoadingButton loading={loading} title="Login" />
            </Button>
          </div>
          <div className="auth_options">
            <Link to="/register" className="nike text-yellow-900">Create new account?</Link>
            <Link to="/forget/password" className="nike text-yellow-900">Forgot your password</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
