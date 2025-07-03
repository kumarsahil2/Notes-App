import { useState } from 'react';
import './SignUp.css';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'initial' | 'verify'>('initial');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleGetOtp = async () => {
    setError('');
    if (!name.trim()) return setError('Please enter your name.');
    if (!dob) return setError('Please select your date of birth.');
    if (!email || !validateEmail(email)) return setError('Please enter a valid email.');

    try {
      await axios.post('/auth/signup/request-otp', { username: name, dob, email });
      setStep('verify');
      alert('OTP sent to your email!');
    } catch (err) {
      console.error(err);
      setError('Failed to send OTP.');
    }
  };

  const handleSignUp = async () => {
    setError('');
    if (!otp.trim()) return setError('Please enter the OTP.');

    try {
      await axios.post('/auth/signup/verify-otp', { email, otp });
      alert('Signed up successfully!');
      navigate('/signin');
    } catch (err) {
      console.error(err);
      setError('OTP verification failed.');
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
          <h1 className="title">Sign up</h1>
          <p className="subtitle">Sign up to enjoy the feature of HD</p>

          {error && <div className="error-text">{error}</div>}

          <input
            className="input-field"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input-field"
            placeholder="Date of Birth"
            type="text"
            onFocus={(e) => (e.target.type = 'date')}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <input
            className="input-field"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {step === 'initial' && (
            <button className="primary-btn" onClick={handleGetOtp}>
              Get OTP
            </button>
          )}

          {step === 'verify' && (
            <>
              <input
                className="input-field"
                placeholder="OTP"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button className="primary-btn" onClick={handleSignUp}>
                Sign up
              </button>
            </>
          )}

          <p className="switch-text">
            Already have an account? <a href="/signin">Sign in</a>
          </p>
        </div>
        <div className="image-section">
          <img src="/bg.png" alt="background" className="bg-image" />
        </div>
      </div>
    </div>
  );
}