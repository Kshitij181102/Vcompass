import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, MessageSquare, ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from "../../Assets/logo.png"
import Input from "../ui/Input";
import LoadingButton from "../ui/LoadingButton";
import BackToLogin from "../ui/BackToLogin";
import Button from "../ui/Button";
// UI Components



// API route
const apis = () => ({
  registerUser: '/api/register'
});

// Toast mock (use real toast library in production)
const toast = {
  error: (msg) => alert("❌ " + msg),
  success: (msg) => alert("✅ " + msg)
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disId, setDisId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

      if (!response.ok) throw new Error(result?.message || "Registration failed");
      if (result?.status) {
        toast.success(result?.message || "Account created!");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/20 to-orange-300/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-yellow-200/20 to-amber-300/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-200/10 to-amber-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-white/90 rounded-2xl p-3 shadow-lg">
                    <img src={logo} alt="Vcompass Logo" className="w-12 h-12 object-contain" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-amber-900">Vcompass</h1>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-amber-900 leading-tight">
                  Join the Future of Online Mentorship
                </h2>
                <p className="text-lg text-amber-700/80 leading-relaxed">
                  Connect with experienced mentors, enhance your learning journey, and track your progress with Vcompass — your trusted academic mentoring companion.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-amber-800 font-medium">Guidance from verified mentors</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-amber-800 font-medium">Personalized learning plans</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-amber-800 font-medium">Track your mentorship progress</span>
              </div>
            </div>
          </div>

          {/* Right side - Registration Form */}
          {/* Mobile Header Intro Section */}
<div className="lg:hidden text-center space-y-4 mb-6">
  <div className="mb-4 flex justify-center">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur opacity-20"></div>
      <div className="relative bg-white/90 rounded-2xl p-3 shadow-lg">
        <img 
          src={logo} 
          alt="Vcompass Logo" 
          className="w-14 h-14 object-contain"
        />
      </div>
    </div>
  </div>
  <h2 className="text-2xl font-bold text-amber-900">
    Create Your Vcompass Account
  </h2>
  <p className="text-sm text-amber-700/80 px-4">
    Connect with mentors and track your learning journey with our online mentoring system.
  </p>
</div>
          <form onSubmit={submitHandler} className="w-full space-y-8">
            
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative overflow-hidden">
              <div className="hidden lg:block text-center mb-8 relative z-10">
                  <h2 className="text-2xl font-bold text-amber-900 mb-2">Create Your Account</h2>
                  <p className="text-amber-700/80">Fill in your details to get started</p>
                </div>
              <div className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-amber-900">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-amber-600/60" />
                      </div>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Enter your name"
                        className="pl-12 pr-4 py-3.5 text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-amber-900">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-amber-600/60" />
                      </div>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter your email"
                        className="pl-12 pr-4 py-3.5 text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Discord ID */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-amber-900">
                      Discord ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MessageSquare className="h-5 w-5 text-amber-600/60" />
                      </div>
                      <Input
                        value={disId}
                        onChange={(e) => setDisId(e.target.value)}
                        type="text"
                        placeholder="Your Discord ID"
                        className="pl-12 pr-4 py-3.5 text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-amber-900">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-amber-600/60" />
                      </div>
                      <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-12 pr-12 py-3.5 text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-amber-600/60"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button type="submit" className="w-full flex items-center justify-center py-4" disabled={loading}>
                    <LoadingButton loading={loading} title="Create Account" />
                    {!loading && <ArrowRight className="h-5 w-5 ml-2" />}
                  </Button>
                </div>

                <div className="mt-6">
                  <BackToLogin />
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-amber-700/70">
              By registering, you agree to our Terms & Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
