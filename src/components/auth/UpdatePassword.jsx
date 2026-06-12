import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import BackToLogin from '../ui/BackToLogin';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apis from '../../utils/apis';
import LoadingButton from '../ui/LoadingButton';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import './auth.css';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(apis().updatePassword, {
        method: 'POST',
        body: JSON.stringify({ password, confirmPassword }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const result = await response.json();
      setLoading(false);
      if (!response.ok) throw new Error(result?.message);
      if (result?.status) {
        toast.success(result?.message);
        sessionStorage.removeItem('resetEmail');
        navigate('/login');
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

      <form onSubmit={submitHandler} className="vc-auth-card">
        <div className="vc-auth-header">
          <div className="vc-auth-icon-ring">
            <KeyRound size={28} strokeWidth={1.8} />
          </div>
          <h1 className="vc-auth-title">New Password</h1>
          <p className="vc-auth-subtitle">
            Create a strong password of at least 6 characters
          </p>
        </div>

        <div className="vc-auth-fields">
          <div className="vc-auth-field">
            <label className="vc-auth-label">
              Password <span>*</span>
            </label>
            <div className="vc-auth-pw-wrap">
              <Input
                onChange={e => setPassword(e.target.value)}
                type={showPw ? "text" : "password"}
                placeholder="New password"
              />
              <button
                type="button"
                className="vc-auth-eye"
                onClick={() => setShowPw(p => !p)}
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div className="vc-auth-field">
            <label className="vc-auth-label">
              Confirm Password <span>*</span>
            </label>
            <div className="vc-auth-pw-wrap">
              <Input
                onChange={e => setConfirmPassword(e.target.value)}
                type={showCpw ? "text" : "password"}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                className="vc-auth-eye"
                onClick={() => setShowCpw(p => !p)}
              >
                {showCpw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
        </div>

        <div className="vc-auth-actions">
          <Button type="submit" disabled={loading}>
            <LoadingButton loading={loading} title="Update Password" />
          </Button>
          <div className="vc-auth-footer-row">
            <BackToLogin />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdatePassword;
