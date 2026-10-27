import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Terminal, Code2, Trophy, Search, Filter, CheckCircle2, 
  Circle, Star, Sparkles, User, LogOut, ArrowRight, 
  ChevronRight, Award, Flame, Database, ShieldCheck, 
  Layers, ExternalLink, RefreshCw, Shuffle, Clock,
  Check, Zap, BookOpen, Building2, TrendingUp, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ArenaAuthModal from './ArenaAuthModal.jsx';

export default function ArenaHub() {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all', 'solved', 'unsolved'
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Top Coders Leaderboard
  const [leaderboard, setLeaderboard] = useState([]);

  // Current logged in arena student
  const [student, setStudent] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Topics
  const topics = [
    { id: 'all', name: 'All Topics' },
    { id: 'Arrays', name: 'Arrays & Hashing' },
    { id: 'Strings', name: 'Strings' },
    { id: 'Algorithms', name: 'Algorithms' },
    { id: 'Stack', name: 'Stack & Queues' },
    { id: 'Core Java', name: 'Core Java' },
    { id: 'SQL', name: 'SQL & Database' }
  ];

  // Featured Companies
  const companies = ['All', 'Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Uber'];

  useEffect(() => {
    // Load student from localStorage
    const savedStudent = localStorage.getItem('arena_student');
    if (savedStudent) {
      try {
        setStudent(JSON.parse(savedStudent));
      } catch (e) {}
    }
    fetchProblems();
    fetchLeaderboard();
  }, [selectedTopic, selectedDifficulty]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      let url = '/api/arena/problems?';
      if (selectedTopic !== 'all') url += `topic=${encodeURIComponent(selectedTopic)}&`;
      if (selectedDifficulty !== 'all') url += `difficulty=${encodeURIComponent(selectedDifficulty)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProblems(data.problems || []);
      }
    } catch (err) {
      console.error('Fetch problems error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/arena/leaderboard');
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.leaderboard || []);
      }
    } catch (e) {}
  };

  const handleLogout = () => {
    localStorage.removeItem('arena_token');
    localStorage.removeItem('arena_student');
    setStudent(null);
  };

  // Pick Random Problem (LeetCode Shuffle feature)
  const handlePickRandom = () => {
    if (!problems || problems.length === 0) return;
    const unsolved = problems.filter(p => !student?.solvedProblems?.includes(p.id));
    const pool = unsolved.length > 0 ? unsolved : problems;
    const randomProblem = pool[Math.floor(Math.random() * pool.length)];
    if (randomProblem) {
      navigate(`/arena/problem/${randomProblem.id}`);
    }
  };

  // Filter problems by status, search, and company
  const filteredProblems = problems.filter((p) => {
    const isSolved = student?.solvedProblems?.includes(p.id);

    if (selectedStatus === 'solved' && !isSolved) return false;
    if (selectedStatus === 'unsolved' && isSolved) return false;

    if (selectedCompany !== 'all') {
      if (!p.companies || !p.companies.includes(selectedCompany)) return false;
    }

    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    const matchCompany = (p.companies || []).some(c => c.toLowerCase().includes(q));
    return (
      p.title.toLowerCase().includes(q) ||
      p.topic.toLowerCase().includes(q) ||
      p.difficulty.toLowerCase().includes(q) ||
      matchCompany
    );
  });

  // Calculate stats
  const totalCount = problems.length;
  const solvedCount = student?.solvedProblems?.length || 0;
  const easyTotal = problems.filter(p => p.difficulty === 'Easy').length;
  const easySolved = problems.filter(p => p.difficulty === 'Easy' && student?.solvedProblems?.includes(p.id)).length;
  const medTotal = problems.filter(p => p.difficulty === 'Medium').length;
  const medSolved = problems.filter(p => p.difficulty === 'Medium' && student?.solvedProblems?.includes(p.id)).length;
  const hardTotal = problems.filter(p => p.difficulty === 'Hard').length;
  const hardSolved = problems.filter(p => p.difficulty === 'Hard' && student?.solvedProblems?.includes(p.id)).length;

  // Daily Challenge Problem (LeetCode Problem of the Day)
  const dailyProblem = problems.find(p => p.id === 'climbing-stairs') || problems[0] || null;

  return (
    <div className="arena-dark-root min-h-screen bg-[#0a0e17] text-slate-100 font-sans pb-24 selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* ─── Ambient Glow Background ───────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-gradient-to-b from-emerald-500/10 via-indigo-500/10 to-transparent blur-[140px]" />
        <div className="absolute top-[30%] right-[5%] w-[450px] h-[350px] rounded-full bg-purple-500/8 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* ─── Hero Header & LeetCode/HackerRank Banner ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Main Hero Card (2 cols) */}
          <div className="lg:col-span-2 bg-[#0d1117] border border-[#30363d] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>LeetCode & HackerRank Coding Arena</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
                Master Code & Crush Technical Interviews
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
                Solve real interview questions asked at top tech giants like Google, Amazon, Meta & Microsoft. Test your code against automated test cases, build algorithmic muscle, and climb the leaderboard!
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-[#30363d]/60">
              <button
                onClick={handlePickRandom}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#0a0e17] font-black text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Pick Random 🔀</span>
              </button>

              <Link
                to="/leaderboard"
                className="px-4 py-2.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>View Full Leaderboard</span>
              </Link>

              <div className="text-xs text-slate-500 font-medium ml-auto hidden sm:block">
                ⚡ {totalCount} Problems Available
              </div>
            </div>

          </div>

          {/* User Stats Meter / Auth Card (1 col) */}
          <div className="bg-[#0d1117] border border-[#30363d] rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            {student ? (
              <div className="space-y-4">
                {/* Profile Header */}
                <Link 
                  to="/student/profile" 
                  className="flex items-center gap-3.5 pb-4 border-b border-[#30363d] hover:bg-[#161b22]/50 -mx-2 -mt-2 p-2 rounded-2xl transition group cursor-pointer"
                  title="View Student Profile"
                >
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-[#161b22] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-emerald-400 group-hover:scale-105 transition-all">
                    {student.photo ? (
                      <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-sm text-emerald-400 bg-emerald-950/40">
                        {student.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                      <span className="group-hover:text-emerald-400 transition-colors">{student.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                        🔥 Streak
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 truncate flex items-center justify-between mt-0.5">
                      <span className="truncate">{student.email}</span>
                      <span className="text-[10px] text-emerald-400 font-bold group-hover:underline flex items-center gap-0.5 flex-shrink-0">
                        Profile ↗
                      </span>
                    </div>
                  </div>
                </Link>

                {/* LeetCode Circular Progress & Breakdown */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                    <span className="text-slate-300">Progress Solved</span>
                    <span className="text-emerald-400 font-mono">{solvedCount} / {totalCount}</span>
                  </div>
                  <div className="w-full h-2 bg-[#21262d] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" 
                      style={{ width: `${totalCount > 0 ? (solvedCount / totalCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Difficulty Counters Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2.5 rounded-xl bg-[#161b22] border border-[#30363d]">
                    <div className="text-[10px] font-bold text-[#00b8a3] uppercase tracking-wider">Easy</div>
                    <div className="text-sm font-black text-white mt-0.5">{easySolved}/{easyTotal}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#161b22] border border-[#30363d]">
                    <div className="text-[10px] font-bold text-[#ffa116] uppercase tracking-wider">Med</div>
                    <div className="text-sm font-black text-white mt-0.5">{medSolved}/{medTotal}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#161b22] border border-[#30363d]">
                    <div className="text-[10px] font-bold text-[#ff375f] uppercase tracking-wider">Hard</div>
                    <div className="text-sm font-black text-white mt-0.5">{hardSolved}/{hardTotal}</div>
                  </div>
                </div>

                {/* Total XP & Logout */}
                <div className="flex items-center justify-between pt-2 border-t border-[#30363d]/60">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Total XP: <strong className="text-amber-400">{student.score || 0}</strong></span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer transition"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center p-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Track Your Progress</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Sign in with your Email & DOB to unlock submissions, save solved status, earn XP badges, and climb the ranks!
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#0a0e17] font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Student Sign In / Register</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* ─── Problem of the Day Banner (LeetCode Daily) ──────────────── */}
        {dailyProblem && (
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#161b22] via-[#0d1117] to-[#161b22] border border-[#30363d] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Problem of the Day
                  </span>
                  <span className="text-[10px] font-black text-emerald-400">+50 Bonus XP</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-1">
                  {dailyProblem.title}
                </h3>
                <div className="flex items-center gap-2.5 text-xs text-slate-400 mt-0.5">
                  <span className={`font-bold ${
                    dailyProblem.difficulty === 'Easy' ? 'text-[#00b8a3]' : dailyProblem.difficulty === 'Medium' ? 'text-[#ffa116]' : 'text-[#ff375f]'
                  }`}>
                    {dailyProblem.difficulty}
                  </span>
                  <span>•</span>
                  <span>Topic: {dailyProblem.topic}</span>
                  {dailyProblem.companies && (
                    <>
                      <span>•</span>
                      <span>Asked at: <strong className="text-slate-300">{dailyProblem.companies.slice(0, 2).join(', ')}</strong></span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Link
              to={`/arena/problem/${dailyProblem.id}`}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <span>Solve Daily Challenge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* ─── Filters & Search Strip ──────────────────────────────────── */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-3xl p-5 mb-6 space-y-4 shadow-xl">
          
          {/* Top Filter Row: Search + Difficulty + Status + Company */}
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search problem, topic or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-[#161b22] border border-[#30363d] rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-slate-500 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropdown Filters */}
            <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
              
              {/* Difficulty */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-2 text-xs font-bold text-slate-300 outline-none cursor-pointer hover:border-[#484f58]"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              {/* Status */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-2 text-xs font-bold text-slate-300 outline-none cursor-pointer hover:border-[#484f58]"
              >
                <option value="all">All Status</option>
                <option value="solved">Solved Only</option>
                <option value="unsolved">Todo / Unsolved</option>
              </select>

              {/* Company Filter */}
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-2 text-xs font-bold text-slate-300 outline-none cursor-pointer hover:border-[#484f58]"
              >
                {companies.map(c => (
                  <option key={c} value={c === 'All' ? 'all' : c}>
                    {c === 'All' ? 'All Companies' : c}
                  </option>
                ))}
              </select>

              <button
                onClick={fetchProblems}
                disabled={loading}
                title="Refresh Problems"
                className="p-2 rounded-xl bg-[#161b22] border border-[#30363d] text-slate-400 hover:text-emerald-400 transition cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              </button>

            </div>

          </div>

          {/* Topic Pills Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-[#30363d]/50 pt-3">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedTopic === t.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-[#161b22] border border-[#30363d] text-slate-400 hover:text-slate-200 hover:bg-[#21262d]'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

        </div>

        {/* ─── Main Content Grid: Problems Table (2/3) + Leaderboard (1/3) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Problem List (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            
            {/* Table Header Bar */}
            <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-2.5 text-xs font-bold text-slate-400 uppercase tracking-wider bg-[#0d1117] border border-[#30363d] rounded-2xl">
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-6">Title & Tags</div>
              <div className="col-span-2 text-center">Acceptance</div>
              <div className="col-span-2 text-center">Difficulty</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {loading ? (
              <div className="p-12 text-center bg-[#0d1117] rounded-3xl border border-[#30363d]">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-400">Loading Coding Arena challenges...</p>
              </div>
            ) : filteredProblems.length === 0 ? (
              <div className="p-12 text-center bg-[#0d1117] rounded-3xl border border-[#30363d]">
                <Terminal className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No challenges match your filters</h3>
                <p className="text-xs text-slate-500 mt-1">Try switching topics, clear search, or reset company filters.</p>
              </div>
            ) : (
              filteredProblems.map((problem) => {
                const isSolved = student?.solvedProblems?.includes(problem.id);

                return (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0d1117] border border-[#30363d] hover:border-emerald-500/40 rounded-2xl p-4 sm:p-4 transition-all flex flex-col sm:grid sm:grid-cols-12 sm:gap-3 sm:items-center hover:bg-[#161b22] group"
                  >
                    {/* Status Col */}
                    <div className="hidden sm:flex sm:col-span-1 justify-center">
                      {isSolved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-500" />
                      )}
                    </div>

                    {/* Title & Tags Col */}
                    <div className="sm:col-span-6 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/arena/problem/${problem.id}`}
                          className="text-sm font-black text-white hover:text-emerald-400 transition truncate cursor-pointer"
                        >
                          {problem.title}
                        </Link>
                        {isSolved && (
                          <span className="sm:hidden text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400">
                            ✓ Solved
                          </span>
                        )}
                      </div>

                      {/* Topic & Companies Subline */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-[#21262d] text-slate-300 font-medium">
                          {problem.topic}
                        </span>
                        {problem.companies?.slice(0, 3).map((comp) => (
                          <span key={comp} className="px-1.5 py-0.5 rounded bg-indigo-950/40 text-indigo-300 border border-indigo-500/20 text-[10px]">
                            {comp}
                          </span>
                        ))}
                        <span className="text-amber-400 font-bold ml-auto sm:ml-0">
                          {problem.points} XP
                        </span>
                      </div>
                    </div>

                    {/* Acceptance Col */}
                    <div className="hidden sm:block sm:col-span-2 text-center text-xs font-mono text-slate-400">
                      {problem.successRate}
                    </div>

                    {/* Difficulty Col */}
                    <div className="sm:col-span-2 text-center my-2 sm:my-0">
                      <span
                        className={`inline-block text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                          problem.difficulty === 'Easy'
                            ? 'bg-[#00b8a3]/10 text-[#00b8a3] border-[#00b8a3]/30'
                            : problem.difficulty === 'Medium'
                            ? 'bg-[#ffa116]/10 text-[#ffa116] border-[#ffa116]/30'
                            : 'bg-[#ff375f]/10 text-[#ff375f] border-[#ff375f]/30'
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>

                    {/* Action Col */}
                    <div className="sm:col-span-1 text-right mt-2 sm:mt-0">
                      <Link
                        to={`/arena/problem/${problem.id}`}
                        className={`w-full sm:w-auto px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSolved
                            ? 'bg-[#21262d] hover:bg-[#30363d] text-slate-300'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-[#0a0e17] font-black'
                        }`}
                      >
                        <span>{isSolved ? 'Review' : 'Solve'}</span>
                      </Link>
                    </div>

                  </motion.div>
                );
              })
            )}

          </div>

          {/* Leaderboard Sidebar Widget (1 col) */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Top Coders Leaderboard */}
            <div className="bg-[#0d1117] border border-[#30363d] rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#30363d]">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-black text-white">Top Arena Coders</h3>
                </div>
                <Link
                  to="/leaderboard"
                  className="text-[10px] text-emerald-400 hover:underline font-bold"
                >
                  View All
                </Link>
              </div>

              {leaderboard.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  Leaderboard warming up...
                </div>
              ) : (
                <div className="space-y-2.5">
                  {leaderboard.slice(0, 5).map((u, i) => (
                    <div
                      key={u.email || i}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#161b22] border border-[#30363d]/50 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-5 text-center font-black ${
                          i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-slate-500'
                        }`}>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                        </span>
                        <div className="truncate">
                          <div className="font-bold text-white truncate max-w-[110px]">{u.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{u.solvedCount} solved</div>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-amber-400 text-xs flex-shrink-0">
                        {u.score} XP
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pro Tip Card */}
            <div className="bg-gradient-to-b from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-3xl p-5 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>Interview Pro Tip</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Always analyze time and space complexity before coding. Most coding interviews at FAANG reward optimal <strong>O(N)</strong> solutions over brute-force <strong>O(N²)</strong> loops.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Auth Modal */}
      <ArenaAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(newStudent) => setStudent(newStudent)}
      />

    </div>
  );
}
