import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { apiFetch } from '../utils/api.js';
import {
  User as UserIcon,
  Mail,
  Lock,
  Loader2,
  Shield,
  Palette,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'security', 'appearance'

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      return showToast('Please enter both name and email address', 'warning');
    }

    setProfileLoading(true);
    try {
      await updateProfile(name, email);
      showToast('Profile settings saved successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword && user?.password) {
      return showToast('Please enter your current password', 'warning');
    }
    if (!newPassword || newPassword.length < 8) {
      return showToast('New password must be at least 8 characters long', 'warning');
    }
    if (newPassword !== confirmPassword) {
      return showToast('Passwords do not match', 'warning');
    }

    setSecurityLoading(true);
    try {
      await apiFetch('/user/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      showToast('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.message || 'Failed to update password', 'error');
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans text-left">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Configuration Settings</h2>
        <p className="text-xs text-slate-400">Manage account information, security, and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar tab options */}
        <div className="lg:col-span-1 p-3 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible shadow-sm">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold shrink-0 cursor-pointer w-full transition-all ${
              activeTab === 'profile'
                ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border border-transparent'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Profile Info
          </button>
          
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold shrink-0 cursor-pointer w-full transition-all ${
              activeTab === 'security'
                ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border border-transparent'
            }`}
          >
            <Shield className="w-4 h-4" />
            Password Security
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold shrink-0 cursor-pointer w-full transition-all ${
              activeTab === 'appearance'
                ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border border-transparent'
            }`}
          >
            <Palette className="w-4 h-4" />
            Preferences
          </button>
        </div>

        {/* Content Box */}
        <div className="lg:col-span-3 p-8 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl shadow-sm text-left">
          
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-base font-bold text-white mb-1">Profile Details</h3>
                <p className="text-xs text-slate-400">Update your primary registration contact details</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                    Display Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:border-emerald-500 outline-none text-white transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:border-emerald-500 outline-none text-white transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 transition-colors text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/30"
                >
                  {profileLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Profile
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-base font-bold text-white mb-1">Update Security Credentials</h3>
                <p className="text-xs text-slate-400">Ensure your account is protected with a secure password</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                
                {user?.googleId && !user?.password ? (
                  <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 rounded-2xl text-xs leading-relaxed mb-4">
                    💡 **OAuth Notice:** You signed up via Google. You do not have a local password set yet. Setting one below will let you log in using both methods.
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:border-emerald-500 outline-none text-white"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:border-emerald-500 outline-none text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:border-emerald-500 outline-none text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={securityLoading}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 transition-colors text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/30"
                >
                  {securityLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Change Password
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-base font-bold text-white mb-1">Theme Preferences</h3>
                <p className="text-xs text-slate-400">Customize the visual interface of the platform</p>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-start gap-4 justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-200">Light / Dark Theme</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Toggle themes using the visual preferences trigger located in the main header.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/30 text-emerald-400 rounded-full text-[9px] font-bold flex items-center gap-0.5">
                    <CheckCircle className="w-2.5 h-2.5" />
                    Responsive
                  </span>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-start gap-4 justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-200">Database Cloud Sync</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      All your budget targets, transaction lists, and chatbot memory are stored securely in MongoDB Atlas.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Settings;
