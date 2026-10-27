import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  FileText,
  Play,
  RotateCcw,
  LogOut,
  ShieldCheck,
  Building,
  User,
  BookOpen,
  Calendar,
  Eye,
  Info,
  ChevronRight,
  ExternalLink,
  Lock,
  Layers,
  Trophy,
  Sparkles
} from 'lucide-react';

export default function ExamDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedExamForModal, setSelectedExamForModal] = useState(null);
  const [rulesAccepted, setRulesAccepted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('exam_token');
    const storedStudent = localStorage.getItem('exam_student');

    if (!token) {
      navigate('/test/login');
      return;
    }

    if (storedStudent) {
      try {
        setStudent(JSON.parse(storedStudent));
      } catch (e) {
        console.error('Error parsing stored student:', e);
      }
    }

    fetchDashboardData(token);
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    setLoading(true);
    try {
      const res = await fetch('/api/test/student/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('exam_token');
        navigate('/test/login');
        return;
      }

      const data = await res.json();
      if (data.success) {
        if (data.student) setStudent(data.student);
        setExams(data.assignedExams || []);
      } else {
        setError(data.message || 'Failed to load test dashboard.');
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Network communication error. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('exam_token');
    localStorage.removeItem('exam_student');
    localStorage.removeItem('assigned_exam');
    navigate('/test/login');
  };

  const handleStartExam = (exam) => {
    setSelectedExamForModal(exam);
    setRulesAccepted(false);
  };

  const confirmAndLaunchExam = () => {
    if (!selectedExamForModal || !rulesAccepted) return;
    const examId = selectedExamForModal.exam_id || selectedExamForModal.id;
    navigate(`/test/exam/${examId}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-base block sm:inline">ProgrammingWala</span>
              <span className="text-xs text-indigo-400 font-medium sm:ml-2">Test Assessment Portal</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Online Proctored Session</span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Candidate Profile Bar */}
        {student && (
          <div className="bg-gradient-to-r from-indigo-900/50 via-slate-900 to-slate-900 border border-indigo-900/60 rounded-3xl p-6 mb-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xl shadow-inner">
                  {(student.fullName || student.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center">
                    {student.fullName || student.name || 'Candidate'}
                    <span className="ml-2.5 text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Verified Candidate
                    </span>
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                    <span className="flex items-center">
                      <Building className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      {student.college || student.college_name || 'Academic Partner College'}
                    </span>
                    <span className="flex items-center">
                      <User className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      {student.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs bg-slate-950/60 p-3 rounded-2xl border border-slate-800 self-start md:self-auto">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Assigned Assessments</div>
                  <div className="text-lg font-bold text-white">{exams.length}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kaun Banega Crorepati (KBC) Hotseat Challenge Section */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-900 border-2 border-amber-400/50 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 shadow-xl shadow-amber-500/20 shrink-0">
                <img
                  src="/kbc-host.jpg"
                  alt="KBC Hotseat"
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-400" /> NEW EXAM ARENA
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  Kaun Banega Crorepati — MERN & SQL Hotseat
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Experience real TV-style KBC with 16 money ladder levels (up to ₹7 Crore), 4 lifelines (50:50, Audience Poll, Expert Advice, Flip Question), and Tik-Tiki Ji timer!
                </p>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <Link
                to="/kbc"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm tracking-wider uppercase shadow-xl shadow-amber-500/30 transition transform hover:scale-105"
              >
                <Trophy className="w-4 h-4 text-slate-950" /> Play KBC Hotseat →
              </Link>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Your Scheduled Examinations</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tests assigned to your candidate profile with active passwords.</p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-sm">Loading your assigned examinations...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-950/50 border border-rose-800 rounded-2xl p-6 text-center max-w-lg mx-auto">
            <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
            <p className="text-rose-200 text-sm font-medium">{error}</p>
          </div>
        ) : exams.length === 0 ? (
          /* Empty State */
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Layers className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">No Tests Assigned Yet</h4>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Your profile is registered, but no test has been assigned to you at this moment. Once your coordinator assigns an exam and issues your test password, it will appear here.
            </p>
            <button
              onClick={() => fetchDashboardData(localStorage.getItem('exam_token'))}
              className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              <span>Refresh Status</span>
            </button>
          </div>
        ) : (
          /* Exam Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((item) => {
              const exam = item.exam || item;
              const access = item.access || item;
              const lastAttempt = item.lastAttempt || item.last_attempt;
              const attemptStatus = item.attemptStatus || (lastAttempt ? lastAttempt.status : 'AVAILABLE');

              const isCompleted = attemptStatus === 'COMPLETED';
              const isInProgress = attemptStatus === 'IN_PROGRESS';
              const isAvailable = attemptStatus === 'AVAILABLE';

              return (
                <div
                  key={exam.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5 group"
                >
                  <div>
                    {/* Status Badge & Code */}
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="text-[11px] font-mono font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                        {exam.code || 'TEST'}
                      </span>

                      {isCompleted ? (
                        <span className="inline-flex items-center text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </span>
                      ) : isInProgress ? (
                        <span className="inline-flex items-center text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full animate-pulse">
                          <Clock className="w-3 h-3 mr-1" />
                          In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                          Ready to Start
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="text-lg font-bold text-white mb-1.5 group-hover:text-indigo-300 transition-colors line-clamp-2">
                      {exam.title || exam.name}
                    </h4>

                    {/* Subject */}
                    <p className="text-xs text-slate-400 mb-4 flex items-center">
                      <BookOpen className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      <span>{exam.subject || 'Technical Assessment'}</span>
                    </p>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 mb-5 text-center">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">Duration</div>
                        <div className="text-xs font-bold text-slate-200 mt-0.5">{exam.duration_minutes || exam.durationMinutes || 60}m</div>
                      </div>
                      <div className="border-x border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Marks</div>
                        <div className="text-xs font-bold text-slate-200 mt-0.5">{exam.total_marks || exam.totalMarks || 100}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">Pass Marks</div>
                        <div className="text-xs font-bold text-slate-200 mt-0.5">{exam.passing_marks || exam.passingMarks || 40}</div>
                      </div>
                    </div>

                    {/* Score Preview if Completed */}
                    {isCompleted && lastAttempt && (
                      <div className="mb-4 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Score Obtained:</span>
                        <div className="font-bold">
                          <span className={lastAttempt.result_status === 'PASSED' ? 'text-emerald-400' : 'text-rose-400'}>
                            {lastAttempt.total_marks_obtained} / {exam.total_marks || 100} ({lastAttempt.percentage}%)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div>
                    {isCompleted ? (
                      <Link
                        to={`/test/result/${lastAttempt?.id || ''}`}
                        className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        <span>View Scorecard & Analysis</span>
                      </Link>
                    ) : isInProgress ? (
                      <button
                        onClick={() => handleStartExam(exam)}
                        className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 transition-colors shadow-lg shadow-amber-600/20"
                      >
                        <Play className="w-3.5 h-3.5 mr-1.5" />
                        <span>Resume Examination</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartExam(exam)}
                        className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
                      >
                        <Play className="w-3.5 h-3.5 mr-1.5" />
                        <span>Start Examination</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Pre-Exam Instructions Modal */}
      {selectedExamForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div>
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Candidate Guidelines</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{selectedExamForModal.title || selectedExamForModal.name}</h3>
              </div>
              <button
                onClick={() => setSelectedExamForModal(null)}
                className="text-slate-400 hover:text-white text-sm p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Instruction Points */}
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed mb-6">
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-start space-x-3">
                <Clock className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Server-Controlled Timer & Auto-Submit</strong>
                  <span>The examination duration is {selectedExamForModal.duration_minutes || 60} minutes. The countdown timer is strictly verified by the server. When the timer hits 00:00, your test will automatically submit.</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-rose-900/40 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Proctored Fullscreen & Anti-Cheat Monitoring</strong>
                  <span>The test requires Fullscreen mode. Any window blur, tab switching, or app minimizing is actively logged. Exceeding tab switch thresholds will result in immediate disqualification and auto-submission.</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-start space-x-3">
                <FileText className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Question Types Included</strong>
                  <span>This test contains Multiple Choice (MCQ), True/False, Descriptive Q&A, and Code Error inspection questions. For code questions, review the code snippet and explain the bug clearly.</span>
                </div>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="p-4 bg-indigo-950/40 rounded-2xl border border-indigo-800/40 mb-6">
              <label className="flex items-start space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rulesAccepted}
                  onChange={(e) => setRulesAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                />
                <span className="text-xs text-indigo-200 leading-normal">
                  I have read and agree to all test proctoring rules. I understand that my tab switches are recorded and that I must complete the test without external assistance.
                </span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedExamForModal(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!rulesAccepted}
                onClick={confirmAndLaunchExam}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
              >
                <span>Launch Assessment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
