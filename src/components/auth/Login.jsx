import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Link, useNavigate } from "react-router-dom";
import apis from "../../utils/apis";
import toast from "react-hot-toast";
import LoadingButton from "../ui/LoadingButton";
import logo from "../../Assets/logo.png";
import { Eye, EyeOff } from "lucide-react";

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
        localStorage.setItem("accessToken", result.token);
        localStorage.setItem("disId", result.disId);
        navigate("/main");
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blurred gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-orange-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-yellow-200/30 to-amber-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-200/10 to-amber-200/10 rounded-full blur-3xl"></div>
      </div>

      <form onSubmit={submitHandler} className="w-full max-w-md z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          <div className="text-center mb-8 relative z-10">
  <div className="flex justify-center mb-3">
    <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
  </div>
  <h1 className="text-3xl font-bold text-amber-900 mb-2">Welcome Back</h1>
  <p className="text-amber-700/80 text-sm font-medium">Login to continue</p>
</div>


          {/* Email field */}
          <div className="mb-6 relative z-10">
            <label className="block text-sm font-semibold text-amber-900 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              onChange={emailChange}
              type="email"
              required
              placeholder="Enter your email"
              value={email}
            />
          </div>

          {/* Password field */}
          <div className="mb-6 relative z-10">
            <label className="block text-sm font-semibold text-amber-900 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                onChange={passwordChange}
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600/60 hover:text-amber-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="relative z-10 mt-6">
            <Button>
              <LoadingButton loading={loading} title="Login" />
            </Button>
          </div>

          {/* Links */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between text-sm relative z-10">
            <Link
              to="/register"
              className="text-amber-700 hover:text-amber-800 font-medium hover:underline"
            >
              Create new account?
            </Link>
            <Link
              to="/forget/password"
              className="text-amber-700 hover:text-amber-800 font-medium hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Terms */}
          <p className="text-center mt-6 text-xs text-amber-700/60">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
