import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import BackToLogin from "../ui/BackToLogin";
import { useNavigate } from "react-router-dom";
import apis from "../../utils/apis";
import toast from "react-hot-toast";
import LoadingButton from "../ui/LoadingButton";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailChanger = (event) => setEmail(event.target.value);

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(apis().forgetPassword, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(result?.message);
      }

      if (result?.status) {
        toast.success(result?.message);
        localStorage.setItem("passToken", result?.token);
        localStorage.setItem("email", email);
        navigate("/otp/verify");
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-orange-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-yellow-200/30 to-amber-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-200/10 to-amber-200/10 rounded-full blur-3xl"></div>
      </div>

      <form
        onSubmit={submitHandler}
        className="w-full max-w-md z-10"
        autoComplete="off"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">
              Forgot your password?
            </h1>
            <p className="text-amber-700/80 text-sm font-medium">
              Enter your registered email to receive a 6-digit OTP.
            </p>
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-amber-900 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              onChange={emailChanger}
              type="email"
              value={email}
              required
              placeholder="Enter your email"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <Button type="submit">
              <LoadingButton loading={loading} title="Send OTP" />
            </Button>
          </div>

          {/* Back to Login */}
          <div className="mt-6">
            <BackToLogin />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgetPassword;
