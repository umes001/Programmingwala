import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, UserCheck, ShieldAlert, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Admissions() {
  const [activeTab, setActiveTab] = useState('apply'); // 'apply' or 'track'

  // Application form steps
  const [step, setStep] = useState(1);
  const [studentName, setStudentName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [selectedClass, setSelectedClass] = useState('');

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    fetch('/api/public/courses')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setCourses(data.data);
          if (data.data.length > 0) {
            setSelectedClass(data.data[0].title);
          } else {
            setSelectedClass('Java Development');
          }
        } else {
          setSelectedClass('Java Development');
        }
        setLoadingCourses(false);
      })
      .catch(err => {
        console.error('Failed to load courses:', err);
        setSelectedClass('Java Development');
        setLoadingCourses(false);
      });
  }, []);

  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [photoFile, setPhotoFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [appNo, setAppNo] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  // Status tracking states
  const [trackAppNo, setTrackAppNo] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('studentDetails', JSON.stringify({ name: studentName, dateOfBirth: dob, gender, class: selectedClass }));
    formData.append('parentDetails', JSON.stringify({ fatherName, motherName, email, phone, address }));
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    try {
      const res = await fetch('/api/public/admissions/apply', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setSubmitting(false);
      if (data.success) {
        setAppNo(data.applicationNumber);
        setApplySuccess(true);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        alert(data.message || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      alert('Network error. Failed to submit.');
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackAppNo.trim()) return;
    setTrackLoading(true);
    setTrackError('');
    setTrackResult(null);

    try {
      const res = await fetch(`/api/public/admissions/track/${trackAppNo.trim()}`);
      const data = await res.json();
      setTrackLoading(false);
      if (data.success) {
        setTrackResult(data.data);
      } else {
        setTrackError(data.message || 'Application number not found.');
      }
    } catch (err) {
      console.error(err);
      setTrackLoading(false);
      setTrackError('Server error. Failed to fetch status.');
    }
  };

  const resetForm = () => {
    setStep(1);
    setStudentName('');
    setDob('');
    setGender('Male');
    setSelectedClass(courses[0]?.title || 'Java Development');
    setFatherName('');
    setMotherName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setApplySuccess(false);
    setAppNo('');
  };

  return (
    <div className="max-w-4xl px-4 py-12 mx-auto space-y-12 md:px-8">

      {/* Title */}
      <div className="max-w-2xl mx-auto space-y-4 text-center">
        <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase border rounded-full text-brandCoral bg-brandCoral/10 border-brandCoral/20">REGISTRATIONS</span>
        <h1 className="text-4xl font-bold font-quicksand text-slate-800">Online Admission Portal</h1>
        <p className="text-sm text-slate-500">
          Apply online for Nursery and KG programs, attach primary documents, and track your admission status reviews.
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="flex justify-center border-b border-orange-100">
        <button
          onClick={() => setActiveTab('apply')}
          className={`flex items-center space-x-2 font-quicksand font-bold text-sm px-6 py-3.5 border-b-2 -mb-[2px] transition-colors ${activeTab === 'apply' ? 'border-brandCoral text-brandCoral' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Apply Online</span>
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`flex items-center space-x-2 font-quicksand font-bold text-sm px-6 py-3.5 border-b-2 -mb-[2px] transition-colors ${activeTab === 'track' ? 'border-brandCoral text-brandCoral' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
          <Search className="w-4 h-4" />
          <span>Track Application</span>
        </button>
      </div>

      {/* Tabs panels */}
      {activeTab === 'apply' ? (
        <div className="p-6 bg-white border shadow-sm border-orange-50 rounded-3xl md:p-10">

          {applySuccess ? (
            <div className="py-10 space-y-4 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-brandMint/10 text-brandMint">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold font-quicksand text-slate-800">Application Submitted!</h3>
              <p className="max-w-md mx-auto text-xs leading-relaxed text-slate-500">
                Thank you! Your registration form has been recorded successfully. Please save the application number below to track the review logs.
              </p>

              <div className="max-w-sm p-4 mx-auto space-y-1 border border-orange-100 bg-brandCream rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Application Tracking Number</span>
                <p className="font-mono text-2xl font-bold text-brandCoral">{appNo}</p>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    setActiveTab('track');
                    setTrackAppNo(appNo);
                  }}
                  className="font-quicksand font-bold text-xs bg-brandSky text-white px-6 py-2.5 rounded-full transition-all"
                >
                  TRACK CURRENT STATUS
                </button>
                <button
                  onClick={resetForm}
                  className="font-quicksand font-bold text-xs bg-slate-100 text-slate-600 px-6 py-2.5 rounded-full transition-all"
                >
                  SUBMIT NEW FORM
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-6">

              {/* Progress Steps Indicators */}
              <div className="flex items-center justify-between max-w-md pb-4 mx-auto text-xs font-bold border-b border-slate-100 text-slate-400 font-quicksand">
                <span className={step >= 1 ? 'text-brandCoral' : ''}>1. Student Details</span>
                <span>→</span>
                <span className={step >= 2 ? 'text-brandCoral' : ''}>2. Parent Details</span>
                <span>→</span>
                <span className={step >= 3 ? 'text-brandCoral' : ''}>3. Documents Upload</span>
              </div>

              {/* STEP 1: Student Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="pb-2 text-lg font-bold border-b font-quicksand text-slate-800 border-orange-50">Student Information</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">Child's Full Name</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Aiden Jenkins"
                      className="w-full p-3 text-xs border border-orange-100 outline-none bg-slate-50 focus:border-brandCoral rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Date of Birth</label>
                      <input
                        type="date"
                        required
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full p-3 text-xs border border-orange-100 outline-none bg-slate-50 focus:border-brandCoral rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full p-3 text-xs border border-orange-100 outline-none bg-slate-50 focus:border-brandCoral rounded-xl"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Program / Class</label>
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full p-3 text-xs border border-orange-100 outline-none bg-slate-50 focus:border-brandCoral rounded-xl"
                      >
                        {loadingCourses ? (
                          <option>Loading courses...</option>
                        ) : courses.length > 0 ? (
                          courses.map((course) => (
                            <option key={course._id} value={course.title}>
                              {course.title} {course.price ? `— ₹${Number(course.price).toLocaleString()}` : ''}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="Java Development">Java Development — ₹5,000</option>
                            <option value="MERN Developer">MERN Developer — ₹6,000</option>
                            <option value="Python Developer">Python Developer — ₹5,000</option>
                            <option value="Frontend Developer">Frontend Developer — ₹4,500</option>
                            <option value="Full Stack Java">Full Stack Java — ₹8,000</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (!studentName.trim() || !dob) return alert('Please fill in student details');
                        setStep(2);
                      }}
                      className="flex items-center px-6 py-3 space-x-1 text-xs font-bold text-white rounded-full shadow font-quicksand bg-brandCoral hover:bg-brandCoral-dark"
                    >
                      <span>NEXT: PARENT DETAILS</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Parent Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="pb-2 text-lg font-bold border-b font-quicksand text-slate-800 border-orange-50">Parent Information</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Father's Full Name</label>
                      <input
                        type="text"
                        required
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        placeholder="John Jenkins"
                        className="w-full p-3 text-xs border border-orange-100 outline-none bg-slate-50 focus:border-brandCoral rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Mother's Full Name</label>
                      <input
                        type="text"
                        required
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                        placeholder="Sarah Jenkins"
                        className="w-full p-3 text-xs border border-orange-100 outline-none bg-slate-50 focus:border-brandCoral rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Email Address (Registry Login ID)</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="parent@example.com"
                        className="w-full p-3 text-xs border border-orange-100 outline-none bg-slate-50 focus:border-brandCoral rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Contact Number</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full p-3 text-xs border border-orange-100 outline-none bg-slate-50 focus:border-brandCoral rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">Home Address</label>
                    <textarea
                      required
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street name, Area, City"
                      className="w-full p-3 text-xs border border-orange-100 outline-none resize-none bg-slate-50 focus:border-brandCoral rounded-xl"
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center px-6 py-3 space-x-1 text-xs font-bold rounded-full font-quicksand bg-slate-100 hover:bg-slate-200 text-slate-600"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>BACK</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!fatherName.trim() || !motherName.trim() || !email || !phone || !address.trim()) {
                          return alert('Please fill in parent details');
                        }
                        setStep(3);
                      }}
                      className="flex items-center px-6 py-3 space-x-1 text-xs font-bold text-white rounded-full shadow font-quicksand bg-brandCoral hover:bg-brandCoral-dark"
                    >
                      <span>NEXT: UPLOAD DOCUMENTS</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Documents Upload */}
              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="pb-2 text-lg font-bold border-b font-quicksand text-slate-800 border-orange-50">Supporting Documents</h4>
                  <p className="text-xs text-slate-500">
                    To expedite checks, please specify references or simulate files naming (local storage placeholder will be created).
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-600">Child's Passport Size Photo (JPG/JPEG/PNG) (Optional)</label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => setPhotoFile(e.target.files[0])}
                        className="w-full p-3 text-xs border border-orange-100 outline-none bg-slate-50 focus:border-brandCoral rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center px-6 py-3 space-x-1 text-xs font-bold rounded-full font-quicksand bg-slate-100 hover:bg-slate-200 text-slate-600"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>BACK</span>
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="font-quicksand font-bold text-xs bg-brandYellow hover:bg-brandYellow-dark text-slate-800 px-8 py-3.5 rounded-full shadow-md disabled:opacity-50"
                    >
                      {submitting ? 'Submitting Application...' : 'SUBMIT ADMISSION APPLICATION'}
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}

        </div>
      ) : (
        /* Status tracking panel */
        <div className="p-6 space-y-6 bg-white border shadow-sm border-orange-50 rounded-3xl md:p-10">
          <form onSubmit={handleTrack} className="flex flex-col max-w-md gap-2 mx-auto sm:flex-row">
            <input
              type="text"
              required
              value={trackAppNo}
              onChange={(e) => setTrackAppNo(e.target.value)}
              placeholder="Enter Application No: PRN-2026-XXXX"
              className="flex-grow p-3 font-mono text-xs font-bold border border-orange-100 outline-none bg-slate-50 focus:border-brandCoral rounded-xl"
            />
            <button
              type="submit"
              disabled={trackLoading}
              className="px-6 py-3 text-xs font-bold text-white transition-all font-quicksand bg-brandCoral hover:bg-brandCoral-dark rounded-xl"
            >
              {trackLoading ? 'Searching...' : 'TRACK STATUS'}
            </button>
          </form>

          {trackError && (
            <div className="flex items-center max-w-md p-4 mx-auto space-x-2 text-xs text-red-600 border border-red-100 bg-red-50 rounded-xl">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>{trackError}</span>
            </div>
          )}

          {trackResult && (
            <div className="max-w-md p-6 mx-auto space-y-4 text-xs font-semibold border border-orange-100 bg-brandCream rounded-2xl text-slate-600">
              <h3 className="pb-2 text-base font-bold border-b border-orange-100 font-quicksand text-slate-800">
                Application Review Logs
              </h3>
              <div className="space-y-2">
                <p>Application Number: <span className="font-mono text-slate-800">{trackResult.applicationNumber}</span></p>
                <p>Student Name: <span className="text-slate-800">{trackResult.studentDetails?.name}</span></p>
                <p>Target Class: <span className="text-slate-800">{trackResult.studentDetails?.class}</span></p>

                <div className="flex items-center pt-2 space-x-2">
                  <span>Current Status:</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${trackResult.status === 'approved' ? 'bg-brandMint/10 text-brandMint-dark border-brandMint/30' :
                    trackResult.status === 'rejected' ? 'bg-red-50 text-red-600 border border-red-100' :
                      'bg-brandYellow/10 text-brandYellow-dark border border-brandYellow/30'
                    }`}>
                    {trackResult.status}
                  </span>
                </div>

                <div className="p-3 mt-2 bg-white border border-orange-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Administrative Remarks</span>
                  <p className="font-normal leading-relaxed text-slate-700">
                    {trackResult.remarks || 'Your documents are currently undergoing verification.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
