import React, { useEffect } from "react";
import Button from "../ui/Button";
import BackToLogin from "../ui/BackToLogin";
import { useRef } from 'react';
import { useState } from "react";
import Timer from "./Timer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apis from "../../utils/apis";
import LoadingButton from "../ui/LoadingButton";
const VerifyOtp = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const navigate = useNavigate();
  const inputRef = [ref1, ref2, ref3, ref4, ref5, ref6];
  const [loading, setLoading] = useState("");
  const [otpTime, setOtpTime] = useState(null);
  const [isexpire, setIsExpire] = useState(false);
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [otp5, setOtp5] = useState("");
  const [otp6, setOtp6] = useState("");

  const otpArray = [setOtp1, setOtp2, setOtp3, setOtp4, setOtp5, setOtp6];

  useEffect(() => {
    if (ref1.current) {
      ref1.current.focus();
    }
  }, []);

  const inputChange = (event, location) => {
    if (event.target.value.length > 1) {
      event.target.value = event.target.value.slice(0, 1);
    }
    otpArray[location](event.target.value);

    if (location < 5 && event.target.value) {
      inputRef[location + 1].current.focus();
    }
  };

  const handleKeyDown = (event, location) => {
    if (event.key === "Backspace") {
      if (!event.target.value && location > 0) {
        inputRef[location - 1].current.focus();
        otpArray[location - 1]("");
      } else {
        otpArray[location]("");
      }
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const finalOtp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
    try {
      setLoading(true);
      const response = await fetch(apis().otpVerify, {
        method: "POST",
        body: JSON.stringify({ otp: finalOtp }),
        headers: { "Content-Type": "application/json" },
      });
      setLoading(false);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message);
      }
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
          method: "POST",
          body: JSON.stringify({ token: localStorage.getItem("passToken") }),
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result?.message);
        }
        if (result?.status) {
          const remaingTime = new Date(result?.sendTime).getTime() - new Date().getTime();
          if (remaingTime > 0) {
            setOtpTime(remaingTime);
          } else {
            setIsExpire(true);
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    getTime();
  }, []);

  const resendHandler = async () => {
    try {
      const response = await fetch(apis().forgetPassword, {
        method: "POST",
        body: JSON.stringify({ email: localStorage.getItem("email") }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message);
      }
      if (result?.status) {
        toast.success(result?.message);
        localStorage.setItem("passToken", result?.token);
        setOtpTime(1 * 60 * 1000);
        setIsExpire(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="auth_main">
      <form onSubmit={submitHandler}>
        <div className="auth_header">
          <p className="auth_heading text-yellow-950">Verify the OTP</p>
          <p className="auth_title text-yellow-950">Enter the OTP sent to your email address</p>
        </div>
        <div className="auth_item">
          <label className="text-yellow-950">OTP *</label>
          <div className="otp_input_container">
            {inputRef.map((item, index) => {
              return (
                <input
                  required
                  ref={item}
                  onChange={(event) => inputChange(event, index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  type="number"
                  key={index}
                  className="ui_input otp_input border-yellow-950"
                />
              );
            })}
          </div>
        </div>
        <div className="auth_action">
          <Button>
            <LoadingButton loading={loading} title="Verify" />
          </Button>
        </div>
        {otpTime !== null && !isexpire ? (
          <Timer setIsExpire={setIsExpire} time={otpTime} />
        ) : (
          <span onClick={resendHandler} className="otp_resend_action" style={{ color: "brown" }}>
            Resend
          </span>
        )}
        <BackToLogin />
      </form>
    </div>
  );
};

export default VerifyOtp;
