import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  ArrowLeft,
  Printer,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Building,
  User,
  Sparkles,
  Code2,
  Check,
  X,
  FileText
} from 'lucide-react';

export default function ExamResult() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const token = localStorage.getItem('exam_token');

  useEffect(() => {
    if (!token) {
      navigate('/test/login');
      return;
    }

    const fetchResult = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/test/result/${attemptId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        if (data.success && data.result) {
          setResult(data.result);

          // If passed, celebrate with confetti!
          if (data.result.result_status === 'PASSED' || data.result.is_passed) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        } else {
          setError(data.message || 'Unable to retrieve test result.');
        }
      } catch (err) {
        console.error('Fetch result error:', err);
        setError('Network error while retrieving result.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId, token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg font-bold">Evaluating Submission & Generating Scorecard...</h2>
        <p className="text-xs text-slate-400 mt-1">Applying automated grading and rubric scoring.</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">
          <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Scorecard Unavailable</h3>
          <p className="text-xs text-slate-400 mb-6">{error || 'Record not found.'}</p>
          <Link
            to="/test/dashboard"
            className="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const isPassed = result.result_status === 'PASSED' || result.is_passed;
  const exam = result.exam || {};
  const student = result.student || {};
  const answers = result.answers || result.studentAnswers || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:text-slate-900">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Print Top Bar */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link
            to="/test/dashboard"
            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to Assessments</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Scorecard</span>
          </button>
        </div>

        {/* Official Scorecard Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl mb-8 print:border print:border-slate-300 print:shadow-none">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full text-indigo-300 text-[11px] font-semibold mb-2">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                <span>Verified Examination Scorecard</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                {exam.title || exam.name || 'Assessment Performance'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Completed on {new Date(result.submitted_at || result.updated_at || Date.now()).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* Result Badge */}
            <div className={`px-5 py-3 rounded-2xl border text-center self-start sm:self-auto ${
              isPassed
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
            }`}>
              <div className="text-[10px] uppercase font-bold tracking-wider">Status</div>
              <div className="text-xl font-extrabold mt-0.5">{isPassed ? 'PASSED' : 'FAILED'}</div>
            </div>
          </div>

          {/* Candidate Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-5 border-b border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Candidate</span>
              <span className="font-bold text-white text-sm">{student.name || student.full_name || 'Candidate'}</span>
              <span className="text-slate-400 block mt-0.5">{student.email}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Institution</span>
              <span className="font-semibold text-slate-200 block text-sm">{student.college?.name || student.college_name || 'Partner College'}</span>
              {student.roll_number && (
                <span className="text-slate-400 font-mono text-[11px]">Roll: {student.roll_number}</span>
              )}
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Proctoring Metrics</span>
              <div className="flex items-center space-x-3 text-slate-300 mt-1">
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {result.duration_taken_seconds ? `${Math.round(result.duration_taken_seconds / 60)}m` : 'Completed'}
                </span>
                <span className="flex items-center text-slate-400">
                  <ShieldAlert className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Switches: {result.tab_switch_count || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Big Score Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Marks Obtained</span>
              <div className={`text-2xl sm:text-3xl font-black mt-1 ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.total_marks_obtained || 0}
              </div>
              <span className="text-[11px] text-slate-500">out of {exam.total_marks || 100}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Percentage</span>
              <div className="text-2xl sm:text-3xl font-black text-indigo-300 mt-1">
                {result.percentage || 0}%
              </div>
              <span className="text-[11px] text-slate-500">Passing: {exam.passing_marks || 40}%</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Pass Mark</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-200 mt-1">
                {exam.passing_marks || 40}
              </div>
              <span className="text-[11px] text-slate-500">Required minimum</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Attempt #</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-200 mt-1">
                {result.attempt_number || 1}
              </div>
              <span className="text-[11px] text-slate-500">Max allowed: {exam.max_attempts || 1}</span>
            </div>
          </div>
        </div>

        {/* Detailed Question Review Section */}
        {answers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Question-by-Question Evaluation Review
              </h3>
              <span className="text-xs text-slate-400">
                {answers.length} Questions Reviewed
              </span>
            </div>

            <div className="space-y-4">
              {answers.map((ans, idx) => {
                const q = ans.question || {};
                const isCorrect = ans.is_correct;
                const isExpanded = expandedQuestion === idx;

                return (
                  <div
                    key={ans.id || idx}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
                  >
                    {/* Collapsible Header */}
                    <div
                      onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                      className="p-4 sm:p-5 flex items-start justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-start space-x-3.5 flex-1 pr-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${
                          isCorrect
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}>
                          {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-bold text-white">Q{idx + 1}.</span>
                            <span className="text-[10px] font-semibold bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase">
                              {q.type || q.question_type || 'MCQ'}
                            </span>
                            <span className={`text-xs font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {ans.marks_awarded || 0} / {q.marks || 1} marks
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 font-medium line-clamp-2">
                            {q.question_text || q.statement}
                          </p>
                        </div>
                      </div>

                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 bg-slate-950/60 border-t border-slate-800 text-xs space-y-4">
                        {/* Code snippet if present */}
                        {(q.code || q.code_snippet) && (
                          <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                            <code>{q.code || q.code_snippet}</code>
                          </div>
                        )}

                        {/* MCQ Options Display */}
                        {q.options && q.options.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                              Options:
                            </span>
                            {q.options.map((opt, oIdx) => {
                              const isUserPick = ans.selected_option_id === opt.id;
                              const isRightOption = opt.is_correct;

                              let optClass = 'bg-slate-900 border-slate-800 text-slate-300';
                              if (isRightOption) optClass = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold';
                              else if (isUserPick && !isRightOption) optClass = 'bg-rose-950/70 border-rose-500 text-rose-200 line-through';

                              return (
                                <div
                                  key={opt.id || oIdx}
                                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${optClass}`}
                                >
                                  <span>{opt.option_text}</span>
                                  <div className="flex items-center space-x-2 text-[10px]">
                                    {isUserPick && <span className="text-slate-400">(Your Selection)</span>}
                                    {isRightOption && <span className="text-emerald-400 font-bold">✓ Correct Answer</span>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Student's Written Answer (for descriptive / code errors) */}
                        {ans.answer_text && (
                          <div>
                            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                              Your Submitted Explanation:
                            </span>
                            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 whitespace-pre-wrap">
                              {ans.answer_text}
                            </div>
                          </div>
                        )}

                        {/* AI / Instructor Evaluation Feedback */}
                        {ans.evaluation_feedback && (
                          <div className="p-3 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-indigo-200">
                            <div className="flex items-center space-x-1.5 font-bold text-xs text-indigo-300 mb-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              <span>AI / Evaluator Feedback:</span>
                            </div>
                            <p className="leading-relaxed text-xs">{ans.evaluation_feedback}</p>
                          </div>
                        )}

                        {/* Explanation / Model Answer */}
                        {q.explanation && (
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                            <strong className="text-white block mb-0.5">Reference Solution:</strong>
                            <p className="text-slate-400 leading-relaxed">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
