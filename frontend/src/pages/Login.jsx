import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  User, Lock, Eye, EyeOff, Mail, ArrowRight, Home,
  GraduationCap, Users, UserCheck, ShieldCheck, Flame, Zap, CheckCircle2,
  Calendar, Camera, Sparkles, Upload
} from 'lucide-react';
import confetti from 'canvas-confetti';

/* ── Available Portals Configuration ── */
const PORTALS = [
  {
    id: 'student',
    name: 'Student LMS',
    icon: GraduationCap,
    role: 'user',
    accentColor: '#f43f5e',
    description: 'Access coding courses, live practice & student portal',
    badge: 'Student LMS'
  },
  {
    id: 'parent',
    name: 'Parent Portal',
    icon: Users,
    role: 'parent',
    accentColor: '#10b981',
    description: 'Track child progress, attendance & fee records',
    badge: 'Parent Portal'
  },
  {
    id: 'teacher',
    name: 'Teacher Portal',
    icon: UserCheck,
    role: 'teacher',
    accentColor: '#8b5cf6',
    description: 'Manage class schedules, student grading & notices',
    badge: 'Teacher Portal'
  },
  {
    id: 'admin',
    name: 'Admin Portal',
    icon: ShieldCheck,
    role: 'admin',
    accentColor: '#06b6d4',
    description: 'Full institute management, admissions & reports',
    badge: 'Admin Portal'
  }
];

