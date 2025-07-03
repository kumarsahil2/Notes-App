import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Notes from './components/Notes';

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
  const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
  const token = storage.getItem('token');
  const email = storage.getItem('email');
  const name = storage.getItem('name');
  if (token && email && name) setUser({ email, name, token });
}, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    // Save user info in localStorage for persistence
    localStorage.setItem('token', userData.token);
    localStorage.setItem('email', userData.email);
    localStorage.setItem('name', userData.name);
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route
          path="/signin"
          element={
            user ? (
              <Notes user={user} onSignOut={handleSignOut} />
            ) : (
              <SignIn onLogin={handleLogin} />
            )
          }
        />
      </Routes>
    </Router>
  );
}