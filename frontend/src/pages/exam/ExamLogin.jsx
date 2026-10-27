import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, KeyRound, Sparkles, QrCode } from 'lucide-react';

export default function ExamLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examParam = (searchParams.get('exam') || searchParams.get('code') || '').trim();
  const emailParam = (searchParams.get('email') || '').trim();

  const [email, setEmail] = useState(emailParam || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Anti-autofill state: input remains readonly until user interacts
  const [isReadOnly, setIsReadOnly] = useState(true);

  // Sync email from search params if passed
  useEffect(() => {
    if (emailParam && !email) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  // Release readonly state on mount after browser autofill heuristic passes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReadOnly(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both your registered email address and your test password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/test/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Invalid credentials or no test assigned.');
      }

      // Save token and student session data
      localStorage.setItem('exam_token', data.token);
      localStorage.setItem('exam_student', JSON.stringify(data.student));
      if (data.assignedExam) {
        localStorage.setItem('assigned_exam', JSON.stringify(data.assignedExam));
      }

      // Redirect to candidate dashboard
      navigate('/test/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to log in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-slate-100 flex flex-col justify-center">
      {/* Decorative ambient glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-md mx-auto w-full">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-medium mb-3 shadow-inner">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Secure Examination Access</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Candidate Test Login
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Log in with your registered email and the unique test password provided for your scheduled exam.
          </p>
          {examParam && (
            <div className="mt-3 inline-flex items-center space-x-2 bg-amber-500/15 border border-amber-500/30 px-3.5 py-1 rounded-full text-amber-300 text-xs font-semibold">
              <QrCode className="w-3.5 h-3.5" />
              <span>Target Exam Code: <strong className="font-mono text-white">{examParam}</strong></span>
            </div>
          )}
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Informational Callout */}
          <div className="mb-6 p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-200 flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-white block font-medium">Test-Specific Password Required</strong>
              <span>Each exam has its own unique password issued by your coordinator. Your password cannot be shared.</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form with aggressive anti-autofill protections */}
          <form
            onSubmit={handleLogin}
            autoComplete="off"
            className="space-y-5"
          >
            {/* Decoy fields to catch browser autofill trap */}
            <input
              type="text"
              name="fake_autofill_email_trap"
              style={{ display: 'none', position: 'absolute', opacity: 0 }}
              tabIndex="-1"
              autoComplete="off"
            />
            <input
              type="password"
              name="fake_autofill_pwd_trap"
              style={{ display: 'none', position: 'absolute', opacity: 0 }}
              tabIndex="-1"
              autoComplete="new-password"
            />

            {/* Registered Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  name="candidate_exam_identifier_no_fill"
                  autoComplete="off"
                  readOnly={isReadOnly}
                  onFocus={() => setIsReadOnly(false)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Test Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Test Password
                </label>
                <span className="text-[11px] text-slate-400">Issued per exam</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  name="candidate_exam_passcode_no_fill"
                  autoComplete="new-password"
                  readOnly={isReadOnly}
                  onFocus={() => setIsReadOnly(false)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter 8-character test password"
                  className="w-full pl-10 pr-11 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono tracking-wide"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 flex items-center justify-center py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/30"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying Test Access...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Enter Examination Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
            First time candidate?{' '}
            <Link
              to={examParam ? `/test/register?exam=${encodeURIComponent(examParam)}` : '/test/register'}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
            >
              Register candidate profile
            </Link>
          </div>
        </div>

        {/* Support note */}
        <div className="mt-6 text-center text-[11px] text-slate-500 flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Server-Controlled Anti-Cheating & AI Evaluation Enabled</span>
        </div>
      </div>
    </div>
  );
}
