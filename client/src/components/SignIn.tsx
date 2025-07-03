import { useState } from 'react';
import './SignIn.css';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface SignInProps {
  onLogin: (user: any) => void;
}

export default function SignIn({ onLogin }: SignInProps) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const navigate = useNavigate();
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignIn = async () => {
  setError('');
  setInfo('');
  if (!email || !validateEmail(email)) return setError('Please enter a valid email.');
  if (!otp.trim()) return setError('Please enter the OTP.');

  try {
    const response = await axios.post('/auth/signin/verify-otp', { email, otp });
    const { token, name, email: userEmail } = response.data;
    if (token && name) {
      if (keepLoggedIn) {
        localStorage.setItem('token', token);
        localStorage.setItem('email', userEmail);
        localStorage.setItem('name', name);
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('email', userEmail);
        sessionStorage.setItem('name', name);
      }
      onLogin({ email: userEmail, name, token });
      navigate('/signin');
    } else {
      setError('No token or name received.');
    }
  } catch (err) {
    console.error(err);
    setError('Sign in failed. OTP invalid or expired.');
  }
};

  const handleResendOtp = async () => {
    setError('');
    setInfo('');
    if (!email || !validateEmail(email)) return setError('Please enter a valid email to resend OTP.');
    try {
      await axios.post('/auth/signin/request-otp', { email });
      setInfo('A new OTP has been sent to your email.');
    } catch (err) {
      console.error(err);
      setError('Failed to resend OTP, User is not registered.');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="auth-container">
        <div className="form-section">
          <div className="brand-logo">
            <img src="/icon.png" alt="HD Logo" className="logo-icon" />
            <span className="logo-text">HD</span>
          </div>

          <h1 className="title">Sign in</h1>
          <p className="subtitle">Please login to continue to your account.</p>

          {error && <div className="error-text">{error}</div>}
          {info && <div className="info-text">{info}</div>}

          <input
            className="input-field"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input-field"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            type="button"
            className="link-text"
            style={{ background: 'none', border: 'none', padding: 0, color: '#007bff', cursor: 'pointer' }}
            onClick={handleResendOtp}
          >
            Resend OTP
          </button>
          <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
  <input
    type="checkbox"
    id="keepLoggedIn"
    checked={keepLoggedIn}
    onChange={() => setKeepLoggedIn(!keepLoggedIn)}
    style={{ marginRight: '0.5rem' }}
  />
  <label htmlFor="keepLoggedIn" style={{ fontSize: '1rem', cursor: 'pointer' }}>
    Keep me logged in
  </label>
</div>
          <button className="primary-btn" onClick={handleSignIn}>
            Sign in
          </button>
          <p className="switch-text">
            Need an account? <a href="/">Create one</a>
          </p>
        </div>
        <div className="image-section">
          <img src="/bg.png" alt="background" className="bg-image" />
        </div>
      </div>
    </div>
  );
}