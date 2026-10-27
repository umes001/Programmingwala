import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { 
  Menu, X, LogOut, LayoutDashboard, LogIn, UserPlus, BookOpen, 
  Sun, Moon, Home, Info, GraduationCap, Code2, Trophy, 
  Video, Image, Phone, ChevronRight, Briefcase, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from './ConfirmModal.jsx';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isKbcLive, setIsKbcLive] = useState(false);

  // Poll Admin KBC Live Session Status
  useEffect(() => {
    let isMounted = true;
    const checkKbcStatus = async () => {
      try {
        const res = await fetch('/api/kbc/session/status');
        const data = await res.json();
        if (isMounted && data.success && data.session) {
          setIsKbcLive(Boolean(data.session.show_in_navbar || data.session.status === 'LIVE'));
        }
      } catch (e) {}
    };

    checkKbcStatus();
    const interval = setInterval(checkKbcStatus, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowLogoutConfirm(false);
  };

  const navLinks = [
    { name: 'HOME', path: '/', icon: Home },
    { name: 'ABOUT', path: '/about', icon: Info },
    { name: 'CAREERS', path: '/careers', icon: Briefcase },
    { name: 'COURSES', path: '/programs', icon: GraduationCap },
    { name: 'CODING ARENA', path: '/arena', icon: Terminal },
    { name: 'KBC QUIZ', path: '/kbc', icon: Trophy, isBadge: true },
    { name: 'LEADERBOARD', path: '/leaderboard', icon: Trophy },
    { name: 'TUTORIALS', path: '/tutorials', icon: Code2 },
    { name: 'GALLERY', path: '/gallery', icon: Image },
    { name: 'CONTACT', path: '/contact', icon: Phone }
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'teacher') return '/dashboard/teacher';
    if (user.role === 'parent') return '/dashboard/parent';
    return '/dashboard/student'; // 'user' or 'student' role → student portal
  };

  // Auto-close menu whenever route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock background body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <nav className={`sticky top-0 z-50 border-b px-4 py-3.5 backdrop-blur-2xl transition-colors duration-300 select-none print:hidden md:px-8 ${
      isDark
        ? 'border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.96))] shadow-[0_12px_35px_rgba(2,6,23,0.65),0_0_0_1px_rgba(148,163,184,0.08)]'
        : 'border-orange-100 bg-white/85 shadow-[0_12px_35px_rgba(15,23,42,0.08),0_0_0_1px_rgba(148,163,184,0.06)]'
    }`}>
      <div className="relative flex items-center justify-between mx-auto max-w-7xl">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div>
            <span className="text-[15px] font-extrabold font-quicksand block leading-none">
              <span className="text-[#E53935]">Apple</span>
              <span className="text-[#2E7D32]">Tree</span>
            </span>
            <p className="mt-[2px] text-[15px] font-black tracking-tight text-black dark:text-white leading-none">INFOTECH</p>
          </div>
        </Link>

        {/* Desktop Links (Clean list with sliding active underline) */}
        <div className="items-center hidden space-x-5 lg:flex">
          {navLinks.filter(l => l.name !== 'KBC QUIZ' || isKbcLive || (user && (user.role === 'admin' || user.role === 'teacher'))).map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`font-quicksand font-extrabold text-xs tracking-wider relative py-1 transition-colors duration-200 hover:text-brandCoral ${isActive ? 'text-brandCoral' : isDark ? 'text-slate-200' : 'text-slate-600'
                  }`}
              >
                <span className="inline-flex items-center gap-1">
                  {link.name}
                  {link.isBadge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black shadow-xs animate-pulse">
                      HOT
                    </span>
                  )}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-gradient-to-r from-brandCoral to-brandSky"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA Buttons + Theme Toggle */}
        <div className="items-center hidden space-x-3 lg:flex">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all cursor-pointer ${
              isDark
                ? 'border-white/15 bg-white/10 text-amber-300 hover:bg-white/20'
                : 'border-orange-200 bg-brandCream text-slate-600 hover:bg-orange-100/40'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link
                  to="/dashboard/admin?tab=kbc"
                  className="flex items-center space-x-1.5 font-quicksand font-extrabold text-xs rounded-full border border-amber-400/80 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-3.5 py-2.5 transition-all shadow-sm"
                  title="Open KBC Live Host Screen"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>KBC HOST</span>
                </Link>
              )}
              <Link
                to={getDashboardPath()}
                className={`flex items-center space-x-1.5 font-quicksand font-bold text-xs rounded-full border px-5 py-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer ${
                  isDark
                    ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100 shadow-[0_10px_24px_rgba(56,189,248,0.12)] hover:bg-cyan-400/20'
                    : 'border-brandSky/30 bg-brandSky/10 text-brandSky-dark shadow-sm hover:bg-brandSky/20'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>DASHBOARD</span>
              </Link>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className={`flex items-center space-x-1.5 font-quicksand font-bold text-xs rounded-full border px-5 py-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer ${
                  isDark
                    ? 'border-rose-400/20 bg-rose-400/10 text-rose-100 shadow-[0_10px_24px_rgba(251,113,133,0.12)] hover:bg-rose-400/20'
                    : 'border-brandCoral/30 bg-brandCoral/10 text-brandCoral-dark shadow-sm hover:bg-brandCoral/20'
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span>LOGOUT</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`flex items-center space-x-1.5 font-quicksand font-bold text-xs rounded-full border px-5 py-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer text-center ${
                  isDark
                    ? 'border-indigo-400/20 bg-indigo-400/10 text-indigo-100 shadow-[0_10px_24px_rgba(129,140,248,0.12)] hover:bg-indigo-400/20'
                    : 'border-indigo-300 bg-indigo-50 text-indigo-700 shadow-sm hover:bg-indigo-100'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>LOGIN</span>
              </Link>
              <Link
                to="/login?register=true"
                className={`font-quicksand font-bold text-xs rounded-full border px-5 py-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center justify-center space-x-1.5 ${
                  isDark
                    ? 'border-amber-400/20 bg-amber-400/10 text-amber-100 shadow-[0_10px_24px_rgba(251,191,36,0.12)] hover:bg-amber-400/20'
                    : 'border-brandCoral/30 bg-brandCoral/10 text-brandCoral shadow-sm hover:bg-brandCoral/20'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>SIGN UP FREE</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          className={`p-2.5 transition-all border rounded-2xl outline-none cursor-pointer lg:hidden flex items-center justify-center shadow-xs active:scale-95 ${
            isDark 
              ? 'text-slate-100 hover:bg-white/10 border-white/15 bg-white/5 active:bg-white/15' 
              : 'text-slate-800 hover:bg-orange-50 border-orange-200 bg-white active:bg-orange-100'
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5 text-brandCoral" /> : <Menu className="w-5 h-5 text-slate-800 dark:text-slate-100" />}
        </button>
      </div>

      {/* Mobile Slide-Out Sidebar Drawer (Rendered via React Portal directly to document.body) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[99999] lg:hidden flex justify-end">
              {/* Backdrop Blur Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
                aria-hidden="true"
              />

              {/* Sidebar Container */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className={`relative z-10 h-[100dvh] w-[320px] max-w-[86vw] border-l shadow-[-20px_0_50px_rgba(0,0,0,0.45)] p-5 flex flex-col justify-between overflow-y-auto ${
                  isDark
                    ? 'bg-slate-950/98 border-white/10 text-white'
                    : 'bg-white/98 border-slate-200/90 text-slate-900'
                } backdrop-blur-2xl`}
              >
                <div className="space-y-4">
                  {/* Header with Logo & Close */}
                  <div className={`flex items-center justify-between pb-3.5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E53935] to-[#2E7D32] flex items-center justify-center text-white text-xs font-black shadow-sm">
                        AT
                      </div>
                      <div>
                        <span className="text-xs font-black tracking-tight block leading-none">
                          <span className="text-[#E53935]">Apple</span>
                          <span className="text-[#2E7D32]">Tree</span>
                        </span>
                        <span className={`text-[9px] font-extrabold tracking-wider block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>INFOTECH</span>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      aria-label="Close navigation menu"
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isDark 
                          ? 'bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white active:scale-95' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 active:scale-95'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Theme Mode Toggle Pill */}
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      isDark
                        ? 'bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-800'
                        : 'bg-orange-50/70 border-orange-100 text-slate-700 hover:bg-orange-100/60'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-500" />}
                      <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase ${
                      isDark ? 'bg-slate-800 text-slate-400' : 'bg-orange-200/60 text-orange-800'
                    }`}>
                      {isDark ? 'Dark' : 'Light'}
                    </span>
                  </button>

                  {/* Navigation Links */}
                  <div className="space-y-1.5 pt-1">
                    <span className={`text-[11px] font-black tracking-wider uppercase px-2 block mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      NAVIGATION MENU
                    </span>
                    {navLinks.filter(l => l.name !== 'KBC QUIZ' || isKbcLive || (user && (user.role === 'admin' || user.role === 'teacher'))).map((link) => {
                      const isActive = location.pathname === link.path;
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.name}
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-between font-quicksand font-extrabold text-sm py-3 px-4 rounded-2xl transition-all ${
                            isActive
                              ? isDark
                                ? 'bg-gradient-to-r from-red-500/25 to-pink-500/25 text-white border-2 border-red-500/50 shadow-md'
                                : 'bg-orange-500/15 text-orange-950 border-2 border-orange-400/60 shadow-xs'
                              : isDark
                              ? 'bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-white hover:text-white shadow-2xs'
                              : 'bg-slate-100 hover:bg-orange-50/90 border border-slate-200 text-slate-900 hover:text-black shadow-2xs'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            {Icon && (
                              <Icon className={`w-4 h-4 shrink-0 ${
                                isActive 
                                  ? (isDark ? 'text-pink-400' : 'text-brandCoral') 
                                  : (isDark ? 'text-brandCoral' : 'text-brandCoral-dark')
                              }`} />
                            )}
                            <span className="tracking-wide flex items-center gap-1.5">
                              {link.name}
                              {link.isBadge && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black">
                                  HOT
                                </span>
                              )}
                            </span>
                          </span>
                          {isActive ? (
                            <span className="w-2 h-2 rounded-full bg-brandCoral shadow-[0_0_10px_rgba(255,112,67,1)]" />
                          ) : (
                            <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Quick Access Actions */}
                <div className={`pt-4 mt-4 border-t space-y-2.5 pb-6 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  {user ? (
                    <>
                      <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl mb-2 border ${
                        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}>
                        <div className="w-8 h-8 rounded-full bg-brandSky/20 text-brandSky-dark flex items-center justify-center font-black text-sm">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-black truncate leading-tight">{user.name || 'User'}</p>
                          <p className={`text-[10px] capitalize font-bold truncate ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>{user.role || 'Member'}</p>
                        </div>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        onClick={() => setIsOpen(false)}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-extrabold text-xs tracking-wider transition-all shadow-sm ${
                          isDark
                            ? 'bg-cyan-500/20 border-2 border-cyan-500/40 text-cyan-200 hover:bg-cyan-500/30'
                            : 'bg-brandSky/20 border-2 border-brandSky/40 text-brandSky-dark hover:bg-brandSky/30'
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>OPEN DASHBOARD</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          setShowLogoutConfirm(true);
                        }}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl font-extrabold text-xs tracking-wider transition-all cursor-pointer ${
                          isDark
                            ? 'bg-rose-500/15 border border-rose-500/30 text-rose-200 hover:bg-rose-500/25'
                            : 'bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100'
                        }`}
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>SIGN OUT</span>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2.5">
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-black text-xs tracking-wider transition-all shadow-sm ${
                          isDark
                            ? 'bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <LogIn className="w-4 h-4" />
                        <span>LOGIN TO LMS</span>
                      </Link>
                      <Link
                        to="/login?register=true"
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-black text-xs tracking-wider shadow-md hover:opacity-95 transition-all"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>GET STARTED FREE</span>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Confirm to Logout"
        message="Are you sure you want to log out of your Appletree account?"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        confirmText="Log Out"
        type="logout"
      />
    </nav>
  );
}



