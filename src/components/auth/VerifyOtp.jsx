import React, { useEffect, useRef, useState } from "react";
import Button from "../ui/Button";
import BackToLogin from "../ui/BackToLogin";
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

  const navigate = useNavigate();
  const otpArray = [setOtp1, setOtp2, setOtp3, setOtp4, setOtp5, setOtp6];

  useEffect(() => {
    if (ref1.current) ref1.current.focus();
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
          const remaingTime =
            new Date(result?.sendTime).getTime() - new Date().getTime();
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-orange-300/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-yellow-200/30 to-amber-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-orange-200/10 to-amber-200/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <form
        onSubmit={submitHandler}
        className="w-full max-w-md z-10 bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-amber-900 mb-2">
            Verify the OTP
          </h2>
          <p className="text-sm text-amber-700/80">
            Enter the 6-digit OTP sent to your email
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-amber-900 mb-1">
            OTP <span className="text-red-500">*</span>
          </label>
          <div className="flex justify-between gap-2">
            {[ref1, ref2, ref3, ref4, ref5, ref6].map((ref, index) => (
              <input
                key={index}
                ref={ref}
                type="number"
                required
                onChange={(e) => inputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-12 text-center text-lg font-semibold text-amber-900 border border-amber-200/50 rounded-md focus:ring-amber-400/20 focus:outline-none bg-white/70"
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Button>
            <LoadingButton loading={loading} title="Verify" />
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-amber-700/80">
          {otpTime !== null && !isexpire ? (
            <Timer setIsExpire={setIsExpire} time={otpTime} />
          ) : (
            <span
              onClick={resendHandler}
              className="cursor-pointer font-medium hover:underline text-amber-700 hover:text-amber-800"
            >
              Resend OTP
            </span>
          )}
        </div>

        <div className="mt-6">
          <BackToLogin />
        </div>
      </form>
    </div>
  );
};

export default VerifyOtp;
