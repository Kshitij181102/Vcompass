import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import BackToLogin from "../ui/BackToLogin";
import { useNavigate } from "react-router-dom";
import apis from "../../utils/apis";
import toast from "react-hot-toast";
import LoadingButton from "../ui/LoadingButton";
import { Mail } from "lucide-react";
import "./auth.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(apis().forgetPassword, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await response.json();
      setLoading(false);
      if (!response.ok) throw new Error(result?.message);
      if (result?.status) {
        toast.success(result?.message);
        sessionStorage.setItem("resetEmail", email);
        navigate("/otp/verify");
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="vc-auth-page">
      <div className="vc-auth-page__orb vc-auth-page__orb--1" />
      <div className="vc-auth-page__orb vc-auth-page__orb--2" />
      <div className="vc-auth-page__orb vc-auth-page__orb--3" />

      <form onSubmit={submitHandler} className="vc-auth-card" autoComplete="off">
        <div className="vc-auth-header">
          <div className="vc-auth-icon-ring">
            <Mail size={28} strokeWidth={1.8} />
          </div>
          <h1 className="vc-auth-title">Forgot password?</h1>
          <p className="vc-auth-subtitle">
            Enter your registered email — we'll send a 6-digit OTP.
          </p>
        </div>

        <div className="vc-auth-fields">
          <div className="vc-auth-field">
            <label className="vc-auth-label">
              Email Address <span>*</span>
            </label>
            <Input
              onChange={e => setEmail(e.target.value)}
              type="email"
              value={email}
              required
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="vc-auth-actions">
          <Button type="submit" disabled={loading}>
            <LoadingButton loading={loading} title="Send OTP" />
          </Button>
          <div className="vc-auth-footer-row">
            <BackToLogin />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgetPassword;
