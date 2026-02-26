import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../hooks/auth';
import { useNavigate, Link } from 'react-router-dom';
import React from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/login', { email, password });
      login(res.data);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 font-sans">
      <div className="w-full max-w-md p-10 bg-gray-900/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">Secure Task Management</h1>
          <p className="text-gray-300 mt-2">Login to access your tasks securely</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-5 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-5 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
          />

          <button
            type="submit"
            className="w-full py-3 font-semibold rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 text-white shadow-lg shadow-pink-500/50 hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300">
          No account?{' '}
          <Link className="text-pink-400 font-semibold hover:underline" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;