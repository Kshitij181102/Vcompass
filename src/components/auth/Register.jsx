import React, { useState } from "react";
import {
  Eye, EyeOff, User, Mail, Lock, MessageSquare,
  ArrowRight, CheckCircle, ArrowLeft, GraduationCap, Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from "../../Assets/logo.png";
import Input from "../ui/Input";
import LoadingButton from "../ui/LoadingButton";
import Button from "../ui/Button";
import apis from "../../utils/apis";
import toast from "react-hot-toast";
import "./Register.css";

const STEPS = ["Account", "Profile", "Done"];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep]     = useState(0);
  const [role, setRole]     = useState(''); // '' | 'student' | 'mentor'
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [password, setPassword] = useState("");
  const [disId, setDisId]   = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (chosen) => {
    setRole(chosen);
    if (chosen === 'mentor') navigate('/mentor/register');
  };

  const goNext = (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in email and password."); return; }
    setStep(1);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!name || !email || !password || !disId) { toast.error("Please fill in all fields."); return; }
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
        setStep(2);
        setTimeout(() => navigate("/login"), 2200);
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="vc-reg">
      <div className="vc-reg__mesh" />

      <header className="vc-reg__topbar">
        <a href="/main" className="vc-reg__brand">
          <div className="vc-reg__logo-ring">
            <img src={logo} alt="V-Compass" />
          </div>
          <span className="vc-reg__brand-name">V-Compass</span>
        </a>
        <button className="vc-reg__signin-btn" onClick={() => navigate('/login')}>
          <ArrowLeft size={14} strokeWidth={2.5} />
          Sign In
        </button>
      </header>

      <main className="vc-reg__main">
        {/* Info col */}
        <div className="vc-reg__info">
          <div className="vc-reg__badge">✦ Start for free</div>
          <h1 className="vc-reg__headline">
            Your compass<br />to <em>greatness</em>.
          </h1>
          <p className="vc-reg__body">
            Join thousands of learners who found clarity, direction, and momentum with V-Compass mentorship.
          </p>
          <div className="vc-reg__features">
            {[
              "Verified expert mentors across 50+ fields",
              "1-on-1 personalized sessions",
              "Track goals and milestones",
              "Community & peer learning",
            ].map((f, i) => (
              <div className="vc-reg__feature" key={i}>
                <span className="vc-reg__feature-dot" />{f}
              </div>
            ))}
          </div>
          <div className="vc-reg__avatars">
            {["RK", "SM", "PJ", "AL", "KD"].map((a, i) => (
              <div className="vc-reg__avatar-chip" key={i} style={{ zIndex: 5 - i }}>{a}</div>
            ))}
            <span className="vc-reg__avatars-text">+2,400 mentors waiting</span>
          </div>
        </div>

        {/* Form col */}
        <div className="vc-reg__form-col">

          {/* ── Role selector ── */}
          {step === 0 && role === '' ? (
            <div className="vc-reg__card" style={{ maxWidth: 420 }}>
              <h2 className="vc-reg__form-title" style={{ textAlign: 'center', marginBottom: 6 }}>
                Join V-Compass
              </h2>
              <p className="vc-reg__form-sub" style={{ textAlign: 'center', marginBottom: 28 }}>
                How would you like to join?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Student card */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('student')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px', borderRadius: 14,
                    border: '2px solid #e2e8f0', background: '#fff',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(245,158,11,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Users size={22} color="#2563eb" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1e293b', fontSize: 15, margin: 0 }}>I'm a Student</p>
                    <p style={{ color: '#64748b', fontSize: 13, margin: '2px 0 0' }}>Looking for mentorship and guidance</p>
                  </div>
                  <ArrowRight size={18} color="#94a3b8" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                </button>

                {/* Mentor card */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('mentor')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px', borderRadius: 14,
                    border: '2px solid #e2e8f0', background: '#fff',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(245,158,11,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#fef3c7,#fde68a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <GraduationCap size={22} color="#d97706" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1e293b', fontSize: 15, margin: 0 }}>I'm a Mentor</p>
                    <p style={{ color: '#64748b', fontSize: 13, margin: '2px 0 0' }}>Want to guide and support students</p>
                  </div>
                  <ArrowRight size={18} color="#94a3b8" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                </button>
              </div>

              <p className="vc-reg__terms" style={{ marginTop: 24, textAlign: 'center' }}>
                Already have an account?{' '}
                <span onClick={() => navigate('/login')} style={{ color: '#f59e0b', cursor: 'pointer', fontWeight: 600 }}>
                  Sign in
                </span>
              </p>
            </div>

          ) : (
            <>
              {/* Step progress bar */}
              <div className="vc-reg__steps">
                {STEPS.map((s, i) => (
                  <React.Fragment key={i}>
                    <div className={`vc-reg__step${i <= step ? ' vc-reg__step--active' : ''}${i < step ? ' vc-reg__step--done' : ''}`}>
                      <div className="vc-reg__step-circle">
                        {i < step ? <CheckCircle size={15} /> : <span>{i + 1}</span>}
                      </div>
                      <span className="vc-reg__step-label">{s}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`vc-reg__step-line${i < step ? ' vc-reg__step-line--done' : ''}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="vc-reg__card">
                {/* Step 0 — credentials */}
                {step === 0 && (
                  <form onSubmit={goNext} className="vc-reg__form">
                    <div>
                      <h2 className="vc-reg__form-title">Create account</h2>
                      <p className="vc-reg__form-sub">Start with your login credentials</p>
                    </div>
                    <div className="vc-reg__field">
                      <label className="vc-reg__label">Email Address</label>
                      <div className="vc-reg__input-wrap">
                        <Mail size={16} className="vc-reg__input-icon" />
                        <Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
                      </div>
                    </div>
                    <div className="vc-reg__field">
                      <label className="vc-reg__label">Password</label>
                      <div className="vc-reg__input-wrap">
                        <Lock size={16} className="vc-reg__input-icon" />
                        <Input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="Create a strong password" required />
                        <button type="button" className="vc-reg__eye" onClick={() => setShowPassword(p => !p)} tabIndex={-1}>
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <p className="vc-reg__hint">Use 8+ characters with letters and numbers</p>
                    </div>
                    <Button type="submit">Continue <ArrowRight size={16} /></Button>
                    <button type="button" className="vc-reg__back-btn" onClick={() => setRole('')} style={{ marginTop: 8 }}>
                      <ArrowLeft size={15} /> Change role
                    </button>
                  </form>
                )}

                {/* Step 1 — profile */}
                {step === 1 && (
                  <form onSubmit={submitHandler} className="vc-reg__form">
                    <div>
                      <h2 className="vc-reg__form-title">Your profile</h2>
                      <p className="vc-reg__form-sub">Tell us a little about yourself</p>
                    </div>
                    <div className="vc-reg__field">
                      <label className="vc-reg__label">Full Name</label>
                      <div className="vc-reg__input-wrap">
                        <User size={16} className="vc-reg__input-icon" />
                        <Input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Your full name" required />
                      </div>
                    </div>
                    <div className="vc-reg__field">
                      <label className="vc-reg__label">Discord ID</label>
                      <div className="vc-reg__input-wrap">
                        <MessageSquare size={16} className="vc-reg__input-icon" />
                        <Input value={disId} onChange={e => setDisId(e.target.value)} type="text" placeholder="e.g. username#1234" required />
                      </div>
                      <p className="vc-reg__hint">Used to connect you with your mentor on Discord</p>
                    </div>
                    <div className="vc-reg__form-actions">
                      <button type="button" className="vc-reg__back-btn" onClick={() => setStep(0)}>
                        <ArrowLeft size={15} /> Back
                      </button>
                      <div className="vc-reg__submit-wrap">
                        <Button type="submit">
                          <LoadingButton loading={loading} title="Create Account" />
                          {!loading && <ArrowRight size={16} />}
                        </Button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Step 2 — success */}
                {step === 2 && (
                  <div className="vc-reg__success">
                    <div className="vc-reg__success-icon">
                      <CheckCircle size={42} strokeWidth={1.5} />
                    </div>
                    <h2 className="vc-reg__success-title">You're in!</h2>
                    <p className="vc-reg__success-body">
                      Your account has been created. Redirecting to sign in…
                    </p>
                    <div className="vc-reg__success-bar">
                      <div className="vc-reg__success-progress" />
                    </div>
                  </div>
                )}
              </div>

              <p className="vc-reg__terms">
                By registering, you agree to our{" "}
                <a href="/terms">Terms of Service</a> and{" "}
                <a href="/privacy">Privacy Policy</a>.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Register;
