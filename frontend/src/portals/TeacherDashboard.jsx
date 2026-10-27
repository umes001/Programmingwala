import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Users, Smile, Clock, Award, Clipboard, ChevronRight, Check, FileText, Printer, Video, Plus, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import ConfirmModal from '../components/ConfirmModal.jsx';
import ResultCardModal from '../components/ResultCardModal.jsx';

export default function TeacherDashboard() {
  const { user, profile } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Logs updates inputs states
  const [attStatus, setAttStatus] = useState('present');
  const [actTitle, setActTitle] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [actCat, setActCat] = useState('play');

  const [repTerm, setRepTerm] = useState('Term 1');
  const [repCognitive, setRepCognitive] = useState(80);
  const [repSocial, setRepSocial] = useState(80);
  const [repCreative, setRepCreative] = useState(80);
  const [repMotor, setRepMotor] = useState(80);
  const [repNotes, setRepNotes] = useState('');
  const [publishedResult, setPublishedResult] = useState(null);
  const [activeResultCard, setActiveResultCard] = useState(null);

  const [btnLoading, setBtnLoading] = useState(false);

  // Top tab toggle: classroom logging vs Google Meet
  const [activeView, setActiveView] = useState('classroom');

  // Google Meet states
  const [meetings, setMeetings] = useState([]);
  const [mtgTitle, setMtgTitle] = useState('');
  const [mtgDescription, setMtgDescription] = useState('');
  const [mtgStartTime, setMtgStartTime] = useState('');
  const [mtgDuration, setMtgDuration] = useState('60');
  const [mtgAudience, setMtgAudience] = useState('parents');
  const [mtgClassFilter, setMtgClassFilter] = useState('');
  const [mtgJoinUrl, setMtgJoinUrl] = useState('');

  // Dropdown filter states
  const [evalClass, setEvalClass] = useState('Preschool');
  const [evalStudentId, setEvalStudentId] = useState('');

  useEffect(() => {
    const filtered = students.filter(s => s.class === evalClass);
    if (filtered.length > 0) {
      setEvalStudentId(filtered[0]._id);
      setSelectedStudent(filtered[0]);
    } else {
      setEvalStudentId('');
      setSelectedStudent(null);
    }
  }, [evalClass, students]);

  useEffect(() => {
    if (evalStudentId) {
      const found = students.find(s => s._id === evalStudentId);
      if (found) setSelectedStudent(found);
    }
  }, [evalStudentId]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (activeView === 'meetings') {
      fetchMeetings();
    }
  }, [activeView]);

  const fetchStudents = () => {
    fetch('/api/portal/teacher/students', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStudents(data.students);
          if (data.students.length > 0) {
            setSelectedStudent(data.students[0]);
          }
        }
      })
      .catch(err => console.error(err));
  };

  // Google Meet: fetch, create, delete (teacher is the host)
  const fetchMeetings = () => {
    fetch('/api/meetings', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMeetings(data.data || []);
        }
      })
      .catch(err => console.error('Error fetching meetings:', err));
  };

  const handleCreateMeeting = (e) => {
    e.preventDefault();
    triggerConfirm(
      "Schedule New Meeting?",
      "This will publish the meeting so parents and staff can join at the scheduled time.",
      "submit",
      async () => {
        try {
          const res = await fetch('/api/meetings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              title: mtgTitle,
              description: mtgDescription,
              startTime: mtgStartTime,
              durationMinutes: mtgDuration,
              targetAudience: mtgAudience,
              classFilter: mtgClassFilter,
              joinUrl: mtgJoinUrl
            })
          });
          const data = await res.json();
          if (data.success) {
            alert('Meeting scheduled successfully!');
            setMtgTitle(''); setMtgDescription(''); setMtgStartTime('');
            setMtgDuration('60'); setMtgAudience('parents'); setMtgClassFilter('');
            setMtgJoinUrl('');
            fetchMeetings();
          } else {
            alert(data.message || 'Failed to schedule meeting');
          }
        } catch (err) {
          console.error(err);
          alert('Error scheduling meeting: ' + err.message);
        }
      }
    );
  };

  const handleDeleteMeeting = (meetingId) => {
    triggerConfirm(
      "Delete Meeting?",
      "This will cancel the meeting for all participants.",
      "delete",
      async () => {
        try {
          const res = await fetch(`/api/meetings/${meetingId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const data = await res.json();
          if (data.success) {
            alert('Meeting deleted!');
            fetchMeetings();
          } else {
            alert(data.message || 'Failed to delete meeting');
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'submit',
    onConfirm: () => {}
  });

  const triggerConfirm = (title, message, type, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleLogAttendance = (e) => {
    e.preventDefault();
    triggerConfirm(
      "Are you sure you want to submit?",
      `This will save the attendance record of ${selectedStudent?.name || 'the student'}.`,
      "submit",
      async () => {
        setBtnLoading(true);
        try {
          const res = await fetch(`/api/portal/teacher/student/${selectedStudent._id}/attendance`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status: attStatus })
          });
          const data = await res.json();
          setBtnLoading(false);
          if (data.success) {
            alert('Attendance logged successfully!');
            fetchStudents();
          }
        } catch (err) {
          console.error(err);
          setBtnLoading(false);
        }
      }
    );
  };

  const handleLogActivity = (e) => {
    e.preventDefault();
    if (!actTitle.trim() || !actDesc.trim()) return alert('Please input all details');
    
    triggerConfirm(
      "Are you sure you want to submit?",
      `This will post an activity update for ${selectedStudent?.name || 'the student'}.`,
      "submit",
      async () => {
        setBtnLoading(true);
        try {
          const res = await fetch(`/api/portal/teacher/student/${selectedStudent._id}/activity`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title: actTitle, description: actDesc, category: actCat })
          });
          const data = await res.json();
          setBtnLoading(false);
          if (data.success) {
            alert('Activity log posted successfully!');
            setActTitle('');
            setActDesc('');
            fetchStudents();
          }
        } catch (err) {
          console.error(err);
          setBtnLoading(false);
        }
      }
    );
  };

  const handleLogProgress = (e) => {
    e.preventDefault();
    triggerConfirm(
      "Are you sure you want to submit?",
      `This will publish the term result card for ${selectedStudent?.name || 'the student'}.`,
      "submit",
      async () => {
        setBtnLoading(true);
        try {
          const res = await fetch(`/api/portal/teacher/student/${selectedStudent._id}/progress`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              term: repTerm,
              cognitive: Number(repCognitive),
              social: Number(repSocial),
              creative: Number(repCreative),
              motorSkills: Number(repMotor),
              notes: repNotes
            })
          });
          const data = await res.json();
          setBtnLoading(false);
          if (data.success) {
            setPublishedResult({
              studentName: selectedStudent.name,
              className: selectedStudent.class,
              term: repTerm,
              cognitive: repCognitive,
              social: repSocial,
              creative: repCreative,
              motorSkills: repMotor,
              notes: repNotes,
              total: Number(repCognitive) + Number(repSocial) + Number(repCreative) + Number(repMotor),
              percentage: ((Number(repCognitive) + Number(repSocial) + Number(repCreative) + Number(repMotor)) / 4).toFixed(1)
            });
            setRepNotes('');
            fetchStudents();
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 }
            });
          }
        } catch (err) {
          console.error(err);
          setBtnLoading(false);
        }
      }
    );
  };


  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 font-quicksand font-medium">Fetching teacher credentials...</p>
      </div>
    );
  }

  return (
    <div className="clay-bg min-h-screen -m-4 md:-m-8 p-4 md:p-8 space-y-6">
      
      {/* Welcome Bar */}
      <div className="clay-card-purple p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-800">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-brandYellow to-yellow-400 border-4 border-white shadow flex items-center justify-center text-slate-800 text-xl font-bold font-quicksand">
            {profile.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="text-[#9F92EC] font-bold text-xs uppercase tracking-wider block">TEACHER PORTAL HUB</span>
            <h1 className="text-3xl font-quicksand font-bold text-slate-800 leading-tight">Hello, {profile.name}! 👋</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Qual: {profile.qualifications} | Specialization: {profile.specialization}
            </p>
          </div>
        </div>
        <div className="bg-white border-2 border-white/60 px-4 py-3 rounded-2xl text-xs font-bold text-slate-700 shadow-sm">
          Class Assigned: {profile.classesAssigned?.join(', ') || 'Nursery'}
        </div>
      </div>

      {/* View Toggle: Classroom logging vs Google Meet */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveView('classroom')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold font-quicksand rounded-xl transition-all ${activeView === 'classroom' ? 'bg-[#9F92EC] text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >
          <Clipboard className="w-4 h-4" /> My Classroom
        </button>
        <button
          onClick={() => setActiveView('meetings')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold font-quicksand rounded-xl transition-all ${activeView === 'meetings' ? 'bg-[#9F92EC] text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >
          <Video className="w-4 h-4" /> Google Meet
        </button>
      </div>

      {activeView === 'meetings' ? (
        <div className="clay-card p-6 md:p-8 min-h-[400px]">
          <div className="space-y-6">
            <h3 className="font-quicksand font-bold text-lg text-slate-800 border-b border-orange-50 pb-3 flex items-center gap-2">
              <Video className="w-5 h-5 text-[#9F92EC]" /> Google Meet
            </h3>

            {/* Creation Form */}
            <form onSubmit={handleCreateMeeting} className="bg-brandCream border border-orange-100 rounded-3xl p-5 space-y-4">
              <h4 className="text-sm font-bold font-quicksand text-slate-800">Schedule a New Meeting</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Meeting Title</label>
                  <input type="text" required value={mtgTitle} onChange={(e) => setMtgTitle(e.target.value)} placeholder="e.g. Online Doubt Session" className="w-full p-2.5 border border-orange-100 outline-none bg-white focus:border-brandCoral rounded-xl" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Start Time</label>
                  <input type="datetime-local" required value={mtgStartTime} onChange={(e) => setMtgStartTime(e.target.value)} className="w-full p-2.5 border border-orange-100 outline-none bg-white focus:border-brandCoral rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Duration (min)</label>
                  <input type="number" min="5" value={mtgDuration} onChange={(e) => setMtgDuration(e.target.value)} className="w-full p-2.5 border border-orange-100 outline-none bg-white focus:border-brandCoral rounded-xl" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Audience</label>
                  <select value={mtgAudience} onChange={(e) => setMtgAudience(e.target.value)} className="w-full p-2.5 border border-orange-100 outline-none bg-white focus:border-brandCoral rounded-xl">
                    <option value="all">Everyone</option>
                    <option value="parents">Parents</option>
                    <option value="teachers">Teachers</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Class Filter (optional)</label>
                  <select value={mtgClassFilter} onChange={(e) => setMtgClassFilter(e.target.value)} className="w-full p-2.5 border border-orange-100 outline-none bg-white focus:border-brandCoral rounded-xl">
                    <option value="">All classes</option>
                    {profile.classesAssigned?.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-600">Description (optional)</label>
                <textarea rows={2} value={mtgDescription} onChange={(e) => setMtgDescription(e.target.value)} placeholder="Agenda or notes for attendees" className="w-full p-2.5 border border-orange-100 outline-none bg-white focus:border-brandCoral rounded-xl resize-none" />
              </div>
              <div className="p-3 space-y-2 text-xs border border-dashed border-orange-100 rounded-xl bg-white/50">
                <p className="font-bold text-slate-500">Google Meet link <span className="font-normal text-slate-400">(paste a https://meet.google.com/ link — auto-generated if a Google service account is configured)</span></p>
                  <input type="url" value={mtgJoinUrl} onChange={(e) => setMtgJoinUrl(e.target.value)} placeholder="https://meet.google.com/xxx-xxxx-xxx" className="w-full p-2.5 border border-orange-100 outline-none bg-white focus:border-brandCoral rounded-xl" />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-1.5 font-quicksand font-bold text-xs bg-[#9F92EC] text-white px-6 py-2.5 rounded-xl hover:bg-[#7B68C9]">
                  <Plus className="w-4 h-4" /> SCHEDULE MEETING
                </button>
              </div>
            </form>

            {/* Meetings List */}
            <div className="space-y-3">
              <h4 className="pb-2 text-sm font-bold border-b font-quicksand text-slate-800 border-orange-50">Upcoming & Past Meetings ({meetings.length})</h4>
              {meetings.length === 0 ? (
                <p className="py-10 text-xs text-center text-slate-500">No meetings scheduled yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {meetings.map((m) => {
                    const start = new Date(m.startTime);
                    return (
                      <div key={m._id} className="flex flex-col justify-between p-4 space-y-3 bg-white border shadow-sm border-orange-100 rounded-2xl">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${m.targetAudience === 'parents' ? 'bg-brandSky/10 text-brandSky-dark border-brandSky/30' : m.targetAudience === 'teachers' ? 'bg-brandLavender/10 text-brandLavender-dark border-brandLavender/30' : 'bg-brandMint/10 text-brandMint-dark border-brandMint/30'}`}>
                              {m.targetAudience}
                            </span>
                            <span className="text-[9px] uppercase font-bold text-slate-400">{m.status}</span>
                          </div>
                          <h5 className="text-sm font-bold font-quicksand text-slate-800">{m.title}</h5>
                          <p className="text-[11px] text-slate-500">
                            {start.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} at {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {m.durationMinutes || 60} min
                          </p>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-orange-50">
                          <a href={m.joinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-white transition-all rounded-lg bg-brandSky hover:bg-brandSky-dark">
                            <Video className="w-3.5 h-3.5" /> JOIN
                          </a>
                          <button onClick={() => handleDeleteMeeting(m._id)} className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-rose-600 transition-all rounded-lg hover:bg-rose-50">
                            <Trash2 className="w-3.5 h-3.5" /> DELETE
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
      <div className="clay-card p-6 md:p-8 min-h-[400px]">
        <div className="space-y-6">
          <h3 className="font-quicksand font-bold text-lg text-slate-800 border-b border-orange-50 pb-3">Student Performance Logging</h3>
          
          {/* Dropdown Selectors: First Class, then Student */}
          <div className="bg-brandCream border border-orange-100 rounded-3xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-slate-600 font-bold block">1. Choose Class / Program</label>
              <select
                value={evalClass}
                onChange={(e) => setEvalClass(e.target.value)}
                className="w-full bg-white border border-orange-100 focus:border-brandCoral rounded-xl p-3 outline-none"
              >
                <option value="Pre-Nursery">Pre-Nursery</option>
                <option value="Nursery">Nursery</option>
                <option value="Junior KG">Junior KG</option>
                <option value="Senior KG">Senior KG</option>
                <option value="Preschool">Preschool</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
                <option value="4th">4th</option>
                <option value="5th">5th</option>
                <option value="6th">6th</option>
                <option value="7th">7th</option>
                <option value="8th">8th</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-slate-600 font-bold block">2. Choose Student Name</label>
              <select
                value={evalStudentId}
                onChange={(e) => setEvalStudentId(e.target.value)}
                className="w-full bg-white border border-orange-100 focus:border-brandCoral rounded-xl p-3 outline-none"
              >
                <option value="">-- Select Student --</option>
                {students.filter(s => s.class === evalClass).map(std => (
                  <option key={std._id} value={std._id}>{std.name}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedStudent ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Attendance & Activities */}
              <div className="lg:col-span-5 space-y-6">
                {/* 1. Log Attendance */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                  <h4 className="font-quicksand font-bold text-slate-800 text-sm flex items-center space-x-1">
                    <Clipboard className="w-4 h-4 text-brandSky" />
                    <span>Log Attendance</span>
                  </h4>
                  <form onSubmit={handleLogAttendance} className="space-y-2.5">
                    <select
                      value={attStatus}
                      onChange={(e) => setAttStatus(e.target.value)}
                      className="w-full bg-white border rounded-xl p-2.5 text-xs outline-none font-semibold text-slate-600"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                    <button
                      type="submit"
                      disabled={btnLoading}
                      className="w-full font-quicksand font-bold text-xs clay-button-purple py-3 shadow"
                    >
                      SAVE ATTENDANCE RECORD
                    </button>
                  </form>
                </div>

                {/* 2. Log Daily Activity */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                  <h4 className="font-quicksand font-bold text-slate-800 text-sm flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-brandYellow-dark" />
                    <span>Log Daily Activity</span>
                  </h4>
                  <form onSubmit={handleLogActivity} className="space-y-3">
                    <div className="grid grid-cols-1 gap-2.5">
                      <input
                        type="text"
                        required
                        placeholder="Activity Title: e.g. Painted Flower Card"
                        value={actTitle}
                        onChange={(e) => setActTitle(e.target.value)}
                        className="bg-white border rounded-xl p-2.5 text-xs outline-none"
                      />
                      <select
                        value={actCat}
                        onChange={(e) => setActCat(e.target.value)}
                        className="bg-white border rounded-xl p-2.5 text-xs outline-none font-semibold text-slate-600"
                      >
                        <option value="art">Art & Craft Activity</option>
                        <option value="food">Meal Intake Update</option>
                        <option value="nap">Nap Time Log</option>
                        <option value="play">Play & Sports Log</option>
                        <option value="academic">Classroom Studies</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Activity Description..."
                      value={actDesc}
                      onChange={(e) => setActDesc(e.target.value)}
                      className="bg-white border rounded-xl p-2.5 w-full text-xs outline-none"
                    />
                    <button
                      type="submit"
                      disabled={btnLoading}
                      className="w-full font-quicksand font-bold text-xs clay-button-purple py-3 shadow"
                    >
                      POST ACTIVITY UPDATE
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Progress Reports by Subject */}
              <div className="lg:col-span-7 bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                <h4 className="font-quicksand font-bold text-slate-800 text-sm flex items-center space-x-1">
                  <Award className="w-4 h-4 text-brandCoral" />
                  <span>Fill Student Result by Subject</span>
                </h4>
                
                <form onSubmit={handleLogProgress} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Assessment Term</label>
                    <select
                      value={repTerm}
                      onChange={e => setRepTerm(e.target.value)}
                      className="bg-white border rounded-xl p-2.5 w-full text-xs outline-none font-semibold text-slate-600"
                    >
                      <option>Term 1 (Mid-Year)</option>
                      <option>Term 2 (Final Evaluations)</option>
                    </select>
                  </div>

                  {publishedResult ? (
                    <div className="bg-white border-2 border-white shadow-[0_15px_30px_rgba(159,146,236,0.12)] rounded-3xl p-5 space-y-4 text-slate-800 relative overflow-hidden">
                      <div className="text-center pb-2.5 border-b-2 border-slate-100 space-y-1">
                        <span className="text-[9px] font-extrabold tracking-widest text-[#7C3AED] bg-[#EAE8FC] px-2.5 py-1 rounded-full">GENERATED RESULT CARD</span>
                        <h4 className="font-quicksand font-bold text-sm text-[#5B468C] mt-1.5">Appletree Infotech</h4>
                        <p className="text-[9px] text-slate-400 font-semibold">{publishedResult.term}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 py-2 bg-[#FAF9F5] px-3.5 rounded-xl border border-slate-100">
                        <p>Student Name: <span className="text-slate-800">{publishedResult.studentName}</span></p>
                        <p>Class: <span className="text-slate-800">{publishedResult.className}</span></p>
                      </div>

                      <div className="space-y-2 pt-1 text-xs">
                        <div className="flex justify-between items-center font-bold text-slate-500 border-b pb-1">
                          <span>Subject</span>
                          <span>Marks Obtained</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600 font-medium">
                          <span>English (Language Arts)</span>
                          <span className="font-bold text-slate-800">{publishedResult.cognitive} / 100</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600 font-medium">
                          <span>Mathematics (Numeracy)</span>
                          <span className="font-bold text-slate-800">{publishedResult.social} / 100</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600 font-medium">
                          <span>Discovery Science</span>
                          <span className="font-bold text-slate-800">{publishedResult.creative} / 100</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600 font-medium">
                          <span>Arts & Crafts</span>
                          <span className="font-bold text-slate-800">{publishedResult.motorSkills} / 100</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1 text-center">
                        <div className="bg-[#EAE8FC] p-2.5 rounded-xl border-2 border-white shadow-[inset_1px_1px_2.5px_white]">
                          <span className="text-[9px] font-bold text-slate-400 block uppercase">Total Score</span>
                          <span className="text-sm font-bold text-[#7C3AED]">{publishedResult.total} / 400</span>
                        </div>
                        <div className="bg-[#FEF3C7] p-2.5 rounded-xl border-2 border-white shadow-[inset_1px_1px_2.5px_white]">
                          <span className="text-[9px] font-bold text-slate-400 block uppercase">Percentage</span>
                          <span className="text-sm font-bold text-amber-700">{publishedResult.percentage}%</span>
                        </div>
                      </div>

                      <div className="bg-[#FAF9F5] border border-slate-100 p-3 rounded-xl text-[10px]">
                        <span className="text-[9.5px] text-slate-400 font-bold uppercase block tracking-wider">Teacher Observations</span>
                        <p className="text-slate-600 mt-1 italic font-medium">"{publishedResult.notes || 'No remarks recorded.'}"</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveResultCard({
                            student: selectedStudent,
                            report: {
                              cognitive: publishedResult.cognitive,
                              social: publishedResult.social,
                              creative: publishedResult.creative,
                              motorSkills: publishedResult.motorSkills,
                              notes: publishedResult.notes,
                              term: publishedResult.term,
                              createdAt: new Date().toISOString()
                            },
                            parentName: selectedStudent.parentId?.name || selectedStudent.parentDetails?.fatherName || selectedStudent.parentDetails?.motherName || 'N/A'
                          })}
                          className="flex-1 py-2.5 px-4 rounded-2xl bg-[#5B468C] hover:bg-[#4A3970] text-white font-quicksand font-bold text-xs shadow transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View & Print</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPublishedResult(null)}
                          className="flex-1 py-2.5 px-4 rounded-2xl bg-slate-105 hover:bg-slate-200 text-slate-600 font-quicksand font-bold text-xs shadow transition-all active:scale-[0.98] cursor-pointer"
                        >
                          PUBLISH ANOTHER
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600 block">Mathematics (Numeracy)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            required
                            value={repSocial}
                            onChange={e => setRepSocial(Number(e.target.value))}
                            className="bg-white border rounded-xl p-2.5 w-full outline-none font-semibold text-slate-600"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600 block">English (Language Arts)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            required
                            value={repCognitive}
                            onChange={e => setRepCognitive(Number(e.target.value))}
                            className="bg-white border rounded-xl p-2.5 w-full outline-none font-semibold text-slate-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600 block">Discovery Science</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            required
                            value={repCreative}
                            onChange={e => setRepCreative(Number(e.target.value))}
                            className="bg-white border rounded-xl p-2.5 w-full outline-none font-semibold text-slate-600"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600 block">Arts & Crafts</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            required
                            value={repMotor}
                            onChange={e => setRepMotor(Number(e.target.value))}
                            className="bg-white border rounded-xl p-2.5 w-full outline-none font-semibold text-slate-600"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="font-bold text-slate-600 block">Teacher Notes & Remarks</label>
                        <input
                          type="text"
                          required
                          placeholder="observations: e.g. Tommy shows excellent skills in math..."
                          value={repNotes}
                          onChange={(e) => setRepNotes(e.target.value)}
                          className="bg-white border rounded-xl p-3 w-full outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={btnLoading}
                        className="w-full font-quicksand font-bold text-xs clay-button-pink py-3.5 shadow"
                      >
                        PUBLISH TERM RESULT CARD
                      </button>
                    </>
                  )}
                </form>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-orange-200 rounded-3xl bg-orange-50/20">
              <p className="text-xs text-slate-500 font-quicksand">Please select a class and student name above to begin logging performance.</p>
            </div>
          )}

        </div>
      </div>
      )}

      {activeResultCard && (
        <ResultCardModal
          activeResult={activeResultCard}
          onClose={() => setActiveResultCard(null)}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        type={confirmModal.type}
      />
    </div>
  );
}
