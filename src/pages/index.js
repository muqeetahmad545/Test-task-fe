// app/login/page.js
'use client';
import React, { useState } from 'react';
import '../../styles/index.css';
import { useRouter } from 'next/router';
import { loginUser } from '../../api/user';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // To handle loading state after form submission
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    setLoading(true); // Show loading spinner
    if (!email || !password) {
      setError('Please fill in both fields.');
      setLoading(false);
      return;
    }

    try {
      const data = await loginUser(email, password);
      console.log('Logged in successfully:', data);
      router.push('/cars');
    } catch (error) {
      setError(error.message); // Set error message if login fails
    } finally {
      setLoading(false); // Stop loading spinner
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-page">
      <h1>Login</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
