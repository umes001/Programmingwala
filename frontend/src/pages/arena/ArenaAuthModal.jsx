import React, { useState, useRef } from 'react';
import { X, Mail, Calendar, User, Camera, Upload, CheckCircle2, AlertCircle, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ArenaAuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginDob, setLoginDob] = useState('');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regPhoto, setRegPhoto] = useState('');
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Compress image on client side
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 320;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = readerEvent.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (JPG, PNG).');
      return;
    }
    try {
      const compressed = await compressImage(file);
      setRegPhoto(compressed);
      setPhotoError('');
    } catch (err) {
      setPhotoError('Could not process photo.');
    }
  };

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginEmail.trim() || !loginDob.trim()) {
      setError('Please enter both your registered Email and Date of Birth.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/arena/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
          dob: loginDob.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.notRegistered) {
          setError(data.error);
          setActiveTab('register');
          setRegEmail(loginEmail.trim());
          setRegDob(loginDob.trim());
          return;
        }
        throw new Error(data.error || 'Login failed.');
      }

      // Save token and student info
      localStorage.setItem('arena_token', data.token);
      localStorage.setItem('arena_student', JSON.stringify(data.student));

      Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: data.message || `Signed in as ${data.student.name}`,
        timer: 1800,
        showConfirmButton: false
      });

      onAuthSuccess(data.student);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!regName.trim() || !regEmail.trim() || !regDob.trim()) {
      setError('Full Name, Email, and Date of Birth are all required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/arena/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          dob: regDob.trim(),
          photo: regPhoto || ''
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed.');

      localStorage.setItem('arena_token', data.token);
      localStorage.setItem('arena_student', JSON.stringify(data.student));

      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Welcome to the ProgrammingWala Coding Arena!',
        timer: 2000,
        showConfirmButton: false
      });

      onAuthSuccess(data.student);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="arena-dark-root fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0d1117] rounded-3xl shadow-2xl shadow-black/90 border border-[#30363d] overflow-hidden text-slate-100">
        
        {/* Header with gradient badge */}
        <div className="relative p-6 pb-4 bg-gradient-to-b from-[#161b22] to-[#0d1117] border-b border-[#30363d]">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#21262d] hover:bg-[#30363d] flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Coding Arena Student Access
          </div>

          <h2 className="text-xl font-black text-white tracking-tight">
            {activeTab === 'login' ? 'Sign In to Coding Arena' : 'Create Free Student Profile'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeTab === 'login' 
              ? 'Access challenges and save your solution XP using your Email and DOB.'
              : 'Join the coding challenge community and track your solved problems.'}
          </p>

          {/* Tab Switcher */}
          <div className="flex rounded-2xl bg-[#090d13] p-1 mt-4 border border-[#30363d]/60">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#21262d] text-emerald-400 border border-[#30363d] shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In (Email + DOB)
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-[#21262d] text-emerald-400 border border-[#30363d] shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Register New Student
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ─── LOGIN FORM ────────────────────────────────────────────── */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Date of Birth (DOB)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={loginDob}
                    onChange={(e) => setLoginDob(e.target.value)}
                    style={{ colorScheme: 'dark' }}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:border-emerald-500 outline-none transition"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Format: Year / Month / Day as recorded in your profile.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-300 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Exam Participant?</strong> Students who took an exam created by an admin can log in directly using their exam email!
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#0d1117] font-black text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Sign In to Arena'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ─── REGISTER FORM ─────────────────────────────────────────── */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Profile Photo Upload */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#161b22] border border-[#30363d]">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500/40 bg-[#0d1117] flex items-center justify-center flex-shrink-0 shadow-sm">
                  {regPhoto ? (
                    <img src={regPhoto} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-7 h-7 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-200">Profile Picture</div>
                  <p className="text-[10px] text-slate-400 mb-1.5">Upload a clear photo for your coder profile.</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-[#21262d] border border-[#30363d] hover:border-emerald-500 text-xs font-semibold text-slate-200 flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Upload className="w-3 h-3 text-emerald-400" />
                    <span>Choose Photo</span>
                  </button>
                  {photoError && <p className="text-[10px] text-rose-400 mt-1">{photoError}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Date of Birth (DOB)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={regDob}
                    onChange={(e) => setRegDob(e.target.value)}
                    style={{ colorScheme: 'dark' }}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:border-emerald-500 outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#0d1117] font-black text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? 'Creating Profile...' : 'Complete Free Registration'}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
