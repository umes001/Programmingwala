import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Calendar, Trophy, Zap, Flame, ShieldCheck, 
  ArrowLeft, ArrowRight, Code2, Terminal, CheckCircle2, 
  XCircle, Clock, Award, Sparkles, ExternalLink, LogOut, 
  Edit3, Camera, Save, RefreshCw, Layers, Check, ChevronRight,
  BookOpen, FileText, CheckCircle, AlertTriangle, Eye, Printer,
  Filter, HelpCircle, ChevronDown, ChevronUp, Share2, Copy
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ArenaProfile() {
  const navigate = useNavigate();
  const { user: authUser, logout: authLogout } = useAuth();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [problems, setProblems] = useState([]);
  const [leaderboardRank, setLeaderboardRank] = useState(null);

  // New Exam & Certificate States
  const [certificates, setCertificates] = useState([]);
  const [examAttempts, setExamAttempts] = useState([]);
  const [activeTab, setActiveTab] = useState('certificates'); // 'certificates' | 'exams' | 'arena'
  const [expandedExamId, setExpandedExamId] = useState(null);
  const [questionFilter, setQuestionFilter] = useState('all'); // 'all' | 'wrong' | 'correct'

  // Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCollege, setEditCollege] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editPhoto, setEditPhoto] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfileData();
  }, [authUser]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      // 1. Identify active student identity from multiple sources
      let activeEmail = null;
      let initialData = {};

      if (authUser && authUser.email) {
        activeEmail = authUser.email;
        initialData = {
          email: authUser.email,
          name: authUser.name || 'Student',
          college: authUser.college || '',
          photo: authUser.photo || ''
        };
      } else {
        const savedStudent = localStorage.getItem('arena_student') || 
                             localStorage.getItem('user') || 
                             localStorage.getItem('student_user');
        if (savedStudent) {
          try {
            const parsed = JSON.parse(savedStudent);
            if (parsed.email) {
              activeEmail = parsed.email;
              initialData = parsed;
            }
          } catch (e) {}
        }
      }

      // If no valid student session exists, redirect to login
      if (!activeEmail) {
        navigate('/login?portal=student');
        return;
      }

      setStudent(initialData);
      setEditName(initialData.name || '');
      setEditCollege(initialData.college || '');
      setEditDob(initialData.dob || '');
      setEditPhoto(initialData.photo || '');

      // 2. Fetch Exam Certificates & Attempts with Wrong-Questions review
      try {
        const examRes = await fetch(`/api/assessment/student/profile-exams?email=${encodeURIComponent(activeEmail)}`);
        const examData = await examRes.json();
        if (examData.success) {
          if (examData.student) {
            setStudent(prev => ({
              ...prev,
              ...examData.student,
              name: examData.student.name || prev?.name || 'Student',
              college: examData.student.college || prev?.college || '',
              photo: prev?.photo || examData.student.photo || ''
            }));
            setEditName(examData.student.name || initialData.name || '');
            setEditCollege(examData.student.college || initialData.college || '');
            if (examData.student.dob) setEditDob(examData.student.dob);
          }
          setCertificates(examData.certificates || []);
          setExamAttempts(examData.attempts || []);
          if (examData.attempts && examData.attempts.length > 0 && !expandedExamId) {
            setExpandedExamId(examData.attempts[0].id);
          }
        }
      } catch (e) {
        console.error('Error fetching exam certificates:', e);
      }

      // 3. Fetch Arena Profile & XP
      try {
        const token = localStorage.getItem('arena_token') || localStorage.getItem('token');
        const res = await fetch(`/api/arena/profile?email=${encodeURIComponent(activeEmail)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const data = await res.json();
        if (data.success && data.student) {
          setStudent(prev => ({
            ...prev,
            ...data.student,
            photo: data.student.photo || prev?.photo || ''
          }));
          setEditPhoto(data.student.photo || '');
          localStorage.setItem('arena_student', JSON.stringify({ ...data.student, email: activeEmail }));
        }
      } catch (e) {
        console.error('Error fetching arena profile:', e);
      }

      // 4. Fetch Problems & Coding Submissions
      try {
        const [probRes, subRes, leadRes] = await Promise.all([
          fetch('/api/arena/problems'),
          fetch(`/api/arena/submissions?email=${encodeURIComponent(activeEmail)}`),
          fetch('/api/arena/leaderboard')
        ]);
        
        const probData = await probRes.json();
        if (probData.success) setProblems(probData.problems || []);

        const subData = await subRes.json();
        if (subData.success) setSubmissions(subData.submissions || []);

        const leadData = await leadRes.json();
        if (leadData.success && leadData.leaderboard) {
          const foundIdx = leadData.leaderboard.findIndex(
            u => String(u.email).toLowerCase() === String(activeEmail).toLowerCase()
          );
          if (foundIdx !== -1) setLeaderboardRank(foundIdx + 1);
        }
      } catch (e) {
        console.error('Error fetching arena stats:', e);
      }

    } catch (err) {
      console.error('Error loading complete profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Image compressor for avatar uploads
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (re) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        let w = img.width, h = img.height;
        if (w > h) {
          if (w > maxDim) { h = Math.round((h * maxDim) / w); w = maxDim; }
        } else {
          if (h > maxDim) { w = Math.round((w * maxDim) / h); h = maxDim; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setEditPhoto(dataUrl);
      };
      img.src = re.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      Swal.fire({ icon: 'error', title: 'Name required', text: 'Please enter your full name.' });
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem('arena_token') || localStorage.getItem('token');
      const res = await fetch('/api/arena/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          email: student.email,
          name: editName.trim(),
          college: editCollege.trim(),
          dob: editDob.trim(),
          photo: editPhoto
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      setStudent(prev => ({
        ...prev,
        ...data.student,
        college: editCollege.trim()
      }));
      setIsEditing(false);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your student details have been saved successfully.',
        timer: 2000,
        showConfirmButton: false,
        background: '#ffffff',
        color: '#000000'
      });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Update Error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('arena_token');
    localStorage.removeItem('arena_student');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (authLogout) authLogout();
    navigate('/login?portal=student');
  };

  const copyToClipboard = (text, label = 'Certificate ID') => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `${label} copied to clipboard!`,
      showConfirmButton: false,
      timer: 1800,
      background: '#ffffff',
      color: '#000000'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-yellow-50 flex items-center justify-center text-slate-900">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-yellow-400/30 animate-ping" />
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-amber-500 rounded-full animate-spin" />
          </div>
          <p className="text-sm font-black tracking-wider uppercase text-slate-900">
            Loading Student Profile & Certificates...
          </p>
        </div>
      </div>
    );
  }

  // Calculate difficulty stats
  const totalProblems = problems.length || 6;
  const solvedList = student?.solvedProblems || [];
  const solvedCount = solvedList.length;

  const easyTotal = problems.filter(p => p.difficulty === 'Easy').length || 3;
  const easySolved = problems.filter(p => p.difficulty === 'Easy' && solvedList.includes(p.id)).length;

  const medTotal = problems.filter(p => p.difficulty === 'Medium').length || 2;
  const medSolved = problems.filter(p => p.difficulty === 'Medium' && solvedList.includes(p.id)).length;

  const hardTotal = problems.filter(p => p.difficulty === 'Hard').length || 1;
  const hardSolved = problems.filter(p => p.difficulty === 'Hard' && solvedList.includes(p.id)).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-white to-yellow-50/80 text-slate-900 font-sans pb-28 selection:bg-yellow-300 selection:text-black relative overflow-x-hidden">
      
      {/* ─── White & Warm Yellow Ambient Background ─────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Radiant top warm yellow bloom */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] rounded-full bg-gradient-to-b from-yellow-300/30 via-amber-200/20 to-transparent blur-[140px]" />
        {/* Soft amber shimmer spotlight */}
        <div className="absolute top-48 left-1/4 w-[600px] h-[400px] rounded-full bg-yellow-200/25 blur-[120px]" />
        {/* Bottom golden warm tone */}
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[450px] rounded-full bg-amber-300/20 blur-[150px]" />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#d97706 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-7">
        
        {/* ─── Top Navigation Bar ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <Link
            to="/arena"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 text-black text-xs font-black transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-black" />
            <span>Coding Arena</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              to="/leaderboard"
              className="px-4 py-2 rounded-2xl bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 text-black text-xs font-black flex items-center gap-2 transition shadow-sm"
            >
              <Trophy className="w-4 h-4 text-black" />
              <span>Leaderboard</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-2xl bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 text-black text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-black" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* ─── Hero Profile Card (White & Yellow Dashboard Theme) ─────────── */}
        <div className="relative rounded-3xl p-7 sm:p-9 shadow-md overflow-hidden border-2 border-yellow-300 bg-white text-slate-900">
          {/* Subtle Ambient Yellow Bloom */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-yellow-200/35 via-amber-100/15 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-7 relative z-10">
            
            {/* Student Avatar with Gold Ring & Camera Edit Trigger */}
            <div className="relative group flex-shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-yellow-400 bg-yellow-50 shadow-md flex items-center justify-center relative">
                {student?.photo ? (
                  <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-black text-yellow-950 bg-gradient-to-br from-yellow-200 to-amber-300">
                    {student?.name?.slice(0, 2).toUpperCase() || 'ST'}
                  </div>
                )}
                {/* Golden Corner Accent */}
                <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-yellow-400 text-black shadow-sm">
                  <Sparkles className="w-3 h-3" />
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-black font-black shadow-md border-2 border-white transition cursor-pointer"
                title="Edit Student Profile"
              >
                <Camera className="w-4 h-4 text-black" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left space-y-3 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-900 border border-yellow-300 font-extrabold inline-flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Verified Student Candidate
                </span>
                {student?.college && (
                  <span className="text-xs px-3 py-1 rounded-full bg-yellow-50 text-slate-800 border border-yellow-200 font-bold inline-flex items-center gap-1.5 truncate max-w-[280px]">
                    🎓 {student.college}
                  </span>
                )}
                <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold inline-flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  Exam Certified
                </span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 flex items-center justify-center sm:justify-start gap-3">
                  <span>{student?.name || 'Student Candidate'}</span>
                </h1>
                {student?.rollNo && (
                  <div className="text-xs font-mono text-slate-600 mt-1">
                    Roll No / Student ID: <span className="text-slate-950 font-bold">{student.rollNo}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-xl">
                  <Mail className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-slate-900 font-bold">{student?.email}</span>
                </div>
                {student?.dob && (
                  <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-xl font-mono">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>DOB: <strong className="text-slate-900">{student.dob}</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-xl">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Certificates: <strong className="text-slate-950 font-black">{certificates.length}</strong></span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 text-black text-xs font-black inline-flex items-center gap-2 transition cursor-pointer shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5 text-black" />
                  <span>Edit Profile</span>
                </button>
                <Link
                  to="/student/portfolio"
                  className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 text-black font-black text-xs inline-flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>Generate AI Portfolio</span>
                </Link>
                <Link
                  to="/arena"
                  className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 text-black font-black text-xs inline-flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-black" />
                  <span>Enter Coding Arena</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* ─── Metric Cards Grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Certificates Earned */}
          <div className="bg-white border-2 border-yellow-300 hover:border-yellow-400 rounded-2xl p-4 shadow-sm transition group">
            <div className="flex items-center justify-between text-xs text-slate-700 font-bold mb-1">
              <span>Exam Certificates</span>
              <Award className="w-4 h-4 text-amber-600 group-hover:scale-110 transition" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
              {certificates.length}
            </div>
            <div className="text-[11px] text-slate-600 mt-1">Admin verified & issued</div>
          </div>

          {/* Card 2: Exams Attended */}
          <div className="bg-white border-2 border-yellow-300 hover:border-yellow-400 rounded-2xl p-4 shadow-sm transition group">
            <div className="flex items-center justify-between text-xs text-slate-700 font-bold mb-1">
              <span>Exams Attended</span>
              <FileText className="w-4 h-4 text-amber-600 group-hover:scale-110 transition" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
              {examAttempts.length}
            </div>
            <div className="text-[11px] text-slate-600 mt-1">
              {examAttempts.filter(a => a.passed).length} passed successfully
            </div>
          </div>

          {/* Card 3: Total Score / XP */}
          <div className="bg-white border-2 border-yellow-300 hover:border-yellow-400 rounded-2xl p-4 shadow-sm transition group">
            <div className="flex items-center justify-between text-xs text-slate-700 font-bold mb-1">
              <span>Ranking XP</span>
              <Zap className="w-4 h-4 text-amber-600 group-hover:scale-110 transition" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
              {student?.score || student?.xp || 0}
            </div>
            <div className="text-[11px] text-slate-600 mt-1">earned across exams & arena</div>
          </div>

          {/* Card 4: Global Rank */}
          <div className="bg-white border-2 border-yellow-300 hover:border-yellow-400 rounded-2xl p-4 shadow-sm transition group">
            <div className="flex items-center justify-between text-xs text-slate-700 font-bold mb-1">
              <span>Global Rank</span>
              <Trophy className="w-4 h-4 text-amber-600 group-hover:scale-110 transition" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
              {leaderboardRank ? `#${leaderboardRank}` : '--'}
            </div>
            <div className="text-[11px] text-slate-600 mt-1">across all students</div>
          </div>

        </div>

        {/* ─── Profile Navigation Tabs ──────────────────────────────────── */}
        <div className="flex items-center gap-2 border-b-2 border-yellow-300/80 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'certificates'
                ? 'bg-yellow-400 text-black border-2 border-yellow-500 shadow-sm scale-[1.02]'
                : 'bg-white text-black hover:bg-yellow-50 border-2 border-yellow-200'
            }`}
          >
            <Award className="w-4 h-4 text-black" />
            <span>My Certificates</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-black ${
              activeTab === 'certificates' ? 'bg-black text-yellow-300' : 'bg-yellow-100 text-black border border-yellow-300'
            }`}>
              {certificates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('exams')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'exams'
                ? 'bg-yellow-400 text-black border-2 border-yellow-500 shadow-sm scale-[1.02]'
                : 'bg-white text-black hover:bg-yellow-50 border-2 border-yellow-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-black" />
            <span>Exam Results & Mistakes Review</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-black ${
              activeTab === 'exams' ? 'bg-black text-yellow-300' : 'bg-yellow-100 text-black border border-yellow-300'
            }`}>
              {examAttempts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('arena')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'arena'
                ? 'bg-yellow-400 text-black border-2 border-yellow-500 shadow-sm scale-[1.02]'
                : 'bg-white text-black hover:bg-yellow-50 border-2 border-yellow-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-black" />
            <span>Coding Arena & Practice</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-black ${
              activeTab === 'arena' ? 'bg-black text-yellow-300' : 'bg-yellow-100 text-black border border-yellow-300'
            }`}>
              {solvedCount} solved
            </span>
          </button>
        </div>

        {/* ─── TAB 1: CERTIFICATES ──────────────────────────────────────── */}
        {activeTab === 'certificates' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span>Admin-Issued Official Exam Certificates</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Certificates generated by admin for exams attended with verifiable cryptographic credentials.
                </p>
              </div>
              <Link
                to="/verify-certificate"
                className="text-xs font-black text-amber-700 hover:text-amber-900 flex items-center gap-1.5 transition"
              >
                <span>Verification Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {certificates.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-yellow-300 p-12 text-center bg-white space-y-4 shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-yellow-100 border border-yellow-300 flex items-center justify-center text-amber-700">
                  <Award className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base font-bold text-slate-900">No Exam Certificates Issued Yet</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Once you attend an examination and the administrator generates or releases your certificate, it will appear here with an official certificate number, grade, and verifiable link.
                  </p>
                </div>
                <Link
                  to="/assessments"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 text-black font-black text-xs transition shadow-sm cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-black" />
                  <span>View Available Exams</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <div
                    key={cert.certificateNumber}
                    className="relative rounded-3xl p-6 bg-white border-2 border-yellow-300 hover:border-yellow-400 shadow-md transition group overflow-hidden text-slate-900"
                  >
                    {/* Golden Ornamental Header Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-black uppercase tracking-wide flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Official & Valid
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Certificate Identifier */}
                      <div className="flex items-center gap-2">
                        <Award className="w-7 h-7 text-amber-600 flex-shrink-0" />
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                            Certificate ID
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-sm font-black text-slate-950 tracking-wide">
                              {cert.certificateNumber}
                            </span>
                            <button
                              onClick={() => copyToClipboard(cert.certificateNumber, 'Certificate Number')}
                              className="p-1 rounded-md text-slate-500 hover:text-black hover:bg-yellow-100 transition cursor-pointer"
                              title="Copy Certificate Number"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Course / Exam Title */}
                      <div>
                        <h3 className="text-lg font-black text-slate-950 group-hover:text-amber-700 transition">
                          {cert.internshipName || 'Certification Examination'}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Awarded to <strong className="text-slate-950">{cert.studentName}</strong>
                        </p>
                      </div>

                      {/* Stats Pills: Grade, Score, Percentage */}
                      <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-yellow-50/60 border border-yellow-200 text-center">
                        <div>
                          <div className="text-[10px] text-slate-600 font-bold">Grade</div>
                          <div className="text-lg font-black text-amber-700 font-mono">
                            {cert.grade || 'A+'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-600 font-bold">Score</div>
                          <div className="text-lg font-black text-slate-950 font-mono">
                            {cert.score} <span className="text-xs text-slate-500 font-normal">/ {cert.totalMarks || 100}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-600 font-bold">Percentage</div>
                          <div className="text-lg font-black text-emerald-700 font-mono">
                            {Math.round(cert.percentage)}%
                          </div>
                        </div>
                      </div>

                      {/* Issue Date & Verification Actions */}
                      <div className="pt-2 border-t border-yellow-200 flex items-center justify-between text-xs">
                        <div className="text-slate-600 flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>
                            {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric'
                            }) : 'Recently Issued'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/verify-certificate/${cert.certificateNumber}`}
                            className="px-3.5 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 text-black font-black text-xs inline-flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-black" />
                            <span>View & Print</span>
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: EXAM RESULTS & MISTAKES REVIEW ─────────────────────── */}
        {activeTab === 'exams' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <span>Exam Results & Question Mistake Review</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Review your attended exams, final declared results, and analyze wrong questions with explanations.
                </p>
              </div>

              {/* Integrity Notice Badge */}
              <div className="px-3.5 py-2 rounded-2xl bg-yellow-100 border border-yellow-300 text-yellow-950 text-[11px] font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Mistakes & Solutions unlocked strictly post-submission upon declared result</span>
              </div>
            </div>

            {examAttempts.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-yellow-300 p-12 text-center bg-white space-y-4 shadow-sm">
                <FileText className="w-12 h-12 text-amber-600 mx-auto" />
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base font-bold text-slate-900">No Exam Attempts Recorded</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    You have not submitted any examination under this student email yet. Attend scheduled exams to see full scorecards and questions review here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {examAttempts.map((attempt) => {
                  const isExpanded = expandedExamId === attempt.id;
                  const questionsList = attempt.questions || [];
                  const wrongQuestions = questionsList.filter(q => !q.isCorrect);
                  const correctQuestions = questionsList.filter(q => q.isCorrect);

                  let filteredQuestions = questionsList;
                  if (questionFilter === 'wrong') filteredQuestions = wrongQuestions;
                  if (questionFilter === 'correct') filteredQuestions = correctQuestions;

                  return (
                    <div
                      key={attempt.id}
                      className="rounded-3xl bg-white border-2 border-yellow-300 hover:border-yellow-400 shadow-md transition overflow-hidden text-slate-900"
                    >
                      {/* Exam Header Banner */}
                      <div className="p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-yellow-200">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                              attempt.passed
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}>
                              {attempt.passed ? 'Passed ✅' : 'Needs Improvement ❌'}
                            </span>
                            <span className="text-[11px] font-mono text-slate-700 bg-yellow-50 px-2.5 py-0.5 rounded-full border border-yellow-200 font-bold">
                              Status: {attempt.status}
                            </span>
                            {attempt.certificateNumber && (
                              <span className="text-[11px] font-mono text-yellow-950 bg-yellow-100 border border-yellow-300 px-2.5 py-0.5 rounded-full font-black">
                                🎓 Cert #{attempt.certificateNumber}
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl font-black text-slate-950">
                            {attempt.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-amber-600" />
                              <span>{attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Time: {Math.round(attempt.timeTaken / 60)} mins</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-800 font-bold">{attempt.correctCount} Correct</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span className="text-rose-800 font-bold">{attempt.wrongCount} Wrong</span>
                            </div>
                          </div>
                        </div>

                        {/* Score & Toggle Review Button */}
                        <div className="flex items-center justify-between md:justify-end gap-5">
                          <div className="text-right">
                            <div className="text-3xl font-black text-amber-700 font-mono">
                              {attempt.score} <span className="text-xs text-slate-500 font-normal">/ {attempt.totalMarks}</span>
                            </div>
                            <div className="text-xs font-bold text-slate-600 mt-0.5">
                              Percentage: <span className="text-slate-950 font-mono font-bold">{Math.round(attempt.percentage)}%</span>
                            </div>
                          </div>

                          <button
                            onClick={() => setExpandedExamId(isExpanded ? null : attempt.id)}
                            className="px-4 py-2.5 rounded-2xl text-xs font-black inline-flex items-center gap-2 transition cursor-pointer bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 text-black shadow-sm"
                          >
                            <span>{isExpanded ? 'Hide Review' : 'Review Mistakes & Solutions'}</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-black" /> : <ChevronDown className="w-4 h-4 text-black" />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Question-by-Question Review with Mistake Filter */}
                      {isExpanded && (
                        <div className="p-6 sm:p-7 space-y-6 bg-yellow-50/30 border-t border-yellow-200">
                          
                          {/* Filter Tabs for Questions */}
                          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-yellow-200 shadow-sm">
                            <div className="flex items-center gap-2">
                              <Filter className="w-4 h-4 text-amber-600" />
                              <span className="text-xs font-black text-slate-900">Filter Questions:</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setQuestionFilter('all')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                                  questionFilter === 'all'
                                    ? 'bg-yellow-400 border-2 border-yellow-500 text-black shadow-sm'
                                    : 'bg-white text-black font-bold border border-yellow-200 hover:bg-yellow-100'
                                }`}
                              >
                                All Questions ({questionsList.length})
                              </button>
                              <button
                                onClick={() => setQuestionFilter('wrong')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                                  questionFilter === 'wrong'
                                    ? 'bg-yellow-400 border-2 border-yellow-500 text-black shadow-sm'
                                    : 'bg-rose-50 text-rose-900 font-bold border border-rose-200 hover:bg-rose-100'
                                }`}
                              >
                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                <span>Wrong Questions ({wrongQuestions.length})</span>
                              </button>
                              <button
                                onClick={() => setQuestionFilter('correct')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                                  questionFilter === 'correct'
                                    ? 'bg-yellow-400 border-2 border-yellow-500 text-black shadow-sm'
                                    : 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 hover:bg-emerald-100'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Correct ({correctQuestions.length})</span>
                              </button>
                            </div>
                          </div>

                          {/* Notice if exam results are locked during active test */}
                          {!attempt.resultDeclared && (
                            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-3 font-medium">
                              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
                              <span>
                                The administrator has kept detailed question answers confidential until all submissions are completed and results are officially published.
                              </span>
                            </div>
                          )}

                          {filteredQuestions.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-xs font-medium">
                              No questions match the selected filter.
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {filteredQuestions.map((q) => (
                                <div
                                  key={q.questionId || q.index}
                                  className={`rounded-2xl p-5 border-2 transition ${
                                    q.isCorrect
                                      ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                                      : 'bg-rose-50/70 border-rose-300 shadow-sm'
                                  }`}
                                >
                                  {/* Question Head */}
                                  <div className="flex items-center justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                      <span className="px-2.5 py-0.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono text-xs font-black">
                                        Q{q.index}
                                      </span>
                                      <span className="text-xs font-bold text-slate-700 bg-yellow-100 px-2.5 py-0.5 rounded-md border border-yellow-300">
                                        {q.topic}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                                        q.isCorrect
                                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                          : 'bg-rose-100 text-rose-900 border-rose-300'
                                      }`}>
                                        {q.isCorrect ? (
                                          <>
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>Correct (+{q.marks} pts)</span>
                                          </>
                                        ) : (
                                          <>
                                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                            <span>Incorrect (0 / {q.maxMarks} pts)</span>
                                          </>
                                        )}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Question Prompt */}
                                  <p className="text-sm font-bold text-slate-950 mb-4 leading-relaxed">
                                    {q.questionText}
                                  </p>

                                  {/* MCQ Options Display */}
                                  {q.options && q.options.length > 0 && (
                                    <div className="space-y-2 mb-4">
                                      {q.options.map((opt, oIdx) => {
                                        const optText = typeof opt === 'object' ? (opt.text || opt.label) : String(opt);
                                        const isSelected = String(q.studentAnswer).trim() === optText.trim();
                                        const isRightAnswer = String(q.correctAnswer).trim() === optText.trim();

                                        let style = 'bg-white border-slate-200 text-slate-800';
                                        let badge = null;

                                        if (isSelected && isRightAnswer) {
                                          style = 'bg-emerald-100/90 border-2 border-emerald-500 text-emerald-950 font-bold';
                                          badge = (
                                            <span className="ml-auto text-[10px] font-black px-2 py-0.5 rounded bg-emerald-600 text-white flex items-center gap-1">
                                              <CheckCircle2 className="w-3 h-3" />
                                              Your Answer (Correct)
                                            </span>
                                          );
                                        } else if (isSelected && !isRightAnswer) {
                                          style = 'bg-rose-100/90 border-2 border-rose-500 text-rose-950 font-bold';
                                          badge = (
                                            <span className="ml-auto text-[10px] font-black px-2 py-0.5 rounded bg-rose-600 text-white flex items-center gap-1">
                                              <XCircle className="w-3 h-3" />
                                              Your Selection (Wrong)
                                            </span>
                                          );
                                        } else if (isRightAnswer) {
                                          style = 'bg-emerald-50 border-2 border-emerald-400 text-emerald-900 font-bold';
                                          badge = (
                                            <span className="ml-auto text-[10px] font-black px-2 py-0.5 rounded bg-emerald-600 text-white flex items-center gap-1">
                                              <Check className="w-3 h-3" />
                                              Correct Answer
                                            </span>
                                          );
                                        }

                                        return (
                                          <div
                                            key={oIdx}
                                            className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 transition ${style}`}
                                          >
                                            <span className="w-5 h-5 rounded-full bg-yellow-100 border border-yellow-300 flex items-center justify-center font-mono text-[11px] font-bold text-slate-900 flex-shrink-0">
                                              {String.fromCharCode(65 + oIdx)}
                                            </span>
                                            <span className="flex-1">{optText}</span>
                                            {badge}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Non-MCQ student and correct answers */}
                                  {(!q.options || q.options.length === 0) && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs font-mono">
                                      <div className="p-3 rounded-xl bg-white border border-slate-300">
                                        <div className="text-[10px] uppercase font-bold text-slate-600 mb-1">Your Submitted Answer:</div>
                                        <div className={q.isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                                          {q.studentAnswer}
                                        </div>
                                      </div>
                                      <div className="p-3 rounded-xl bg-emerald-50 border-2 border-emerald-400">
                                        <div className="text-[10px] uppercase font-bold text-emerald-800 mb-1">Correct Answer:</div>
                                        <div className="text-emerald-900 font-bold">
                                          {q.correctAnswer}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Concept & Explanation Card */}
                                  <div className="p-3.5 rounded-xl bg-yellow-100 border-2 border-yellow-300 text-xs text-yellow-950 leading-relaxed flex items-start gap-2.5 shadow-sm">
                                    <HelpCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <strong className="text-yellow-950 font-black block mb-0.5">Solution & Concept Explanation:</strong>
                                      {q.explanation}
                                    </div>
                                  </div>

                                </div>
                              ))}
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: CODING ARENA & PRACTICE ────────────────────────────── */}
        {activeTab === 'arena' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Difficulty Breakdown (1 col) */}
              <div className="bg-white border-2 border-yellow-300 rounded-3xl p-6 shadow-md space-y-4 text-slate-900">
                <h3 className="text-sm font-black text-slate-950 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>Difficulty Progress</span>
                </h3>

                {/* Easy Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#00b8a3]">Easy</span>
                    <span className="text-slate-600 font-mono">{easySolved} / {easyTotal}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="h-full bg-[#00b8a3]" 
                      style={{ width: `${easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Medium Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#ffa116]">Medium</span>
                    <span className="text-slate-600 font-mono">{medSolved} / {medTotal}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="h-full bg-[#ffa116]" 
                      style={{ width: `${medTotal > 0 ? (medSolved / medTotal) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Hard Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#ff375f]">Hard</span>
                    <span className="text-slate-600 font-mono">{hardSolved} / {hardTotal}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="h-full bg-[#ff375f]" 
                      style={{ width: `${hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-300 text-[11px] text-yellow-950 leading-relaxed font-medium">
                  💡 <strong>Pro Tip:</strong> Solving harder problems in the Coding Arena multiplies your XP score and ranks you higher on the global leaderboard!
                </div>
              </div>

              {/* Submissions Activity History (2 cols) */}
              <div className="lg:col-span-2 bg-white border-2 border-yellow-300 rounded-3xl p-6 shadow-md space-y-4 text-slate-900">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-950 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Recent Arena Submissions</span>
                  </h3>
                  <Link to="/arena" className="text-xs text-amber-700 hover:underline font-bold">
                    Solve More Problems
                  </Link>
                </div>

                {submissions.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 space-y-2">
                    <Code2 className="w-10 h-10 mx-auto opacity-40 text-amber-600" />
                    <p className="text-xs font-medium">No code submissions recorded yet.</p>
                    <Link
                      to="/arena"
                      className="inline-block px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 text-black font-black text-xs mt-2 shadow-sm cursor-pointer"
                    >
                      Start Solving in Arena
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {submissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 rounded-2xl bg-yellow-50/40 border border-yellow-200 flex items-center justify-between text-xs hover:border-yellow-400 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {sub.status === 'Accepted' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          )}
                          <div className="truncate">
                            <Link
                              to={`/arena/problem/${sub.problemId}`}
                              className="font-bold text-slate-950 hover:text-amber-700 transition truncate block"
                            >
                              {sub.problemTitle || sub.problemId}
                            </Link>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {new Date(sub.submittedAt).toLocaleTimeString()} • {new Date(sub.submittedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-yellow-100 border border-yellow-300 text-slate-900 font-bold">
                            {sub.language}
                          </span>
                          <span className={`font-black text-xs ${
                            sub.status === 'Accepted' ? 'text-emerald-700' : 'text-rose-700'
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ─── Edit Profile Modal ────────────────────────────────────────── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-yellow-400 overflow-hidden text-slate-900 p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-yellow-200">
              <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Edit Student Profile</span>
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-black font-bold cursor-pointer px-3 py-1 rounded-lg bg-yellow-100 hover:bg-yellow-200 border border-yellow-300 transition"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Photo selector */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-yellow-50/70 border border-yellow-200">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-yellow-400 bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  {editPhoto ? (
                    <img src={editPhoto} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-amber-700" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900">Profile Picture</div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1 px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 border border-yellow-500 text-xs font-black text-black flex items-center gap-1.5 cursor-pointer shadow-sm transition"
                  >
                    <Camera className="w-3 h-3 text-black" />
                    <span>Upload New Photo</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-yellow-50/30 border border-yellow-300 rounded-xl text-xs text-slate-950 font-medium outline-none focus:border-yellow-500 focus:bg-white transition"
                />
              </div>

              {/* College / Institution */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">College / Institution</label>
                <input
                  type="text"
                  placeholder="e.g. Ajay Kumar Garg Engineering College"
                  value={editCollege}
                  onChange={(e) => setEditCollege(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-yellow-50/30 border border-yellow-300 rounded-xl text-xs text-slate-950 font-medium outline-none focus:border-yellow-500 focus:bg-white transition"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Date of Birth (DOB)</label>
                <input
                  type="date"
                  value={editDob}
                  onChange={(e) => setEditDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-yellow-50/30 border border-yellow-300 rounded-xl text-xs text-slate-950 font-medium outline-none focus:border-yellow-500 focus:bg-white transition"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-black text-xs font-black border border-yellow-300 cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 text-black font-black text-xs cursor-pointer disabled:opacity-50 shadow-sm transition"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
