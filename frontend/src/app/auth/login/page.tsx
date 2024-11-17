'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Xử lý đăng nhập thông qua form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
        email,
        password,
      });

      // Lưu token vào cookie
      document.cookie = `token=${response.data.token}; path=/; secure; SameSite=None`;

      // Chuyển hướng đến trang bảo vệ
      router.push('/');
    } catch (err) {
      setError('Login failed');
    }
  };

  // Xử lý đăng nhập thông qua Google OAuth
  const handleGoogleLogin = async (response: any) => {
    try {
      const token = response.credential;  // Lấy token Google OAuth

      // Gửi yêu cầu GET đến backend với token
      const res = await axios.get(`${process.env.GOOGLE_CALLBACK_URL}`, {
        params: { token },  // Truyền token qua query parameter
      });

      // Lưu token vào cookie
      document.cookie = `token=${res.data.token}; path=/; secure; SameSite=None`;

      // Chuyển hướng đến trang bảo vệ
      router.push('/');
    } catch (err) {
      setError('Google login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-black">Login</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Log In
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          <a href="/auth/forgot-password" className="hover:underline">Forgot Password?</a>
        </div>

        <div className="text-center text-sm text-gray-600">
          Dont have an account?{" "}
          <a href="/auth/signup" className="text-blue-600 hover:underline">Sign Up</a>
        </div>

        {/* Nút Login với Google */}
        <div className="flex justify-center mt-4">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError('Google Login failed')}
            useOneTap
            theme="filled_blue"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
