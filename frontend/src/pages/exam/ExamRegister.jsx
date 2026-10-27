import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Hash, ShieldCheck, CheckCircle2, ArrowRight, AlertCircle, Sparkles, BookOpen, GraduationCap, KeyRound, Copy, Check, QrCode } from 'lucide-react';
import CollegeSearchSelect from '../../components/exam/CollegeSearchSelect.jsx';

export default function ExamRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examCodeParam = (searchParams.get('exam') || searchParams.get('exam_code') || searchParams.get('code') || '').trim();

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [targetExam, setTargetExam] = useState(null);
  const [loadingExam, setLoadingExam] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    rollNumber: '',
    collegeId: null,
    collegeName: '',
    courseId: '',
    batchId: '',
    dateOfBirth: '',
    termsAccepted: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Fetch target exam details if code param exists
  useEffect(() => {
    if (!examCodeParam) return;
    setLoadingExam(true);
    fetch(`/api/test/exam-by-code/${encodeURIComponent(examCodeParam)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.exam) {
          setTargetExam(data.exam);
        }
      })
      .catch(err => console.error('Failed to load target exam:', err))
      .finally(() => setLoadingExam(false));
  }, [examCodeParam]);

  // Fetch available courses & batches
  useEffect(() => {
    fetch('/api/test/courses')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.courses)) {
          setCourses(data.courses);
        }
      })
      .catch(err => console.error('Failed to load exam courses:', err));
  }, []);

  // Update batches when course changes
  useEffect(() => {
    if (!formData.courseId) {
      setBatches([]);
      return;
    }
    const selectedCourse = courses.find(c => String(c.id) === String(formData.courseId));
    if (selectedCourse && selectedCourse.batches) {
      setBatches(selectedCourse.batches);
    } else {
      setBatches([]);
    }
  }, [formData.courseId, courses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.termsAccepted) {
      setError('Please review and accept the examination guidelines and terms.');
      return;
    }

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.mobileNumber.trim()) {
      setError('Please fill in all required fields (Full Name, Email, and Mobile Number).');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/test/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          mobileNumber: formData.mobileNumber.trim(),
          rollNumber: formData.rollNumber.trim() || null,
          collegeId: formData.collegeId,
          collegeName: formData.collegeName,
          courseId: formData.courseId ? parseInt(formData.courseId) : null,
          batchId: formData.batchId ? parseInt(formData.batchId) : null,
          dateOfBirth: formData.dateOfBirth || null,
          termsAccepted: formData.termsAccepted,
          examCode: examCodeParam || undefined,
          exam_code: examCodeParam || undefined
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed. Please check your details.');
      }

      setSuccessData(data.student);
    } catch (err) {
      setError(err.message || 'Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-slate-100 flex flex-col justify-center">
      {/* Decorative background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-2xl mx-auto w-full">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-medium mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Examination Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Candidate Test Registration
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            Register your verified student profile. Test credentials & access codes are issued directly by your examination coordinator.
          </p>
        </div>

        {/* Success View */}
        {successData ? (
          <div className="bg-white text-slate-900 rounded-3xl shadow-2xl p-8 sm:p-10 border border-emerald-200 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful!</h2>
            <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
              Your candidate profile has been registered in the examination management system.
            </p>

            {/* Direct Auto-Enrolled Test Password Card */}
            {successData.testPassword && (
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-2 border-amber-400/80 rounded-2xl p-6 mb-6 text-left shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <KeyRound className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Your Unique Test Password
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30">
                    Ready to Start
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3">
                  You have been enrolled in <strong>{successData.assignedExam?.title || targetExam?.title || 'your scheduled examination'}</strong>. Use this password to log in and take the exam.
                </p>

                <div className="flex items-center space-x-2 bg-slate-950/90 border border-amber-400/40 p-3 rounded-xl">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-amber-400 tracking-wider flex-1 text-center select-all">
                    {successData.testPassword}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(successData.testPassword);
                      setCopiedPassword(true);
                      setTimeout(() => setCopiedPassword(false), 2500);
                    }}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 transition shadow-sm flex-shrink-0"
                  >
                    {copiedPassword ? (
                      <>
                        <Check className="w-4 h-4 text-slate-950" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-amber-200/80 mt-2.5">
                  💡 <em>Make sure to copy or save this password now. You will enter it on the login screen.</em>
                </p>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left mb-6 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Candidate Name:</span>
                <span className="font-semibold text-slate-900">{successData.fullName || successData.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Registered Email:</span>
                <span className="font-semibold text-slate-900">{successData.email}</span>
              </div>
              {successData.college && (
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Institution:</span>
                  <span className="font-semibold text-slate-900 text-right">{successData.college}</span>
                </div>
              )}
              {successData.assignedExam && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Enrolled Exam:</span>
                  <span className="font-bold text-indigo-700 text-right">{successData.assignedExam.title} ({successData.assignedExam.code})</span>
                </div>
              )}
            </div>

            {!successData.testPassword && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-left text-xs text-indigo-900 mb-8 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">How to access your scheduled test:</strong>
                  <p className="text-indigo-700 leading-relaxed">
                    Your instructor or exam coordinator will assign your examination and generate your <strong>unique test-specific password</strong>. Once you receive your test password, log in with your email and test password.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {successData.testPassword ? (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(successData.testPassword);
                    navigate(`/test/login?exam=${encodeURIComponent(examCodeParam || successData.assignedExam?.code || '')}&email=${encodeURIComponent(successData.email)}`);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/25"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Copy Password & Enter Exam</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/test/login')}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25"
                >
                  <span>Proceed to Test Login</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Registration Form Card */
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            {/* Target Exam Banner (If accessed via QR code or Link) */}
            {targetExam && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-indigo-500/20 border border-amber-500/40 text-xs text-amber-100 flex items-center justify-between shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md flex-shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-amber-300 text-sm">{targetExam.title}</span>
                      <span className="bg-amber-400 text-slate-950 font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">
                        {targetExam.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {targetExam.subject || 'General'} • {targetExam.duration_minutes} Mins • Passing: {targetExam.passing_marks} / {targetExam.total_marks} Marks
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full font-bold text-[10px] border border-amber-400/30 flex-shrink-0">
                  Auto-Enrolling
                </span>
              </div>
            )}

            {/* Informational Banner: No Password Required */}
            <div className="mb-6 p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-200 flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-100 block mb-0.5">
                  {targetExam ? 'Instant Test Credentials On Submit' : 'No Password Required at Registration'}
                </span>
                <span>
                  {targetExam 
                    ? 'Submitting this form will automatically enroll you in this test and generate your unique test password immediately.'
                    : 'You do not need to create or enter a password. Test-specific passwords are issued by the examination administrator per scheduled test.'}
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2.5">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Email & Mobile Number Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      placeholder="10-digit mobile"
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* College Search Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  College / University <span className="text-rose-400">*</span>
                </label>
                <div className="text-slate-900">
                  <CollegeSearchSelect
                    value={{ collegeId: formData.collegeId, collegeName: formData.collegeName }}
                    onChange={(selected) => setFormData({ ...formData, collegeId: selected.collegeId, collegeName: selected.collegeName })}
                    placeholder="Type to search your college or university..."
                    required
                  />
                </div>
              </div>

              {/* Optional Roll Number & Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Roll Number / Student ID <span className="text-slate-500 text-[10px] lowercase">(optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      placeholder="e.g. 2100290100042"
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Date of Birth <span className="text-slate-500 text-[10px] lowercase">(optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Course & Batch selection */}
              {courses.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Course Enrolled <span className="text-slate-500 text-[10px] lowercase">(optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <select
                        value={formData.courseId}
                        onChange={(e) => setFormData({ ...formData, courseId: e.target.value, batchId: '' })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select Course (if applicable)</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {batches.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Batch <span className="text-slate-500 text-[10px] lowercase">(optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <select
                          value={formData.batchId}
                          onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select Batch</option>
                          {batches.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                  />
                  <span className="text-xs text-slate-300 leading-relaxed">
                    I verify that the provided academic and contact details are accurate. I agree to abide by all anti-cheating regulations, proctoring rules, and server evaluation terms during online assessments.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/30"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Registering Candidate...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Complete Candidate Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            </form>

            {/* Already have test credentials? */}
            <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
              Already registered and have your test credentials?{' '}
              <Link to="/test/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">
                Go to Test Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
