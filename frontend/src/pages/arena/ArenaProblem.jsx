import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Play, Send, CheckCircle2, XCircle, Terminal, 
  RotateCcw, Sparkles, User, Trophy, ShieldCheck, ChevronRight,
  Code2, AlertCircle, AlertTriangle, Check, Copy, ChevronLeft, Shuffle,
  Timer, Pause, PlayCircle, RefreshCw, Maximize2, Minimize2,
  Lightbulb, History, BookOpen, ChevronDown, ChevronUp, Cpu
} from 'lucide-react';
import Swal from 'sweetalert2';
import ArenaAuthModal from './ArenaAuthModal.jsx';

export default function ArenaProblem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [allProblems, setAllProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [copiedInputIdx, setCopiedInputIdx] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active Tab on Left Pane: 'description', 'hints', 'submissions'
  const [activeLeftTab, setActiveLeftTab] = useState('description');

  // Progressive Hints Revealed States
  const [revealedHints, setRevealedHints] = useState({});

  // Submissions History
  const [submissionsList, setSubmissionsList] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Stopwatch / Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  // Test Execution State
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [activeConsoleTab, setActiveConsoleTab] = useState('testcase'); // 'testcase' or 'result'
  const [activeTestTab, setActiveTestTab] = useState(0); // 0, 1, 2, or 'custom'
  const [customInput, setCustomInput] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [submitResults, setSubmitResults] = useState(null);
  const [runTimeMs, setRunTimeMs] = useState(null);

  // Student Auth State
  const [student, setStudent] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Ref for textarea & line gutter
  const textareaRef = useRef(null);
  const lineGutterRef = useRef(null);

  // ─── Stopwatch Timer Effect ───────────────────────────────────────────
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ─── Load Student & Problem Data ──────────────────────────────────────
  useEffect(() => {
    const savedStudent = localStorage.getItem('arena_student');
    if (savedStudent) {
      try {
        setStudent(JSON.parse(savedStudent));
      } catch (e) {}
    }
    fetchProblemDetails();
    fetchAllProblems();
  }, [id]);

  const fetchAllProblems = async () => {
    try {
      const res = await fetch('/api/arena/problems');
      const data = await res.json();
      if (data.success) {
        setAllProblems(data.problems || []);
      }
    } catch (e) {}
  };

  const fetchProblemDetails = async () => {
    setLoading(true);
    setRunResults(null);
    setSubmitResults(null);
    setRevealedHints({});
    setTimerSeconds(0);
    setTimerRunning(true);
    try {
      const res = await fetch(`/api/arena/problems/${id}`);
      const data = await res.json();
      if (data.success && data.problem) {
        setProblem(data.problem);
        // Default custom input
        if (data.problem.sampleTestCases?.[0]?.input) {
          setCustomInput(data.problem.sampleTestCases[0].input);
        }
        // Set default starter code
        if (data.problem.starters) {
          if (data.problem.topic?.includes('SQL') && data.problem.starters.sql) {
            setLanguage('sql');
            setCode(data.problem.starters.sql);
          } else if (data.problem.starters.javascript) {
            setLanguage('javascript');
            setCode(data.problem.starters.javascript);
          } else if (data.problem.starters.java) {
            setLanguage('java');
            setCode(data.problem.starters.java);
          } else if (data.problem.starters.python) {
            setLanguage('python');
            setCode(data.problem.starters.python);
          }
        }
      }
    } catch (err) {
      console.error('Fetch problem error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch submissions when clicking Submissions tab
  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const savedStudent = localStorage.getItem('arena_student');
      let emailParam = '';
      if (savedStudent) {
        const parsed = JSON.parse(savedStudent);
        if (parsed.email) emailParam = `&email=${encodeURIComponent(parsed.email)}`;
      }
      const res = await fetch(`/api/arena/submissions?problemId=${encodeURIComponent(id)}${emailParam}`);
      const data = await res.json();
      if (data.success) {
        setSubmissionsList(data.submissions || []);
      }
    } catch (e) {
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveLeftTab(tab);
    if (tab === 'submissions') {
      fetchSubmissions();
    }
  };

  // Prev / Next / Random Navigation
  const currentIdx = allProblems.findIndex(p => p.id === id);
  const prevProblem = currentIdx > 0 ? allProblems[currentIdx - 1] : null;
  const nextProblem = currentIdx >= 0 && currentIdx < allProblems.length - 1 ? allProblems[currentIdx + 1] : null;

  const handlePickRandom = () => {
    if (allProblems.length <= 1) return;
    const others = allProblems.filter(p => p.id !== id);
    const pick = others[Math.floor(Math.random() * others.length)];
    if (pick) navigate(`/arena/problem/${pick.id}`);
  };

  // Language switch
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (problem?.starters && problem.starters[newLang]) {
      setCode(problem.starters[newLang]);
    }
  };

  // Copy Input Helper
  const handleCopyInput = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedInputIdx(idx);
    setTimeout(() => setCopiedInputIdx(null), 2000);
  };

  // Copy Code Helper
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Editor Tab key handling & line sync
  const handleKeyDown = (e) => {
    // Ctrl + Enter or Cmd + Enter = Run Code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunCode();
      return;
    }
    // Ctrl + S = Submit
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSubmitCode();
      return;
    }
    // Tab key inserts 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const handleScroll = () => {
    if (textareaRef.current && lineGutterRef.current) {
      lineGutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Run Code against Sample Test Cases
  const handleRunCode = async () => {
    if (!code.trim()) return;
    setRunning(true);
    setRunResults(null);
    setSubmitResults(null);
    setConsoleOpen(true);
    setActiveConsoleTab('result');

    const startTime = performance.now();

    try {
      const res = await fetch('/api/arena/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: id,
          code,
          language
        })
      });

      const data = await res.json();
      const endTime = performance.now();
      setRunTimeMs(Math.round(endTime - startTime));
      setRunResults(data);
      setActiveTestTab(0);
    } catch (err) {
      Swal.fire({ 
        icon: 'error', 
        title: 'Execution Error', 
        text: err.message,
        background: '#0d1117',
        color: '#f0f6fc'
      });
    } finally {
      setRunning(false);
    }
  };

  // Submit Code against All Test Cases
  const handleSubmitCode = async () => {
    const token = localStorage.getItem('arena_token');
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    setSubmitting(true);
    setSubmitResults(null);
    setRunResults(null);
    setConsoleOpen(true);
    setActiveConsoleTab('result');

    const startTime = performance.now();

    try {
      const res = await fetch('/api/arena/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId: id,
          code,
          language
        })
      });

      const data = await res.json();
      const endTime = performance.now();
      setRunTimeMs(Math.round(endTime - startTime));

      if (!res.ok) throw new Error(data.error || 'Submission failed.');

      setSubmitResults(data);

      if (data.allPassed) {
        // Update local student solved list & score
        if (student) {
          const updated = {
            ...student,
            score: data.newTotalScore,
            solvedProblems: [...new Set([...(student.solvedProblems || []), id])]
          };
          setStudent(updated);
          localStorage.setItem('arena_student', JSON.stringify(updated));
        }

        Swal.fire({
          icon: 'success',
          title: '🎉 Accepted!',
          html: `<div style="color: #cbd5e1; font-size: 14px;">All test cases passed!<br><strong style="color: #10b981; font-size: 16px;">+${data.awardedPoints || 0} XP Earned</strong></div>`,
          timer: 3500,
          showConfirmButton: false,
          background: '#0d1117',
          color: '#f0f6fc'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Wrong Answer',
          text: 'One or more automated test cases failed. Inspect the console below for details.',
          timer: 3000,
          showConfirmButton: false,
          background: '#0d1117',
          color: '#f0f6fc'
        });
      }
    } catch (err) {
      Swal.fire({ 
        icon: 'error', 
        title: 'Submission Error', 
        text: err.message,
        background: '#0d1117',
        color: '#f0f6fc'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="arena-dark-root min-h-screen bg-[#0a0e17] flex items-center justify-center text-slate-200">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-400">Loading IDE Workspace...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="arena-dark-root min-h-screen bg-[#0a0e17] flex items-center justify-center p-4">
        <div className="text-center bg-[#0d1117] p-8 rounded-3xl border border-[#30363d] max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-black text-white">Challenge Not Found</h2>
          <p className="text-xs text-slate-400 mt-1 mb-4">This challenge does not exist or has been removed.</p>
          <Link to="/arena" className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black text-xs font-bold">
            Back to Arena Hub
          </Link>
        </div>
      </div>
    );
  }

  const isSolved = student?.solvedProblems?.includes(problem.id);
  const activeCases = submitResults?.testResults || runResults?.results || problem.sampleTestCases || [];
  const lineCount = Math.max(code.split('\n').length, 18);

  return (
    <div className={`arena-dark-root min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col select-none ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      
      {/* ─── Top IDE Navigation Bar (LeetCode Style) ─────────────────── */}
      <header className="h-14 bg-[#0d1117] border-b border-[#30363d] px-4 flex items-center justify-between flex-shrink-0 z-20">
        
        {/* Left: Problem Navigation & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/arena"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-slate-300 hover:text-white transition text-xs font-bold"
            title="Problem List"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Problem List</span>
          </Link>

          {/* Prev / Next / Random Switcher */}
          <div className="flex items-center gap-1 border-l border-[#30363d] pl-3">
            <button
              onClick={() => prevProblem && navigate(`/arena/problem/${prevProblem.id}`)}
              disabled={!prevProblem}
              title={prevProblem ? `Previous: ${prevProblem.title}` : 'No previous problem'}
              className="p-1.5 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => nextProblem && navigate(`/arena/problem/${nextProblem.id}`)}
              disabled={!nextProblem}
              title={nextProblem ? `Next: ${nextProblem.title}` : 'No next problem'}
              className="p-1.5 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handlePickRandom}
              title="Pick Random Problem"
              className="p-1.5 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-slate-300 transition cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Problem Title & Difficulty Badge */}
          <div className="flex items-center gap-2 truncate pl-2 border-l border-[#30363d]">
            <span className="font-extrabold text-sm text-white truncate max-w-[200px] sm:max-w-xs">
              {problem.title}
            </span>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                problem.difficulty === 'Easy'
                  ? 'bg-[#00b8a3]/15 text-[#00b8a3] border-[#00b8a3]/30'
                  : problem.difficulty === 'Medium'
                  ? 'bg-[#ffa116]/15 text-[#ffa116] border-[#ffa116]/30'
                  : 'bg-[#ff375f]/15 text-[#ff375f] border-[#ff375f]/30'
              }`}
            >
              {problem.difficulty}
            </span>
            {isSolved && (
              <span className="hidden md:inline-flex text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                ✓ Solved
              </span>
            )}
          </div>
        </div>

        {/* Center: Interview Stopwatch Timer */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-[#161b22] border border-[#30363d] text-xs font-mono font-bold text-slate-300">
          <Timer className="w-3.5 h-3.5 text-emerald-400" />
          <span>{formatTimer(timerSeconds)}</span>
          <button
            onClick={() => setTimerRunning(!timerRunning)}
            title={timerRunning ? 'Pause Timer' : 'Resume Timer'}
            className="text-slate-400 hover:text-white cursor-pointer ml-1"
          >
            {timerRunning ? <Pause className="w-3 h-3" /> : <PlayCircle className="w-3 h-3 text-emerald-400" />}
          </button>
          <button
            onClick={() => setTimerSeconds(0)}
            title="Reset Timer"
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <RefreshCw className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Right: Actions, Language & Profile */}
        <div className="flex items-center gap-2">
          
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-[#161b22] border border-[#30363d] text-xs font-bold text-slate-200 rounded-xl px-2.5 py-1.5 outline-none cursor-pointer hover:border-[#484f58]"
          >
            {problem.topic?.includes('SQL') ? (
              <option value="sql">SQL (Alasql)</option>
            ) : null}
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="java">Java (JDK 25 LTS)</option>
            <option value="python">Python 3</option>
          </select>

          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            disabled={running || submitting}
            title="Run Code (Ctrl + Enter)"
            className="px-3.5 py-1.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 text-emerald-400 ${running ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{running ? 'Running...' : 'Run'}</span>
          </button>

          {/* Submit Code Button */}
          <button
            onClick={handleSubmitCode}
            disabled={running || submitting}
            title="Submit Solution (Ctrl + S)"
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#0a0e17] text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Testing...' : 'Submit'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-slate-400 hover:text-white transition cursor-pointer hidden sm:block"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Student Status Badge */}
          {student ? (
            <Link 
              to="/student/profile" 
              title={`View ${student.name}'s Profile`}
              className="flex items-center gap-2 pl-2 border-l border-[#30363d] group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl overflow-hidden border border-emerald-500/50 bg-[#161b22] group-hover:border-emerald-400 group-hover:scale-105 transition-all">
                {student.photo ? (
                  <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-emerald-400">
                    {student.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </Link>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/20 transition cursor-pointer"
            >
              Sign In
            </button>
          )}

        </div>

      </header>

      {/* ─── Two-Column Split Workspace ───────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* ─── Left Column: Problem Tabs (Description, Hints, Submissions) ── */}
        <div className="w-full md:w-1/2 h-[45vh] md:h-auto flex flex-col border-r border-[#30363d] bg-[#0d1117]">
          
          {/* Left Panel Tabs Header */}
          <div className="h-10 px-4 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTabChange('description')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  activeLeftTab === 'description'
                    ? 'bg-[#0d1117] text-white border border-[#30363d] shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3 h-3 text-emerald-400" />
                <span>Description</span>
              </button>

              <button
                onClick={() => handleTabChange('hints')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  activeLeftTab === 'hints'
                    ? 'bg-[#0d1117] text-white border border-[#30363d] shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lightbulb className="w-3 h-3 text-amber-400" />
                <span>Hints & Editorial</span>
                {problem.hints && problem.hints.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                    {problem.hints.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabChange('submissions')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  activeLeftTab === 'submissions'
                    ? 'bg-[#0d1117] text-white border border-[#30363d] shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <History className="w-3 h-3 text-indigo-400" />
                <span>Submissions</span>
              </button>
            </div>
          </div>

          {/* Left Panel Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* ─── TAB 1: DESCRIPTION ─────────────────────────────────── */}
            {activeLeftTab === 'description' && (
              <div className="space-y-6">
                
                {/* Title & Metadata */}
                <div>
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl sm:text-2xl font-black text-white">{problem.title}</h1>
                    <span className="text-xs font-bold text-amber-400 font-mono">{problem.points} XP</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-[#161b22] text-slate-300 border border-[#30363d]">
                      {problem.topic}
                    </span>
                    {problem.companies?.map(c => (
                      <span key={c} className="px-2 py-0.5 rounded-md bg-indigo-950/40 text-indigo-300 border border-indigo-500/20 text-[11px]">
                        {c}
                      </span>
                    ))}
                    <span className="text-slate-400 ml-auto font-mono text-[11px]">
                      Acceptance: {problem.successRate}
                    </span>
                  </div>
                </div>

                {/* Problem Statement */}
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-sans">
                  {problem.description}
                </div>

                {/* Input / Output Format */}
                {problem.inputFormat && (
                  <div className="space-y-1.5 p-4 rounded-2xl bg-[#161b22] border border-[#30363d]">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Input Format</div>
                    <pre className="text-xs text-slate-200 font-mono whitespace-pre-line">{problem.inputFormat}</pre>
                  </div>
                )}

                {problem.outputFormat && (
                  <div className="space-y-1.5 p-4 rounded-2xl bg-[#161b22] border border-[#30363d]">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Output Format</div>
                    <pre className="text-xs text-slate-200 font-mono whitespace-pre-line">{problem.outputFormat}</pre>
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && problem.constraints.length > 0 && (
                  <div className="space-y-2 p-4 rounded-2xl bg-[#161b22]/50 border border-[#30363d]">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Constraints</div>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300 font-mono">
                      {problem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sample Test Cases with Copy Button */}
                <div className="space-y-4 pt-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sample Test Cases</div>
                  {problem.sampleTestCases?.map((tc, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#161b22] border border-[#30363d] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400">Example {idx + 1}</span>
                        <button
                          onClick={() => handleCopyInput(tc.input, idx)}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedInputIdx === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Input</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase">Input:</span>
                        <pre className="text-xs text-slate-200 font-mono bg-[#0d1117] p-2.5 rounded-xl mt-1 overflow-x-auto border border-[#30363d]">
                          {tc.input}
                        </pre>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase">Output:</span>
                        <pre className="text-xs text-emerald-400 font-mono bg-[#0d1117] p-2.5 rounded-xl mt-1 overflow-x-auto border border-[#30363d]">
                          {tc.output}
                        </pre>
                      </div>

                      {tc.explanation && (
                        <p className="text-xs text-slate-400 italic pt-1">
                          Explanation: {tc.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ─── TAB 2: HINTS & EDITORIAL ───────────────────────────── */}
            {activeLeftTab === 'hints' && (
              <div className="space-y-6">
                
                {/* Target Complexity */}
                {problem.editorial && (
                  <div className="p-4 rounded-2xl bg-[#161b22] border border-[#30363d] space-y-3">
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" />
                      <span>Target Complexity</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-[#0d1117] border border-[#30363d]">
                        <span className="text-slate-500 block text-[10px]">Time Complexity</span>
                        <span className="text-emerald-400 font-bold text-sm">{problem.editorial.timeComplexity}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#0d1117] border border-[#30363d]">
                        <span className="text-slate-500 block text-[10px]">Space Complexity</span>
                        <span className="text-emerald-400 font-bold text-sm">{problem.editorial.spaceComplexity}</span>
                      </div>
                    </div>
                    {problem.editorial.approach && (
                      <p className="text-xs text-slate-300 leading-relaxed pt-1">
                        <strong>Optimal Approach:</strong> {problem.editorial.approach}
                      </p>
                    )}
                  </div>
                )}

                {/* Progressive Hints Accordion */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Progressive Hints</div>
                  {problem.hints && problem.hints.length > 0 ? (
                    problem.hints.map((hintText, hIdx) => {
                      const isRevealed = revealedHints[hIdx];
                      return (
                        <div key={hIdx} className="rounded-2xl bg-[#161b22] border border-[#30363d] overflow-hidden">
                          <button
                            onClick={() => setRevealedHints(prev => ({ ...prev, [hIdx]: !prev[hIdx] }))}
                            className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-slate-200 hover:text-white cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                              <span>Hint {hIdx + 1}</span>
                            </span>
                            {isRevealed ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </button>
                          {isRevealed ? (
                            <div className="p-3.5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-[#30363d]/60 bg-[#0d1117]/60 font-sans">
                              {hintText}
                            </div>
                          ) : (
                            <div className="px-3.5 pb-3 text-[11px] text-slate-500">
                              Click to reveal clue...
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-slate-500 text-center py-6">
                      No hints available for this problem. You can solve it!
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ─── TAB 3: SUBMISSIONS HISTORY ─────────────────────────── */}
            {activeLeftTab === 'submissions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Past Attempts</span>
                  <button
                    onClick={fetchSubmissions}
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingSubmissions ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {loadingSubmissions ? (
                  <div className="text-center py-8 text-xs text-slate-500">Loading submissions...</div>
                ) : submissionsList.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    No submissions recorded yet for this challenge. Click Submit to evaluate your solution!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {submissionsList.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          {sub.status === 'Accepted' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )}
                          <div>
                            <span className={`font-bold ${sub.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {sub.status}
                            </span>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {new Date(sub.submittedAt).toLocaleTimeString()} • {new Date(sub.submittedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] font-mono text-slate-300 uppercase px-2 py-0.5 rounded bg-[#0d1117] border border-[#30363d]">
                            {sub.language}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* ─── Right Column: Code Editor & Execution Console Drawer ────── */}
        <div className="w-full md:w-1/2 flex flex-col h-[55vh] md:h-auto overflow-hidden bg-[#0a0e17]">
          
          {/* Editor Header Bar */}
          <div className="h-10 px-4 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-xs text-slate-300 font-mono flex-shrink-0">
            <div className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Solution.{language === 'java' ? 'java' : language === 'python' ? 'py' : language === 'sql' ? 'sql' : 'js'}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Font Size Selector */}
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
                <span>Font:</span>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="bg-[#0d1117] border border-[#30363d] rounded px-1.5 py-0.5 text-[11px] text-slate-300 outline-none cursor-pointer"
                >
                  <option value={12}>12px</option>
                  <option value={14}>14px</option>
                  <option value={16}>16px</option>
                </select>
              </div>

              {/* Copy Code */}
              <button
                onClick={handleCopyCode}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span className="hidden sm:inline">{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>

              {/* Reset Template */}
              <button
                onClick={() => {
                  if (problem.starters?.[language]) setCode(problem.starters[language]);
                }}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Code Textarea Area with Real Line Gutter */}
          <div className="flex-1 relative flex overflow-hidden bg-[#0d1117]">
            {/* Line numbers gutter */}
            <div
              ref={lineGutterRef}
              className="w-11 py-4 bg-[#090d13] border-r border-[#30363d]/60 text-right pr-2 select-none overflow-hidden text-slate-600 font-mono"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
            >
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editable Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              spellCheck="false"
              className="flex-1 p-4 bg-[#0d1117] text-[#f0f6fc] font-mono leading-relaxed resize-none outline-none focus:ring-0 border-none select-text overflow-y-auto"
              style={{ 
                fontSize: `${fontSize}px`, 
                lineHeight: '1.6',
                tabSize: 2 
              }}
              placeholder="// Type your algorithmic solution here..."
            />
          </div>

          {/* ─── Bottom Console / Test Results Drawer ──────────────────── */}
          <div className={`border-t border-[#30363d] bg-[#0d1117] flex flex-col transition-all duration-200 ${
            consoleOpen ? 'h-64 sm:h-72' : 'h-10'
          }`}>
            
            {/* Drawer Header Tabs */}
            <div className="h-10 px-4 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setConsoleOpen(true); setActiveConsoleTab('testcase'); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeConsoleTab === 'testcase' && consoleOpen
                      ? 'bg-[#0d1117] text-white border border-[#30363d]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Testcase</span>
                </button>

                <button
                  onClick={() => { setConsoleOpen(true); setActiveConsoleTab('result'); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeConsoleTab === 'result' && consoleOpen
                      ? 'bg-[#0d1117] text-white border border-[#30363d]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Test Result</span>
                  {submitResults ? (
                    <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      submitResults.allPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {submitResults.allPassed ? 'Accepted' : 'Wrong Answer'}
                    </span>
                  ) : runResults ? (
                    <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      runResults.allPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {runResults.allPassed ? 'Passed' : 'Failed'}
                    </span>
                  ) : null}
                </button>
              </div>

              {/* Toggle Drawer Open / Close */}
              <button
                onClick={() => setConsoleOpen(!consoleOpen)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                title={consoleOpen ? 'Collapse Console' : 'Expand Console'}
              >
                {consoleOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>

            {/* Console Drawer Body */}
            {consoleOpen && (
              <div className="flex-1 p-4 overflow-y-auto text-xs font-mono space-y-3 bg-[#0d1117]">
                
                {/* ─── CONSOLE TAB 1: TESTCASE ─────────────────────────── */}
                {activeConsoleTab === 'testcase' && (
                  <div className="space-y-3">
                    {/* Case Tabs */}
                    <div className="flex items-center gap-2 border-b border-[#30363d]/60 pb-2">
                      {problem.sampleTestCases?.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveTestTab(idx)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeTestTab === idx
                              ? 'bg-[#21262d] text-white border border-[#30363d]'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setActiveTestTab('custom')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          activeTestTab === 'custom'
                            ? 'bg-[#21262d] text-emerald-400 border border-emerald-500/40'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        + Custom Input
                      </button>
                    </div>

                    {/* Case View */}
                    {activeTestTab === 'custom' ? (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Custom Input:</span>
                        <textarea
                          value={customInput}
                          onChange={(e) => setCustomInput(e.target.value)}
                          className="w-full h-24 p-2.5 rounded-xl bg-[#161b22] text-slate-200 border border-[#30363d] mt-1 outline-none focus:border-emerald-500 text-xs font-mono"
                          placeholder="nums = [2, 7, 11, 15], target = 9"
                        />
                      </div>
                    ) : problem.sampleTestCases?.[activeTestTab] ? (
                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Input:</span>
                          <pre className="p-2.5 rounded-xl bg-[#161b22] text-slate-200 mt-1 overflow-x-auto border border-[#30363d] text-xs">
                            {problem.sampleTestCases[activeTestTab].input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Expected Output:</span>
                          <pre className="p-2.5 rounded-xl bg-[#161b22] text-emerald-400 mt-1 overflow-x-auto border border-[#30363d] text-xs">
                            {problem.sampleTestCases[activeTestTab].output}
                          </pre>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* ─── CONSOLE TAB 2: TEST RESULT ──────────────────────── */}
                {activeConsoleTab === 'result' && (
                  <div className="space-y-3">
                    {submitResults || runResults ? (
                      <>
                        {/* Status Header Banner */}
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#161b22] border border-[#30363d]">
                          <div className="flex items-center gap-2">
                            {(submitResults?.allPassed || runResults?.allPassed) ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <span className="font-black text-sm text-emerald-400">
                                  {submitResults ? 'Accepted' : 'Sample Testcases Passed'}
                                </span>
                              </>
                            ) : (submitResults?.hasCompilationError || runResults?.hasCompilationError) ? (
                              <>
                                <AlertTriangle className="w-5 h-5 text-rose-400" />
                                <span className="font-black text-sm text-rose-400">
                                  Compilation Error
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-5 h-5 text-rose-400" />
                                <span className="font-black text-sm text-rose-400">
                                  {submitResults ? 'Wrong Answer' : 'Sample Testcase Failed'}
                                </span>
                              </>
                            )}
                          </div>

                          {runTimeMs !== null && (
                            <span className="text-xs text-slate-400 font-mono">
                              ⚡ Runtime: <strong className="text-emerald-400">{runTimeMs} ms</strong>
                            </span>
                          )}
                        </div>

                        {/* Testcase Subtabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#30363d]/60 pb-2">
                          {activeCases.map((tc, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveTestTab(idx)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                activeTestTab === idx
                                  ? 'bg-[#21262d] text-white border border-[#30363d]'
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <span>Case {idx + 1}</span>
                              {tc.passed === true && <span className="text-emerald-400 text-xs">✓</span>}
                              {tc.passed === false && <span className="text-rose-400 text-xs">✗</span>}
                            </button>
                          ))}
                        </div>

                        {/* Case Details */}
                        {activeCases[activeTestTab] && (
                          <div className="space-y-2.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Input:</span>
                                <pre className="p-2.5 rounded-xl bg-[#161b22] text-slate-300 mt-1 overflow-x-auto text-[11px] border border-[#30363d]">
                                  {activeCases[activeTestTab].input}
                                </pre>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Expected Output:</span>
                                <pre className="p-2.5 rounded-xl bg-[#161b22] text-emerald-400 mt-1 overflow-x-auto text-[11px] border border-[#30363d]">
                                  {activeCases[activeTestTab].expected || activeCases[activeTestTab].output}
                                </pre>
                              </div>
                            </div>

                            {activeCases[activeTestTab].actual !== undefined && (
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Your Output:</span>
                                <pre className={`p-2.5 rounded-xl bg-[#161b22] mt-1 overflow-x-auto text-[11px] border border-[#30363d] font-mono whitespace-pre-wrap ${
                                  activeCases[activeTestTab].passed ? 'text-emerald-400' : 'text-rose-400'
                                }`}>
                                  {activeCases[activeTestTab].actual}
                                </pre>
                              </div>
                            )}

                            {(runResults?.stdout || submitResults?.stdout) && (
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Standard Output (Stdout):</span>
                                <pre className="p-2.5 rounded-xl bg-[#161b22] text-slate-200 mt-1 overflow-x-auto text-[11px] border border-[#30363d] font-mono whitespace-pre-wrap">
                                  {runResults?.stdout || submitResults?.stdout}
                                </pre>
                              </div>
                            )}

                            {activeCases[activeTestTab].error && (
                              <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs font-mono space-y-1.5">
                                <div className="font-bold text-rose-200 flex items-center gap-1.5">
                                  <AlertCircle className="w-4 h-4 text-rose-400" />
                                  <span>Compiler / Execution Diagnostic:</span>
                                </div>
                                <pre className="whitespace-pre-wrap text-[11px] text-rose-300 overflow-x-auto bg-black/50 p-3 rounded-lg border border-rose-900/60 leading-relaxed select-text font-mono">
                                  {activeCases[activeTestTab].error}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-slate-500 text-center py-6">
                        Click <strong>Run</strong> to test sample cases or <strong>Submit</strong> to evaluate against all hidden testcases.
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

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
