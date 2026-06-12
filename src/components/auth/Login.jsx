import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Link, useNavigate } from "react-router-dom";
import apis from "../../utils/apis";
import toast from "react-hot-toast";
import LoadingButton from "../ui/LoadingButton";
import logo from "../../Assets/logo.png";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import "./Login.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(apis().loginUser, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await response.json();
      setLoading(false);
      if (!response.ok) { toast.error(result?.message || "Login failed"); return; }
      if (result?.status) {
        toast.success(result.message || "Login successful");
        sessionStorage.setItem("disId", result.disId);
        // Redirect based on role
        if (result.role === 'admin')  navigate('/admin');
        else if (result.role === 'mentor') navigate('/mentor');
        else navigate('/main');
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="vc-login">
      {/* ── Left ── */}
      <div className="vc-login__left">
        <div className="vc-login__left-content">
          <div className="vc-login__brand">
            <div className="vc-login__logo-box">
              <img src={logo} alt="V-Compass" className="vc-login__logo-img" />
            </div>
            <span className="vc-login__brand-name">V-Compass</span>
          </div>

          <h1 className="vc-login__headline">
            Navigate<br />Your <em>Future.</em>
          </h1>
          <p className="vc-login__subheadline">
            Connect with world-class mentors who guide you toward the career and life you envision.
          </p>

          <div className="vc-login__stats">
            <div>
              <span className="vc-login__stat-num">2.4k+</span>
              <span className="vc-login__stat-label">Mentors</span>
            </div>
            <div className="vc-login__stat-sep" />
            <div>
              <span className="vc-login__stat-num">18k+</span>
              <span className="vc-login__stat-label">Sessions</span>
            </div>
            <div className="vc-login__stat-sep" />
            <div>
              <span className="vc-login__stat-num">96%</span>
              <span className="vc-login__stat-label">Satisfaction</span>
            </div>
          </div>

          <div className="vc-login__testimonial">
            <p className="vc-login__quote">
              V-Compass changed the trajectory of my career within 3 months.
            </p>
            <div className="vc-login__author">
              <div className="vc-login__avatar">AK</div>
              <div>
                <span className="vc-login__author-name">Arjun Kumar</span>
                <span className="vc-login__author-role">Software Engineer @ Google</span>
              </div>
            </div>
          </div>
        </div>

        <div className="vc-login__orb vc-login__orb--a" />
        <div className="vc-login__orb vc-login__orb--b" />
        <div className="vc-login__orb vc-login__orb--c" />
      </div>

      {/* ── Right ── */}
      <div className="vc-login__right">
        <div className="vc-login__form-wrap">
          <div>
            <h2 className="vc-login__form-title">Welcome back</h2>
            <p className="vc-login__form-sub">Sign in to continue your journey</p>
          </div>

          <form onSubmit={submitHandler} className="vc-login__form">
            <div className="vc-login__field">
              <label className="vc-login__label">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="vc-login__field">
              <label className="vc-login__label">Password</label>
              <div className="vc-login__pw-wrap">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="vc-login__eye"
                  onClick={() => setShowPassword(p => !p)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="vc-login__forgot-row">
              <Link to="/forget/password" className="vc-login__forgot">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" disabled={loading}>
              <LoadingButton loading={loading} title="Sign In" />
              {!loading && <ArrowRight size={17} />}
            </Button>
          </form>

          <p className="vc-login__register">
            Don't have an account?{" "}
            <Link to="/register" className="vc-login__register-link">
              Create one free
            </Link>
          </p>

          <p className="vc-login__terms">
            By signing in you agree to our{" "}
            <a href="/terms">Terms</a> and{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