export default function Login() {
  const { login, register, loginWithGoogle, user, error, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isRegister, setIsRegister] = useState(searchParams.get('register') === 'true');
  const [selectedPortalId, setSelectedPortalId] = useState('student');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [dob, setDob]           = useState('');
  const [photo, setPhoto]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [valErr, setValErr]     = useState('');
  const [infoMsg, setInfoMsg]   = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);
  const [existingStudent, setExistingStudent] = useState(null);

  const selectedPortal = PORTALS.find(p => p.id === selectedPortalId) || PORTALS[0];

  useEffect(() => {
    try {
      const stored = localStorage.getItem('arena_student');
      if (stored) {
        setExistingStudent(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.role === 'admin')        navigate('/dashboard/admin');
    else if (user.role === 'teacher') navigate('/dashboard/teacher');
    else if (user.role === 'parent')  navigate('/dashboard/parent');
    else navigate('/lms/dashboard');
  }, [user, navigate]);

  const handleSelectPortal = (portal) => {
    setSelectedPortalId(portal.id);
    setEmail('');
    setDob('');
    setPassword('');
    setValErr('');
    setInfoMsg('');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setValErr('Photo size should be under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  // Student LMS Login: Only Email + Date of Birth
  const handleStudentLogin = async (e) => {
    if (e) e.preventDefault();
    setValErr('');
    setInfoMsg('');

    if (!email.trim()) {
      setValErr('Please enter your email address.');
      return;
    }
    if (!dob) {
      setValErr('Please select or enter your Date of Birth (DOB).');
      return;
    }

    setStudentLoading(true);
    try {
      const res = await fetch('/api/arena/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), dob })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('arena_token', data.token);
        localStorage.setItem('arena_student', JSON.stringify(data.student));
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        navigate('/student/profile');
      } else if (res.status === 404 || data.notRegistered) {
        // Account does not exist in DB: switch to register mode pre-filling email & dob
        setIsRegister(true);
        setInfoMsg('No existing student account found for this email. Enter your Full Name below to register and create your coder profile!');
      } else {
        setValErr(data.error || 'Student login failed.');
      }
    } catch (err) {
      setValErr('Unable to connect to server. Please try again.');
    } finally {
      setStudentLoading(false);
    }
  };

  // Student LMS Register: Name + Email + DOB + optional Photo
  const handleStudentRegister = async (e) => {
    if (e) e.preventDefault();
    setValErr('');
    setInfoMsg('');

    if (!name.trim()) {
      setValErr('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setValErr('Please enter your email address.');
      return;
    }
    if (!dob) {
      setValErr('Please select your Date of Birth.');
      return;
    }

    setStudentLoading(true);
    try {
      const res = await fetch('/api/arena/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          dob,
          photo
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('arena_token', data.token);
        localStorage.setItem('arena_student', JSON.stringify(data.student));
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        navigate('/student/profile');
      } else {
        setValErr(data.error || 'Registration failed.');
      }
    } catch (err) {
      setValErr('Unable to connect to server. Please try again.');
    } finally {
      setStudentLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setValErr('');
    const res = await login(email, password);
    if (res.success) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } else {
      setValErr(res.message || 'Login failed.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setValErr('');
    if (!name.trim())          { setValErr('Enter your full name'); return; }
    if (password.length < 6)   { setValErr('Password must be ≥ 6 chars'); return; }
    if (password !== confirm)  { setValErr('Passwords do not match'); return; }
    const res = await register(name, email, password, 'user');
    if (res.success) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      navigate('/lms/dashboard');
    } else setValErr(res.message || 'Registration failed.');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#07080c] font-sans antialiased text-white relative overflow-hidden">

      {/* ── Top Left Floating Home Button ── */}
      <Link 
        to="/"
        className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white/90 bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-md transition-all shadow-lg hover:scale-105"
      >
        <Home className="w-3.5 h-3.5 text-pink-400" /> Back to Home
      </Link>

      {/* ══════════════════════════════════════════════════════════════════
          LEFT HERO PANEL: Cinematic Moonlit Landscape & AI Branding
         ══════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[48%] relative flex-col justify-between p-12 overflow-hidden select-none">
        
        {/* Background Image with Ambient Night Artwork */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85')`,
            backgroundPosition: 'center 40%'
          }}
        />

        {/* Cinematic Vignette & Lighting Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-[#07080c]" />
        
        {/* Full Moon Glow Flare Simulation */}
        <div 
          className="absolute top-10 left-36 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(200,230,255,0.08) 45%, transparent 70%)',
            filter: 'blur(20px)'
          }}
        />

        {/* ── Top Brand Badge: Programming Wallah & Appletree Infotech ── */}
        <div className="relative z-10 flex items-center gap-3.5 pt-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-pink-500/30 to-rose-600/30 border border-pink-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(244,63,94,0.35)] overflow-hidden p-1.5">
            <img 
              src="/appletree_logo.png" 
              alt="Appletree Logo" 
              className="w-full h-full object-contain drop-shadow"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo.png';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">Programming Wallah</span>
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">AI</span>
            </div>
            <p className="text-[11px] font-extrabold tracking-widest text-[#f43f5e] uppercase">
              APPLETREE INFOTECH
            </p>
          </div>
        </div>

        {/* ── Bottom Content: Status Badge & Hero Typography ── */}
        <div className="relative z-10 space-y-4 pb-4 max-w-lg">
          
          {/* Active Opportunities Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-xs font-semibold text-white/90 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>10,480+ Live Opportunities Active</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
            Find Your Dream Job <br />
            <span className="bg-gradient-to-r from-pink-400 via-rose-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
              Powered by AI.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-md">
            Master full-stack technologies with Programming Wallah & Appletree Infotech. Match with verified tech employers, and launch your dream career.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          RIGHT FORM PANEL: Sleek Dark Modern Interface
         ══════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 z-20 relative">

        <div className="w-full max-w-[440px] space-y-6">

          {/* Header Title */}
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {selectedPortalId === 'student'
                ? (isRegister ? 'Register Student LMS' : 'Student LMS Login')
                : (isRegister ? 'Create an account' : 'Welcome back')}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {selectedPortalId === 'student'
                ? (isRegister 
                    ? 'Enter your name, email & date of birth to create your student coder profile' 
                    : 'Enter your registered Email & Date of Birth (no password needed!)')
                : (isRegister 
                    ? 'Start learning and building your career with Appletree AI' 
                    : 'Select your portal or enter your credentials to continue')}
            </p>
          </div>

          {/* Active Arena Student Quick Access Banner */}
          {selectedPortalId === 'student' && existingStudent && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold truncate">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="truncate">Saved Profile: {existingStudent.name}</span>
              </div>
              <Link 
                to="/student/profile" 
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[11px] whitespace-nowrap transition cursor-pointer shadow-sm"
              >
                Open Profile →
              </Link>
            </div>
          )}

          {/* Portal Selector Tabs (Student LMS, Parent, Teacher, Admin) */}
          {!isRegister && (
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                Select Portal Access
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {PORTALS.map((portal) => {
                  const Icon = portal.icon;
                  const isSelected = selectedPortalId === portal.id;
                  return (
                    <button
                      key={portal.id}
                      type="button"
                      onClick={() => handleSelectPortal(portal)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        isSelected 
                          ? 'bg-[#121722] border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.35)] scale-[1.02]' 
                          : 'bg-[#0b0e14] border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className={`text-[11px] font-bold truncate w-full ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                        {portal.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Info Banner */}
          {infoMsg && (
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-start gap-2.5 shadow-md">
              <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {(valErr || error) && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{valErr || error}</span>
            </div>
          )}

          {/* Form */}
          <form 
            onSubmit={
              selectedPortalId === 'student'
                ? (isRegister ? handleStudentRegister : handleStudentLogin)
                : (isRegister ? handleRegister : handleLogin)
            } 
            className="space-y-4"
            autoComplete="off"
            noValidate
          >

            {/* ── Student LMS Portal Fields (Passwordless Email + DOB) ── */}
            {selectedPortalId === 'student' ? (
              <>
                {/* Full Name (Student Register only) */}
                {isRegister && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4 text-cyan-400/80" />
                    </div>
                    <input
                      type="text"
                      name="student_full_name"
                      id="student_full_name"
                      required
                      placeholder="Your Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="off"
                      className="w-full bg-[#0c1017] border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-400 outline-none transition-all shadow-sm"
                    />
                  </div>
                )}

                {/* Registered Email */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-cyan-400/80" />
                  </div>
                  <input
                    type="email"
                    name="student_email"
                    id="student_email"
                    required
                    placeholder="Registered Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    className="w-full bg-[#0c1017] border border-cyan-500/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-400 outline-none transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                  />
                </div>

                {/* Date of Birth (DOB) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="student_dob" className="text-[11px] uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Date of Birth (DOB)</span>
                    </label>
                    <span className="text-[10px] text-cyan-400/90 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      Passwordless Auth
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      name="student_dob"
                      id="student_dob"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      style={{ colorScheme: 'dark' }}
                      className="w-full bg-[#0c1017] border border-cyan-500/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-2xl py-3.5 px-4 text-sm text-white placeholder-slate-400 outline-none transition-all shadow-[0_0_10px_rgba(6,182,212,0.12)] cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span>💡</span>
                    <span>Use only your email & date of birth. No password required for students!</span>
                  </p>
                </div>

                {/* Profile Picture (Student Register only) */}
                {isRegister && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-pink-400" />
                      <span>Profile Picture (Optional)</span>
                    </label>
                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#0c1017] border border-slate-800">
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0">
                        {photo ? (
                          <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer transition">
                          <Upload className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Upload Photo</span>
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        </label>
                        {photo && (
                          <button
                            type="button"
                            onClick={() => setPhoto('')}
                            className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Student Action Button */}
                <button
                  type="submit"
                  disabled={studentLoading}
                  className="w-full py-3.5 rounded-full font-bold text-sm text-white tracking-wide transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 mt-3 active:scale-[0.99]"
                  style={{
                    background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                    boxShadow: '0 4px 22px rgba(244, 63, 94, 0.45)'
                  }}
                >
                  {studentLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Student Credentials...</span>
                    </>
                  ) : isRegister ? (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Register & Open Profile</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                      <span>Continue to Student Profile & Arena</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </>
            ) : (
              /* ── Parent, Teacher & Admin Portals (Email + Password) ── */
              <>
                {/* Name Input (Register mode only) */}
                {isRegister && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4 text-cyan-400/80" />
                    </div>
                    <input
                      type="text"
                      name="user_display_name"
                      id="user_display_name"
                      required
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="off"
                      className="w-full bg-[#0c1017] border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-400 outline-none transition-all"
                    />
                  </div>
                )}

                {/* Email Address Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-cyan-400/80" />
                  </div>
                  <input
                    type="email"
                    name="user_email_address"
                    id="user_email_address"
                    required
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    className="w-full bg-[#0c1017] border border-cyan-500/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-400 outline-none transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="user_access_token"
                    id="user_access_token"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full bg-[#0c1017] border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-2xl py-3.5 pl-11 pr-11 text-sm text-white placeholder-slate-400 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Confirm Password (Register mode only) */}
                {isRegister && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type={showPw ? 'text' : 'password'}
                      name="user_confirm_token"
                      id="user_confirm_token"
                      required
                      placeholder="Confirm Password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      autoComplete="new-password"
                      className="w-full bg-[#0c1017] border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-400 outline-none transition-all"
                    />
                  </div>
                )}

                {/* Options Row: Remember Me & Forgot Password */}
                {!isRegister && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded bg-[#0c1017] border-slate-700 text-pink-500 focus:ring-0 accent-pink-500"
                      />
                      <span>Remember Me</span>
                    </label>
                    <button
                      type="button"
                      className="text-[#f43f5e] hover:text-pink-400 font-semibold transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Primary Action Button: Pink Pill CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full font-bold text-sm text-white tracking-wide transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 mt-3"
                  style={{
                    background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                    boxShadow: '0 4px 22px rgba(244, 63, 94, 0.45)'
                  }}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{isRegister ? 'Create Free Account' : 'Continue with Email'}</span>
                  )}
                </button>
              </>
            )}
          </form>

          {/* Toggle Login / Sign Up */}
          <div className="text-center pt-2 text-xs text-slate-400">
            <span>{isRegister ? 'Already have an account? ' : "Don't have an account? "}</span>
            <button
              type="button"
              onClick={() => { 
                setIsRegister(!isRegister); 
                setValErr(''); 
                setInfoMsg('');
              }}
              className="text-[#f43f5e] hover:text-pink-400 font-bold ml-1 transition-colors cursor-pointer"
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

        </div>

        {/* ── Floating Mascot Badge in Bottom Right Corner ── */}
        <div className="absolute bottom-6 right-6 hidden sm:flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#141824] border border-slate-700/80 shadow-[0_0_15px_rgba(244,63,94,0.25)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <img 
              src="/clay_mascot.png" 
              alt="Mascot" 
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo.png';
              }}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
