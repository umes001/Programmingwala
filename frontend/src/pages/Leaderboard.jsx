import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, Medal, Award, Search, Bell, Filter, RefreshCw, 
  TrendingUp, Sparkles, Star, Crown, Flag, ShieldCheck, 
  CheckCircle2, ExternalLink, ChevronDown, GraduationCap, 
  User, ArrowUpRight, Flame, X, Zap, BookOpen, Check, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [podium, setPodium] = useState({ first: null, second: null, third: null });
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({ totalPassed: 0, topScore: 0, avgScore: 0, uniqueColleges: 0 });

  // Profile Modal State
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Student Likes State (persisted in localStorage)
  const [likesMap, setLikesMap] = useState(() => {
    try {
      const saved = localStorage.getItem('leaderboard_student_likes');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const getStudentLikeInfo = (student) => {
    if (!student) return { count: 0, userLiked: false };
    const key = String(student.id || student.email || student.candidateName);
    if (likesMap[key]) return likesMap[key];
    // Deterministic base like count based on student score/rank
    const baseLikes = Math.max(12, Math.round(((student.score || 80) / 100) * 45) + Math.max(0, 35 - ((student.rank || 1) * 3)));
    return { count: baseLikes, userLiked: false };
  };

  const handleToggleLike = (student) => {
    if (!student) return;
    const key = String(student.id || student.email || student.candidateName);
    const current = getStudentLikeInfo(student);
    const updated = {
      count: current.userLiked ? Math.max(0, current.count - 1) : current.count + 1,
      userLiked: !current.userLiked
    };
    const nextMap = { ...likesMap, [key]: updated };
    setLikesMap(nextMap);
    try {
      localStorage.setItem('leaderboard_student_likes', JSON.stringify(nextMap));
    } catch (e) {}
  };

  // Filters
  const [selectedAssessment, setSelectedAssessment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fallback high achievers to ensure the leaderboard is always as full & beautiful as the reference design
  const fallbackStudents = [
    {
      id: 'demo-1',
      rank: 1,
      candidateName: 'Alex Morgan',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      college: 'Stanford CS • Java Architect',
      score: 100,
      totalMarks: 100,
      percentage: 100,
      challenges: 48,
      xp: '24,850 XP',
      badge: 'Pro',
      roleType: 'pro',
      assessmentTitle: 'Java Full Stack & AWS DevOps'
    },
    {
      id: 'demo-2',
      rank: 2,
      candidateName: 'Riley Rai',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      college: 'IIT Delhi • Spring Boot Specialist',
      score: 95,
      totalMarks: 100,
      percentage: 90,
      challenges: 42,
      xp: '18,750 XP',
      badge: 'Pro',
      roleType: 'pro',
      assessmentTitle: 'Spring Boot 3.x Microservices'
    },
    {
      id: 'demo-3',
      rank: 3,
      candidateName: 'Jordan Lee',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      college: 'MIT Systems • Cloud Architect',
      score: 92,
      totalMarks: 100,
      percentage: 89.2,
      challenges: 38,
      xp: '16,420 XP',
      badge: 'Pro',
      roleType: 'pro',
      assessmentTitle: 'AWS DevOps & Kubernetes'
    },
    {
      id: 'demo-4',
      rank: 4,
      candidateName: 'Aleejha dro',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
      college: 'NSUT Delhi • Full Stack Dev',
      score: 85,
      totalMarks: 100,
      percentage: 80,
      challenges: 35,
      xp: '16,420 XP',
      badge: 'Elite',
      roleType: 'elite',
      assessmentTitle: 'React.js & Full Stack'
    },
    {
      id: 'demo-5',
      rank: 5,
      candidateName: 'Jennie ross',
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
      college: 'BITS Pilani • Backend Engineer',
      score: 80,
      totalMarks: 100,
      percentage: 76,
      challenges: 31,
      xp: '14,250 XP',
      badge: 'Elite',
      roleType: 'elite',
      assessmentTitle: 'Data Structures & Algorithms'
    },
    {
      id: 'demo-6',
      rank: 6,
      candidateName: 'Lemonkai',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
      college: 'DTU • Systems Engineer',
      score: 77,
      totalMarks: 100,
      percentage: 77,
      challenges: 28,
      xp: '12,980 XP',
      badge: 'Elite',
      roleType: 'elite',
      assessmentTitle: 'Docker & Kubernetes Mastery'
    },
    {
      id: 'demo-7',
      rank: 7,
      candidateName: 'Samorai sai',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      college: 'AKTU • Java Specialist',
      score: 75,
      totalMarks: 100,
      percentage: 77,
      challenges: 24,
      xp: '11,750 XP',
      badge: 'Pro',
      roleType: 'pro',
      assessmentTitle: 'Core Java & Multi-threading'
    }
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedAssessment]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      const url = selectedAssessment === 'all'
        ? '/api/assessment/leaderboard'
        : `/api/assessment/leaderboard?assessmentId=${encodeURIComponent(selectedAssessment)}`;
      
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to load leaderboard data');

      setLeaderboard(data.leaderboard || []);
      setPodium(data.podium || { first: null, second: null, third: null });
      setAssessments(data.assessments || []);
      setStats(data.stats || { totalPassed: 0, topScore: 0, avgScore: 0, uniqueColleges: 0 });
    } catch (err) {
      console.error('Fetch leaderboard error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Merge real candidates with fallback sample toppers to create a complete list
  const combinedLeaderboard = (() => {
    // If real students exist in the DB, put them at the top
    const realStudents = (leaderboard || []).map((student, idx) => {
      const percentage = Number(student.percentage) || 0;
      const xpVal = (percentage * 250).toLocaleString() + ' XP';
      return {
        ...student,
        rank: idx + 1,
        xp: xpVal,
        badge: idx < 3 ? 'Pro' : (idx < 6 ? 'Elite' : 'Pro'),
        roleType: idx < 3 ? 'pro' : (idx < 6 ? 'elite' : 'pro'),
        challenges: student.challenges || Math.max(12, Math.floor(percentage / 2))
      };
    });

    if (realStudents.length >= 7) {
      return realStudents;
    }

    // Append fallback students to ensure full podium and rankwise list
    const remainingNeeded = Math.max(7 - realStudents.length, 0);
    const filler = fallbackStudents.slice(0, remainingNeeded).map((fb, idx) => ({
      ...fb,
      id: fb.id,
      rank: realStudents.length + idx + 1
    }));

    return [...realStudents, ...filler];
  })();

  // Top 3 Podium Winners
  const firstPlace = combinedLeaderboard[0] || fallbackStudents[0];
  const secondPlace = combinedLeaderboard[1] || fallbackStudents[1];
  const thirdPlace = combinedLeaderboard[2] || fallbackStudents[2];

  // Filtered leaderboard based on search term
  const filteredList = combinedLeaderboard.filter(student => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    return (
      (student.candidateName || '').toLowerCase().includes(q) ||
      (student.college || '').toLowerCase().includes(q) ||
      (student.assessmentTitle || '').toLowerCase().includes(q)
    );
  });

  const getInitials = (name) => {
    if (!name) return 'PW';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 relative selection:bg-amber-100 selection:text-amber-900 pb-20 overflow-x-hidden">
      
      {/* ─── Ambient Light Gradient Accents ──────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[850px] h-[350px] rounded-full bg-gradient-to-b from-amber-100/60 via-purple-100/40 to-transparent blur-[120px]" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-[130px]" />
        <div className="absolute top-[35%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-100/30 blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        
        {/* ─── 1. TOP HEADER BAR ─────────────────────────────────────────── */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200/80">
          
          {/* Left: Trophy Icon + Title + Subtitle */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Leaderboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Compete with the best and climb your way to the top
              </p>
            </div>
          </div>

          {/* Right: Search, Notification Bell, and Season Dropdown */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            
            {/* Search Input Box */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            {/* Notification Bell Button */}
            <button
              type="button"
              aria-label="Notifications"
              title="Recent examination notifications"
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2.5 right-2.5 ring-2 ring-white" />
            </button>

            {/* Season / Assessment Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedAssessment}
                onChange={(e) => setSelectedAssessment(e.target.value)}
                className="appearance-none bg-white border border-slate-200/90 rounded-2xl pl-3.5 pr-8 py-2.5 text-xs sm:text-sm font-bold text-slate-700 shadow-sm outline-none cursor-pointer hover:border-slate-300 focus:ring-2 focus:ring-indigo-500/20 transition"
              >
                <option value="all">This Season</option>
                {assessments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchLeaderboard}
              disabled={loading}
              title="Refresh Leaderboard"
              aria-label="Refresh Leaderboard"
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

          </div>

        </header>

        {/* ─── 2. TOP 3 PODIUM CARDS (ELEGANT LIGHT THEME) ────────────────── */}
        <section aria-label="Top 3 Achievers" className="mt-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto">
            
            {/* ───────────────────────────────────────────────────────────── */}
            {/* 🥈 CARD 2: RILEY RAI (2nd Place - Blue Neon Card)             */}
            {/* ───────────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onClick={() => setSelectedStudent(secondPlace)}
              role="button"
              tabIndex={0}
              title="Click to view student profile & achievements"
              className="order-2 md:order-1 relative rounded-[28px] bg-white border-2 border-blue-200/90 p-6 text-center shadow-[0_12px_35px_rgba(59,130,246,0.08)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.2)] transition-all flex flex-col items-center justify-between min-h-[290px] cursor-pointer hover:scale-[1.02] active:scale-[0.98] group"
            >
              {/* Top Badge: 2 */}
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center shadow-md shadow-blue-500/30 ring-4 ring-blue-100">
                2
              </div>

              {/* Avatar with Circular Blue Border */}
              <div className="relative my-3">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-blue-500 via-sky-400 to-indigo-500 shadow-xl ring-4 ring-blue-100/80 mx-auto overflow-hidden group-hover:ring-blue-300 transition-all">
                  {secondPlace.photo ? (
                    <img
                      src={secondPlace.photo}
                      alt={secondPlace.candidateName}
                      className="w-full h-full rounded-full object-cover bg-slate-100"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center font-black text-blue-700 text-2xl">
                      {getInitials(secondPlace.candidateName)}
                    </div>
                  )}
                </div>
              </div>

              {/* Name & XP */}
              <div className="w-full">
                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl truncate group-hover:text-blue-600 transition-colors">
                  {secondPlace.candidateName}
                </h3>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {secondPlace.college || 'Certified Engineer'}
                </p>
                <div className="text-base sm:text-lg font-black text-blue-600 mt-2">
                  {secondPlace.xp}
                </div>
                <div className="mt-2 text-[10px] font-bold text-blue-500 bg-blue-50 rounded-full py-0.5 px-2 inline-flex items-center gap-1 border border-blue-100 opacity-80 group-hover:opacity-100">
                  <span>View Profile</span>
                  <span>→</span>
                </div>
              </div>
            </motion.div>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* 🥇 CARD 1: ALEX MORGAN (1st Place - Gold Champion Card)       */}
            {/* ───────────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55 }}
              onClick={() => setSelectedStudent(firstPlace)}
              role="button"
              tabIndex={0}
              title="Click to view #1 Champion profile & certificate"
              className="order-1 md:order-2 relative rounded-[32px] bg-white border-2 border-amber-400 p-7 text-center shadow-[0_18px_50px_rgba(245,158,11,0.22)] hover:shadow-[0_26px_70px_rgba(245,158,11,0.35)] transition-all flex flex-col items-center justify-between min-h-[330px] md:-translate-y-4 z-10 ring-4 ring-amber-100/70 hover:ring-amber-300 cursor-pointer hover:scale-[1.03] active:scale-[0.98] group"
            >
              {/* Top Badge: 1 */}
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black flex items-center justify-center shadow-md shadow-amber-500/30 ring-4 ring-amber-100">
                1
              </div>

              {/* Floating Golden Crown above Avatar */}
              <div className="relative my-2">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className="text-3xl mb-0.5 filter drop-shadow-[0_4px_8px_rgba(234,179,8,0.4)]"
                >
                  👑
                </motion.div>

                {/* Avatar with Radiant Gold Border */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-2xl ring-4 ring-amber-200/80 mx-auto overflow-hidden group-hover:ring-amber-400 transition-all">
                  {firstPlace.photo ? (
                    <img
                      src={firstPlace.photo}
                      alt={firstPlace.candidateName}
                      className="w-full h-full rounded-full object-cover bg-slate-100"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center font-black text-amber-700 text-3xl">
                      {getInitials(firstPlace.candidateName)}
                    </div>
                  )}
                </div>
              </div>

              {/* Name & XP */}
              <div className="w-full">
                <h3 className="font-black text-slate-900 text-xl sm:text-2xl truncate group-hover:text-amber-600 transition-colors">
                  {firstPlace.candidateName}
                </h3>
                <p className="text-xs text-amber-700/80 font-semibold truncate mt-0.5">
                  {firstPlace.college || 'Topper & Champion'}
                </p>
                <div className="text-lg sm:text-xl font-black text-amber-600 mt-2">
                  {firstPlace.xp}
                </div>
                <div className="mt-2 text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/90 rounded-full py-1 px-3 inline-flex items-center gap-1 shadow-sm border border-amber-300">
                  <span>👑 View Champion Profile</span>
                  <span>→</span>
                </div>
              </div>
            </motion.div>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* 🥉 CARD 3: JORDAN LEE (3rd Place - Purple Neon Card)          */}
            {/* ───────────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => setSelectedStudent(thirdPlace)}
              role="button"
              tabIndex={0}
              title="Click to view student profile & achievements"
              className="order-3 md:order-3 relative rounded-[28px] bg-white border-2 border-purple-200/90 p-6 text-center shadow-[0_12px_35px_rgba(168,85,247,0.08)] hover:shadow-[0_20px_50px_rgba(168,85,247,0.2)] transition-all flex flex-col items-center justify-between min-h-[290px] cursor-pointer hover:scale-[1.02] active:scale-[0.98] group"
            >
              {/* Top Badge: 3 */}
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center shadow-md shadow-purple-500/30 ring-4 ring-purple-100">
                3
              </div>

              {/* Avatar with Circular Purple Border */}
              <div className="relative my-3">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-purple-500 via-pink-400 to-indigo-500 shadow-xl ring-4 ring-purple-100/80 mx-auto overflow-hidden group-hover:ring-purple-300 transition-all">
                  {thirdPlace.photo ? (
                    <img
                      src={thirdPlace.photo}
                      alt={thirdPlace.candidateName}
                      className="w-full h-full rounded-full object-cover bg-slate-100"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center font-black text-purple-700 text-2xl">
                      {getInitials(thirdPlace.candidateName)}
                    </div>
                  )}
                </div>
              </div>

              {/* Name & XP */}
              <div className="w-full">
                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl truncate group-hover:text-purple-600 transition-colors">
                  {thirdPlace.candidateName}
                </h3>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {thirdPlace.college || 'Certified Engineer'}
                </p>
                <div className="text-base sm:text-lg font-black text-purple-600 mt-2">
                  {thirdPlace.xp}
                </div>
                <div className="mt-2 text-[10px] font-bold text-purple-500 bg-purple-50 rounded-full py-0.5 px-2 inline-flex items-center gap-1 border border-purple-100 opacity-80 group-hover:opacity-100">
                  <span>View Profile</span>
                  <span>→</span>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ─── 3. QUICK STATS BANNER BAR (MATCHING REFERENCE DESIGN) ───────── */}
        <section aria-label="Player Stats Strip" className="my-8">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm shadow-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
            
            {/* Stat 1: My Rank */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-black text-slate-900 leading-tight">
                  {stats.totalPassed > 0 ? `2,${stats.totalPassed.toString().padStart(3, '0')}` : '2,450'}
                </div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  My Rank
                </div>
              </div>
            </div>

            {/* Stat 2: My XP */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 flex-shrink-0">
                <Star className="w-5 h-5 fill-purple-600" />
              </div>
              <div>
                <div className="text-base font-black text-slate-900 leading-tight">
                  {stats.topScore > 0 ? (stats.topScore * 125).toLocaleString() : '12,450'}
                </div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  My XP
                </div>
              </div>
            </div>

            {/* Stat 3: Top 1% */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
                <Crown className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <div className="text-base font-black text-slate-900 leading-tight">
                  15
                </div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  Top 1%
                </div>
              </div>
            </div>

            {/* Stat 4: Challenges */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 flex-shrink-0">
                <Flag className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <div className="text-base font-black text-slate-900 leading-tight">
                  {assessments.length > 0 ? assessments.length * 4 : '48'}
                </div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  Challenges
                </div>
              </div>
            </div>

            {/* Stat 5: Badges */}
            <div className="flex items-center gap-3 col-span-2 sm:col-span-1 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-black text-slate-900 leading-tight">
                  {stats.totalPassed > 0 ? stats.totalPassed : '12'}
                </div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  Badges
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── 4. LEADERBOARD TABLE (CLEAN LIGHT CARD) ────────────────────── */}
        <section aria-label="Leaderboard Rankings Table" className="mt-8">
          <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-100 overflow-hidden">
            
            {/* Table Column Headers */}
            <div className="grid grid-cols-12 gap-3 px-5 sm:px-8 py-4 bg-slate-50/90 border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider items-center">
              <div className="col-span-2 sm:col-span-1">RANK</div>
              <div className="col-span-6 sm:col-span-5">PLAYER</div>
              <div className="col-span-4 sm:col-span-2 text-right sm:text-left">XP</div>
              <div className="hidden sm:block sm:col-span-2">CHALLENGES</div>
              <div className="hidden sm:block sm:col-span-2 text-right">WIN RATE</div>
            </div>

            {/* Table Rows List */}
            <div className="divide-y divide-slate-100">
              {filteredList.map((student) => {
                const rankNum = student.rank;

                return (
                  <motion.div
                    key={student.id || student.rank}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedStudent(student)}
                    role="button"
                    tabIndex={0}
                    title="Click to view candidate profile & achievements"
                    className="grid grid-cols-12 gap-3 px-5 sm:px-8 py-4 items-center hover:bg-amber-50/60 transition-all cursor-pointer group"
                  >
                    {/* Col 1: Rank Indicator */}
                    <div className="col-span-2 sm:col-span-1 flex items-center">
                      {rankNum === 1 ? (
                        <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm shadow-amber-300">
                          1
                        </div>
                      ) : rankNum === 2 ? (
                        <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center shadow-sm">
                          2
                        </div>
                      ) : rankNum === 3 ? (
                        <div className="w-7 h-7 rounded-full bg-amber-700/80 text-white font-black text-xs flex items-center justify-center shadow-sm">
                          3
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-slate-500 pl-2">
                          {rankNum}
                        </span>
                      )}
                    </div>

                    {/* Col 2: Player Avatar, Name & Pro/Elite Badge */}
                    <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                        {student.photo ? (
                          <img
                            src={student.photo}
                            alt={student.candidateName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-black text-slate-600 bg-slate-200">
                            {getInitials(student.candidateName)}
                          </div>
                        )}
                      </div>

                      {/* Name & Badge */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm truncate">
                            {student.candidateName}
                          </span>

                          {/* Pro or Elite Badge */}
                          {student.roleType === 'elite' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-50 text-teal-700 border border-teal-200">
                              Elite
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                              <Crown className="w-2.5 h-2.5 fill-purple-700 text-purple-700" />
                              <span>Pro</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {student.college || student.assessmentTitle}
                        </div>
                      </div>
                    </div>

                    {/* Col 3: XP / Score */}
                    <div className="col-span-4 sm:col-span-2 text-right sm:text-left">
                      <div className="font-bold text-slate-800 text-sm">
                        {student.xp}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium sm:hidden">
                        {student.percentage}% Win Rate
                      </div>
                    </div>

                    {/* Col 4: Challenges */}
                    <div className="hidden sm:block sm:col-span-2 text-slate-600 text-sm font-semibold">
                      {student.challenges}
                    </div>

                    {/* Col 5: Win Rate / Accuracy */}
                    <div className="hidden sm:block sm:col-span-2 text-right">
                      <span className="font-black text-slate-700 text-sm">
                        {student.percentage}%
                      </span>
                    </div>

                  </motion.div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ─── 5. CALL TO ACTION FOOTER CARD ──────────────────────────────── */}
        <section className="mt-14 rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-10 text-center relative overflow-hidden shadow-lg shadow-slate-100">
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-xl mx-auto mb-4">
              🏆
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight">
              Ready to climb the Leaderboard?
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Take our official technical examinations, demonstrate your Java & AWS proficiency, and claim your position among top performers with an industry-verified certificate.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/dashboard/admin/tests"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm shadow-lg shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Take Technical Assessment</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/verify-certificate"
                className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Verify a Certificate</span>
              </Link>
            </div>
          </div>
        </section>

      </div>

      {/* ─── 6. CENTERED STUDENT PROFILE MODAL (COMPACT CLEAN WHITE DESIGN) ─── */}
      <AnimatePresence>
        {selectedStudent && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedStudent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[400px] rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 text-slate-900 overflow-hidden my-4"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer z-20"
                title="Close Profile"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Rank Pill Badge */}
              <div className="flex items-center justify-center mb-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                  {selectedStudent.rank === 1 ? '👑 Ranked #1 Global Champion' : (selectedStudent.rank === 2 ? '🥈 Ranked #2 Runner Up' : (selectedStudent.rank === 3 ? '🥉 Ranked #3 Achiever' : `⭐ Rank #${selectedStudent.rank || 'N/A'}`))}
                </div>
              </div>

              {/* Avatar Section */}
              <div className="text-center relative">
                <div className="relative inline-block my-1">
                  {selectedStudent.rank === 1 && (
                    <div className="text-2xl absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      👑
                    </div>
                  )}
                  <div className="w-20 h-20 rounded-full p-1 bg-amber-100 border-2 border-amber-400 mx-auto overflow-hidden">
                    {selectedStudent.photo ? (
                      <img
                        src={selectedStudent.photo}
                        alt={selectedStudent.candidateName}
                        className="w-full h-full rounded-full object-cover bg-slate-100"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-black text-xl">
                        {getInitials(selectedStudent.candidateName)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Candidate Name */}
                <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1.5">
                  {selectedStudent.candidateName}
                </h2>

                {/* College & Examination */}
                <p className="text-xs font-bold text-amber-600 mt-0.5 max-w-xs mx-auto truncate">
                  {selectedStudent.college || 'Certified Student Candidate'}
                </p>
                {selectedStudent.assessmentTitle && (
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    Assessment: <span className="text-slate-700 font-semibold">{selectedStudent.assessmentTitle}</span>
                  </p>
                )}
              </div>

              {/* Clean Metric Stats Grid */}
              <div className="grid grid-cols-3 gap-2 my-4">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Total XP</div>
                  <div className="text-base font-black text-amber-600 font-mono">
                    {selectedStudent.xp || `${((selectedStudent.percentage || 90) * 250).toLocaleString()} XP`}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Win Rate</div>
                  <div className="text-base font-black text-slate-800 font-mono">
                    {selectedStudent.percentage || 90}%
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Badge</div>
                  <div className="text-xs font-black text-slate-800 flex items-center justify-center gap-1 mt-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{selectedStudent.badge || 'Pro'}</span>
                  </div>
                </div>
              </div>

              {/* Certificate & Verified Credentials */}
              {selectedStudent.certificateNumber ? (
                <div className="mb-4 p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-amber-200/70 text-amber-800 flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-amber-900">Official Exam Certificate</div>
                      <div className="text-[10px] text-slate-600 font-mono font-semibold truncate">{selectedStudent.certificateNumber}</div>
                    </div>
                  </div>
                  <Link
                    to={`/verify-certificate/${selectedStudent.certificateNumber}`}
                    className="px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 border border-yellow-500 text-black text-xs font-black flex items-center gap-1 transition flex-shrink-0 shadow-sm"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3 text-black" />
                  </Link>
                </div>
              ) : (
                <div className="mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-left">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div className="text-[11px] text-slate-600 leading-tight">
                    Verified participant. Certificate is issued upon exam completion.
                  </div>
                </div>
              )}

              {/* Modal Buttons: Like Button and Close Button */}
              <div className="flex items-center gap-2 pt-1">
                {(() => {
                  const likeInfo = getStudentLikeInfo(selectedStudent);
                  return (
                    <button
                      type="button"
                      onClick={() => handleToggleLike(selectedStudent)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 text-black font-black text-xs transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
                      title={likeInfo.userLiked ? 'Unlike this student' : 'Like this student'}
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform duration-200 ${
                          likeInfo.userLiked
                            ? 'fill-rose-600 text-rose-600 scale-125'
                            : 'text-black hover:scale-110'
                        }`}
                      />
                      <span>{likeInfo.userLiked ? 'Liked' : 'Like'}</span>
                      <span className="px-2 py-0.5 rounded-full bg-black/10 text-black text-[11px] font-mono font-black">
                        {likeInfo.count}
                      </span>
                    </button>
                  );
                })()}
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="py-2.5 px-4 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-black font-black border border-yellow-300 text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}