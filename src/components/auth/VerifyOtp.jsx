import React, { useEffect, useRef, useState } from "react";
import Button from "../ui/Button";
import BackToLogin from "../ui/BackToLogin";
import Timer from "./Timer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apis from "../../utils/apis";
import LoadingButton from "../ui/LoadingButton";
import { ShieldCheck, RotateCcw } from "lucide-react";
import "./auth.css";

const VerifyOtp = () => {
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [loading, setLoading] = useState(false);
  const [otpTime, setOtpTime] = useState(null);
  const [isexpire, setIsExpire] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();

  useEffect(() => { refs[0].current?.focus(); }, []);

  const inputChange = (e, idx) => {
    let val = e.target.value.replace(/\D/, "").slice(-1);
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) refs[idx + 1].current?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (!otp[idx] && idx > 0) {
        refs[idx - 1].current?.focus();
        const next = [...otp];
        next[idx - 1] = "";
        setOtp(next);
      } else {
        const next = [...otp];
        next[idx] = "";
        setOtp(next);
      }
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const finalOtp = otp.join("");
    try {
      setLoading(true);
      const response = await fetch(apis().otpVerify, {
        method: "POST",
        body: JSON.stringify({ otp: finalOtp }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      setLoading(false);
      const result = await response.json();
      if (!response.ok) throw new Error(result?.message);
      if (result?.status) {
        toast.success(result?.message);
        navigate("/password/update");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const getTime = async () => {
      try {
        const response = await fetch(apis().getOtpTime, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result?.message);
        if (result?.status) {
          const remaining = new Date(result?.sendTime).getTime() - Date.now();
          remaining > 0 ? setOtpTime(remaining) : setIsExpire(true);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    getTime();
  }, []);

  const resendHandler = async () => {
    try {
      const email = sessionStorage.getItem("resetEmail");
      const response = await fetch(apis().forgetPassword, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.message);
      if (result?.status) {
        toast.success(result?.message);
        setOtpTime(60 * 1000);
        setIsExpire(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="vc-auth-page">
      <div className="vc-auth-page__orb vc-auth-page__orb--1" />
      <div className="vc-auth-page__orb vc-auth-page__orb--2" />
      <div className="vc-auth-page__orb vc-auth-page__orb--3" />

      <form onSubmit={submitHandler} className="vc-auth-card">
        <div className="vc-auth-header">
          <div className="vc-auth-icon-ring">
            <ShieldCheck size={28} strokeWidth={1.8} />
          </div>
          <h1 className="vc-auth-title">Verify OTP</h1>
          <p className="vc-auth-subtitle">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <div className="vc-auth-fields">
          <div className="vc-auth-field">
            <label className="vc-auth-label">
              One-Time Password <span>*</span>
            </label>
            <div className="vc-otp-grid">
              {refs.map((ref, idx) => (
                <input
                  key={idx}
                  ref={ref}
                  type="number"
                  inputMode="numeric"
                  required
                  value={otp[idx]}
                  onChange={e => inputChange(e, idx)}
                  onKeyDown={e => handleKeyDown(e, idx)}
                  className="vc-otp-input"
                  maxLength={1}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="vc-auth-actions">
          <Button type="submit" disabled={loading}>
            <LoadingButton loading={loading} title="Verify Code" />
          </Button>

          <div className="vc-auth-timer">
            {otpTime !== null && !isexpire ? (
              <Timer setIsExpire={setIsExpire} time={otpTime} />
            ) : (
              <button type="button" className="vc-auth-resend" onClick={resendHandler}>
                <RotateCcw size={14} strokeWidth={2.5} />
                Resend OTP
              </button>
            )}
          </div>

          <div className="vc-auth-footer-row">
            <BackToLogin />
          </div>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtp;
