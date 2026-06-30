import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Mail, Lock, Loader2, ArrowRight, Landmark, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId && window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          setLoading(true);
          try {
            await loginWithGoogle(response.credential);
            showToast('Logged in with Google successfully!', 'success');
            navigate('/dashboard');
          } catch (err) {
            showToast(err.message || 'Google Login failed', 'error');
          } finally {
            setLoading(false);
          }
        },
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-btn-container'),
        { theme: 'filled_dark', size: 'large', width: '100%', shape: 'pill' }
      );
    }
  }, [loginWithGoogle, navigate, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return showToast('Please fill in all fields', 'warning');
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back to Credo!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoGoogleLogin = async () => {
    setLoading(true);
    try {
      await login('demo@credo.com', 'password123');
      showToast('Welcome to Credo (Demo Session)!', 'success');
      navigate('/dashboard');
    } catch {
      showToast('Demo login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-teal-500/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-2xl text-white relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl shadow-lg shadow-emerald-500/15 mb-3">
            <Landmark className="w-6 h-6 text-slate-950" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-outfit">Welcome back</h2>
          <p className="text-xs text-slate-400 mt-1">Log in to manage your money with Credo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all duration-200 placeholder-slate-600 text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5 px-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all duration-200 placeholder-slate-600 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 transition-colors text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/30"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-slate-800/80"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            or continue with
          </span>
          <div className="flex-grow border-t border-slate-800/80"></div>
        </div>

        <div className="flex flex-col gap-3">
          <div id="google-btn-container" className="w-full overflow-hidden" />
          
          <button
            onClick={handleDemoGoogleLogin}
            type="button"
            className="w-full py-2.5 bg-slate-950/80 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-inner"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            Sign in as Demo User (demo@credo.com)
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
