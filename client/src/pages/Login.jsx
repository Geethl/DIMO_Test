import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLoginLib from 'react-facebook-login/dist/facebook-login-render-props';
import { setCredentials } from '../features/auth/authSlice';
import api from '../services/api';

const FacebookLogin = FacebookLoginLib.default || FacebookLoginLib;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(setCredentials(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await api.post('/auth/google', { token: credentialResponse.credential });
      dispatch(setCredentials(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Google Login Failed');
    }
  };

  const handleFacebookResponse = async (response) => {
    if (response.error || response.status === 'unknown') return setError('Facebook Login Canceled');
    try {
      const { data } = await api.post('/auth/facebook', { accessToken: response.accessToken, userID: response.userID });
      dispatch(setCredentials(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Facebook Login Failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="bg-dimo-blue p-8 text-center">
          <h2 className="text-3xl font-black text-white">Welcome Back</h2>
          <p className="text-blue-100 mt-2">Sign in to your DIMO account</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-dimo-red rounded-xl flex items-center space-x-2">
              <AlertCircle size={20} />
              <span className="font-medium text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dimo-blue outline-none transition-colors" 
                  placeholder="name@company.com" 
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs font-medium text-dimo-blue hover:text-blue-800">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dimo-blue outline-none transition-colors" 
                  placeholder="••••••••" 
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-dimo-blue hover:bg-blue-800 text-white font-bold rounded-xl flex justify-center items-center space-x-2 transition-colors disabled:opacity-70 shadow-lg shadow-blue-900/20"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              {!loading && <LogIn size={20} />}
            </button>
          </form>

          <div className="mt-8 relative flex items-center justify-center">
            <div className="absolute inset-x-0 h-px bg-gray-200"></div>
            <span className="relative bg-white px-4 text-sm text-gray-500 font-medium">Or continue with</span>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login Failed')}
                theme="outline"
                size="large"
                width="100%"
                text="signin_with"
                shape="rectangular"
              />
            </div>

            <FacebookLogin
              appId={import.meta.env.VITE_FACEBOOK_CLIENT_ID || '123456789'}
              fields="name,email,picture"
              callback={handleFacebookResponse}
              render={renderProps => (
                <button 
                  onClick={renderProps.onClick}
                  type="button"
                  className="w-full flex items-center justify-center space-x-3 py-2 border border-gray-300 rounded-[4px] hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="w-5 h-5 max-w-full" />
                  <span className="text-[14px]">Sign in with Facebook</span>
                </button>
              )}
            />
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            Don't have an account? <Link to="/signup" className="text-dimo-red font-bold hover:underline">Sign up now</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
