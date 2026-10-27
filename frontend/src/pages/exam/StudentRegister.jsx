import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const COLLEGE_LIST = [
  "Ajay Kumar Garg Engineering College (AKGEC, Ghaziabad)",
  "ABES Engineering College (ABES EC, Ghaziabad)",
  "ABES Institute of Technology (ABES IT, Ghaziabad)",
  "KIET Group of Institutions (KIET, Ghaziabad)",
  "Krishna Engineering College (KEC, Ghaziabad)",
  "IMS Engineering College (IMSEC, Ghaziabad)",
  "Raj Kumar Goel Institute of Technology (RKGIT, Ghaziabad)",
  "JSS Academy of Technical Education (JSSATE, Noida)",
  "Galgotias College of Engineering & Technology (GCET)",
  "Galgotias University (Greater Noida)",
  "G.L. Bajaj Institute of Technology & Management (GLBITM)",
  "Noida Institute of Engineering & Technology (NIET)",
  "Jaypee Institute of Information Technology (JIIT, Noida)",
  "Amity University (Noida)",
  "Bennett University (Greater Noida)",
  "Sharda University (Greater Noida)",
  "Shiv Nadar University (SNU, Greater Noida)",
  "Delhi Technological University (DTU, Delhi)",
  "Netaji Subhas University of Technology (NSUT, Delhi)",
  "Indraprastha Institute of Information Technology (IIIT Delhi)",
  "Guru Gobind Singh Indraprastha University (GGSIPU)",
  "Maharaja Agrasen Institute of Technology (MAIT, Delhi)",
  "Maharaja Surajmal Institute of Technology (MSIT, Delhi)",
  "Bharati Vidyapeeth's College of Engineering (BVCOE, Delhi)",
  "Jamia Millia Islamia (JMI, New Delhi)",
  "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
  "Chaudhary Charan Singh University (CCSU, Meerut)",
  "University of Delhi (DU)",
  "Indian Institute of Technology (IIT)",
  "National Institute of Technology (NIT)",
  "Indian Institute of Information Technology (IIIT)",
  "Other / College Not Listed"
];

