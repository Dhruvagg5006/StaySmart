'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { EnvelopeIcon, LockClosedIcon, UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = '/listings';
    }, 1200);
  };

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = '/listings';
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#09090B' }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[25%] w-[600px] h-[600px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[-10%] left-[15%] w-[400px] h-[400px] rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #6D28D9 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/home" className="inline-flex items-center gap-2 mb-6">
            <AppLogo text="StaySmart AI" iconName="SignalIcon" size={28} className="text-phosphor font-display font-bold tracking-tight" />
          </Link>
          <h1 className="text-2xl font-bold font-display mb-2" style={{ color: '#EEEEF0' }}>Create your account</h1>
          <p className="text-sm" style={{ color: '#9898A0' }}>Get personalized AI property recommendations tailored to you</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: 'rgba(30,19,50,0.6)', border: '1px solid rgba(139,92,246,0.2)', backdropFilter: 'blur(20px)' }}>
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
            <span className="text-xs" style={{ color: '#9898A0' }}>or sign up with email</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(238,238,240,0.08)' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#9898A0' }}>FULL NAME</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9898A0' }} />
                <input
                  type="text"
                  className="input-beacon w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  placeholder="Your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#9898A0' }}>EMAIL ADDRESS</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9898A0' }} />
                <input
                  type="email"
                  className="input-beacon w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#9898A0' }}>PASSWORD</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9898A0' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-beacon w-full pl-10 pr-10 py-3 rounded-xl text-sm"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
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
              <p className="text-xs mt-1.5" style={{ color: '#9898A0' }}>Use 8+ characters with a mix of letters and numbers</p>
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
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>

            <p className="text-xs text-center" style={{ color: '#9898A0' }}>
              By signing up, you agree to our{' '}
              <span className="cursor-pointer" style={{ color: '#A78BFA' }}>Terms of Service</span>
              {' '}and{' '}
              <span className="cursor-pointer" style={{ color: '#A78BFA' }}>Privacy Policy</span>
            </p>
          </form>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: '#9898A0' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold" style={{ color: '#A78BFA' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
