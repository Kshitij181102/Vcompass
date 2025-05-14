import React, { useState } from "react";
import "./auth.css";
import Button from "../ui/Button";
import Input from "../ui/Input";
import BackToLogin from "../ui/BackToLogin";
import apis from "../../utils/apis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../ui/LoadingButton";
import logo from '../../Assets/logo.png';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disId, setDisId] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!name || !email || !password || !disId) {
      toast.error("Please fill in all the fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(apis().registerUser, {
        method: "POST",
        body: JSON.stringify({ name, email, password, disId }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) throw new Error(result?.message);
      if (result?.status) {
        toast.success(result?.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="auth_main">
      <form onSubmit={submitHandler}>
        <div className="auth_container">
          <div className="auth_header">
            <img src={logo} alt="Company Logo" className="logo" />
            <p className="auth_heading text-yellow-900">Welcome to Vcompass</p>
            <p className="auth_title text-yellow-900">Create a New Account</p>
          </div>

          <div className="form_fields_container">
            <div className="auth_item">
              <label>
                Name <span style={{ color: "red" }}>*</span>
              </label>
              <Input
                onChange={(e) => setName(e.target.value)}
                type="text"
                value={name}
                placeholder="Enter your name"
              />
            </div>

            <div className="auth_item">
              <label>
                Discord Id <span style={{ color: "red" }}>*</span>
              </label>
              <Input
                onChange={(e) => setDisId(e.target.value)}
                type="text"
                value={disId}
                placeholder="Enter your Discord Id"
              />
            </div>

            <div className="auth_item">
              <label>
                Email <span style={{ color: "red" }}>*</span>
              </label>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                value={email}
                placeholder="Enter your Email"
              />
            </div>

            <div className="auth_item">
              <label>
                Password <span style={{ color: "red" }}>*</span>
              </label>
              <div className="relative">
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  value={password}
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
          </div>

          <div className="auth_action">
            <Button>
              <LoadingButton loading={loading} title="Register" />
            </Button>
          </div>

          <div className="auth_footer">
            <BackToLogin />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