export default function StudentRegister() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [customCollege, setCustomCollege] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [photo, setPhoto] = useState('');
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(null);

  useEffect(() => {
    fetchAssessmentInfo();
  }, [id]);

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 240;
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
          const dataUrl = canvas.toDataURL('image/jpeg', 0.65);
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
      Swal.fire({ icon: 'error', title: 'Invalid File', text: 'Please select an image file (JPG, PNG, WebP).' });
      return;
    }
    try {
      const compressed = await compressImage(file);
      setPhoto(compressed);
      setPhotoError('');
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Image Error', text: 'Could not process selected image.' });
    }
  };

  const fetchAssessmentInfo = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);
      const res = await fetch(`/api/assessment/public/${id}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load assessment details.');
      setAssessment(data);
    } catch (err) {
      setFetchError(err.name === 'AbortError' ? 'Connection timed out loading test details.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Name and email are required!' });
      return;
    }

    if (!dob) {
      Swal.fire({
        icon: 'warning',
        title: 'Date of Birth Required',
        text: 'Please select your Date of Birth. This is required for entering exams and your Coding Arena account.'
      });
      return;
    }

    if (!photo) {
      setPhotoError('Profile photo is required for your exam admit card and leaderboard rank.');
      Swal.fire({
        icon: 'warning',
        title: 'Profile Photo Required',
        text: 'Please upload your profile photo. This photo will be shown on the Leaderboard podium when you score top marks!'
      });
      return;
    }

    setSubmitting(true);
    const finalCollege = selectedCollege === 'Other / College Not Listed'
      ? customCollege.trim()
      : selectedCollege.trim();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(`/api/assessment/${id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          dob: dob.trim(),
          phone: phone.trim(),
          college: finalCollege,
          rollNo: rollNo.trim(),
          photo: photo
        })
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed.');

      setRegisteredSuccess({
        candidate: data.candidate,
        examUrl: data.examUrl || `/test/${id}?email=${encodeURIComponent(email.trim().toLowerCase())}&dob=${encodeURIComponent(dob.trim())}`,
        message: data.message
      });

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'Your registration has been confirmed with your profile picture. You can now proceed to the exam gate.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      clearTimeout(timeoutId);
      const errMsg = err.name === 'AbortError' 
        ? 'Registration is taking too long. Please check your network and try again.'
        : err.message;
      Swal.fire({ icon: 'error', title: 'Registration Failed', text: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-semibold text-slate-300">Loading Assessment Details...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !assessment) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center text-white shadow-2xl">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Assessment Unavailable</h2>
          <p className="text-slate-400 text-sm mb-6">{fetchError || 'Assessment not found or currently inactive.'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold text-sm transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Registration Complete Success View
  if (registeredSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200 dark:border-slate-700 text-center animate-fade-in">
          <div className="relative mx-auto w-24 h-24 mb-4">
            {registeredSuccess.candidate?.photo || photo ? (
              <img
                src={registeredSuccess.candidate?.photo || photo}
                alt="Student Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-4xl mx-auto shadow-lg shadow-emerald-500/20">
                ✓
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow">
              ✓
            </span>
          </div>

          <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            Enrolled Successfully
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            Registration Confirmed!
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
            Welcome, <strong className="text-slate-900 dark:text-white">{registeredSuccess.candidate?.name}</strong>! Your email and profile photo are registered for:
          </p>

          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 text-left mb-6 space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Assessment:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{assessment.title}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Registered Email:</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{registeredSuccess.candidate?.email}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Duration:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{assessment.duration} Minutes</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Passing Score:</span>
              <span className="font-semibold text-emerald-600">{assessment.passingScore}%</span>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 text-left text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
            <p className="font-bold mb-1 flex items-center gap-1.5 text-sm">
              <span>🔑</span> Exam Access Password Required
            </p>
            When entering the test gate, you will be prompted to enter your registered email and the <strong>Exam Password</strong> shared with you by your administrator or instructor.
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={registeredSuccess.examUrl}
              className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all text-center block"
            >
              Proceed to Exam Gate →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Registration Form View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Top Header Badge */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📝</span>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-emerald-100">Student Examination Portal</div>
                <div className="text-sm font-semibold opacity-90">ProgrammingWala & AppleTree</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
              {assessment.duration} min
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Assessment Title & Metadata */}
          <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              {assessment.title}
            </h1>
            {assessment.description && (
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                {assessment.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700/60 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
                ⏱️ Duration: <strong>{assessment.duration} mins</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                🎯 Pass Score: <strong>{assessment.passingScore}%</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-300">
                ❓ Questions: <strong>{assessment.questionCount || 'Multi'}</strong>
              </span>
            </div>
          </div>

          {/* Form Description */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Candidate Registration</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Fill in your details and upload your profile photo below. If you score top marks, you will be showcased on the <strong>Leaderboard Stage</strong>!
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Student Profile Photo Upload */}
            <div className={`p-4 rounded-2xl border transition-all ${
              photoError
                ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-700'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700'
            }`}>
              <div className="flex justify-between items-center mb-2.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📸</span> Student Profile Photo <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold lowercase">
                  Shown on Leaderboard & Certificate
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/60 bg-slate-200 dark:bg-slate-700 flex items-center justify-center shadow-md">
                    {photo ? (
                      <img src={photo} alt="Student avatar preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <span className="text-3xl block">👤</span>
                        <span className="text-[10px] font-bold block mt-0.5">Required</span>
                      </div>
                    )}
                  </div>
                  {photo && (
                    <button
                      type="button"
                      onClick={() => setPhoto('')}
                      className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-90"
                      title="Remove Photo"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                    >
                      <span>📷</span> {photo ? 'Change Profile Photo' : 'Upload Profile Photo *'}
                    </button>
                    {photo && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl border border-emerald-300 dark:border-emerald-800">
                        ✓ Photo Ready
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Upload a clear face portrait (JPG, PNG). Candidates who pass with top scores will be placed on the <strong>Leaderboard 1st, 2nd, and 3rd Podium</strong>!
                  </p>
                  {photoError && (
                    <p className="text-xs text-rose-500 font-bold mt-1.5 flex items-center gap-1 justify-center sm:justify-start">
                      <span>⚠️</span> {photoError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">👤</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Manish Kumar"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Address & Date of Birth Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex justify-between">
                  <span>Email Address <span className="text-rose-500">*</span></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-normal lowercase">primary key</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">✉️</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. manish@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex justify-between">
                  <span>Date of Birth (DOB) <span className="text-rose-500">*</span></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-normal lowercase">for exam entry</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">📅</span>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Phone & College Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Mobile / WhatsApp
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">📱</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  College / Institute
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">🏫</span>
                  <select
                    value={selectedCollege}
                    onChange={e => setSelectedCollege(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all cursor-pointer appearance-none"
                  >
                    <option value="">-- Select College / Institute --</option>
                    {COLLEGE_LIST.map((col) => (
                      <option key={col} value={col} className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800">
                        {col}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
                </div>

                {selectedCollege === 'Other / College Not Listed' && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      required
                      value={customCollege}
                      onChange={e => setCustomCollege(e.target.value)}
                      placeholder="Please enter your College / Institute name"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900/60 border border-emerald-400 dark:border-emerald-600 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Roll Number / Student ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Roll Number / Student ID (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">🎓</span>
                <input
                  type="text"
                  value={rollNo}
                  onChange={e => setRollNo(e.target.value)}
                  placeholder="e.g. 210027010001"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registering Candidate...
                  </>
                ) : (
                  <>Submit Registration & Proceed 🚀</>
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Already registered?{' '}
                <Link to={`/test/${id}`} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                  Go directly to Exam Gate →
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
