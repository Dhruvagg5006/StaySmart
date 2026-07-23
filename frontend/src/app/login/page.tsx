'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'login' | 'verify'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleName, setGoogleName] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      
      if (res.status === 403) {
        // Unverified user flow
        setError(data.detail || 'Your email is not verified. Please verify using OTP.');
        setSuccess('Please verify your email to log in. An OTP has been sent.');
        // Pre-fill email if the username entered looks like an email
        if (username.includes('@')) {
          setEmail(username);
        }
        setStep('verify');
        return;
      }
      
      if (!res.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Save token to localStorage
      localStorage.setItem('auth_token', data.token);
      
      // Dispatch a custom event to notify Header that auth has changed
      window.dispatchEvent(new Event('auth-updated'));
      
      setSuccess('Logged in successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = '/listings';
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) {
      setError('Please fill in both email and OTP code.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/user/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp_code: otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Verification failed');
      }
      setSuccess('Email verified successfully! You can now log in.');
      setStep('login');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setError('Please enter your email to resend OTP.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/user/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Resending OTP failed');
      }
      setSuccess('A new OTP has been sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setShowGoogleModal(true);
  };

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleName || !googleEmail) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:8000/user/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: googleName, email: googleEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Google login failed');
      }
      localStorage.setItem('auth_token', data.token);
      window.dispatchEvent(new Event('auth-updated'));
      setSuccess('Logged in with Google successfully!');
      setShowGoogleModal(false);
      setTimeout(() => {
        window.location.href = '/listings';
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#09090B' }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #6D28D9 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/home" className="inline-flex items-center gap-2 mb-6">
            <AppLogo text="StaySmart AI" iconName="SignalIcon" size={28} className="text-phosphor font-display font-bold tracking-tight" />
          </Link>
          <h1 className="text-2xl font-bold font-display mb-2" style={{ color: '#EEEEF0' }}>
            {step === 'login' ? 'Welcome back' : 'Verify your email'}
          </h1>
          <p className="text-sm" style={{ color: '#9898A0' }}>
            {step === 'login' 
              ? 'Sign in to access your saved properties and recommendations'
              : 'Please enter the OTP verification code sent to your email'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: 'rgba(30,19,50,0.6)', border: '1px solid rgba(139,92,246,0.2)', backdropFilter: 'blur(20px)' }}>
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm mb-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>
              {error}
            </div>
          )}

          {success && (
            <div className="px-4 py-3 rounded-xl text-sm mb-4" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#A7F3D0' }}>
              {success}
            </div>
          )}

          {step === 'login' ? (
            <>
              {/* Google OAuth */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold mb-6 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ background: 'rgba(238,238,240,0.06)', border: '1px solid rgba(238,238,240,0.12)', color: '#EEEEF0' }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px" style={{ background: 'rgba(238,238,240,0.08)' }} />
                <span className="text-xs" style={{ color: '#9898A0' }}>or sign in with email/username</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(238,238,240,0.08)' }} />
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#9898A0' }}>USERNAME OR EMAIL</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9898A0' }} />
                    <input
                      type="text"
                      className="input-beacon w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                      placeholder="username or email"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold" style={{ color: '#9898A0' }}>PASSWORD</label>
                    <button type="button" className="text-xs" style={{ color: '#A78BFA' }}>Forgot password?</button>
                  </div>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9898A0' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input-beacon w-full pl-10 pr-10 py-3 rounded-xl text-sm"
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: '#9898A0' }}
                    >
                      {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-violet py-3 rounded-xl text-sm font-semibold mt-2 transition-all duration-200 active:scale-[0.98]"
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : 'Sign In'}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#9898A0' }}>EMAIL ADDRESS</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9898A0' }} />
                  <input
                    type="email"
                    className="input-beacon w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                    placeholder="Enter your email to verify"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#9898A0' }}>OTP CODE</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9898A0' }} />
                  <input
                    type="text"
                    className="input-beacon w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                    placeholder="Enter 6-digit verification code"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span style={{ color: '#9898A0' }}>Didn&apos;t receive it?</span>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="font-semibold transition-colors hover:opacity-80"
                  style={{ color: '#A78BFA' }}
                >
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-violet py-3 rounded-xl text-sm font-semibold mt-2 transition-all duration-200 active:scale-[0.98]"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => setStep('login')}
                className="w-full text-center text-xs mt-2 transition-colors hover:opacity-80"
                style={{ color: '#9898A0' }}
              >
                ← Back to sign in
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm mt-6" style={{ color: '#9898A0' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold" style={{ color: '#A78BFA' }}>Create one free</Link>
        </p>
      </div>

      {/* Google Sign-in Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl border border-violet-500/30 bg-[#0F0F12] text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Sign in with Google</h3>
              <button onClick={() => setShowGoogleModal(false)} className="text-[#9898A0] hover:text-white transition-colors">
                ✕
              </button>
            </div>
            <p className="text-xs mb-5 text-[#9898A0]">
              Select or enter your Google profile details to sign in.
            </p>
            
            <form onSubmit={handleGoogleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#9898A0] block mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={googleName}
                  onChange={e => setGoogleName(e.target.value)}
                  placeholder="e.g. Arjun Mehta"
                  className="w-full px-3 py-2 bg-[#1E1332] border border-[#3A3A45] rounded-xl text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#9898A0] block mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={googleEmail}
                  onChange={e => setGoogleEmail(e.target.value)}
                  placeholder="e.g. arjun.mehta@gmail.com"
                  className="w-full px-3 py-2 bg-[#1E1332] border border-[#3A3A45] rounded-xl text-sm text-white outline-none"
                />
              </div>

              <div className="mt-6 flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="flex-1 py-3 border border-white/10 rounded-xl text-xs font-semibold text-[#9898A0] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-[#8B5CF6] text-white rounded-xl text-xs font-semibold hover:bg-[#7c4fdf] transition-colors disabled:opacity-40"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
