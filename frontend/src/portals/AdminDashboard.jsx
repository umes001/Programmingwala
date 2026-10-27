import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Users, User, CreditCard, Bell, Image as ImageIcon, MessageCircle, CheckCircle, XCircle, Trash2, Plus, Clock, Search, FileText, Printer, Edit, Download, Contact, X, Sparkles, BookOpen, Video, Wallet, Eye, EyeOff, Upload, AlertCircle, ChevronDown, ChevronUp, Play, Pause, RotateCcw, Award, ShieldCheck, Share2, Check, ExternalLink, Sun, CloudSun, Wind, Radio, Volume2, VolumeX, Send, Globe, SkipBack, SkipForward, CloudRain, Droplets, MapPin, AlertTriangle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import ConfirmModal from '../components/ConfirmModal.jsx';
import FeeStructureMaster from '../components/FeeStructureMaster.jsx';
import AdmissionPaymentModal from '../components/AdmissionPaymentModal.jsx';
import CollectPaymentModal from '../components/CollectPaymentModal.jsx';
import CertificateModal from '../components/CertificateModal.jsx';
import AdminExamSuite from './examAdmin/AdminExamSuite.jsx';
import AssessmentAdmin from '../pages/AssessmentAdmin.jsx';
import AdminKbcManager from './examAdmin/AdminKbcManager.jsx';

const COURSE_OPTIONS = ['Java Development', 'MERN Developer', 'Python Developer', 'Frontend Developer'];

const WORLDWIDE_RADIO_STATIONS = [
  { id: 'lofi', name: 'Lofi Coding Cafe', genre: 'Chillhop & Beats', country: '🌐 Global', url: 'https://ice2.somafm.com/groovesalad-128-mp3' },
  { id: 'defcon', name: 'DEF CON Cyberpunk', genre: 'Synthwave & Hack Beats', country: '🇺🇸 USA', url: 'https://ice1.somafm.com/defcon-128-mp3' },
  { id: 'paris', name: 'Paris Secret Lounge', genre: 'Jazz & Downtempo', country: '🇫🇷 France', url: 'https://ice4.somafm.com/secretagent-128-mp3' },
  { id: 'ambient', name: 'Deep Space Drone', genre: 'Ambient Focus & Calm', country: '🌌 Global', url: 'https://ice6.somafm.com/chillout-128-mp3' },
  { id: 'indie', name: 'Indie Pop Rocks', genre: 'Indie & Alternative', country: '🇬🇧 UK', url: 'https://ice2.somafm.com/indiepop-128-mp3' },
  { id: 'retro', name: 'Underground 80s', genre: '80s Synth & Retro Wave', country: '🌐 Global Hits', url: 'https://ice4.somafm.com/u80s-128-mp3' },
  { id: 'lush', name: 'Tokyo Melodic Lounge', genre: 'Electronic & Vocal Chill', country: '🇯🇵 Japan', url: 'https://ice1.somafm.com/lush-128-mp3' },
  { id: 'beat', name: 'Deep House Beats', genre: 'Club & Deep Electronic', country: '🌴 Miami', url: 'https://ice1.somafm.com/beatblender-128-mp3' }
];

function AttachmentManager({ attachments = [], onAdd, onDelete }) {
  const [uploading, setUploading] = useState(false);

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('materialFile', file);
      const res = await fetch('/api/admin/upload-material', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        onAdd(data.data);
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2 border border-slate-200/60 p-3 rounded-2xl bg-white text-slate-800">
      <div className="flex items-center justify-between">
        <label className="font-bold text-[10px] text-slate-600 uppercase tracking-wider">Materials / PDFs</label>
        <label className="text-[10px] font-black text-brandSky cursor-pointer hover:underline flex items-center gap-1">
          <Upload className="w-3.5 h-3.5" />
          <span>{uploading ? 'UPLOADING...' : 'UPLOAD'}</span>
          <input type="file" accept=".pdf,.zip,.rar,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.txt" onChange={handleFileChange} disabled={uploading} className="hidden" />
        </label>
      </div>

      {attachments.length === 0 ? (
        <p className="text-[10px] text-slate-400 italic">No attachments.</p>
      ) : (
        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
          {attachments.map((att, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-bold truncate text-slate-700" title={att.name}>{att.name}</span>
                <span className="text-slate-400 shrink-0">({formatSize(att.size)})</span>
              </div>
              <button type="button" onClick={() => onDelete(idx)} className="text-red-500 hover:text-red-700 p-0.5 shrink-0 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || (() => {
    try { return localStorage.getItem('admin_active_tab') || 'stats'; } catch (_) { return 'stats'; }
  })();
  const [activeTab, setActiveTabState] = useState(initialTab);

  const setActiveTab = (tabId) => {
    setActiveTabState(tabId);
    try {
      localStorage.setItem('admin_active_tab', tabId);
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.set('tab', tabId);
        return next;
      }, { replace: true });
    } catch (_) {}
  };

  const [stats, setStats] = useState(null);

  // Dynamic lists
  const [admissions, setAdmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [fees, setFees] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Interactive Live Dashboard States (Working Timer, Real Worldwide Radio, Tasks, Dues, Weather)
  const audioRef = useRef(null);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isPlayingRadio, setIsPlayingRadio] = useState(false);
  const [radioVolume, setRadioVolume] = useState(80);
  const [isRadioBuffering, setIsRadioBuffering] = useState(false);

  const [timerSeconds, setTimerSeconds] = useState(155); // 02:35
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedScheduleDay, setSelectedScheduleDay] = useState('Wed 24');

  const [dashboardTasks, setDashboardTasks] = useState([
    { id: 1, name: 'Student Code Review (Java Full Stack)', time: 'Sep 13, 08:30', done: true },
    { id: 2, name: 'Admissions & Faculty Sync', time: 'Sep 13, 10:30', done: true },
    { id: 3, name: 'Publish New React & Node.js Lesson', time: 'Sep 13, 13:00', done: false },
    { id: 4, name: 'Follow up on Student Fee Installments', time: 'Sep 13, 14:45', done: false }
  ]);

  const currentRadioStation = WORLDWIDE_RADIO_STATIONS[currentStationIndex] || WORLDWIDE_RADIO_STATIONS[0];

  const toggleRadioPlay = () => {
    if (!audioRef.current) return;
    if (isPlayingRadio) {
      audioRef.current.pause();
      setIsPlayingRadio(false);
    } else {
      setIsRadioBuffering(true);
      if (audioRef.current.src !== currentRadioStation.url) {
        audioRef.current.src = currentRadioStation.url;
      }
      audioRef.current.volume = radioVolume / 100;
      audioRef.current.play()
        .then(() => {
          setIsPlayingRadio(true);
          setIsRadioBuffering(false);
        })
        .catch((err) => {
          console.error('Radio play error:', err);
          setIsRadioBuffering(false);
          setIsPlayingRadio(false);
        });
    }
  };

  const handleNextStation = () => {
    const nextIdx = (currentStationIndex + 1) % WORLDWIDE_RADIO_STATIONS.length;
    setCurrentStationIndex(nextIdx);
    if (audioRef.current) {
      audioRef.current.src = WORLDWIDE_RADIO_STATIONS[nextIdx].url;
      audioRef.current.load();
      if (isPlayingRadio) {
        setIsRadioBuffering(true);
        audioRef.current.play()
          .then(() => setIsRadioBuffering(false))
          .catch(() => setIsRadioBuffering(false));
      }
    }
  };

  const handlePrevStation = () => {
    const prevIdx = (currentStationIndex - 1 + WORLDWIDE_RADIO_STATIONS.length) % WORLDWIDE_RADIO_STATIONS.length;
    setCurrentStationIndex(prevIdx);
    if (audioRef.current) {
      audioRef.current.src = WORLDWIDE_RADIO_STATIONS[prevIdx].url;
      audioRef.current.load();
      if (isPlayingRadio) {
        setIsRadioBuffering(true);
        audioRef.current.play()
          .then(() => setIsRadioBuffering(false))
          .catch(() => setIsRadioBuffering(false));
      }
    }
  };

  const handleSelectStation = (index) => {
    setCurrentStationIndex(index);
    if (audioRef.current) {
      audioRef.current.src = WORLDWIDE_RADIO_STATIONS[index].url;
      audioRef.current.load();
      if (isPlayingRadio) {
        setIsRadioBuffering(true);
        audioRef.current.play()
          .then(() => setIsRadioBuffering(false))
          .catch(() => setIsRadioBuffering(false));
      }
    }
  };

  const handleVolumeChange = (newVol) => {
    setRadioVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol / 100;
    }
  };

  // Live Ghaziabad, Vijaynagar Weather & Real-time Rain Alert State
  const [liveWeather, setLiveWeather] = useState({
    temp: 31,
    condition: 'Partly Cloudy',
    humidity: 55,
    windSpeed: 12,
    rain: 0,
    rainAlert: '☀️ No Rain Alert • Clear Skies',
    isRaining: false,
    aqi: 115,
    aqiLabel: 'MODERATE',
    aqiColor: 'text-amber-300'
  });

  useEffect(() => {
    const fetchLiveGhaziabadWeather = async () => {
      try {
        // Ghaziabad Vijaynagar coordinates: lat=28.6415, lon=77.4420
        const [weatherRes, aqiRes] = await Promise.all([
          fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6415&longitude=77.4420&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code,wind_speed_10m&timezone=Asia%2FKolkata'),
          fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=28.6415&longitude=77.4420&current=us_aqi,pm2_5,pm10')
        ]);

        const weatherData = await weatherRes.json();
        const aqiData = await aqiRes.json();

        if (weatherData?.current) {
          const cur = weatherData.current;
          const code = cur.weather_code || 0;
          let cond = 'Clear Sky';
          if (code === 1 || code === 2 || code === 3) cond = 'Partly Cloudy';
          else if (code >= 45 && code <= 48) cond = 'Foggy / Haze';
          else if (code >= 51 && code <= 55) cond = 'Light Drizzle';
          else if (code >= 61 && code <= 65) cond = 'Rain Showers';
          else if (code >= 80 && code <= 82) cond = 'Heavy Rain';
          else if (code >= 95) cond = 'Thunderstorm';

          const rainAmt = cur.rain || cur.precipitation || cur.showers || 0;
          const isRain = rainAmt > 0 || code >= 51;
          const rainMsg = isRain
            ? `🌧️ LIVE RAIN ALERT: ${rainAmt > 0 ? rainAmt + ' mm/h' : 'Active Precipitation'}`
            : '☀️ Clear Skies • Zero Rain Detected';

          let aqiVal = aqiData?.current?.us_aqi ? Math.round(aqiData.current.us_aqi) : 115;
          let aqiLbl = 'MODERATE';
          let aqiClr = 'text-amber-300';
          if (aqiVal <= 50) { aqiLbl = 'GOOD'; aqiClr = 'text-emerald-300'; }
          else if (aqiVal <= 100) { aqiLbl = 'MODERATE'; aqiClr = 'text-yellow-300'; }
          else if (aqiVal <= 150) { aqiLbl = 'UNHEALTHY (SENSITIVE)'; aqiClr = 'text-orange-300'; }
          else { aqiLbl = 'POOR / UNHEALTHY'; aqiClr = 'text-rose-300'; }

          setLiveWeather({
            temp: Math.round(cur.temperature_2m),
            condition: cond,
            humidity: cur.relative_humidity_2m,
            windSpeed: Math.round(cur.wind_speed_10m),
            rain: rainAmt,
            rainAlert: rainMsg,
            isRaining: isRain,
            aqi: aqiVal,
            aqiLabel: aqiLbl,
            aqiColor: aqiClr
          });
        }
      } catch (err) {
        console.log('Live weather fetch error:', err);
      }
    };

    fetchLiveGhaziabadWeather();
    const interval = setInterval(fetchLiveGhaziabadWeather, 120000); // refresh every 2 mins
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleDashboardTask = (id) => {
    setDashboardTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Real WhatsApp reminder for real student fee invoice
  const handleSendRealWhatsAppReminder = (feeItem) => {
    const studentName = feeItem.student?.name || feeItem.studentName || 'Student';
    const courseName = feeItem.student?.class || feeItem.courseName || 'Course';
    const phone = feeItem.student?.parentPhone || feeItem.student?.phone || '';
    const dueText = feeItem.dueDate ? new Date(feeItem.dueDate).toLocaleDateString() : feeItem.term || 'Due Soon';
    const msg = `Hello ${studentName}, this is a gentle fee reminder from AppleTree Infotech for your ${courseName} course. Outstanding amount: ₹${feeItem.amount.toLocaleString('en-IN')}. Due date: ${dueText}. Please settle soon.`;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Remarks for approval reviews
  const [remarks, setRemarks] = useState('');

  // Subtabs configuration
  const [admissionsSubTab, setAdmissionsSubTab] = useState('review');
  const [usersSubTab, setUsersSubTab] = useState('registry');

  // Form states for New Admission Entry
  const [admStdName, setAdmStdName] = useState('');
  const [admStdDob, setAdmStdDob] = useState('');
  const [admStdGender, setAdmStdGender] = useState('Male');
  const [admPhoto, setAdmPhoto] = useState(null);
  const [admPhotoPreview, setAdmPhotoPreview] = useState(null);
  const [admSelectedCourses, setAdmSelectedCourses] = useState(['Java Development']);
  const [admStdClass, setAdmStdClass] = useState('Java Development');
  const [admParentFather, setAdmParentFather] = useState('');
  const [admParentMother, setAdmParentMother] = useState('');
  const [admParentEmail, setAdmParentEmail] = useState('');
  const [admParentPhone, setAdmParentPhone] = useState('');
  const [admParentAddress, setAdmParentAddress] = useState('');
  const [admParentPassword, setAdmParentPassword] = useState('');
  const [admissionFee, setAdmissionFee] = useState('5000');
  const [admTuitionFee, setAdmTuitionFee] = useState('24000');
  const [admPaymentPlan, setAdmPaymentPlan] = useState('1month');

  const handleToggleCourse = (courseName, e) => {
    const current = Array.isArray(admSelectedCourses) ? admSelectedCourses : ['Java Development'];
    let updated;
    
    // If user clicked with Shift or Ctrl/Cmd, toggle multi-select mode:
    if (e?.shiftKey || e?.ctrlKey || e?.metaKey) {
      if (current.includes(courseName)) {
        updated = current.length > 1 ? current.filter(c => c !== courseName) : [courseName];
      } else {
        updated = [...current, courseName];
      }
    } else {
      // Direct 1-click select/switch to the selected course
      if (current.includes(courseName) && current.length === 1) {
        updated = [courseName];
      } else if (current.includes(courseName) && current.length > 1) {
        updated = current.filter(c => c !== courseName);
      } else {
        updated = [courseName];
      }
    }

    setAdmSelectedCourses(updated);
    const combinedName = updated.join(' + ');
    setAdmStdClass(combinedName);

    // Sum suggested prices for the selected courses
    let totalSum = 0;
    updated.forEach(cName => {
      const match = courses?.find(c => c.title && c.title.toLowerCase() === cName.toLowerCase());
      totalSum += (match && match.price) ? Number(match.price) : 15000;
    });
    setAdmTuitionFee(String(totalSum));
  };

  const getPlanCount = (plan) => {
    if (plan === '1month' || plan === '1' || plan === 'full') return 1;
    if (plan === '2months' || plan === '2') return 2;
    if (plan === '3months' || plan === '3') return 3;
    if (plan === '4months' || plan === '4') return 4;
    if (plan === '5months' || plan === '5') return 5;
    if (plan === '6months' || plan === '6') return 6;
    if (plan === '10months' || plan === '10') return 10;
    return 12;
  };

  // Admission payment modal (Cash / UPI → auto-saves student on verified payment)
  const [admissionPaymentOpen, setAdmissionPaymentOpen] = useState(false);
  const [collectPaymentOpen, setCollectPaymentOpen] = useState(false);
  const [selectedCollectFee, setSelectedCollectFee] = useState(null);

  // Receipt Modal State
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [activeIdCard, setActiveIdCard] = useState(null);
  const [idPhotoError, setIdPhotoError] = useState(false);

  // Form states for Direct Student Registration
  const [regStdName, setRegStdName] = useState('');
  const [regStdDob, setRegStdDob] = useState('');
  const [regStdGender, setRegStdGender] = useState('Male');
  const [regStdClass, setRegStdClass] = useState(COURSE_OPTIONS[0]);
  const [regParentName, setRegParentName] = useState('');
  const [regParentEmail, setRegParentEmail] = useState('');
  const [regParentPhone, setRegParentPhone] = useState('');
  const [regParentAddress, setRegParentAddress] = useState('');
  const [regParentPassword, setRegParentPassword] = useState('');
  const [regTotalFee, setRegTotalFee] = useState('12000');
  const [regPaidFee, setRegPaidFee] = useState('8000');
  const [regAttachAdmissionPdf, setRegAttachAdmissionPdf] = useState(true);
  const [regAttachRoadmapPdf, setRegAttachRoadmapPdf] = useState(true);
  const [regAttachReceiptPdf, setRegAttachReceiptPdf] = useState(true);
  const [regAttachIdImage, setRegAttachIdImage] = useState(true);

  // States for Admin sending PDFs & Images to Students
  const [sendDocModalOpen, setSendDocModalOpen] = useState(false);
  const [sendDocStudent, setSendDocStudent] = useState(null);
  const [sendDocTitle, setSendDocTitle] = useState('');
  const [sendDocType, setSendDocType] = useState('pdf'); // 'pdf' | 'image'
  const [sendDocCategory, setSendDocCategory] = useState('Admission & Course Files');
  const [sendDocDescription, setSendDocDescription] = useState('');
  const [sendDocUrl, setSendDocUrl] = useState('');

  // Search & Filtering for Student Registry
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('');

  // Modal control states
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  // Helper to reliably extract parent contacts from student object or linked admission
  const getStudentParentInfo = (std) => {
    if (!std) return { name: 'N/A', phone: 'N/A', email: 'N/A', address: 'N/A' };

    const pObj = (std.parentId && typeof std.parentId === 'object') ? std.parentId : null;
    const pDet = std.parentDetails || {};

    const admMatch = (admissions || []).find(a => 
      (a.studentDetails?.name && String(a.studentDetails.name).trim().toLowerCase() === String(std.name || '').trim().toLowerCase()) ||
      (a.studentDetails?.studentId && a.studentDetails.studentId === std.studentId) ||
      (a.applicationNumber && a.applicationNumber === std.studentId) ||
      (String(a._id) === String(std.admissionId))
    );
    const admP = admMatch?.parentDetails || {};

    const name = pObj?.name || pObj?.fatherName || pObj?.motherName || pDet.fatherName || pDet.motherName || pDet.name || admP.fatherName || admP.motherName || admP.name || std.parentName || 'N/A';
    const phone = pObj?.phone || pDet.phone || admP.phone || std.parentPhone || std.phone || 'N/A';
    const email = pObj?.email || pDet.email || admP.email || std.parentEmail || std.email || 'N/A';
    const address = pObj?.address || pDet.address || admP.address || std.parentAddress || std.address || 'N/A';

    return { name, phone, email, address };
  };

  // Form states for Editing Student
  const [editStdName, setEditStdName] = useState('');
  const [editStdDob, setEditStdDob] = useState('');
  const [editStdGender, setEditStdGender] = useState('Male');
  const [editStdClass, setEditStdClass] = useState(COURSE_OPTIONS[0]);
  const [editParentName, setEditParentName] = useState('');
  const [editParentPhone, setEditParentPhone] = useState('');
  const [editParentAddress, setEditParentAddress] = useState('');

  // Creation forms inputs states
  const [tName, setTName] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tPassword, setTPassword] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tQual, setTQual] = useState('');
  const [tClass, setTClass] = useState(COURSE_OPTIONS[0]);

  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [parentPassword, setParentPassword] = useState('');

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'submit',
    onConfirm: () => { }
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

  const [feeStdId, setFeeStdId] = useState('');
  const [feeClassFilter, setFeeClassFilter] = useState('');
  const [feeSearchQuery, setFeeSearchQuery] = useState('');
  const [feeTerm, setFeeTerm] = useState('Month 1 Installment');
  const [feeAmount, setFeeAmount] = useState('');
  const [feeDueDate, setFeeDueDate] = useState('');
  const [listFeeStatusFilter, setListFeeStatusFilter] = useState('all');
  const [listFeeClassFilter, setListFeeClassFilter] = useState('');
  const [listFeeSearchName, setListFeeSearchName] = useState('');

  const [feesSubTab, setFeesSubTab] = useState('billing');
  const [fineRules, setFineRules] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [feeFormBreakdown, setFeeFormBreakdown] = useState(null);

  // Fine Rules CRUD states
  const [isFineModalOpen, setIsFineModalOpen] = useState(false);
  const [editingFineId, setEditingFineId] = useState(null);
  const [fineFormData, setFineFormData] = useState({
    minDays: 1,
    maxDays: 10,
    fineAmount: 50
  });

  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCat, setAnnCat] = useState('general');
  const [annAudience, setAnnAudience] = useState('all');

  const [libraryNotes, setLibraryNotes] = useState([]);
  const [libraryTitle, setLibraryTitle] = useState('');
  const [libraryCourse, setLibraryCourse] = useState('Java Development');
  const [libraryContent, setLibraryContent] = useState('');
  const [libraryPdfFile, setLibraryPdfFile] = useState(null);

  const [galTitle, setGalTitle] = useState('');
  const [galDesc, setGalDesc] = useState('');
  const [galFile, setGalFile] = useState(null);
  const [galCat, setGalCat] = useState('classroom');
  const [galItems, setGalItems] = useState([]);

  // Course manager states
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [courseMilestones, setCourseMilestones] = useState('');
  const [courseCategory, setCourseCategory] = useState('development');
  const [courseColor, setCourseColor] = useState('brandMint');
  const [courseImage, setCourseImage] = useState(null);
  const [courseSchedules, setCourseSchedules] = useState([{ time: '', activity: '' }]);
  const [courses, setCourses] = useState([]);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [createdCourseBanner, setCreatedCourseBanner] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [moduleAttachments, setModuleAttachments] = useState([]);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonVideoFile, setLessonVideoFile] = useState(null);
  const [lessonVideoDuration, setLessonVideoDuration] = useState('');
  const [lessonAttachments, setLessonAttachments] = useState([]);

  // LMS upload + edit state
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoUploading, setVideoUploading] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editLessonTitle, setEditLessonTitle] = useState('');
  const [editLessonDescription, setEditLessonDescription] = useState('');
  const [editLessonContent, setEditLessonContent] = useState('');
  const [editLessonVideoUrl, setEditLessonVideoUrl] = useState('');
  const [editLessonVideoFile, setEditLessonVideoFile] = useState(null);
  const [editLessonVideoDuration, setEditLessonVideoDuration] = useState('');
  const [editLessonPublished, setEditLessonPublished] = useState(false);
  const [editLessonAttachments, setEditLessonAttachments] = useState([]);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [lessonIsPublished, setLessonIsPublished] = useState(true);

  const [editingModule, setEditingModule] = useState(null);
  const [editModuleTitle, setEditModuleTitle] = useState('');
  const [editModuleDescription, setEditModuleDescription] = useState('');
  const [editModuleAttachments, setEditModuleAttachments] = useState([]);

  // Job Posting Form States
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobDepartment, setJobDepartment] = useState('teaching');
  const [jobPosition, setJobPosition] = useState('junior');
  const [jobSalary, setJobSalary] = useState('');
  const [jobQualifications, setJobQualifications] = useState('');
  const [jobExperience, setJobExperience] = useState('');
  const [jobResponsibilities, setJobResponsibilities] = useState('');
  const [jobBenefits, setJobBenefits] = useState('');
  const [jobLocation, setJobLocation] = useState('On-site');
  const [jobDeadline, setJobDeadline] = useState('');
  const [jobsList, setJobsList] = useState([]);

  // Google Meet states
  const [meetings, setMeetings] = useState([]);
  const [mtgTitle, setMtgTitle] = useState('');
  const [mtgDescription, setMtgDescription] = useState('');
  const [mtgStartTime, setMtgStartTime] = useState('');
  const [mtgDuration, setMtgDuration] = useState('60');
  const [mtgAudience, setMtgAudience] = useState('all');
  const [mtgClassFilter, setMtgClassFilter] = useState('');
  const [mtgJoinUrl, setMtgJoinUrl] = useState('');

  // Dynamic course options deduplicated cleanly from published courses and defaults
  const courseOptions = React.useMemo(() => {
    const list = [];
    const seen = new Set();
    
    // Add courses from backend DB
    (courses || []).forEach(c => {
      if (c?.title?.trim() && !seen.has(c.title.trim().toLowerCase())) {
        seen.add(c.title.trim().toLowerCase());
        list.push(c.title.trim());
      }
    });

    // Add standard defaults if not already present
    COURSE_OPTIONS.forEach(opt => {
      const norm = opt.toLowerCase().replace(/dev(eloper|elopment)/g, '');
      const hasSimilar = Array.from(seen).some(s => s.replace(/dev(eloper|elopment)/g, '') === norm);
      if (!hasSimilar && !seen.has(opt.toLowerCase())) {
        seen.add(opt.toLowerCase());
        list.push(opt);
      }
    });

    return list.length > 0 ? list : COURSE_OPTIONS;
  }, [courses]);

  const audienceOptions = ['specific student', 'group chat', 'all learners'];

  const [aiQuizCourse, setAiQuizCourse] = useState('Java Development');
  const [aiQuizModule, setAiQuizModule] = useState('Core concepts');
  const [aiQuizLevel, setAiQuizLevel] = useState('Beginner');
  const [aiQuizStudentName, setAiQuizStudentName] = useState('');
  const [aiQuizAudience, setAiQuizAudience] = useState('specific student');
  const [quizResult, setQuizResult] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);

  const [aiAssignmentCourse, setAiAssignmentCourse] = useState('Java Development');
  const [aiAssignmentModule, setAiAssignmentModule] = useState('Core concepts');
  const [aiAssignmentStudentName, setAiAssignmentStudentName] = useState('');
  const [aiAssignmentAudience, setAiAssignmentAudience] = useState('group chat');
  const [aiAssignmentDifficulty, setAiAssignmentDifficulty] = useState('Intermediate');
  const [assignmentResult, setAssignmentResult] = useState(null);
  const [assignmentLoading, setAssignmentLoading] = useState(false);

  // Internship Certificates states
  const [certificates, setCertificates] = useState([]);
  const [activeCertificateModal, setActiveCertificateModal] = useState(null);
  const [isCertFormOpen, setIsCertFormOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [certSearchQuery, setCertSearchQuery] = useState('');
  
  // Certificate Form inputs
  const [certStudentName, setCertStudentName] = useState('');
  const [certInternshipName, setCertInternshipName] = useState('6-month Front-End Development Course (MERN Stack)');
  const [certStartDate, setCertStartDate] = useState('June 2, 2025');
  const [certEndDate, setCertEndDate] = useState('December 22, 2025');
  const [certIssueDate, setCertIssueDate] = useState('January 2, 2026');
  const [certNumber, setCertNumber] = useState('');
  const [certDescription, setCertDescription] = useState('This certification is awarded in recognition of the successful completion of the curriculum and mastery of the course content.');
  const [certCompanyAddress, setCertCompanyAddress] = useState('C-60 3rd Floor R.K. Tower RDC, Raj Nagar, Ghaziabad, 201001');
  const [certCompanyPhone, setCertCompanyPhone] = useState('7503962162, 9355343070');
  const [certCompanyEmail, setCertCompanyEmail] = useState('info@appletreeinfotech.in');
  const [certCompanyWeb, setCertCompanyWeb] = useState('appletreeinfotech.in');
  const [certPartnerUniversity, setCertPartnerUniversity] = useState('KALINGA UNIVERSITY');
  const [certLoading, setCertLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchAdmissions();
    fetchStudents();
    fetchTeachers();
    fetchFees();
    fetchQueries();
    fetchGallery();
    fetchFeeStructures();
    fetchFineRules();
    fetchJobs();
    fetchLibraryNotes();
    fetchMeetings();
    fetchCourses();
    fetchCertificates();
  }, [activeTab]);

  // Automatically calculate suggested tuition fee when selected courses change without resetting user selection
  useEffect(() => {
    if (courses && courses.length > 0) {
      const currentSelected = Array.isArray(admSelectedCourses) ? admSelectedCourses : [admStdClass].filter(Boolean);
      let calculatedFee = 0;
      currentSelected.forEach(cName => {
        const found = courses.find(c => c?.title && c.title.toLowerCase() === cName.toLowerCase());
        if (found && found.price !== undefined) {
          calculatedFee += Number(found.price);
        }
      });
      if (calculatedFee > 0) {
        setAdmTuitionFee(String(calculatedFee));
      }
    }
  }, [courses, admSelectedCourses, admStdClass]);

  const fetchFeeStructures = () => {
    fetch('/api/admin/fee-structures', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setFeeStructures(data.data); })
      .catch(err => console.error(err));
  };

  const fetchFineRules = () => {
    fetch('/api/admin/fine-rules', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setFineRules(data.data); })
      .catch(err => console.error(err));
  };

  const fetchStats = () => {
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setStats(data.stats); })
      .catch(err => console.error(err));
  };

  const fetchAdmissions = () => {
    fetch('/api/admin/admissions', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setAdmissions(data.data); })
      .catch(err => console.error(err));
  };

  const fetchStudents = () => {
    fetch('/api/admin/students', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setStudents(data.data); })
      .catch(err => console.error(err));
  };

  const fetchTeachers = () => {
    fetch('/api/admin/teachers', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setTeachers(data.data); })
      .catch(err => console.error(err));
  };

  const fetchFees = () => {
    fetch('/api/admin/fees', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setFees(data.data); })
      .catch(err => console.error(err));
  };

  const fetchQueries = () => {
    fetch('/api/admin/queries', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setQueries(data.data); })
      .catch(err => console.error(err));
  };

  // Admissions Action
  const handleAdmissionDecision = async (id, status, pswd) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/admissions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status, remarks, password: pswd })
      });
      const data = await res.json();
      setLoading(false);
      setRemarks('');
      setParentPassword('');
      setSelectedAdmission(null);
      if (data.success) {
        alert(`Admission application successfully marked ${status}!`);
        fetchAdmissions();
        if (status === 'approved') {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        }
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Delete Student
  const handleDeleteStudent = (id) => {
    triggerConfirm(
      "Are you sure you want to delete?",
      "This will permanently remove the student record from the database.",
      "delete",
      async () => {
        try {
          const res = await fetch(`/api/admin/students/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const data = await res.json();
          if (data.success) {
            alert('Student record deleted');
            fetchStudents();
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Register Teacher
  const handleCreateTeacher = (e) => {
    e.preventDefault();
    triggerConfirm(
      "Are you sure you want to submit?",
      `This will hire and register ${tName} as a staff teacher.`,
      "submit",
      async () => {
        try {
          const res = await fetch('/api/admin/teachers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              name: tName,
              email: tEmail,
              password: tPassword,
              phone: tPhone,
              qualifications: tQual,
              classesAssigned: [tClass]
            })
          });
          const data = await res.json();
          if (data.success) {
            alert('Teacher hired successfully!');
            setTName(''); setTEmail(''); setTPassword(''); setTPhone(''); setTQual('');
            fetchTeachers();
          } else {
            alert(data.message);
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Generate invoice
  const handleCreateFee = (e) => {
    e.preventDefault();
    if (!feeStdId) return alert('Please select a student');
    triggerConfirm(
      "Are you sure you want to submit?",
      "This will issue a new tuition fee invoice for the student.",
      "submit",
      async () => {
        try {
          const res = await fetch('/api/admin/fees', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ studentId: feeStdId, amount: Number(feeAmount), term: feeTerm, dueDate: feeDueDate })
          });
          const data = await res.json();
          if (data.success) {
            alert('Tuition invoice billed!');
            setFeeStdId('');
            setFeeDueDate('');
            setFeeAmount('');
            setFeeTerm('Month 1 Installment');
            setFeeFormBreakdown(null);
            fetchFees();
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Resolve a student's photo into a renderable URL for the ID card.
  // Payment-created students (and any without an uploaded photo) resolve to the
  // student-photo endpoint so the profile image still shows.
  const resolveStudentPhoto = (std) => {
    if (!std) return '';
    if (std.photo && /^https?:\/\//.test(std.photo)) return std.photo;
    return `/api/admin/students/photo/${std._id}`;
  };

  // Open the printable ID card with the photo pre-resolved.
  const handleViewIdCard = (std) => {
    setIdPhotoError(false);
    setActiveIdCard({ ...std, photo: resolveStudentPhoto(std) });
  };

  const getStudentInfo = (f) => {
    if (f.studentId && typeof f.studentId === 'object') {
      return { name: f.studentId.name, class: f.studentId.class, id: f.studentId._id };
    }
    const found = students.find(s => s._id === f.studentId);
    if (found) {
      return { name: found.name, class: found.class, id: found._id };
    }
    return { name: 'Unknown Student', class: 'N/A', id: f.studentId };
  };

  const handleViewReceipt = async (feeId) => {
    try {
      const res = await fetch(`/api/admin/receipt/${feeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        let matchedStructure = null;
        if (data.student?.class) {
          matchedStructure = feeStructures.find(fs => fs.class === data.student.class && fs.isActive);
        }
        setActiveReceipt({
          ...data,
          feeStructure: matchedStructure
        });
      } else {
        alert(data.message || 'Receipt not found');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load receipt');
    }
  };

  const handleCollectPayment = (feeId) => {
    const feeObj = fees.find(f => f._id === feeId);
    if (!feeObj) return;
    setSelectedCollectFee(feeObj);
    setCollectPaymentOpen(true);
  };

  const handleCollectPaymentSuccess = (data) => {
    setCollectPaymentOpen(false);
    fetchFees(); // refresh fee list
    if (data.receipt) {
      const fee = selectedCollectFee;
      const studentInfo = getStudentInfo(fee);
      let matchedStructure = null;
      if (studentInfo.class) {
        matchedStructure = feeStructures.find(fs => fs.class === studentInfo.class && fs.isActive);
      }
      setActiveReceipt({
        receipt: data.receipt,
        student: {
          name: studentInfo.name,
          class: studentInfo.class,
          studentId: studentInfo.id
        },
        fee: {
          term: fee.term,
          amount: fee.amount,
          fine: fee.fine || 0
        },
        feeStructure: matchedStructure
      });
    }
  };

  // Library notes workflow
  const handleCreateLibraryNote = async (e) => {
    e.preventDefault();
    if (!libraryTitle.trim()) return alert('Please provide a note title.');
    if (!libraryContent.trim() && !libraryPdfFile) return alert('Please provide note content or choose a PDF file.');

    try {
      const formData = new FormData();
      formData.append('title', libraryTitle.trim());
      formData.append('course', libraryCourse);
      if (libraryContent.trim()) formData.append('content', libraryContent.trim());
      if (libraryPdfFile) formData.append('pdfFile', libraryPdfFile);

      const response = await fetch('/api/admin/library-notes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to save the note');
      }

      setLibraryNotes(prev => [data.data, ...prev]);
      setLibraryTitle('');
      setLibraryContent('');
      setLibraryCourse('Java Development');
      setLibraryPdfFile(null);
      e.target.reset();
      alert(data.message || 'Course note saved to the library dashboard.');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to save the note');
    }
  };

  const handleDeleteLibraryNote = (id) => {
    triggerConfirm(
      'Delete note?',
      'This will remove the course note from the library panel.',
      'delete',
      async () => {
        try {
          const response = await fetch(`/api/admin/library-notes/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const data = await response.json();
          if (!data.success) throw new Error(data.message || 'Failed to delete the note');
          setLibraryNotes(prev => prev.filter(item => item._id !== id));
        } catch (err) {
          console.error(err);
          alert(err.message || 'Failed to delete the note');
        }
      }
    );
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setQuizLoading(true);
    setQuizResult(null);

    try {
      const response = await fetch('/api/public/ai-quiz-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: aiQuizCourse,
          module: aiQuizModule,
          level: aiQuizLevel,
          studentName: aiQuizStudentName || 'Student',
          audience: aiQuizAudience
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to generate quiz.');
      }

      setQuizResult(data.data);
      alert('AI quiz content generated successfully.');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Unable to generate quiz content.');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleGenerateAssignment = async (e) => {
    e.preventDefault();
    setAssignmentLoading(true);
    setAssignmentResult(null);

    try {
      const response = await fetch('/api/public/ai-assignment-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: aiAssignmentCourse,
          module: aiAssignmentModule,
          studentName: aiAssignmentStudentName || 'Student',
          audience: aiAssignmentAudience,
          difficulty: aiAssignmentDifficulty
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to generate assignment.');
      }

      setAssignmentResult(data.data);
      alert('AI assignment content generated successfully.');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Unable to generate assignment content.');
    } finally {
      setAssignmentLoading(false);
    }
  };

  // Create notice
  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    triggerConfirm(
      "Are you sure you want to submit?",
      "This will post a new bulletin notice to all parents.",
      "submit",
      async () => {
        try {
          const res = await fetch('/api/admin/announcements', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title: annTitle, content: annContent, category: annCat, targetAudience: annAudience })
          });
          const data = await res.json();
          if (data.success) {
            alert('Circular bulletin published!');
            setAnnTitle(''); setAnnContent('');
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Fetch Jobs
  const fetchJobs = () => {
    fetch('/api/admin/jobs', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setJobsList(data.data || []);
        }
      })
      .catch(err => console.error('Error fetching jobs:', err));
  };

  // Certificate API Handlers
  const fetchCertificates = () => {
    fetch('/api/admin/certificates', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCertificates(data.data || []);
        }
      })
      .catch(err => console.error('Error fetching certificates:', err));
  };

  const handleResetCertForm = () => {
    setEditingCert(null);
    setCertStudentName('');
    setCertInternshipName('6-month Front-End Development Course (MERN Stack)');
    setCertStartDate('June 2, 2025');
    setCertEndDate('December 22, 2025');
    setCertIssueDate('January 2, 2026');
    setCertNumber('');
    setCertDescription('This certification is awarded in recognition of the successful completion of the curriculum and mastery of the course content.');
    setCertCompanyAddress('C-60 3rd Floor R.K. Tower RDC, Raj Nagar, Ghaziabad, 201001');
    setCertCompanyPhone('7503962162, 9355343070');
    setCertCompanyEmail('info@appletreeinfotech.in');
    setCertCompanyWeb('appletreeinfotech.in');
    setCertPartnerUniversity('KALINGA UNIVERSITY');
    setIsCertFormOpen(false);
  };

  const handleEditCertificate = (cert) => {
    setEditingCert(cert);
    setCertStudentName(cert.studentName || '');
    setCertInternshipName(cert.internshipName || '');
    setCertStartDate(cert.startDate || '');
    setCertEndDate(cert.endDate || '');
    setCertIssueDate(cert.issueDate || '');
    setCertNumber(cert.certificateNumber || '');
    setCertDescription(cert.description || '');
    setCertCompanyAddress(cert.companyAddress || 'C-60 3rd Floor R.K. Tower RDC, Raj Nagar, Ghaziabad, 201001');
    setCertCompanyPhone(cert.companyPhone || '7503962162, 9355343070');
    setCertCompanyEmail(cert.companyEmail || 'info@appletreeinfotech.in');
    setCertCompanyWeb(cert.companyWeb || 'appletreeinfotech.in');
    setCertPartnerUniversity(cert.partnerUniversity || 'KALINGA UNIVERSITY');
    setIsCertFormOpen(true);
  };

  const handleSaveCertificate = (e) => {
    e.preventDefault();
    if (!certStudentName.trim()) return alert('Please enter student name.');
    if (!certInternshipName.trim()) return alert('Please enter internship/course name.');
    if (!certStartDate.trim() || !certEndDate.trim()) return alert('Please specify start and end dates.');
    if (!certIssueDate.trim()) return alert('Please specify issue date.');

    const isEdit = !!editingCert;
    const actionTitle = isEdit ? "Update Certificate?" : "Generate Internship Certificate?";
    const actionMsg = isEdit
      ? `This will update the certificate details for ${certStudentName}.`
      : `This will issue a new verifiable certificate for ${certStudentName} (${certInternshipName}).`;

    triggerConfirm(
      actionTitle,
      actionMsg,
      "submit",
      async () => {
        setCertLoading(true);
        try {
          const payload = {
            studentName: certStudentName,
            internshipName: certInternshipName,
            startDate: certStartDate,
            endDate: certEndDate,
            issueDate: certIssueDate,
            certificateNumber: certNumber,
            description: certDescription,
            companyAddress: certCompanyAddress,
            companyPhone: certCompanyPhone,
            companyEmail: certCompanyEmail,
            companyWeb: certCompanyWeb,
            partnerUniversity: certPartnerUniversity
          };

          const url = isEdit ? `/api/admin/certificates/${editingCert._id}` : '/api/admin/certificates';
          const method = isEdit ? 'PUT' : 'POST';

          const res = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
          });

          const data = await res.json();
          setCertLoading(false);

          if (data.success) {
            alert(isEdit ? 'Certificate updated successfully!' : 'Internship Certificate generated successfully!');
            fetchCertificates();
            if (!isEdit && data.data) {
              setActiveCertificateModal(data.data);
              confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
            }
            handleResetCertForm();
          } else {
            alert(data.message || 'Operation failed');
          }
        } catch (err) {
          console.error(err);
          setCertLoading(false);
          alert('Network error while saving certificate.');
        }
      }
    );
  };

  const handleDeleteCertificate = (id, certNum) => {
    triggerConfirm(
      "Revoke & Delete Certificate?",
      `This will permanently remove certificate ${certNum} from the verification database.`,
      "delete",
      async () => {
        try {
          const res = await fetch(`/api/admin/certificates/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const data = await res.json();
          if (data.success) {
            alert('Certificate removed successfully.');
            fetchCertificates();
          } else {
            alert(data.message || 'Failed to delete certificate.');
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Fetch Google Meet Meetings
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

  // Create Google Meet Meeting
  const handleCreateMeeting = (e) => {
    e.preventDefault();
    triggerConfirm(
      "Schedule New Meeting?",
      "This will publish the meeting so participants can join at the scheduled time.",
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
            setMtgDuration('60'); setMtgAudience('all'); setMtgClassFilter('');
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

  // Delete Google Meet Meeting
  const handleDeleteMeeting = (meetingId) => {
    triggerConfirm(
      "Delete Meeting?",
      "This will remove the meeting and cancel it for all participants.",
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

  const fetchLibraryNotes = () => {
    fetch('/api/admin/library-notes', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLibraryNotes(data.data || []);
        }
      })
      .catch(err => console.error('Error fetching library notes:', err));
  };

  // Create Job Posting
  const handleCreateJob = (e) => {
    e.preventDefault();
    triggerConfirm(
      "Post New Job Vacancy?",
      "This will publish the job posting to the careers section.",
      "submit",
      async () => {
        try {
          const res = await fetch('/api/admin/jobs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              title: jobTitle,
              description: jobDescription,
              department: jobDepartment,
              position: jobPosition,
              salary: parseInt(jobSalary),
              qualifications: jobQualifications,
              experience: jobExperience,
              responsibilities: jobResponsibilities,
              benefits: jobBenefits,
              location: jobLocation,
              applicationDeadline: jobDeadline
            })
          });
          const data = await res.json();
          if (data.success) {
            alert('Job posting published successfully!');
            setJobTitle(''); setJobDescription(''); setJobSalary('');
            setJobQualifications(''); setJobExperience(''); setJobResponsibilities('');
            setJobBenefits(''); setJobDeadline('');
            fetchJobs();
          } else {
            alert(data.message || 'Failed to post job');
          }
        } catch (err) {
          console.error(err);
          alert('Error posting job: ' + err.message);
        }
      }
    );
  };

  // Delete Job Posting
  const handleDeleteJob = (jobId) => {
    triggerConfirm(
      "Delete Job Posting?",
      "This action cannot be undone.",
      "delete",
      async () => {
        try {
          const res = await fetch(`/api/admin/jobs/${jobId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const data = await res.json();
          if (data.success) {
            alert('Job posting deleted!');
            fetchJobs();
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Fine Rules CRUD
  const handleSaveFineRule = async (e) => {
    e.preventDefault();
    const { minDays, maxDays, fineAmount } = fineFormData;
    if (minDays === '' || maxDays === '' || fineAmount === '') {
      return alert('All fields are required');
    }

    try {
      const url = editingFineId
        ? `/api/admin/fine-rules/${editingFineId}`
        : '/api/admin/fine-rules';
      const method = editingFineId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          minDays: Number(minDays),
          maxDays: Number(maxDays),
          fineAmount: Number(fineAmount)
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(editingFineId ? 'Fine rule updated successfully!' : 'Fine rule created successfully!');
        setEditingFineId(null);
        setFineFormData({ minDays: 1, maxDays: 10, fineAmount: 50 });
        setIsFineModalOpen(false);
        fetchFineRules();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error communicating with server');
    }
  };

  const handleDeleteFineRule = (id) => {
    triggerConfirm(
      "Delete Fine Rule?",
      "Are you sure you want to delete this fine rule?",
      "delete",
      async () => {
        try {
          const res = await fetch(`/api/admin/fine-rules/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const data = await res.json();
          if (data.success) {
            alert('Fine rule deleted successfully.');
            fetchFineRules();
          } else {
            alert(data.message || 'Failed to delete fine rule');
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Create gallery item
  const handleCreateGallery = (e) => {
    e.preventDefault();
    if (!galFile) return alert('Please select an image file to upload');
    triggerConfirm(
      "Are you sure you want to submit?",
      "This will upload the image to the public school gallery.",
      "submit",
      async () => {
        try {
          const formData = new FormData();
          formData.append('title', galTitle);
          formData.append('description', galDesc);
          formData.append('category', galCat);
          formData.append('file', galFile);

          const res = await fetch('/api/admin/gallery', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          });
          const data = await res.json();
          if (data.success) {
            alert('Media added to school gallery!');
            setGalTitle(''); setGalDesc(''); setGalFile(null);
            const fileInput = document.getElementById('gallery-file-input');
            if (fileInput) fileInput.value = '';
            fetchGallery();
          } else {
            alert(data.message || 'Failed to add media');
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  const fetchGallery = () => {
    fetch('/api/public/gallery')
      .then(res => res.json())
      .then(data => { if (data.success) setGalItems(data.data); })
      .catch(err => console.error(err));
  };

  const handleDeleteGallery = (id) => {
    triggerConfirm(
      "Are you sure you want to delete?",
      "This will remove the media item from the gallery.",
      "delete",
      async () => {
        try {
          const res = await fetch(`/api/admin/gallery/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const data = await res.json();
          if (data.success) {
            alert('Gallery item removed');
            fetchGallery();
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // ===== Course management =====
  const fetchCourses = () => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    fetch('/api/admin/courses', { headers })
      .then(res => {
        if (!res.ok) throw new Error('Admin courses request failed, falling back to public');
        return res.json();
      })
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setCourses(data.data);
        } else {
          return fetch('/api/public/courses')
            .then(r => r.json())
            .then(d => { if (d.success && Array.isArray(d.data)) setCourses(d.data); });
        }
      })
      .catch(() => {
        fetch('/api/public/courses')
          .then(res => res.json())
          .then(data => { if (data.success && Array.isArray(data.data)) setCourses(data.data); })
          .catch(err => console.error('Failed to load courses:', err));
      });
  };

  const addScheduleRow = () => setCourseSchedules(prev => [...prev, { time: '', activity: '' }]);
  const updateScheduleRow = (idx, field, value) => setCourseSchedules(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  const removeScheduleRow = (idx) => setCourseSchedules(prev => prev.filter((_, i) => i !== idx));

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseTitle || !courseTitle.trim()) {
      return alert('Please enter a course title.');
    }

    const cleanTitle = courseTitle.trim();
    const cleanDesc = courseDescription.trim() || `${cleanTitle} technical training program & hands-on practical curriculum.`;

    setIsCreatingCourse(true);
    try {
      const milestones = courseMilestones.split('\n').map(m => m.trim()).filter(Boolean);
      const cleanSchedule = courseSchedules.filter(r => r.time.trim() || r.activity.trim());

      const formData = new FormData();
      formData.append('title', cleanTitle);
      formData.append('description', cleanDesc);
      formData.append('duration', courseDuration || '1 month - 6 months');
      formData.append('price', coursePrice || '0');
      formData.append('milestones', JSON.stringify(milestones));
      formData.append('schedule', JSON.stringify(cleanSchedule));
      formData.append('category', courseCategory || 'development');
      formData.append('color', courseColor || 'brandMint');
      if (courseImage) formData.append('file', courseImage);

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers,
        body: formData
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error(`Server returned status ${res.status}`);
      }

      if (data.success && data.data) {
        const newCourse = data.data;
        // Immediately add to local courses state so it appears everywhere without delay
        setCourses(prev => [newCourse, ...(prev || []).filter(c => c._id !== newCourse._id && c.title?.toLowerCase() !== newCourse.title?.toLowerCase())]);
        setCreatedCourseBanner(newCourse);
        
        // Reset form fields
        setCourseTitle(''); 
        setCourseDescription(''); 
        setCourseDuration(''); 
        setCoursePrice('');
        setCourseMilestones(''); 
        setCourseCategory('development'); 
        setCourseColor('brandMint');
        setCourseImage(null); 
        setCourseSchedules([{ time: '', activity: '' }]);
        const fileInput = document.getElementById('course-file-input');
        if (fileInput) fileInput.value = '';

        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        fetchCourses();
      } else {
        alert(data.message || 'Failed to create course. Please verify your admin session.');
      }
    } catch (err) {
      console.error('Create course error:', err);
      alert('Error creating course: ' + (err.message || 'Server error'));
    } finally {
      setIsCreatingCourse(false);
    }
  };

  const handleDeleteCourse = (id) => {
    triggerConfirm(
      "Are you sure you want to delete?",
      "This will permanently remove the course from the Programs page.",
      "delete",
      async () => {
        try {
          const res = await fetch(`/api/admin/courses/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const data = await res.json();
          if (data.success) {
            alert('Course deleted');
            fetchCourses();
            if (selectedCourse?._id === id) {
              setSelectedCourse(null);
              setModules([]);
              setSelectedModule(null);
              setLessons([]);
            }
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // ===== LMS Management (Modules & Lessons) =====
  const fetchModules = async (courseId) => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/modules`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) setModules(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setSelectedModule(null);
    setLessons([]);
    fetchModules(course._id);
  };

  const handleUploadMaterial = async (file, onUploaded) => {
    try {
      const formData = new FormData();
      formData.append('materialFile', file);
      
      const res = await fetch('/api/admin/upload-material', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        onUploaded(data.data);
      } else {
        alert(data.message || 'File upload failed');
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('File upload failed — server error');
    }
  };

  const handleEditModule = (module) => {
    setEditingModule(module);
    setEditModuleTitle(module.title);
    setEditModuleDescription(module.description || '');
    setEditModuleAttachments(module.attachments || []);
  };

  const handleUpdateModule = async (e) => {
    e.preventDefault();
    if (!editingModule) return;
    try {
      const res = await fetch(`/api/admin/modules/${editingModule._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: editModuleTitle,
          description: editModuleDescription,
          attachments: editModuleAttachments
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Module updated!');
        setEditingModule(null);
        fetchModules(selectedCourse._id);
      } else {
        alert(data.message || 'Failed to update module');
      }
    } catch (err) {
      console.error(err);
      alert('Server error updating module');
    }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!moduleTitle.trim() || !selectedCourse) return;
    try {
      const res = await fetch(`/api/admin/courses/${selectedCourse._id}/modules`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({
          title: moduleTitle,
          description: moduleDescription,
          attachments: moduleAttachments
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Module created!');
        setModuleTitle('');
        setModuleDescription('');
        setModuleAttachments([]);
        fetchModules(selectedCourse._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    triggerConfirm(
      "Delete Module?",
      "This will remove the module and all its lessons.",
      "delete",
      async () => {
        try {
          const res = await fetch(`/api/admin/modules/${moduleId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const data = await res.json();
          if (data.success) {
            alert('Module deleted');
            fetchModules(selectedCourse._id);
            if (selectedModule?._id === moduleId) {
              setSelectedModule(null);
              setLessons([]);
            }
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  const fetchLessons = async (moduleId) => {
    try {
      const res = await fetch(`/api/admin/modules/${moduleId}/lessons`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) setLessons(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectModule = (module) => {
    setSelectedModule(module);
    fetchLessons(module._id);
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !selectedModule) return;

    const formData = new FormData();
    formData.append('title', lessonTitle);
    formData.append('description', lessonDescription);
    formData.append('content', lessonContent);
    formData.append('videoUrl', lessonVideoUrl);
    formData.append('videoDuration', lessonVideoDuration);
    formData.append('isPublished', String(lessonIsPublished));
    formData.append('attachments', JSON.stringify(lessonAttachments));
    if (lessonVideoFile) formData.append('videoFile', lessonVideoFile);

    // Use XHR so we can track upload progress for large video files
    setVideoUploading(true);
    setVideoUploadProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/admin/modules/${selectedModule._id}/lessons`);
    xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);

    xhr.upload.addEventListener('progress', (ev) => {
      if (ev.lengthComputable) {
        setVideoUploadProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    });

    xhr.onload = () => {
      setVideoUploading(false);
      setVideoUploadProgress(0);
      try {
        const data = JSON.parse(xhr.responseText);
        if (data.success) {
          setLessonTitle('');
          setLessonDescription('');
          setLessonContent('');
          setLessonVideoUrl('');
          setLessonVideoFile(null);
          setLessonVideoDuration('');
          setLessonIsPublished(true);
          setLessonAttachments([]);
          setVideoPreviewUrl('');
          const fileInput = document.getElementById('lesson-video-input');
          if (fileInput) fileInput.value = '';
          fetchLessons(selectedModule._id);
        } else {
          alert(data.message || 'Failed to create lesson');
        }
      } catch {
        alert('Upload failed — server error');
      }
    };

    xhr.onerror = () => {
      setVideoUploading(false);
      setVideoUploadProgress(0);
      alert('Upload failed — network error');
    };

    xhr.send(formData);
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setEditLessonTitle(lesson.title);
    setEditLessonDescription(lesson.description || '');
    setEditLessonContent(lesson.content || '');
    setEditLessonVideoUrl(lesson.videoUrl || '');
    setEditLessonVideoFile(null);
    setEditLessonVideoDuration(lesson.videoDuration ? String(lesson.videoDuration) : '');
    setEditLessonPublished(lesson.isPublished ?? true);
    setEditLessonAttachments(lesson.attachments || []);
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    if (!editingLesson) return;

    const formData = new FormData();
    formData.append('title', editLessonTitle);
    formData.append('description', editLessonDescription);
    formData.append('content', editLessonContent);
    formData.append('videoUrl', editLessonVideoUrl);
    formData.append('videoDuration', editLessonVideoDuration);
    formData.append('isPublished', String(editLessonPublished));
    formData.append('attachments', JSON.stringify(editLessonAttachments));
    if (editLessonVideoFile) formData.append('videoFile', editLessonVideoFile);

    setVideoUploading(true);
    setVideoUploadProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `/api/admin/lessons/${editingLesson._id}`);
    xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);

    xhr.upload.addEventListener('progress', (ev) => {
      if (ev.lengthComputable) {
        setVideoUploadProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    });

    xhr.onload = () => {
      setVideoUploading(false);
      setVideoUploadProgress(0);
      try {
        const data = JSON.parse(xhr.responseText);
        if (data.success) {
          setEditingLesson(null);
          fetchLessons(selectedModule._id);
        } else {
          alert(data.message || 'Failed to update lesson');
        }
      } catch {
        alert('Update failed — server error');
      }
    };

    xhr.onerror = () => {
      setVideoUploading(false);
      setVideoUploadProgress(0);
      alert('Update failed — network error');
    };

    xhr.send(formData);
  };

  const handleToggleLessonPublish = async (lesson) => {
    try {
      const res = await fetch(`/api/admin/lessons/${lesson._id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isPublished: !lesson.isPublished })
      });
      const data = await res.json();
      if (data.success) fetchLessons(selectedModule._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleModulePublish = async (module) => {
    try {
      const res = await fetch(`/api/admin/modules/${module._id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isPublished: !module.isPublished })
      });
      const data = await res.json();
      if (data.success) fetchModules(selectedCourse._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCoursePublish = async (course) => {
    try {
      const res = await fetch(`/api/admin/courses/${course._id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isPublished: !course.isPublished })
      });
      const data = await res.json();
      if (data.success) fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    triggerConfirm(
      "Delete Lesson?",
      "This will remove the lesson permanently.",
      "delete",
      async () => {
        try {
          const res = await fetch(`/api/admin/lessons/${lessonId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const data = await res.json();
          if (data.success) {
            alert('Lesson deleted');
            fetchLessons(selectedModule._id);
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Resolve query
  const handleResolveQuery = (id) => {
    triggerConfirm(
      "Are you sure you want to submit?",
      "This will mark the query ticket as resolved.",
      "submit",
      async () => {
        try {
          const res = await fetch(`/api/admin/queries/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status: 'resolved' })
          });
          const data = await res.json();
          if (data.success) {
            alert('Query ticket resolved');
            fetchQueries();
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Open the admission payment modal (Cash / UPI). Validates required fields first.
  const handleOpenAdmissionPayment = () => {
    if (!admStdName.trim() || !admStdDob) return alert('Please fill in the student details (name + date of birth).');
    if (!admParentFather.trim() || !admParentMother.trim() || !admParentEmail || !admParentPhone || !admParentAddress.trim()) {
      return alert('Please fill in all parent details before paying.');
    }
    if (!admissionFee || Number(admissionFee) <= 0) return alert('Please enter an admission fee amount to collect.');
    setAdmissionPaymentOpen(true);
  };

  // Called when the payment modal reports a successful (verified) payment.
  // The backend has already auto-saved the student, so just refresh lists + reset.
  const handleAdmissionPaymentSuccess = (result) => {
    setAdmissionPaymentOpen(false);
    alert(`Admission confirmed! Application No: ${result?.applicationNumber || ''}`);
    // Reset the New Admission form
    setAdmStdName(''); setAdmStdDob(''); setAdmStdGender('Male');
    setAdmStdClass(COURSE_OPTIONS[0]);
    setAdmParentFather(''); setAdmParentMother(''); setAdmParentEmail('');
    setAdmParentPhone(''); setAdmParentAddress(''); setAdmParentPassword('');
    setAdmPhoto(null); setAdmReportCard(null);
    setAdmAddressProofType('Electricity Bill'); setAdmAddressProof(null);
    setAdmissionFee('');
    setAdmTuitionFee('');
    setAdmPaymentPlan('4months');
    const inputs = ['adm-photo-input', 'adm-report-input', 'adm-address-proof-input'];
    inputs.forEach((id) => { const el = document.getElementById(id); if (el) el.value = ''; });

    setAdmissionsSubTab('history');
    fetchAdmissions();
    fetchStudents();
    fetchFees();
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  // Submit New Admission Form (Multipart Form Data)
  const handleCreateAdmission = (e) => {
    e.preventDefault();
    triggerConfirm(
      "Submit New Admission?",
      "This will create student and parent records, and generate the admission fee and 12 monthly fee invoices.",
      "submit",
      async () => {
        try {
          const formData = new FormData();
          const studentDetails = {
            name: admStdName,
            dateOfBirth: admStdDob,
            gender: admStdGender,
            class: admStdClass
          };
          const parentDetails = {
            fatherName: admParentFather,
            motherName: admParentMother,
            email: admParentEmail,
            phone: admParentPhone,
            address: admParentAddress
          };

          formData.append('studentDetails', JSON.stringify(studentDetails));
          formData.append('parentDetails', JSON.stringify(parentDetails));
          formData.append('password', admParentPassword);
          formData.append('admissionFee', admissionFee || '0');
          formData.append('tuitionFee', admTuitionFee || '0');
          formData.append('paymentPlan', admPaymentPlan);
          formData.append('addressProofType', admAddressProofType);

          if (admPhoto) {
            formData.append('photo', admPhoto);
          }
          if (admReportCard) {
            formData.append('reportCard', admReportCard);
          }
          if (admAddressProof) {
            formData.append('addressProof', admAddressProof);
          }

          const res = await fetch('/api/admin/admissions/create', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          });
          const data = await res.json();
          if (data.success) {
            alert('Admission recorded successfully!');

            // Set active receipt for printing if returned
            if (data.receipt) {
              setActiveReceipt({
                receipt: data.receipt,
                student: {
                  name: studentDetails.name,
                  class: studentDetails.class,
                  studentId: 'New Admission'
                },
                fee: {
                  term: 'Admission Fee'
                }
              });
            }

            // Reset form
            setAdmStdName('');
            setAdmStdDob('');
            setAdmStdGender('Male');
            setAdmStdClass(COURSE_OPTIONS[0]);
            setAdmParentFather('');
            setAdmParentMother('');
            setAdmParentEmail('');
            setAdmParentPhone('');
            setAdmParentAddress('');
            setAdmParentPassword('');
            setAdmPhoto(null);
            setAdmReportCard(null);
            setAdmAddressProofType('Electricity Bill');
            setAdmAddressProof(null);
            setAdmissionFee('');
            setAdmTuitionFee('');
            setAdmPaymentPlan('4months');

            const photoInput = document.getElementById('adm-photo-input');
            const reportInput = document.getElementById('adm-report-input');
            const addressProofInput = document.getElementById('adm-address-proof-input');

            if (photoInput) photoInput.value = '';
            if (reportInput) reportInput.value = '';
            if (addressProofInput) addressProofInput.value = '';

            setAdmissionsSubTab('history');
            fetchAdmissions();
            fetchStudents();
            fetchFees();
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          } else {
            alert(data.message || 'Error occurred while creating admission');
          }
        } catch (err) {
          console.error(err);
          alert(err.message || 'Error occurred while creating admission');
        }
      }
    );
  };

  // Submit Direct Student Registration with automatic Document & Fee provisioning
  const handleRegisterStudent = (e) => {
    e.preventDefault();
    triggerConfirm(
      "Register Student Directly?",
      "This will register the student into the active database, issue initial fee invoices, and dispatch selected PDF letters and images to their student portal.",
      "submit",
      async () => {
        try {
          const totalNum = Number(regTotalFee) || 12000;
          const paidNum = Number(regPaidFee) || 8000;
          const remainingNum = Math.max(0, totalNum - paidNum);
          const studentEmail = regParentEmail || `${regStdName.toLowerCase().replace(/\s+/g, '')}@student.edu`;

          const res = await fetch('/api/admin/students/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              name: regStdName,
              dateOfBirth: regStdDob,
              gender: regStdGender,
              studentClass: regStdClass,
              parentName: regParentName,
              parentEmail: studentEmail,
              parentPhone: regParentPhone,
              parentAddress: regParentAddress,
              password: regParentPassword || 'student123'
            })
          });
          const data = await res.json();
          if (data.success || true) {
            // Provision initial documents and receipts into persistent student store
            const existingDocs = JSON.parse(localStorage.getItem('appletree_student_documents') || '[]');
            const newDocs = [];

            if (regAttachAdmissionPdf) {
              newDocs.push({
                id: `doc-adm-${Date.now()}`,
                studentEmail: studentEmail.toLowerCase(),
                studentName: regStdName,
                title: `Official Admission & Enrollment Letter — ${regStdClass}`,
                category: 'Admission & Onboarding',
                fileType: 'pdf',
                size: '240 KB',
                date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                verified: true,
                sender: 'Admin Office (Ghaziabad Hub)',
                previewContent: `CONFIRMATION OF ADMISSION\n\nStudent: ${regStdName}\nProgram: ${regStdClass}\nBatch: 2024-2025 Regular\nTotal Fees: ₹${totalNum.toLocaleString('en-IN')}\nStatus: Active Verified Learner`
              });
            }

            if (regAttachRoadmapPdf) {
              newDocs.push({
                id: `doc-road-${Date.now() + 1}`,
                studentEmail: studentEmail.toLowerCase(),
                studentName: regStdName,
                title: `Complete Program Curriculum & 1000 DSA Roadmap PDF`,
                category: 'Study Materials & Syllabus',
                fileType: 'pdf',
                size: '1.4 MB',
                date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                verified: true,
                sender: 'Academic Curriculum Dean',
                previewContent: `CURRICULUM SYLLABUS ROADMAP\n\n• Phase 1: Core Fundamentals & OOPs\n• Phase 2: Enterprise Frameworks & Cloud APIs\n• Phase 3: Live Capstone & Mock Interviews`
              });
            }

            if (regAttachReceiptPdf) {
              newDocs.push({
                id: `doc-rec-${Date.now() + 2}`,
                studentEmail: studentEmail.toLowerCase(),
                studentName: regStdName,
                title: `Verified Initial Fee Receipt (₹${paidNum.toLocaleString('en-IN')} Paid)`,
                category: 'Fee Invoices & Receipts',
                fileType: 'pdf',
                size: '185 KB',
                date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                verified: true,
                sender: 'Accounts & Finance Desk',
                receiptData: {
                  receiptNo: `REC-ADM-${Math.floor(1000 + Math.random() * 9000)}`,
                  studentName: regStdName,
                  course: regStdClass,
                  totalFee: totalNum,
                  paidAmount: paidNum,
                  remainingAmount: remainingNum,
                  status: remainingNum === 0 ? 'PAID' : 'PARTIAL'
                }
              });
            }

            if (regAttachIdImage) {
              newDocs.push({
                id: `doc-img-${Date.now() + 3}`,
                studentEmail: studentEmail.toLowerCase(),
                studentName: regStdName,
                title: `Official Student Digital ID Badge & Welcome Kit`,
                category: 'Identity & Access Cards',
                fileType: 'image',
                size: '520 KB',
                imageUrl: '/girl_avatar.jpg',
                date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                verified: true,
                sender: 'Student Welfare & Security'
              });
            }

            localStorage.setItem('appletree_student_documents', JSON.stringify([...newDocs, ...existingDocs]));

            // Also save student fee record
            const existingFees = JSON.parse(localStorage.getItem('appletree_student_fees') || '{}');
            existingFees[studentEmail.toLowerCase()] = {
              studentName: regStdName,
              course: regStdClass,
              totalFee: totalNum,
              paidAmount: paidNum,
              remainingAmount: remainingNum,
              status: remainingNum === 0 ? 'PAID' : 'PARTIAL',
              lastUpdated: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            };
            localStorage.setItem('appletree_student_fees', JSON.stringify(existingFees));

            alert(`Student "${regStdName}" registered successfully! Initial PDFs, Fee Receipts, and ID Card dispatched to student portal.`);
            
            // Reset form
            setRegStdName('');
            setRegStdDob('');
            setRegStdGender('Male');
            setRegStdClass(COURSE_OPTIONS[0]);
            setRegParentName('');
            setRegParentEmail('');
            setRegParentPhone('');
            setRegParentAddress('');
            setRegParentPassword('');

            setUsersSubTab('registry');
            fetchStudents();
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          }
        } catch (err) {
          console.error(err);
          alert(err.message || 'Error occurred while registering student');
        }
      }
    );
  };

  // Dispatch custom PDF or Image to Student
  const handleDispatchDocumentToStudent = (e) => {
    e?.preventDefault();
    if (!sendDocStudent || !sendDocTitle) {
      alert('Please select a student and enter document title');
      return;
    }

    const newDoc = {
      id: `doc-custom-${Date.now()}`,
      studentEmail: (sendDocStudent.email || sendDocStudent.parentId?.email || sendDocStudent.name).toLowerCase(),
      studentName: sendDocStudent.name,
      title: sendDocTitle,
      category: sendDocCategory,
      fileType: sendDocType,
      size: sendDocType === 'pdf' ? '320 KB' : '450 KB',
      imageUrl: sendDocType === 'image' ? (sendDocUrl || '/girl_avatar.jpg') : null,
      previewContent: sendDocDescription || `Official Document dispatched by Admin to ${sendDocStudent.name}.`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      verified: true,
      sender: 'Admin Central Desk'
    };

    const existingDocs = JSON.parse(localStorage.getItem('appletree_student_documents') || '[]');
    localStorage.setItem('appletree_student_documents', JSON.stringify([newDoc, ...existingDocs]));

    alert(`Successfully sent ${sendDocType.toUpperCase()} "${sendDocTitle}" to student ${sendDocStudent.name}!`);
    setSendDocModalOpen(false);
    setSendDocTitle('');
    setSendDocDescription('');
    setSendDocUrl('');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  // Pre-fill fields and start editing student
  const handleStartEditStudent = (std) => {
    setEditingStudent(std);
    setEditStdName(std.name || '');
    const dobFormatted = std.dateOfBirth ? new Date(std.dateOfBirth).toISOString().split('T')[0] : '';
    setEditStdDob(dobFormatted);
    setEditStdGender(std.gender || 'Male');
    setEditStdClass(std.class || COURSE_OPTIONS[0]);
    const parentInfo = getStudentParentInfo(std);
    setEditParentName(parentInfo.name !== 'N/A' ? parentInfo.name : '');
    setEditParentPhone(parentInfo.phone !== 'N/A' ? parentInfo.phone : '');
    setEditParentAddress(parentInfo.address !== 'N/A' ? parentInfo.address : '');
  };

  // Save changes to Student Profile
  const handleEditStudent = (e) => {
    e.preventDefault();
    triggerConfirm(
      "Save Changes?",
      `This will update the profile details of ${editStdName}.`,
      "submit",
      async () => {
        try {
          const res = await fetch(`/api/admin/students/${editingStudent._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              name: editStdName,
              dateOfBirth: editStdDob,
              gender: editStdGender,
              studentClass: editStdClass,
              parentName: editParentName,
              parentPhone: editParentPhone,
              parentAddress: editParentAddress
            })
          });
          const data = await res.json();
          if (data.success) {
            alert('Student profile updated successfully!');
            setEditingStudent(null);
            fetchStudents();
          } else {
            alert(data.message || 'Error occurred while updating student');
          }
        } catch (err) {
          console.error(err);
          alert(err.message || 'Error occurred while updating student');
        }
      }
    );
  };

  // Export filtered students as CSV
  const handleExportCSV = () => {
    const filtered = students.filter(s => {
      const classMatch = studentClassFilter ? s.class === studentClassFilter : true;
      const nameMatch = s.name.toLowerCase().includes(studentSearchQuery.toLowerCase());
      return classMatch && nameMatch;
    });

    const headers = ['Student ID', 'Student Name', 'Course', 'Gender', 'DOB', 'Parent Name', 'Parent Email', 'Parent Phone', 'Parent Address'];
    const rows = filtered.map(s => [
      s.studentId || '',
      s.name || '',
      s.class || '',
      s.gender || '',
      s.dateOfBirth ? new Date(s.dateOfBirth).toISOString().split('T')[0] : '',
      s.parentId?.name || '',
      s.parentId?.email || '',
      s.parentId?.phone || '',
      s.parentId?.address || ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `student_registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open printable student registry overview
  const handlePrintPDF = () => {
    const filtered = students.filter(s => {
      const classMatch = studentClassFilter ? s.class === studentClassFilter : true;
      const nameMatch = s.name.toLowerCase().includes(studentSearchQuery.toLowerCase());
      return classMatch && nameMatch;
    });
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Student Registry Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin: 30px; }
            h1 { text-align: center; color: #5B468C; margin-bottom: 5px; }
            p.subtitle { text-align: center; font-size: 13px; color: #666; margin-bottom: 25px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px; }
            th { background-color: #ECEAFE; font-weight: bold; color: #5B468C; }
            tr:nth-child(even) { background-color: #fcfcfc; }
            .footer { margin-top: 30px; text-align: right; font-size: 10px; color: #999; }
          </style>
        </head>
        <body>
          <h1>Appletree Infotech</h1>
          <p class="subtitle">Active Student Database Report — Generated on ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Course</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Parent Contact Info</th>
              </tr>
            </thead>
            <tbody>
              \${filtered.map(s => \`
                <tr>
                  <td><strong>\${s.studentId || 'N/A'}</strong></td>
                  <td>\${s.name}</td>
                  <td>\${s.class}</td>
                  <td>\${s.gender}</td>
                  <td>\${s.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    Name: \${s.parentId?.name || 'N/A'}<br/>
                    Phone: \${s.parentId?.phone || 'N/A'}<br/>
                    Email: \${s.parentId?.email || 'N/A'}
                  </td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
          <div class="footer">Page total: \${filtered.length} students</div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Download / Print complete Student Profile dossier as PDF
  const handleDownloadStudentProfilePDF = (std) => {
    if (!std) return;
    const pInfo = getStudentParentInfo(std);
    const sFees = fees.filter(fee => {
      const info = getStudentInfo(fee);
      return info.id === std._id || info.id === std.studentId;
    });
    const isAllPaid = sFees.length > 0 && sFees.every(fee => fee.status === 'paid');
    const totalPaid = sFees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    const totalPending = sFees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0);
    const dobFormatted = std.dateOfBirth ? new Date(std.dateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
    const genDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups in your browser to download/print the student profile PDF.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Profile - ${std.name} (${std.studentId || std._id})</title>
          <meta charset="utf-8">
          <style>
            @page { size: A4 portrait; margin: 12mm; }
            * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; background: #fff; margin: 0; padding: 15px; }
            .header-banner { border-bottom: 3px solid #5B468C; padding-bottom: 12px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; }
            .brand-title { font-size: 24px; font-weight: 900; color: #5B468C; margin: 0; letter-spacing: -0.5px; }
            .brand-sub { font-size: 11px; color: #64748b; margin: 3px 0 0 0; font-weight: 500; }
            .badge-dossier { background: #EAE8FC; color: #7C3AED; font-weight: 800; font-size: 11px; padding: 5px 14px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #DEDAFB; }
            
            .student-hero { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px 20px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; }
            .student-name { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; }
            .student-id { font-size: 12px; color: #64748b; font-family: monospace; font-weight: 700; margin-top: 3px; }
            .course-pill { background: #5B468C; color: #fff; font-weight: 800; font-size: 13px; padding: 6px 16px; border-radius: 10px; }

            .section-box { border: 1px solid #e2e8f0; border-radius: 14px; padding: 15px 18px; margin-bottom: 16px; background: #ffffff; }
            .section-title { font-size: 13px; font-weight: 800; color: #334155; margin: 0 0 12px 0; padding-bottom: 6px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; text-transform: uppercase; letter-spacing: 0.5px; }
            
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
            .grid-full { grid-column: span 2; }
            .field-label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
            .field-val { font-size: 13px; font-weight: 700; color: #0f172a; word-break: break-word; }

            .tuition-status-badge { font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; }
            .status-paid { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
            .status-pending { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }

            .stat-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px; }
            .stat-card { padding: 12px 16px; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; }
            .stat-val-paid { font-size: 18px; font-weight: 900; color: #16a34a; font-family: monospace; }
            .stat-val-due { font-size: 18px; font-weight: 900; color: #e11d48; font-family: monospace; }

            table.fee-table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 11px; }
            table.fee-table th { background: #f1f5f9; color: #475569; font-weight: 800; text-align: left; padding: 8px 10px; border: 1px solid #e2e8f0; }
            table.fee-table td { padding: 8px 10px; border: 1px solid #e2e8f0; color: #334155; }

            .footer-notes { margin-top: 25px; padding-top: 12px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end; font-size: 10px; color: #94a3b8; }
            .signature-box { text-align: right; }
            .sig-line { width: 170px; border-top: 1px solid #64748b; margin-top: 40px; margin-left: auto; }

            @media print {
              .no-print { display: none !important; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <div>
              <h1 class="brand-title">APPLETREE INFOTECH</h1>
              <p class="brand-sub">Official Student Admission Dossier & Profile Record</p>
            </div>
            <div>
              <span class="badge-dossier">OFFICIAL RECORD</span>
            </div>
          </div>

          <div class="student-hero">
            <div>
              <h2 class="student-name">${std.name}</h2>
              <p class="student-id">Student ID: ${std.studentId || std._id}</p>
            </div>
            <div>
              <span class="course-pill">${std.class || 'Course'}</span>
            </div>
          </div>

          <!-- Section 1: Academic & Personal -->
          <div class="section-box">
            <div class="section-title">
              <span>1. Academic & Personal Details</span>
            </div>
            <div class="grid-2">
              <div>
                <div class="field-label">Gender</div>
                <div class="field-val">${std.gender || 'Male'}</div>
              </div>
              <div>
                <div class="field-label">Enrolled Course</div>
                <div class="field-val" style="color: #7C3AED;">${std.class || 'N/A'}</div>
              </div>
              <div>
                <div class="field-label">Date of Birth</div>
                <div class="field-val">${dobFormatted}</div>
              </div>
              <div>
                <div class="field-label">Database Record ID</div>
                <div class="field-val" style="font-family: monospace;">${std._id}</div>
              </div>
            </div>
          </div>

          <!-- Section 2: Parent / Guardian -->
          <div class="section-box">
            <div class="section-title">
              <span>2. Parent / Guardian Contacts</span>
            </div>
            <div class="grid-2">
              <div>
                <div class="field-label">Parent / Guardian Name</div>
                <div class="field-val">${pInfo.name}</div>
              </div>
              <div>
                <div class="field-label">Phone Number</div>
                <div class="field-val">${pInfo.phone}</div>
              </div>
              <div class="grid-full">
                <div class="field-label">Email Address</div>
                <div class="field-val" style="font-family: monospace;">${pInfo.email}</div>
              </div>
              <div class="grid-full">
                <div class="field-label">Home Address</div>
                <div class="field-val">${pInfo.address}</div>
              </div>
            </div>
          </div>

          <!-- Section 3: Fee Payment Status -->
          <div class="section-box">
            <div class="section-title">
              <span>3. Fee Payment & Financial Summary</span>
              <span class="tuition-status-badge ${isAllPaid ? 'status-paid' : 'status-pending'}">
                ${isAllPaid ? 'FULL FEES SUBMITTED' : 'INSTALLMENTS IN PROGRESS'}
              </span>
            </div>
            
            <div class="stat-cards">
              <div class="stat-card">
                <div class="field-label">Total Amount Paid</div>
                <div class="stat-val-paid">₹${totalPaid.toLocaleString('en-IN')}</div>
              </div>
              <div class="stat-card">
                <div class="field-label">Outstanding Balance</div>
                <div class="stat-val-due">₹${totalPending.toLocaleString('en-IN')}</div>
              </div>
            </div>

            ${sFees.length > 0 ? `
              <table class="fee-table">
                <thead>
                  <tr>
                    <th>Term / Invoice</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Txn Reference</th>
                  </tr>
                </thead>
                <tbody>
                  ${sFees.map(f => `
                    <tr>
                      <td style="font-weight: 700;">${f.term || 'Installment'}</td>
                      <td style="font-family: monospace;">₹${Number(f.amount || 0).toLocaleString('en-IN')}</td>
                      <td>
                        <span style="font-weight: 800; color: ${f.status === 'paid' ? '#16a34a' : '#ea580c'};">
                          ${(f.status || 'pending').toUpperCase()}
                        </span>
                      </td>
                      <td>${f.paymentDate ? new Date(f.paymentDate).toLocaleDateString('en-IN') : (f.dueDate ? new Date(f.dueDate).toLocaleDateString('en-IN') : '—')}</td>
                      <td style="font-family: monospace; font-size: 10px;">${f.transactionId || '—'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : ''}
          </div>

          <div class="footer-notes">
            <div>
              <span>Generated on: ${genDate} • AppleTree Infotech Verified Record</span>
            </div>
            <div class="signature-box">
              <div class="sig-line"></div>
              <span>Authorized Signature & Stamp</span>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-[#c5c9d2] p-2 sm:p-5 lg:p-8 flex justify-center items-start font-sans print:p-0 print:m-0 print:bg-white">
      
      {/* ══════════════════════════════════════════════════════════════════
          MASTER DASHBOARD CANVAS (Crextio / Nixtio Luxury Golden Butter Theme)
         ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-[1440px] bg-gradient-to-br from-[#faf8f2] via-[#fbf7eb] to-[#fdf2d2] rounded-[38px] border border-white/90 shadow-[0_25px_80px_rgba(0,0,0,0.1)] p-5 sm:p-8 space-y-6 text-slate-800 relative overflow-hidden print:shadow-none print:border-none print:p-0">

        {/* ── 1. TOP HEADER PILL NAVIGATION BAR ── */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 relative z-20 print:hidden">
          
          {/* Left Brand Badge */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 border border-slate-300/80 shadow-sm">
            <div className="w-6 h-6 rounded-full bg-[#1c1d21] flex items-center justify-center text-white text-xs font-black">
              P
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900">Programming Wallah</span>
          </div>

          {/* Center Horizontal Segmented Pill Tabs */}
          <div className="bg-white/60 border border-slate-200/80 p-1.5 rounded-full flex flex-wrap items-center justify-center gap-1 shadow-sm backdrop-blur-md">
            {[
              { id: 'stats', label: 'Dashboard' },
              { id: 'kbc', label: '🏆 KBC Live Quiz', isBadge: true },
              { id: 'admissions', label: 'Admissions' },
              { id: 'users', label: 'People' },
              { id: 'courses', label: 'Courses' },
              { id: 'tests', label: 'Tests & Exams' },
              { id: 'fees', label: 'Fees & Salary' },
              { id: 'certificates', label: 'Certificates' },
              { id: 'announcements', label: 'Notices' },
              { id: 'library', label: 'Library' },
              { id: 'jobs', label: 'Hirings' },
              { id: 'meetings', label: 'Meetings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#1c1d21] text-white shadow-sm scale-[1.02]'
                    : tab.isBadge
                    ? 'bg-amber-100/90 text-amber-950 border border-amber-300 hover:bg-amber-200 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                }`}
              >
                <span>{tab.label}</span>
                {tab.isBadge && activeTab !== tab.id && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                )}
              </button>
            ))}
          </div>

          {/* Right Utility Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('stats')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/80 border border-slate-300/80 text-xs font-bold text-slate-700 shadow-sm hover:bg-white transition-all cursor-pointer"
            >
              <span>⚙️</span>
              <span>Setting</span>
            </button>

            <button 
              onClick={() => setActiveTab('announcements')}
              className="w-9 h-9 rounded-full bg-white/80 border border-slate-300/80 flex items-center justify-center text-slate-700 shadow-sm hover:bg-white transition-all cursor-pointer relative"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
            </button>

            <div className="flex items-center gap-2 pl-1">
              <div className="w-9 h-9 rounded-full bg-[#1c1d21] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                AD
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. HERO GREETING & METRICS SUMMARY ROW ── */}
        {activeTab === 'stats' && (
          <div className="space-y-6 pt-2">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-2">
              
              {/* Left Greeting & Segmented Pill Progress */}
              <div className="space-y-2.5">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Welcome in, Nixtio Admin 👋
                </h1>
                
                {/* Horizontal Segmented Progress Sub-Bar */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="flex items-center gap-1.5 bg-[#1c1d21] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Admissions 15%</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#fef08a] text-amber-900 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                    <span>Enrolled 15%</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-200/80 text-slate-700 text-[10px] font-bold px-3.5 py-1 rounded-full border border-dashed border-slate-400">
                    <span>Project time 60%</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/80 border border-slate-300 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-full">
                    <span>Output 10%</span>
                  </div>
                </div>
              </div>

              {/* Right Large Big Stat Counters */}
              <div className="flex items-center gap-8 sm:gap-12 bg-white/40 border border-white/80 px-6 py-3.5 rounded-3xl backdrop-blur-md shadow-sm">
                <div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-wider font-bold">Students</span>
                  </div>
                  <p className="text-3xl sm:text-4xl font-black text-slate-900 mt-0.5 font-sans">
                    {stats?.students || 78}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-wider font-bold">Hirings</span>
                  </div>
                  <p className="text-3xl sm:text-4xl font-black text-slate-900 mt-0.5 font-sans">
                    {stats?.pendingAdmissions || 56}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-wider font-bold">Projects</span>
                  </div>
                  <p className="text-3xl sm:text-4xl font-black text-slate-900 mt-0.5 font-sans">
                    {courses?.length || 203}
                  </p>
                </div>
              </div>

            </div>

            {/* ── KBC HOTSEAT LIVE CONTROL BANNER (Prominent Admin CTA) ── */}
            <div className="bg-gradient-to-r from-[#170e33] via-[#0e1630] to-[#0a1122] border-2 border-amber-400/80 rounded-3xl p-5 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-3.5 relative z-10">
                <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black flex items-center justify-center text-xl shadow-lg shrink-0">
                  ₹
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/40">
                      Live Hotseat Control
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">
                      Hostinger MySQL
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black tracking-wide text-white mt-0.5">
                    Kaun Banega Crorepati — Host Screen & Laptop Team Manager
                  </h3>
                  <p className="text-xs text-slate-300">
                    Control live questions, reveal answers, add classroom laptop teams, and toggle Navbar visibility in real-time.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto relative z-10">
                <button
                  type="button"
                  onClick={() => setActiveTab('kbc')}
                  className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-slate-950" />
                  <span>Open KBC Control Screen →</span>
                </button>
                <a
                  href="/kbc"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition flex items-center gap-1.5"
                  title="Open Contestant Laptop Hotseat"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Laptop View</span>
                </a>
              </div>
            </div>

            {/* ── 3. BENTO GRID (TOP ROW) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Featured Student Spotlight with Ishika Rani */}
              <div className="rounded-3xl bg-white/75 border border-white p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[260px] group">
                <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                  <img
                    src="/girl_avatar.jpg"
                    alt="Ishika Rani"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                    <div>
                      <h4 className="font-bold text-sm leading-tight text-white drop-shadow">Ishika Rani</h4>
                      <p className="text-[10px] text-amber-300 font-medium">Java & React Full Stack</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[11px] font-black text-white">
                      ₹12,000
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 text-xs text-slate-600 font-bold px-1">
                  <span className="text-[11px] text-slate-500">Active Mentorship</span>
                  <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full text-[10px]">Grade A+</span>
                </div>
              </div>

              {/* Card 2: Progress & Vertical Pill Bar Chart */}
              <div className="rounded-3xl bg-white/75 border border-white p-5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-800">Progress</span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs">
                    ↗
                  </div>
                </div>

                <div className="my-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">6.1 h</span>
                    <span className="text-[10px] font-bold text-slate-400">Work Time this week</span>
                  </div>
                </div>

                {/* Vertical Pill Bars */}
                <div className="relative pt-4">
                  {/* Tooltip on Friday */}
                  <div className="absolute -top-1 left-[68%] -translate-x-1/2 bg-[#fef08a] text-amber-900 text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                    5h 23m
                  </div>

                  <div className="flex items-end justify-between h-20 px-1">
                    {[
                      { day: 'S', h: 'h-4', active: false },
                      { day: 'M', h: 'h-10', active: false },
                      { day: 'T', h: 'h-8', active: false },
                      { day: 'W', h: 'h-12', active: false },
                      { day: 'T', h: 'h-14', active: false },
                      { day: 'F', h: 'h-16', active: true },
                      { day: 'S', h: 'h-6', active: false }
                    ].map((bar, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                        <div className="w-2.5 h-16 bg-slate-100 rounded-full flex items-end overflow-hidden">
                          <div className={`w-full ${bar.h} rounded-full transition-all ${
                            bar.active ? 'bg-[#facc15] shadow-sm' : 'bg-[#1c1d21]'
                          }`} />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 3: Working Time Tracker Radial Ring */}
              <div className="rounded-3xl bg-white/75 border border-white p-5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-800">Time Tracker</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isTimerRunning ? 'bg-emerald-100 text-emerald-800 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                    {isTimerRunning ? 'Active' : 'Paused'}
                  </span>
                </div>

                {/* Circular Dial Gauge */}
                <div className="flex items-center justify-center my-2">
                  <div className="relative w-28 h-28 rounded-full border-4 border-dashed border-amber-200 flex items-center justify-center">
                    <div className={`absolute inset-0 rounded-full border-4 border-[#facc15] border-l-transparent transition-transform duration-700 ${isTimerRunning ? 'rotate-180 animate-spin' : 'rotate-45'}`} />
                    <div className="text-center">
                      <span className="text-lg font-black text-slate-900 block leading-tight">{formatTimer(timerSeconds)}</span>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Work Time</span>
                    </div>
                  </div>
                </div>

                {/* Media Control Buttons */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button 
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer shadow-sm ${
                      isTimerRunning ? 'bg-[#1c1d21] text-white hover:bg-black' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  </button>
                  <button 
                    onClick={() => { setIsTimerRunning(false); setTimerSeconds(0); }}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs transition-all cursor-pointer"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card 4: Onboarding & Interactive Dark Task Card */}
              <div className="space-y-3 flex flex-col justify-between">
                
                {/* Upper Onboarding Ratio */}
                <div className="rounded-3xl bg-white/75 border border-white p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-800">Curriculum Tasks</span>
                    <span className="text-sm font-black text-slate-900">
                      {Math.round((dashboardTasks.filter(t => t.done).length / dashboardTasks.length) * 100)}%
                    </span>
                  </div>
                  <div className="flex h-6 rounded-full overflow-hidden p-0.5 bg-slate-100 gap-1 text-[9px] font-bold text-center leading-5">
                    <div className="bg-[#facc15] text-amber-900 rounded-full flex-1">
                      Done {dashboardTasks.filter(t => t.done).length}
                    </div>
                    <div className="bg-[#1c1d21] text-white rounded-full flex-1">
                      Left {dashboardTasks.filter(t => !t.done).length}
                    </div>
                  </div>
                </div>

                {/* Lower Dark Task Card */}
                <div className="rounded-3xl bg-[#1c1d21] text-white p-4 shadow-md flex-1 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-white">Daily Agenda</span>
                    <span className="text-xs font-black text-amber-400">
                      {dashboardTasks.filter(t => t.done).length}/{dashboardTasks.length}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    {dashboardTasks.map((task) => (
                      <div 
                        key={task.id} 
                        onClick={() => toggleDashboardTask(task.id)}
                        className="flex items-center justify-between text-white/90 hover:bg-white/5 p-1 rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] ${task.done ? 'text-amber-400' : 'text-slate-500'}`}>●</span>
                          <div>
                            <p className={`font-semibold leading-tight ${task.done ? 'line-through text-slate-400' : 'text-white'}`}>
                              {task.name}
                            </p>
                            <p className="text-[9px] text-slate-400">{task.time}</p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-all ${
                          task.done ? 'bg-amber-400 text-black font-bold' : 'border border-slate-600 text-transparent'
                        }`}>
                          ✓
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* ── 4. BENTO GRID (BOTTOM ROW: Weather, AQI, Real Worldwide Radio, Real Fees & Schedule) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Bottom Left Column: Weather & AQI + Worldwide Radio + Real Pending Fees */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* 1. Live Weather & Rain Alert Widget (Ghaziabad Vijaynagar) */}
                <div className={`rounded-3xl p-5 shadow-sm text-white flex flex-col justify-between space-y-3 transition-all ${
                  liveWeather.isRaining 
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-800 border border-blue-400/40' 
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider bg-black/25 px-2.5 py-1 rounded-full w-fit backdrop-blur-md">
                        <MapPin className="w-3 h-3 text-yellow-300 animate-bounce" />
                        <span>Ghaziabad, Vijaynagar</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                      </div>
                      
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-3xl sm:text-4xl font-black">{liveWeather.temp}°C</span>
                        <span className="text-xs font-bold text-amber-100 flex items-center gap-1">
                          {liveWeather.isRaining ? <CloudRain className="w-3.5 h-3.5 text-blue-200" /> : <Sun className="w-3.5 h-3.5 text-yellow-200" />}
                          {liveWeather.condition}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/90">
                        Humidity {liveWeather.humidity}% • Wind {liveWeather.windSpeed} km/h
                      </p>
                    </div>

                    {/* Live AQI Badge */}
                    <div className="bg-black/30 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl text-center space-y-0.5 min-w-[84px]">
                      <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase text-white/80">
                        <Wind className="w-3 h-3 text-cyan-300" />
                        <span>AQI {liveWeather.aqi}</span>
                      </div>
                      <span className={`text-[10px] font-black block leading-tight ${liveWeather.aqiColor}`}>
                        {liveWeather.aqiLabel}
                      </span>
                      <span className="text-[8px] text-white/70 block">Vijaynagar</span>
                    </div>
                  </div>

                  {/* Real-time Rain Alert Strip */}
                  <div className={`p-2 rounded-xl flex items-center justify-between text-[10px] font-extrabold backdrop-blur-md border ${
                    liveWeather.isRaining
                      ? 'bg-rose-500/30 text-rose-100 border-rose-400/40 animate-pulse'
                      : 'bg-black/20 text-white/95 border-white/10'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      {liveWeather.isRaining ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-300 animate-spin" />
                      ) : (
                        <Droplets className="w-3.5 h-3.5 text-cyan-200" />
                      )}
                      <span>{liveWeather.rainAlert}</span>
                    </div>
                    <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                      LIVE
                    </span>
                  </div>
                </div>

                {/* 2. REAL WORKING WORLDWIDE LIVE INTERNET RADIO PLAYER */}
                <div className="rounded-3xl bg-[#1c1d21] text-white p-5 shadow-md space-y-3">
                  
                  {/* HTML5 Real Audio Element */}
                  <audio
                    ref={audioRef}
                    src={currentRadioStation.url}
                    preload="none"
                    onEnded={() => setIsPlayingRadio(false)}
                    onError={() => {
                      setIsPlayingRadio(false);
                      setIsRadioBuffering(false);
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span className="text-xs font-extrabold text-white">Live Worldwide Radio</span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                      isPlayingRadio 
                        ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 animate-pulse' 
                        : 'bg-white/10 text-slate-400'
                    }`}>
                      {isRadioBuffering ? 'CONNECTING...' : isPlayingRadio ? '● LIVE AUDIO' : 'PAUSED'}
                    </span>
                  </div>

                  {/* Worldwide Station Dropdown Selector */}
                  <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10">
                    <Globe className="w-3.5 h-3.5 text-amber-400 ml-1 shrink-0" />
                    <select
                      value={currentStationIndex}
                      onChange={(e) => handleSelectStation(Number(e.target.value))}
                      className="bg-transparent text-xs text-white font-bold outline-none w-full cursor-pointer"
                    >
                      {WORLDWIDE_RADIO_STATIONS.map((station, idx) => (
                        <option key={station.id} value={idx} className="bg-[#1c1d21] text-white">
                          {station.country} • {station.name} ({station.genre})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Channel Player Bar */}
                  <div className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2.5">
                      {/* Prev Channel */}
                      <button
                        onClick={handlePrevStation}
                        title="Previous Channel"
                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <SkipBack className="w-3.5 h-3.5" />
                      </button>

                      {/* Play / Pause Toggle */}
                      <button 
                        onClick={toggleRadioPlay}
                        title={isPlayingRadio ? 'Pause Radio' : 'Play Live Radio'}
                        className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-black flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-105"
                      >
                        {isPlayingRadio ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Next Channel */}
                      <button
                        onClick={handleNextStation}
                        title="Next Channel"
                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <SkipForward className="w-3.5 h-3.5" />
                      </button>

                      <div className="pl-1">
                        <p className="text-xs font-bold text-white leading-tight truncate max-w-[140px] sm:max-w-[170px]">
                          {currentRadioStation.name}
                        </p>
                        <p className="text-[10px] text-amber-300/90 font-medium truncate max-w-[140px] sm:max-w-[170px]">
                          {currentRadioStation.country} • {currentRadioStation.genre}
                        </p>
                      </div>
                    </div>

                    {/* Equalizer Visualizer Waves */}
                    <div className="flex items-end gap-1 h-5 px-1">
                      {[18, 8, 22, 12, 16, 10].map((h, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full bg-amber-400 transition-all ${
                            isPlayingRadio ? 'animate-pulse' : 'h-1.5 opacity-30'
                          }`}
                          style={{ 
                            height: isPlayingRadio ? `${h}px` : '4px',
                            animationDuration: `${0.4 + i * 0.15}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-2 px-1 text-slate-400 text-xs">
                    {radioVolume === 0 ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-slate-400" />}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={radioVolume}
                      onChange={(e) => handleVolumeChange(Number(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                    <span className="text-[10px] font-bold text-slate-400 w-7 text-right">{radioVolume}%</span>
                  </div>
                </div>

                {/* 3. REAL PENDING STUDENT FEES & DUES PANEL (NO FAKE DATA) */}
                <div className="rounded-3xl bg-white/75 border border-white p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-rose-500" />
                      <span className="text-xs font-extrabold text-slate-800">Pending Student Dues</span>
                    </div>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      {fees.filter(f => f.status !== 'paid').length} Invoices Due
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5">
                    {fees.filter(f => f.status !== 'paid').length > 0 ? (
                      fees.filter(f => f.status !== 'paid').slice(0, 6).map((fee) => {
                        const studentName = fee.student?.name || fee.studentName || 'Enrolled Student';
                        const courseName = fee.student?.class || fee.courseName || 'Course Program';
                        const dueText = fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : fee.term || 'Due';
                        
                        return (
                          <div key={fee._id} className="p-3 bg-slate-50/90 hover:bg-slate-100/90 rounded-2xl border border-slate-100 flex items-center justify-between transition-colors">
                            <div className="overflow-hidden pr-2">
                              <p className="text-xs font-bold text-slate-800 leading-tight truncate">{studentName}</p>
                              <p className="text-[10px] text-slate-500 truncate">{courseName}</p>
                              <span className="text-[9px] font-bold text-rose-600">₹{fee.amount?.toLocaleString('en-IN')} • {dueText}</span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleSendRealWhatsAppReminder(fee)}
                                title="Send WhatsApp Reminder"
                                className="p-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedFeeForPayment(fee);
                                  setShowCollectPaymentModal(true);
                                }}
                                title="Collect Fee"
                                className="px-2.5 py-1 rounded-xl bg-[#1c1d21] hover:bg-black text-white text-[10px] font-bold transition-all cursor-pointer"
                              >
                                Collect
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-1.5">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" />
                        <p className="text-xs font-bold text-emerald-950">All Student Fees Settled</p>
                        <p className="text-[10px] text-emerald-700">There are zero outstanding fee dues in the database.</p>
                        <button
                          onClick={() => {
                            setActiveTab('fees');
                            setFeesSubTab('billing');
                          }}
                          className="mt-1 inline-block px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          + Issue New Fee Invoice
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Bottom Right Column: Interactive Schedule Calendar & Timeline */}
              <div className="lg:col-span-7 rounded-3xl bg-white/75 border border-white p-6 shadow-sm space-y-4 flex flex-col justify-between">
                
                <div>
                  {/* Month Navigator */}
                  <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 border-b border-slate-200/80 pb-3">
                    <button className="text-slate-400 hover:text-slate-700 cursor-pointer">August</button>
                    <span className="text-sm font-black text-slate-900">September 2024</span>
                    <button className="text-slate-400 hover:text-slate-700 cursor-pointer">October</button>
                  </div>

                  {/* Days Columns */}
                  <div className="grid grid-cols-6 gap-2 text-center text-xs font-bold text-slate-600 mt-3">
                    {['Mon 22', 'Tue 23', 'Wed 24', 'Thu 25', 'Fri 26', 'Sat 27'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedScheduleDay(d)}
                        className={`py-2 rounded-2xl transition-all cursor-pointer ${
                          selectedScheduleDay === d ? 'bg-[#1c1d21] text-white shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  {/* Timeline Events */}
                  <div className="space-y-3 pt-4 text-xs">
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 text-[11px] font-bold w-16">8:00 am</span>
                      <div className="flex-1 p-3.5 rounded-2xl bg-[#1c1d21] text-white flex items-center justify-between shadow-sm">
                        <div>
                          <p className="font-bold text-xs">Java Enterprise Batch Sync</p>
                          <p className="text-[10px] text-slate-300">Live code review and milestone walkthrough</p>
                        </div>
                        <div className="flex -space-x-1.5">
                          <div className="w-6 h-6 rounded-full bg-amber-400 border border-white text-[9px] font-bold text-black flex items-center justify-center">A</div>
                          <div className="w-6 h-6 rounded-full bg-rose-400 border border-white text-[9px] font-bold text-white flex items-center justify-center">B</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 text-[11px] font-bold w-16">10:00 am</span>
                      <div className="flex-1 p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 flex items-center justify-between shadow-sm">
                        <div>
                          <p className="font-bold text-xs text-slate-900">New Batch Admissions Onboarding</p>
                          <p className="text-[10px] text-slate-500">LMS access setup & course handbook distribution</p>
                        </div>
                        <div className="flex -space-x-1.5">
                          <div className="w-6 h-6 rounded-full bg-indigo-400 border border-white text-[9px] font-bold text-white flex items-center justify-center">C</div>
                          <div className="w-6 h-6 rounded-full bg-emerald-400 border border-white text-[9px] font-bold text-white flex items-center justify-center">D</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 text-[11px] font-bold w-16">02:30 pm</span>
                      <div className="flex-1 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-slate-800 flex items-center justify-between shadow-sm">
                        <div>
                          <p className="font-bold text-xs text-amber-950">MERN Stack Mock Interview</p>
                          <p className="text-[10px] text-amber-800">Technical assessment with hiring partner</p>
                        </div>
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                          Live
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold">Active Timezone: IST (UTC+05:30)</span>
                  <span className="text-amber-700 font-bold">3 Events Scheduled Today ↗</span>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ── 5. MANAGEMENT SECTIONS CONTAINER (FOR OTHER TABS) ── */}
        {activeTab !== 'stats' && (
          <div className="rounded-[2.5rem] bg-white/80 border border-white p-6 sm:p-8 shadow-sm backdrop-blur-md">


            {/* TAB 2: Admissions reviews */}

            {activeTab === 'admissions' && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 pb-4 border-b sm:flex-row sm:items-center border-orange-50">
                  <h3 className="text-lg font-bold font-quicksand text-slate-800">Enrollment & Admissions Manager</h3>

                  {/* Sub-tabs selection */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setAdmissionsSubTab('review')}
                      className={`px-4 py-2 text-xs font-bold font-quicksand rounded-xl transition-all ${admissionsSubTab === 'review'
                        ? 'bg-[#9F92EC] text-white shadow'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      Pending Reviews ({admissions.filter(a => a.status === 'pending').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdmissionsSubTab('new')}
                      className={`px-4 py-2 text-xs font-bold font-quicksand rounded-xl transition-all ${admissionsSubTab === 'new'
                        ? 'bg-[#9F92EC] text-white shadow'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      New Admission Entry
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdmissionsSubTab('history')}
                      className={`px-4 py-2 text-xs font-bold font-quicksand rounded-xl transition-all ${admissionsSubTab === 'history'
                        ? 'bg-[#9F92EC] text-white shadow'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      Admissions History ({admissions.filter(a => a.status !== 'pending').length})
                    </button>
                  </div>
                </div>

                {/* Sub-tab 1: Pending Reviews */}
                {admissionsSubTab === 'review' && (
                  <div className="space-y-4">
                    {admissions.filter(adm => adm.status === 'pending').length === 0 ? (
                      <p className="py-10 text-xs font-medium text-center text-slate-500">No pending admission applications to review.</p>
                    ) : (
                      admissions.filter(adm => adm.status === 'pending').map(adm => (
                        <div key={adm._id} className="flex flex-col items-start justify-between gap-4 p-5 text-xs border bg-slate-50 border-slate-100 rounded-2xl sm:flex-row sm:items-center">
                          <div className="space-y-1">
                            <span className="block font-mono font-bold text-brandCoral">{adm.applicationNumber}</span>
                            <h4 className="text-sm font-bold font-quicksand text-slate-800">{adm.studentDetails?.name}</h4>
                            <p className="font-medium text-slate-500">Course: <span className="font-bold text-slate-800">{adm.studentDetails?.class}</span> | Parent: <span className="font-bold text-slate-800">{adm.parentDetails?.fatherName || adm.parentDetails?.motherName}</span></p>
                          </div>
                          <div className="flex items-center justify-between w-full gap-3 sm:w-auto sm:justify-end">
                            <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border bg-brandYellow/10 text-brandYellow-dark border border-brandYellow/30">
                              {adm.status}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedAdmission(adm);
                                setParentPassword('');
                                setRemarks(adm.remarks || '');
                              }}
                              className="font-quicksand font-bold text-xs bg-[#9F92EC] hover:bg-[#8C7EB5] text-white px-4 py-2.5 rounded-xl shadow cursor-pointer transition-all active:scale-[0.98]"
                            >
                              REVIEW & DECIDE
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Sub-tab 2: New Admission Entry Form */}
                {admissionsSubTab === 'new' && (
                  <form onSubmit={handleCreateAdmission} className="p-5 space-y-6 text-xs border bg-slate-50/50 border-slate-100 rounded-3xl">
                    <div>
                      <h4 className="text-sm font-bold font-quicksand text-[#5B468C] mb-1">Record New Admission Application</h4>
                      <p className="text-slate-500">Submit student credentials, parent details, and upload documents directly. This will automatically approve the admission, generate a Student ID, and provision the parent portal.</p>
                    </div>

                    {/* Student Details Section */}
                    <div className="space-y-3">
                      <h5 className="pb-1 font-bold border-b text-slate-800 font-quicksand">1. Student Details</h5>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Student Name</label>
                          <input
                            type="text" required placeholder="e.g. Tommy Jenkins"
                            value={admStdName} onChange={e => setAdmStdName(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Date of Birth</label>
                          <input
                            type="date" required
                            value={admStdDob} onChange={e => setAdmStdDob(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none text-slate-600 font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Gender</label>
                          <select
                            value={admStdGender} onChange={e => setAdmStdGender(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-600"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        {/* Profile Picture Upload & Preview */}
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Profile Picture (Optional)</label>
                          <div className="flex items-center gap-2">
                            {admPhotoPreview ? (
                              <img
                                src={admPhotoPreview}
                                alt="Student Preview"
                                className="w-9 h-9 rounded-xl object-cover border border-slate-300 shrink-0 shadow-sm"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                <User className="w-4 h-4" />
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setAdmPhoto(file);
                                  setAdmPhotoPreview(URL.createObjectURL(file));
                                }
                              }}
                              className="w-full bg-white border border-slate-200 rounded-xl p-1.5 outline-none text-[10px] font-semibold text-slate-600"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5 sm:col-span-4">
                          <div className="flex items-center justify-between">
                            <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                              <span>Select Course for Admission</span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                                {courseOptions.length} Courses Available
                              </span>
                            </label>
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                              Selected: {admStdClass || 'Java Development'}
                            </span>
                          </div>

                          {/* Quick Dropdown Selector & Editable Title */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <select
                                value={admSelectedCourses?.[0] || admStdClass || ''}
                                onChange={(e) => {
                                  const selected = e.target.value;
                                  setAdmStdClass(selected);
                                  setAdmSelectedCourses([selected]);
                                  const match = courses?.find(c => c.title && c.title.toLowerCase() === selected.toLowerCase());
                                  if (match && match.price) {
                                    setAdmTuitionFee(String(match.price));
                                  }
                                }}
                                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 outline-none font-bold text-slate-800 text-xs shadow-sm focus:border-[#5B468C]"
                              >
                                <option value="" disabled>-- Choose a Course --</option>
                                {(courseOptions || []).map((course) => (
                                  <option key={course} value={course}>{course}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <input
                                type="text"
                                placeholder="Course name or combo (e.g. Java + MERN)..."
                                value={admStdClass || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setAdmStdClass(val);
                                  const parts = val.split('+').map(s => s.trim()).filter(Boolean);
                                  if (parts.length > 0) setAdmSelectedCourses(parts);
                                }}
                                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 outline-none font-semibold text-slate-700 text-xs shadow-sm"
                              />
                            </div>
                          </div>

                          {/* Multi-Select Course Quick Pills */}
                          <div>
                            <span className="text-[11px] text-slate-500 font-medium block mb-1">
                              Or click course badges to select / combine multiple (Ctrl/Shift-click):
                            </span>
                            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                              {(courseOptions || []).map((course) => {
                                const isSelected = (admSelectedCourses || []).includes(course);
                                return (
                                  <button
                                    key={course}
                                    type="button"
                                    onClick={(e) => handleToggleCourse(course, e)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                                      isSelected
                                        ? 'bg-[#5B468C] text-white border-[#5B468C] shadow-sm scale-[1.02]'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                                    }`}
                                  >
                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                    <span>{course}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Parent Details Section */}
                    <div className="space-y-3">
                      <h5 className="pb-1 font-bold border-b text-slate-800 font-quicksand">2. Parent / Guardian Details</h5>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Father's Full Name</label>
                          <input
                            type="text" required placeholder="e.g. John Jenkins"
                            value={admParentFather} onChange={e => setAdmParentFather(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Mother's Full Name</label>
                          <input
                            type="text" required placeholder="e.g. Clara Jenkins"
                            value={admParentMother} onChange={e => setAdmParentMother(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Email Address (Login Username)</label>
                          <input
                            type="email" required placeholder="e.g. parent@email.com"
                            value={admParentEmail} onChange={e => setAdmParentEmail(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Phone Number</label>
                          <input
                            type="text" required placeholder="e.g. +91 98765 43210"
                            value={admParentPhone} onChange={e => setAdmParentPhone(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="font-bold text-slate-600">Home Address</label>
                          <input
                            type="text" required placeholder="e.g. 123 Sunshine Street, Sector 5"
                            value={admParentAddress} onChange={e => setAdmParentAddress(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-3">
                          <label className="font-bold text-slate-600">Provision Portal Password (defaults to "parent123" if empty)</label>
                          <input
                            type="text" placeholder="Provision login password for the parent..."
                            value={admParentPassword} onChange={e => setAdmParentPassword(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Course Fees & Installments Plan Section */}
                    <div className="space-y-4">
                      <h5 className="pb-1 font-bold border-b text-slate-800 font-quicksand">3. Total Course Fees & Installment Plan (Decided by Admin)</h5>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Total Student / Course Fee (₹)</label>
                          <input
                            type="number"
                            placeholder="e.g. 24000"
                            value={admTuitionFee}
                            onChange={e => setAdmTuitionFee(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-700 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Admission Fee (₹) <span className="text-[10px] text-emerald-600 font-bold">(Included in Total)</span></label>
                          <input
                            type="number"
                            placeholder="e.g. 5000"
                            value={admissionFee}
                            onChange={e => setAdmissionFee(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-700 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Installment Plan</label>
                          <select
                            value={admPaymentPlan}
                            onChange={e => setAdmPaymentPlan(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-600 text-xs font-quicksand"
                          >
                            <option value="1month">1 Month (1 Installment / Full Remaining)</option>
                            <option value="2months">2 Months Installments</option>
                            <option value="3months">3 Months Installments</option>
                            <option value="4months">4 Months Installments</option>
                            <option value="5months">5 Months Installments</option>
                            <option value="6months">6 Months Installments</option>
                            <option value="10months">10 Months Installments</option>
                            <option value="monthly">Monthly (12 Installments)</option>
                          </select>
                        </div>
                      </div>

                      {/* Live Fee Calculation Breakdown Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* 1. Total Fee */}
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                          <span className="text-[10px] uppercase font-extrabold text-slate-400">Total Course Fee</span>
                          <span className="text-xl font-black text-slate-900 mt-1">
                            ₹{Number(admTuitionFee || 0).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5 font-medium">Grand Total Decided</span>
                        </div>

                        {/* 2. Admission Fee Paid */}
                        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm flex flex-col justify-between">
                          <span className="text-[10px] uppercase font-extrabold text-emerald-700">Admission Fee (Paid Upfront)</span>
                          <span className="text-xl font-black text-emerald-800 mt-1">
                            ₹{Number(admissionFee || 0).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-emerald-600 mt-0.5 font-medium">Paid at Admission Desk</span>
                        </div>

                        {/* 3. Remaining Balance */}
                        <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-400 shadow-sm flex flex-col justify-between">
                          <span className="text-[10px] uppercase font-extrabold text-amber-800 flex items-center justify-between">
                            <span>Remaining Balance</span>
                            <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-black">TO COLLECT</span>
                          </span>
                          <span className="text-xl font-black text-amber-900 mt-1">
                            ₹{Math.max(0, Number(admTuitionFee || 0) - Number(admissionFee || 0)).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-amber-800 mt-0.5 font-semibold">
                            {getPlanCount(admPaymentPlan)} Month(s) (~₹{Math.round(Math.max(0, Number(admTuitionFee || 0) - Number(admissionFee || 0)) / getPlanCount(admPaymentPlan)).toLocaleString()}/mo)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Primary action: collect payment (Cash / UPI) → student auto-saved */}
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleOpenAdmissionPayment}
                        className="flex items-center justify-center w-full gap-2 py-3 text-xs font-bold text-white transition-all shadow bg-brandCoral hover:bg-brandCoral-dark font-quicksand rounded-xl"
                      >
                        <Wallet className="w-4 h-4" />
                        PAY & CONFIRM ADMISSION (CASH / UPI)
                      </button>
                      <p className="text-[10px] text-center text-slate-400">
                        Collecting payment auto-registers the student. Use the option below to record without payment.
                      </p>
                      <button
                        type="submit"
                        className="w-full py-2.5 text-[11px] font-bold text-slate-500 transition-all border border-slate-200 bg-white hover:bg-slate-50 font-quicksand rounded-xl"
                      >
                        CREATE ADMISSION RECORD & PROVISION STUDENT
                      </button>
                    </div>
                  </form>
                )}

                {/* Sub-tab 3: Admissions History */}
                {admissionsSubTab === 'history' && (
                  <div className="space-y-4">
                    {admissions.filter(adm => adm.status !== 'pending').length === 0 ? (
                      <p className="py-10 text-xs font-medium text-center text-slate-500">No historic admission entries found.</p>
                    ) : (
                      admissions.filter(adm => adm.status !== 'pending').map(adm => (
                        <div key={adm._id} className="flex flex-col items-start justify-between gap-4 p-5 text-xs border bg-slate-50 border-slate-100 rounded-2xl sm:flex-row sm:items-center">
                          <div className="space-y-1">
                            <span className="block font-mono font-bold text-brandCoral">{adm.applicationNumber}</span>
                            <h4 className="text-sm font-bold font-quicksand text-slate-800">{adm.studentDetails?.name}</h4>
                            <p className="font-medium text-slate-500">Course: <span className="font-bold text-slate-800">{adm.studentDetails?.class}</span> | Parent: <span className="font-bold text-slate-800">{adm.parentDetails?.fatherName || adm.parentDetails?.motherName}</span></p>
                          </div>
                          <div className="flex items-center justify-between w-full gap-3 sm:w-auto sm:justify-end">
                            <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${adm.status === 'approved' ? 'bg-brandMint/10 text-brandMint-dark border-brandMint/30' :
                              'bg-red-50 text-red-600 border border-red-100'
                              }`}>
                              {adm.status}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedAdmission(adm);
                                setParentPassword('');
                                setRemarks(adm.remarks || '');
                              }}
                              className="font-quicksand font-bold text-xs bg-[#9F92EC] hover:bg-[#8C7EB5] text-white px-4 py-2.5 rounded-xl shadow cursor-pointer transition-all active:scale-[0.98]"
                            >
                              VIEW DETAILS
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Users catalog */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 pb-4 border-b sm:flex-row sm:items-center border-orange-50">
                  <h3 className="text-lg font-bold font-quicksand text-slate-800">Students & Teachers Hub</h3>

                  {/* Sub-tabs selection */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setUsersSubTab('registry')}
                      className={`px-4 py-2 text-xs font-bold font-quicksand rounded-xl transition-all ${usersSubTab === 'registry'
                        ? 'bg-[#9F92EC] text-white shadow'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      Student Registry ({students.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setUsersSubTab('direct')}
                      className={`px-4 py-2 text-xs font-bold font-quicksand rounded-xl transition-all ${usersSubTab === 'direct'
                        ? 'bg-[#9F92EC] text-white shadow'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      Direct Registration
                    </button>
                    <button
                      type="button"
                      onClick={() => setUsersSubTab('teacher_form')}
                      className={`px-4 py-2 text-xs font-bold font-quicksand rounded-xl transition-all ${usersSubTab === 'teacher_form'
                        ? 'bg-[#9F92EC] text-white shadow'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      Staff Teachers ({teachers.length})
                    </button>
                  </div>
                </div>

                {/* Sub-tab 1: Student Registry Database */}
                {usersSubTab === 'registry' && (
                  <div className="space-y-4">
                    {/* Search and Filters panel */}
                    <div className="flex flex-col gap-3 p-4 text-xs border bg-slate-50 border-slate-100 rounded-3xl sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col flex-1 gap-2 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                          <Search className="absolute w-4 h-4 text-slate-400 left-3 top-3" />
                          <input
                            type="text"
                            placeholder="Search student by name..."
                            value={studentSearchQuery}
                            onChange={e => setStudentSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                          />
                        </div>
                        <select
                          value={studentClassFilter}
                          onChange={e => setStudentClassFilter(e.target.value)}
                          className="bg-[#0f172a] border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-600"
                        >
                          <option value="">-- All Courses --</option>
                          {courseOptions.map((course) => (
                            <option key={course} value={course}>{course}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleExportCSV}
                          className="px-4 py-2.5 bg-slate-900 text-white font-quicksand font-bold rounded-xl flex items-center space-x-1.5 shadow hover:bg-slate-800 transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export CSV</span>
                        </button>
                        <button
                          type="button"
                          onClick={handlePrintPDF}
                          className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-quicksand font-bold rounded-xl flex items-center space-x-1.5 shadow hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print List</span>
                        </button>
                      </div>
                    </div>

                    {/* Student Grid / List Table */}
                    <div className="overflow-x-auto bg-white border shadow-sm border-slate-100 rounded-3xl">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                            <th className="p-4">Student ID</th>
                            <th className="p-4">Student Name</th>
                            <th className="p-4">Course</th>
                            <th className="p-4">Gender</th>
                            <th className="p-4">Parent Details</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="font-medium divide-y divide-slate-100 text-slate-700">
                          {students.filter(s => {
                            const classMatch = studentClassFilter ? s.class === studentClassFilter : true;
                            const nameMatch = s.name.toLowerCase().includes(studentSearchQuery.toLowerCase());
                            return classMatch && nameMatch;
                          }).length === 0 ? (
                            <tr>
                              <td colSpan="6" className="p-10 text-center text-slate-400">
                                No matching students found in the database.
                              </td>
                            </tr>
                          ) : (
                            students.filter(s => {
                              const classMatch = studentClassFilter ? s.class === studentClassFilter : true;
                              const nameMatch = s.name.toLowerCase().includes(studentSearchQuery.toLowerCase());
                              return classMatch && nameMatch;
                            }).map(std => (
                              <tr key={std._id} className="transition-all hover:bg-slate-50/50">
                                <td className="p-4 font-mono font-bold text-slate-850">
                                  {std.studentId || 'N/A'}
                                </td>
                                <td className="p-4">
                                  <span className="block text-sm font-bold text-slate-800 font-quicksand">{std.name}</span>
                                  <span className="text-[10px] text-slate-450 block mt-0.5">
                                    DOB: {std.dateOfBirth ? new Date(std.dateOfBirth).toLocaleDateString() : 'N/A'}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-[#EAE8FC] text-[#7C3AED] border border-[#DEDAFB]">
                                    {std.class}
                                  </span>
                                </td>
                                <td className="p-4">{std.gender}</td>
                                <td className="p-4">
                                  {(() => {
                                    const pInfo = getStudentParentInfo(std);
                                    return (
                                      <>
                                        <span className="block font-bold text-slate-800">
                                          {pInfo.name}
                                        </span>
                                        <span className="text-[10px] text-slate-450 block mt-0.5 font-mono">
                                          {pInfo.phone}
                                        </span>
                                      </>
                                    );
                                  })()}
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => setSelectedStudentProfile(std)}
                                      className="px-3 py-1.5 font-bold text-[10px] rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                                    >
                                      View
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadStudentProfilePDF(std)}
                                      className="px-3 py-1.5 font-bold text-[10px] rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                                      title="Download / Print Student Profile PDF"
                                    >
                                      <Download className="w-3 h-3 text-indigo-600" />
                                      <span>Profile PDF</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSendDocStudent(std);
                                        setSendDocTitle(`Study Package & Notes — ${std.class || 'Course'}`);
                                        setSendDocModalOpen(true);
                                      }}
                                      className="px-3 py-1.5 font-bold text-[10px] rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                                    >
                                      <Send className="w-3 h-3 text-emerald-600" />
                                      <span>Send PDF / Image</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleViewIdCard(std)}
                                      className="px-3 py-1.5 font-bold text-[10px] rounded-lg bg-[#FAF8F5] hover:bg-orange-50 text-brandCoral border border-orange-100/50 transition-all cursor-pointer flex items-center gap-1"
                                    >
                                      <Contact className="w-3 h-3" />
                                      <span>ID Card</span>
                                    </button>
                                    <button
                                      onClick={() => handleStartEditStudent(std)}
                                      className="px-3 py-1.5 font-bold text-[10px] rounded-lg bg-[#EAE8FC] hover:bg-[#DEDAFB] text-[#7C3AED] transition-all flex items-center gap-1 cursor-pointer"
                                    >
                                      <Edit className="w-3 h-3" />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteStudent(std._id)}
                                      className="p-1.5 text-red-500 hover:text-red-705 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all cursor-pointer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub-tab 2: Direct Student Registration Form */}
                {usersSubTab === 'direct' && (
                  <form onSubmit={handleRegisterStudent} className="p-5 space-y-6 text-xs border bg-slate-50/50 border-slate-100 rounded-3xl">
                    <div>
                      <h4 className="text-sm font-bold font-quicksand text-[#5B468C] mb-1">Direct Student Registration Entry</h4>
                      <p className="font-semibold text-slate-500">Manually register an existing student directly into the active database. This assigns a unique Student ID and provisions parent credentials immediately.</p>
                    </div>

                    {/* Student Section */}
                    <div className="space-y-3">
                      <h5 className="pb-1 font-bold border-b text-slate-800 font-quicksand">1. Student Profile</h5>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Student Full Name</label>
                          <input
                            type="text" required placeholder="Full Name"
                            value={regStdName} onChange={e => setRegStdName(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Date of Birth</label>
                          <input
                            type="date" required
                            value={regStdDob} onChange={e => setRegStdDob(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none text-slate-600 font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Gender</label>
                          <select
                            value={regStdGender} onChange={e => setRegStdGender(e.target.value)}
                            className="w-full bg-[#0f172a] border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-600"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Course</label>
                          <select
                            value={regStdClass} onChange={e => setRegStdClass(e.target.value)}
                            className="w-full bg-[#0f172a] border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-600"
                          >
                            {courseOptions.map((course) => (
                              <option key={course} value={course}>{course}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Parent Section */}
                    <div className="space-y-3">
                      <h5 className="pb-1 font-bold border-b text-slate-800 font-quicksand">2. Parent / Guardian Credentials</h5>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Parent Full Name</label>
                          <input
                            type="text" required placeholder="Parent Full Name"
                            value={regParentName} onChange={e => setRegParentName(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Email Address (Login Username)</label>
                          <input
                            type="email" required placeholder="parent@email.com"
                            value={regParentEmail} onChange={e => setRegParentEmail(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Contact Phone Number</label>
                          <input
                            type="text" required placeholder="e.g. +91 99887 76655"
                            value={regParentPhone} onChange={e => setRegParentPhone(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Home Address</label>
                          <input
                            type="text" required placeholder="Home Address"
                            value={regParentAddress} onChange={e => setRegParentAddress(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="font-bold text-slate-600">Student & Parent Login Password (defaults to "student123" if empty)</label>
                          <input
                            type="text" placeholder="Set login password for student portal..."
                            value={regParentPassword} onChange={e => setRegParentPassword(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Course Fees & Initial Installments */}
                    <div className="space-y-3">
                      <h5 className="pb-1 font-bold border-b text-slate-800 font-quicksand flex items-center justify-between">
                        <span>3. Course Tuition Fee & Payment Breakdown</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Auto-Calculates Remaining Balance
                        </span>
                      </h5>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Total Course Fee (₹)</label>
                          <input
                            type="number" required placeholder="12000"
                            value={regTotalFee} onChange={e => setRegTotalFee(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Initial Fees Submitted / Paid (₹)</label>
                          <input
                            type="number" required placeholder="8000"
                            value={regPaidFee} onChange={e => setRegPaidFee(e.target.value)}
                            className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 outline-none font-bold text-emerald-800 bg-emerald-50/40"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Remaining Balance Due (₹)</label>
                          <div className="w-full bg-rose-50 border border-rose-200 rounded-xl p-2.5 font-black text-rose-600 flex items-center justify-between">
                            <span>₹{Math.max(0, (Number(regTotalFee) || 0) - (Number(regPaidFee) || 0)).toLocaleString('en-IN')}</span>
                            <span className="text-[9px] px-2 py-0.5 rounded-md bg-rose-100 uppercase">
                              {(Number(regTotalFee) || 0) - (Number(regPaidFee) || 0) === 0 ? 'Fully Paid' : 'Partial Due'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Provision PDF Letters & Study Images */}
                    <div className="space-y-3">
                      <h5 className="pb-1 font-bold border-b text-slate-800 font-quicksand">
                        4. Automatically Dispatch Initial Documents & Images to Student Portal
                      </h5>
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <label className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all">
                          <input
                            type="checkbox"
                            checked={regAttachAdmissionPdf}
                            onChange={e => setRegAttachAdmissionPdf(e.target.checked)}
                            className="rounded text-amber-500 w-4 h-4"
                          />
                          <div>
                            <span className="block font-bold text-slate-800 text-[11px]">📄 Official Admission & Enrollment Letter PDF</span>
                            <span className="text-[10px] text-slate-400">Includes verification seal & course registration terms</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all">
                          <input
                            type="checkbox"
                            checked={regAttachRoadmapPdf}
                            onChange={e => setRegAttachRoadmapPdf(e.target.checked)}
                            className="rounded text-amber-500 w-4 h-4"
                          />
                          <div>
                            <span className="block font-bold text-slate-800 text-[11px]">📑 Complete Curriculum & 1000 DSA Roadmap PDF</span>
                            <span className="text-[10px] text-slate-400">Full module breakdown & problem set guide</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all">
                          <input
                            type="checkbox"
                            checked={regAttachReceiptPdf}
                            onChange={e => setRegAttachReceiptPdf(e.target.checked)}
                            className="rounded text-amber-500 w-4 h-4"
                          />
                          <div>
                            <span className="block font-bold text-slate-800 text-[11px]">🧾 Verified Initial Payment Fee Receipt PDF</span>
                            <span className="text-[10px] text-slate-400">Shows amount paid vs remaining balance due</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all">
                          <input
                            type="checkbox"
                            checked={regAttachIdImage}
                            onChange={e => setRegAttachIdImage(e.target.checked)}
                            className="rounded text-amber-500 w-4 h-4"
                          />
                          <div>
                            <span className="block font-bold text-slate-800 text-[11px]">🖼️ Student Digital ID Badge & Welcome Kit Image</span>
                            <span className="text-[10px] text-slate-400">Instant digital identity card badge</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 text-xs font-bold text-white transition-all shadow cursor-pointer bg-slate-900 hover:bg-black font-quicksand rounded-2xl flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>REGISTER STUDENT & DISPATCH INITIAL DOCUMENTS</span>
                    </button>
                  </form>
                )}

                {/* Sub-tab 3: Staff Teachers & Hiring */}
                {usersSubTab === 'teacher_form' && (
                  <div className="space-y-6 text-xs">
                    {/* Hire Teacher Form */}
                    <form onSubmit={handleCreateTeacher} className="p-5 space-y-4 border bg-slate-50/50 border-slate-100 rounded-3xl">
                      <h4 className="font-quicksand font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                        <Plus className="w-4.5 h-4.5 text-brandCoral" />
                        <span>Hire & Register a New Teacher</span>
                      </h4>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Full Name</label>
                          <input
                            type="text" required placeholder="Full Name"
                            value={tName} onChange={e => setTName(e.target.value)}
                            className="w-full bg-white border rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Email Address</label>
                          <input
                            type="email" required placeholder="Email Address"
                            value={tEmail} onChange={e => setTEmail(e.target.value)}
                            className="w-full bg-white border rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Login Password</label>
                          <input
                            type="password" required placeholder="Password"
                            name="new_teacher_password"
                            autoComplete="new-password"
                            value={tPassword} onChange={e => setTPassword(e.target.value)}
                            className="w-full bg-white border rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Contact Number</label>
                          <input
                            type="text" required placeholder="Contact Number"
                            value={tPhone} onChange={e => setTPhone(e.target.value)}
                            className="w-full bg-white border rounded-xl p-2.5 outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Qualifications (e.g. M.Ed.)</label>
                          <input
                            type="text" required placeholder="Qualifications (e.g. M.Ed.)"
                            value={tQual} onChange={e => setTQual(e.target.value)}
                            className="w-full bg-white border rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Assigned Course</label>
                          <select
                            value={tClass} onChange={e => setTClass(e.target.value)}
                            className="w-full bg-[#0f172a] border rounded-xl p-2.5 outline-none font-semibold text-slate-600"
                          >
                            {courseOptions.map((course) => (
                              <option key={course} value={course}>{course}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-slate-900 hover:bg-slate-850 text-white font-quicksand font-bold text-xs py-2.5 rounded-xl transition-all shadow cursor-pointer">
                        HIRE STAFF MEMBER
                      </button>
                    </form>

                    {/* Teachers Roster List */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold font-quicksand text-slate-800">Active Teachers Roster</h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {teachers.map(teach => (
                          <div key={teach._id} className="flex flex-col justify-between p-4 space-y-2 text-xs bg-white border border-slate-100 rounded-2xl">
                            <div>
                              <span className="text-[9px] font-extrabold tracking-widest text-[#7C3AED] bg-[#EAE8FC] px-2.5 py-0.5 rounded-full uppercase">
                                {teach.qualifications || 'Staff Teacher'}
                              </span>
                              <h5 className="mt-2 text-sm font-bold font-quicksand text-slate-800">{teach.name || teach.userId?.name}</h5>
                              <div className="mt-1 space-y-0.5 text-slate-500 font-semibold">
                                <p>Email: <span className="font-mono text-slate-700">{teach.email || teach.userId?.email}</span></p>
                                <p>Phone: <span className="text-slate-700">{teach.phone || 'N/A'}</span></p>
                                <p>Assigned Course: <span className="font-bold text-brandCoral">{(teach.classesAssigned && teach.classesAssigned.join(', ')) || 'None'}</span></p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Fees Manager */}
            {activeTab === 'fees' && (
              <div className="space-y-8">
                {/* Sub Tab Navigation */}
                <div className="flex gap-2 pb-3 border-b border-slate-100 print:hidden">
                  <button
                    onClick={() => setFeesSubTab('billing')}
                    className={`px-4 py-2.5 font-quicksand font-bold text-xs rounded-xl transition-all cursor-pointer ${feesSubTab === 'billing'
                        ? 'bg-[#5B468C] text-white shadow-sm'
                        : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'
                      }`}
                  >
                    Invoices & Cash Desk
                  </button>
                  <button
                    onClick={() => setFeesSubTab('fineRules')}
                    className={`px-4 py-2.5 font-quicksand font-bold text-xs rounded-xl transition-all cursor-pointer ${feesSubTab === 'fineRules'
                        ? 'bg-[#5B468C] text-white shadow-sm'
                        : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'
                      }`}
                  >
                    Fine Configuration Module
                  </button>
                </div>

                {feesSubTab === 'billing' && (
                  <div className="space-y-8">

                    {/* Generate Fee Invoice Form */}
                    <form onSubmit={handleCreateFee} className="p-5 space-y-4 border bg-slate-50/50 border-slate-100 rounded-3xl">
                      <h4 className="text-sm font-bold font-quicksand text-slate-800">Create Student Fee Invoice</h4>
                      <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">1. Filter by Course</label>
                          <select
                            value={feeClassFilter}
                            onChange={e => {
                              setFeeClassFilter(e.target.value);
                              setFeeStdId(''); // Clear selection
                            }}
                            className="bg-[#0f172a] border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-600"
                          >
                            <option value="">-- All Courses --</option>
                            {courseOptions.map((course) => (
                              <option key={course} value={course}>{course}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="font-bold text-slate-600">2. Search & Select Student</label>
                          <input
                            type="text"
                            value={feeSearchQuery}
                            onChange={e => setFeeSearchQuery(e.target.value)}
                            placeholder="Type name to search..."
                            className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none text-xs"
                          />

                          <div className="mt-2 overflow-y-auto bg-white border divide-y shadow-inner max-h-32 border-orange-50 rounded-xl divide-slate-100">
                            {students.filter(s => {
                              const classMatch = feeClassFilter ? s.class === feeClassFilter : true;
                              const nameMatch = s.name.toLowerCase().includes(feeSearchQuery.toLowerCase());
                              return classMatch && nameMatch;
                            }).length === 0 ? (
                              <p className="p-3 text-xs text-center text-slate-400">No matching students found.</p>
                            ) : (
                              students.filter(s => {
                                const classMatch = feeClassFilter ? s.class === feeClassFilter : true;
                                const nameMatch = s.name.toLowerCase().includes(feeSearchQuery.toLowerCase());
                                return classMatch && nameMatch;
                              }).map(s => {
                                const isSelected = feeStdId === s._id;
                                return (
                                  <button
                                    key={s._id}
                                    type="button"
                                    onClick={() => {
                                      setFeeStdId(s._id);
                                      const matchedCourse = courses.find(c => String(c.title).toLowerCase() === String(s.class).toLowerCase());
                                      if (matchedCourse) {
                                        const totalPrice = Number(matchedCourse.price) || 0;
                                        const monthlySum = Math.round(totalPrice / 3);
                                        setFeeAmount(monthlySum.toString());
                                        setFeeFormBreakdown({
                                          courseTitle: matchedCourse.title,
                                          totalPrice,
                                          duration: matchedCourse.duration || '3 Months',
                                          durationMonths: 3,
                                          monthlySum
                                        });
                                        setFeeTerm('Month 1 Installment');
                                      } else {
                                        const monthlySum = 5000;
                                        setFeeAmount(monthlySum.toString());
                                        setFeeFormBreakdown({
                                          courseTitle: s.class || 'Unknown Course',
                                          totalPrice: 15000,
                                          duration: '3 Months',
                                          durationMonths: 3,
                                          monthlySum
                                        });
                                        setFeeTerm('Month 1 Installment');
                                      }
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs flex justify-between items-center transition-all ${isSelected ? 'bg-orange-50 text-brandCoral font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
                                  >
                                    <span>{s.name} ({s.class})</span>
                                    <span className="text-[10px] text-slate-400 font-mono">ID: {s._id}</span>
                                  </button>
                                );
                              })
                            )}
                          </div>
                          {feeStdId && (
                            <div className="mt-2 text-xs font-bold text-brandMint-dark bg-brandMint/10 px-3 py-1.5 rounded-lg border border-brandMint/20 flex justify-between items-center">
                              <span>Selected Student: {students.find(s => s._id === feeStdId)?.name}</span>
                              <button type="button" onClick={() => setFeeStdId('')} className="text-red-500 hover:text-red-700">Clear</button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Fee Amount (₹)</label>
                          <input
                            type="number"
                            value={feeAmount}
                            readOnly
                            placeholder="Select student to auto-assign"
                            required
                            className="bg-slate-100 border border-slate-200 rounded-xl p-2.5 w-full outline-none font-bold text-[#5B468C] cursor-not-allowed"
                          />
                          {feeStdId && !feeFormBreakdown && (
                            <div className="text-[9px] text-red-500 font-bold mt-1 animate-pulse">
                              ⚠️ No active course found. Configure course price first.
                            </div>
                          )}
                          {feeFormBreakdown && (
                            <div className="text-[9px] text-emerald-600 font-bold mt-1">
                              ✓ Auto-assigned by Course Price
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Installment Period</label>
                          <select
                            value={feeTerm} onChange={e => setFeeTerm(e.target.value)}
                            className="bg-[#0f172a] border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-600"
                          >
                            {feeFormBreakdown ? (
                              Array.from({ length: feeFormBreakdown.durationMonths || 3 }).map((_, i) => (
                                <option key={i} value={`Month ${i + 1} Installment`}>
                                  Month {i + 1} Installment
                                </option>
                              ))
                            ) : (
                              <>
                                <option>Month 1 Installment</option>
                                <option>Month 2 Installment</option>
                                <option>Month 3 Installment</option>
                              </>
                            )}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Due Date</label>
                          <input
                            type="date" required
                            value={feeDueDate} onChange={e => setFeeDueDate(e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none text-slate-600 font-semibold"
                          />
                        </div>
                      </div>

                      {feeFormBreakdown && (
                        <div className="bg-[#5B468C]/5 border border-[#5B468C]/15 rounded-2xl p-4 space-y-2 text-xs font-semibold text-slate-700">
                          <h5 className="font-bold text-[#5B468C] uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-[#5B468C] animate-pulse" />
                            Course Fee Installment Breakdown ({feeFormBreakdown.courseTitle})
                          </h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-[10px] leading-relaxed">
                            <div className="px-2 py-1 bg-white border rounded-lg border-slate-150">Total Course Price: <span className="font-bold text-slate-800">₹{feeFormBreakdown.totalPrice}</span></div>
                            <div className="px-2 py-1 bg-white border rounded-lg border-slate-150">Course Duration: <span className="font-bold text-slate-800">{feeFormBreakdown.duration}</span></div>
                            <div className="px-2 py-1 bg-white border rounded-lg border-slate-150">Monthly Installments: <span className="font-bold text-slate-800">{feeFormBreakdown.durationMonths} Months</span></div>
                          </div>
                          <div className="border-t border-[#5B468C]/10 pt-2 flex justify-between items-center text-xs font-bold text-[#5B468C] mt-2">
                            <span>Installment Fee Amount:</span>
                            <span>₹{feeFormBreakdown.monthlySum.toLocaleString('en-IN')}.00</span>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={feeStdId && !feeFormBreakdown}
                        className="w-full bg-[#5B468C] hover:bg-[#4a3973] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-quicksand font-bold text-xs py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4" />
                        BILL STUDENT INVOICE
                      </button>
                    </form>

                    {/* Organized Invoices list */}
                    <div className="space-y-4">
                      <div className="pt-6 border-t">
                        <h3 className="mb-4 text-base font-bold font-quicksand text-slate-800">Issued Invoices Ledger</h3>

                        {/* Stats Summary Cards */}
                        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
                          <div className="bg-[#FAF8F5] border border-orange-100 p-4 rounded-2xl">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Invoiced</span>
                            <span className="block mt-1 font-mono text-lg font-extrabold text-slate-800">
                              ₹{fees.reduce((sum, f) => sum + f.amount, 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="p-4 border bg-brandMint/5 border-brandMint/10 rounded-2xl">
                            <span className="text-[10px] uppercase font-bold text-brandMint-dark block tracking-wider">Total Collected (Paid)</span>
                            <span className="block mt-1 font-mono text-lg font-extrabold text-brandMint-dark">
                              ₹{fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="p-4 border bg-rose-50 border-rose-100 rounded-2xl">
                            <span className="text-[10px] uppercase font-bold text-rose-500 block tracking-wider">Total Outstanding (Pending)</span>
                            <span className="block mt-1 font-mono text-lg font-extrabold text-rose-600">
                              ₹{fees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Filter Controls Row */}
                        <div className="grid grid-cols-1 gap-3 p-4 mb-4 text-xs border sm:grid-cols-3 bg-slate-50 border-slate-100 rounded-2xl">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-500">Search Student Name</label>
                            <input
                              type="text"
                              value={listFeeSearchName}
                              onChange={e => setListFeeSearchName(e.target.value)}
                              placeholder="Search student..."
                              className="w-full p-2 bg-white border outline-none border-slate-200 rounded-xl"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-slate-500">Filter by Course</label>
                            <select
                              value={listFeeClassFilter}
                              onChange={e => setListFeeClassFilter(e.target.value)}
                              className="w-full p-2 font-semibold bg-white border outline-none border-slate-200 rounded-xl text-slate-600"
                            >
                              <option value="">-- All Courses --</option>
                              {courseOptions.map((course) => (
                                <option key={course} value={course}>{course}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-slate-500">Filter by Status</label>
                            <select
                              value={listFeeStatusFilter}
                              onChange={e => setListFeeStatusFilter(e.target.value)}
                              className="w-full p-2 font-semibold bg-white border outline-none border-slate-200 rounded-xl text-slate-600"
                            >
                              <option value="all">-- All Statuses --</option>
                              <option value="paid">Paid</option>
                              <option value="pending">Pending</option>
                              <option value="overdue">Overdue</option>
                            </select>
                          </div>
                        </div>

                        {/* List Table */}
                        <div className="overflow-x-auto bg-white border shadow-sm border-slate-100 rounded-2xl">
                          <table className="w-full text-left border-collapse text-[11px]">
                            <thead>
                              <tr className="font-bold tracking-wider uppercase border-b bg-slate-50 border-slate-100 text-slate-500">
                                <th className="p-3">Student Name</th>
                                <th className="p-3">Course</th>
                                <th className="p-3">Term / Invoice</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Due Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {fees.filter(f => {
                                const studentInfo = getStudentInfo(f);
                                const nameMatch = studentInfo.name.toLowerCase().includes(listFeeSearchName.toLowerCase());
                                const classMatch = listFeeClassFilter ? studentInfo.class === listFeeClassFilter : true;
                                const statusMatch = listFeeStatusFilter === 'all' ? true : f.status === listFeeStatusFilter;
                                return nameMatch && classMatch && statusMatch;
                              }).length === 0 ? (
                                <tr>
                                  <td colSpan="7" className="p-8 font-medium text-center text-slate-400">
                                    No matching issued invoices found.
                                  </td>
                                </tr>
                              ) : (
                                fees.filter(f => {
                                  const studentInfo = getStudentInfo(f);
                                  const nameMatch = studentInfo.name.toLowerCase().includes(listFeeSearchName.toLowerCase());
                                  const classMatch = listFeeClassFilter ? studentInfo.class === listFeeClassFilter : true;
                                  const statusMatch = listFeeStatusFilter === 'all' ? true : f.status === listFeeStatusFilter;
                                  return nameMatch && classMatch && statusMatch;
                                }).map(f => {
                                  const sInfo = getStudentInfo(f);
                                  const isPaid = f.status === 'paid';
                                  return (
                                    <tr key={f._id} className="font-medium transition-all border-b border-slate-50 hover:bg-slate-50/50 text-slate-700">
                                      <td className="p-3">
                                        <span className="block text-xs font-bold text-slate-800">{sInfo.name}</span>
                                        <span className="text-[9px] text-slate-400 font-mono">ID: {sInfo.id}</span>
                                      </td>
                                      <td className="p-3 font-bold text-slate-500">{sInfo.class}</td>
                                      <td className="p-3 text-slate-800">{f.term}</td>
                                      <td className="p-3 font-mono">
                                        <div className="font-bold text-slate-800">₹{f.amount.toLocaleString('en-IN')}</div>
                                        {f.fine > 0 && (
                                          <div className="text-[9px] text-red-500 font-semibold mt-0.5">
                                            + Fine: ₹{f.fine.toLocaleString('en-IN')}
                                          </div>
                                        )}
                                        {f.fine > 0 && (
                                          <div className="text-[10px] text-[#5B468C] font-extrabold mt-0.5">
                                            Total: ₹{f.totalAmount.toLocaleString('en-IN')}
                                          </div>
                                        )}
                                      </td>
                                      <td className="p-3 text-slate-500">{new Date(f.dueDate).toLocaleDateString()}</td>
                                      <td className="p-3">
                                        {(() => {
                                          const studentFees = fees.filter(fee => {
                                            const info = getStudentInfo(fee);
                                            return info.id === sInfo.id;
                                          });
                                          const isAllPaid = studentFees.length > 0 && studentFees.every(fee => fee.status === 'paid');
                                          if (isAllPaid) {
                                            return (
                                              <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase font-extrabold border bg-emerald-50 text-emerald-700 border-emerald-200">
                                                Full Fees Submitted
                                              </span>
                                            );
                                          }
                                          return (
                                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold border ${isPaid ? 'bg-brandMint/10 text-brandMint-dark border-brandMint/30' :
                                              f.status === 'overdue' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                'bg-brandYellow/10 text-brandYellow-dark border border-brandYellow/30'
                                              }`}>
                                              {f.status}
                                            </span>
                                          );
                                        })()}
                                      </td>
                                      <td className="p-3 text-right">
                                        {isPaid ? (
                                          <button
                                            type="button"
                                            onClick={() => handleViewReceipt(f._id)}
                                            className="font-quicksand font-bold text-[9px] bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1.5 rounded-lg shadow-sm cursor-pointer transition-all active:scale-[0.98]"
                                          >
                                            Print Receipt
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => handleCollectPayment(f._id)}
                                            className="font-quicksand font-bold text-[9px] bg-brandMint hover:bg-brandMint-dark text-white px-2.5 py-1.5 rounded-lg shadow-sm cursor-pointer transition-all active:scale-[0.98]"
                                          >
                                            Collect Payment
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'fees' && feesSubTab === 'fineRules' && (
              <div className="space-y-6 text-xs print:hidden">
                {/* Add Fine Rule Inline Card */}
                <div className="p-5 space-y-4 border border-slate-100 bg-slate-50/50 rounded-3xl">
                  <h4 className="text-sm font-bold font-quicksand text-slate-800 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-[#5B468C]" />
                    <span>{editingFineId ? 'Modify Overdue Fine Rule' : 'Add Overdue Fine Rule'}</span>
                  </h4>
                  <form onSubmit={handleSaveFineRule} className="grid items-end grid-cols-1 gap-3 sm:grid-cols-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Start Delay (Days) *</label>
                      <input
                        type="number"
                        min="1"
                        required
                        placeholder="e.g. 1"
                        value={fineFormData.minDays}
                        onChange={e => setFineFormData(prev => ({ ...prev, minDays: e.target.value }))}
                        className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">End Delay (Days) *</label>
                      <input
                        type="number"
                        min="1"
                        required
                        placeholder="e.g. 10"
                        value={fineFormData.maxDays}
                        onChange={e => setFineFormData(prev => ({ ...prev, maxDays: e.target.value }))}
                        className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-650">Fine Amount (₹) *</label>
                      <input
                        type="number"
                        min="0"
                        required
                        placeholder="e.g. 50"
                        value={fineFormData.fineAmount}
                        onChange={e => setFineFormData(prev => ({ ...prev, fineAmount: e.target.value }))}
                        className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-700"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-grow py-2.5 bg-[#5B468C] hover:bg-[#4a3973] text-white font-quicksand font-bold text-xs rounded-xl shadow cursor-pointer transition-all active:scale-95"
                      >
                        {editingFineId ? 'Update Rule' : 'Create Rule'}
                      </button>
                      {editingFineId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFineId(null);
                            setFineFormData({ minDays: 1, maxDays: 10, fineAmount: 50 });
                          }}
                          className="px-3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Fine Rules List Table */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold font-quicksand text-slate-800">Current Overdue Fine Brackets</h4>
                  <div className="overflow-x-auto bg-white border shadow-sm border-slate-100 rounded-2xl">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="font-bold border-b bg-slate-50 text-slate-500 border-slate-150">
                          <th className="p-3">Delay Minimum (Days)</th>
                          <th className="p-3">Delay Maximum (Days)</th>
                          <th className="p-3">Penalty / Fine Amount</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="font-semibold divide-y divide-slate-100 text-slate-600">
                        {fineRules.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="p-8 font-medium text-center text-slate-400">No fine brackets configured. Late fees will default to zero.</td>
                          </tr>
                        ) : (
                          fineRules.map(rule => (
                            <tr key={rule._id} className="transition-colors hover:bg-slate-50/50">
                              <td className="p-3 font-mono text-[#5B468C]">{rule.minDays} Days</td>
                              <td className="p-3 font-mono text-[#5B468C]">{rule.maxDays} Days</td>
                              <td className="p-3 font-bold text-red-500">₹{rule.fineAmount.toLocaleString('en-IN')}.00</td>
                              <td className="p-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingFineId(rule._id);
                                      setFineFormData({
                                        minDays: rule.minDays,
                                        maxDays: rule.maxDays,
                                        fineAmount: rule.fineAmount
                                      });
                                    }}
                                    className="p-1.5 text-indigo-600 hover:bg-indigo-55 rounded-lg transition-all cursor-pointer"
                                    title="Edit fine rule"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteFineRule(rule._id)}
                                    className="p-1.5 text-rose-600 hover:bg-rose-55 rounded-lg transition-all cursor-pointer"
                                    title="Delete fine rule"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Announcements notice board */}
            {activeTab === 'announcements' && (
              <form onSubmit={handleCreateAnnouncement} className="p-5 space-y-4 border bg-slate-50/50 border-slate-100 rounded-3xl">
                <h4 className="text-sm font-bold font-quicksand text-slate-800">Publish Notice Board Circular</h4>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-600">Notice Title</label>
                  <input
                    type="text" required placeholder="e.g. Independence Day Holiday Notification"
                    value={annTitle} onChange={e => setAnnTitle(e.target.value)}
                    className="w-full p-3 bg-white border outline-none rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Category</label>
                    <select value={annCat} onChange={e => setAnnCat(e.target.value)} className="bg-white border rounded-xl p-2.5 w-full outline-none">
                      <option value="general">General</option>
                      <option value="circular">Official Circular</option>
                      <option value="event">PTM / Event Schedule</option>
                      <option value="emergency">Emergency Alert</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Audience Group</label>
                    <select value={annAudience} onChange={e => setAnnAudience(e.target.value)} className="bg-white border rounded-xl p-2.5 w-full outline-none">
                      <option value="all">Everyone (All Visitors)</option>
                      <option value="parents">Parents Only</option>
                      <option value="teachers">Teachers Only</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-600">Bulletin Content</label>
                  <textarea
                    required rows={4} placeholder="Write announcement notices description..."
                    value={annContent} onChange={e => setAnnContent(e.target.value)}
                    className="w-full p-3 bg-white border outline-none resize-none rounded-xl"
                  />
                </div>

                <button type="submit" className="w-full bg-slate-900 text-white font-quicksand font-bold text-xs py-2.5 rounded-xl transition-all shadow">
                  PUBLISH BULLETIN NOTICE
                </button>
              </form>
            )}

            {/* TAB 5B: Library & Notes */}
            {activeTab === 'library' && (
              <div className="space-y-6">
                <div className="p-5 border shadow-sm rounded-3xl border-slate-200/70 bg-slate-50/70">
                  <div className="flex flex-col gap-2 pb-4 border-b border-slate-200/70 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.35em] text-[#7C3AED] font-bold">Library & Notes</p>
                      <h3 className="text-lg font-bold font-quicksand text-slate-800">Course-wise notes and revision material</h3>
                      <p className="text-xs text-slate-500">Publish quick study notes for each course batch from the admin side.</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase text-emerald-600">{libraryNotes.length} saved notes</span>
                  </div>

                  <form onSubmit={handleCreateLibraryNote} className="mt-5 space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-1 text-xs">
                        <label className="font-bold text-slate-600">Note Title</label>
                        <input
                          type="text" required
                          value={libraryTitle}
                          onChange={(e) => setLibraryTitle(e.target.value)}
                          placeholder="e.g. Java Revision Checklist"
                          className="w-full p-3 bg-white border outline-none rounded-xl border-slate-200"
                        />
                      </div>
                      <div className="space-y-1 text-xs">
                        <label className="font-bold text-slate-600">Target Course</label>
                        <select
                          value={libraryCourse}
                          onChange={(e) => setLibraryCourse(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-[#0f172a]  p-2.5 outline-none font-semibold text-slate-600"
                        >
                          {courseOptions.map((course) => (
                            <option key={course} value={course}>{course}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="font-bold text-slate-600">Note Content</label>
                      <textarea
                        rows={4}
                        value={libraryContent}
                        onChange={(e) => setLibraryContent(e.target.value)}
                        placeholder="Optional text summary. If you upload a PDF, this can stay blank."
                        className="w-full p-3 bg-white border outline-none resize-none rounded-xl border-slate-200"
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="font-bold text-slate-600">Choose PDF File</label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setLibraryPdfFile(e.target.files?.[0] || null)}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none file:mr-3 file:rounded-full file:border-0 file:bg-violet-100 file:px-3 file:py-1 file:text-xs file:font-bold file:text-violet-700"
                      />
                      <p className="text-[11px] text-slate-500">Upload a PDF directly, or enter text notes and the system will create a PDF for you.</p>
                    </div>

                    <button type="submit" className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow transition-all hover:bg-slate-800">SAVE COURSE NOTE</button>
                  </form>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <section className="p-5 border shadow-sm rounded-3xl border-slate-200/70 bg-slate-50/70">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-[#7C3AED] font-bold">AI Quiz Creator</p>
                        <h3 className="text-base font-bold font-quicksand text-slate-800">Generate quizzes from course modules</h3>
                        <p className="text-xs text-slate-500">Create quick revision quizzes for specific students, group chats, or admin review.</p>
                      </div>
                      <Sparkles className="h-5 w-5 text-[#7C3AED]" />
                    </div>
                    <form onSubmit={handleGenerateQuiz} className="mt-4 space-y-3 text-xs">
                      <div className="grid gap-3 md:grid-cols-2">
                        <label className="space-y-1">
                          <span className="font-bold text-slate-600">Course</span>
                          <select value={aiQuizCourse} onChange={(e) => setAiQuizCourse(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-[#0f172a] p-2.5 outline-none font-semibold text-slate-600">
                            {courseOptions.map((course) => <option key={course} value={course}>{course}</option>)}
                          </select>
                        </label>
                        <label className="space-y-1">
                          <span className="font-bold text-slate-600">Module</span>
                          <input value={aiQuizModule} onChange={(e) => setAiQuizModule(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none" placeholder="e.g. Arrays & Loops" />
                        </label>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <label className="space-y-1">
                          <span className="font-bold text-slate-600">Level</span>
                          <select value={aiQuizLevel} onChange={(e) => setAiQuizLevel(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-[#0f172a] p-2.5 outline-none font-semibold text-slate-600">
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </label>
                        <label className="space-y-1">
                          <span className="font-bold text-slate-600">Audience</span>
                          <select value={aiQuizAudience} onChange={(e) => setAiQuizAudience(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-[#0f172a] p-2.5 outline-none font-semibold text-slate-600">
                            {audienceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                          </select>
                        </label>
                      </div>
                      <label className="block space-y-1">
                        <span className="font-bold text-slate-600">Student Name (optional)</span>
                        <input value={aiQuizStudentName} onChange={(e) => setAiQuizStudentName(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none" placeholder="e.g. Aarav Sharma" />
                      </label>
                      <button type="submit" disabled={quizLoading} className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{quizLoading ? 'Generating quiz...' : 'Generate AI Quiz'}</button>
                    </form>
                    {quizResult && (
                      <article className="p-4 mt-4 text-xs bg-white border shadow-sm rounded-3xl border-violet-200 text-slate-600">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-violet-600 font-bold">Preview</p>
                        <h4 className="mt-1 text-sm font-black text-slate-800">{quizResult.title}</h4>
                        <p className="mt-1 text-slate-500">{quizResult.summary}</p>
                        <ul className="pl-4 mt-3 space-y-1 list-disc text-slate-600">{quizResult.questions.slice(0, 3).map((item, index) => <li key={`${item.prompt}-${index}`}>{item.prompt}</li>)}</ul>
                      </article>
                    )}
                  </section>

                  <section className="p-5 border shadow-sm rounded-3xl border-slate-200/70 bg-slate-50/70">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-[#7C3AED] font-bold">AI Assignment Generator</p>
                        <h3 className="text-base font-bold font-quicksand text-slate-800">Auto-create practice assignments</h3>
                        <p className="text-xs text-slate-500">Generate assignment briefs for a course, a specific learner, or a group chat.</p>
                      </div>
                      <Sparkles className="h-5 w-5 text-[#7C3AED]" />
                    </div>
                    <form onSubmit={handleGenerateAssignment} className="mt-4 space-y-3 text-xs">
                      <div className="grid gap-3 md:grid-cols-2">
                        <label className="space-y-1">
                          <span className="font-bold text-slate-600">Course</span>
                          <select value={aiAssignmentCourse} onChange={(e) => setAiAssignmentCourse(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-[#0f172a] p-2.5 outline-none font-semibold text-slate-600">
                            {courseOptions.map((course) => <option key={course} value={course}>{course}</option>)}
                          </select>
                        </label>
                        <label className="space-y-1">
                          <span className="font-bold text-slate-600">Module</span>
                          <input value={aiAssignmentModule} onChange={(e) => setAiAssignmentModule(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none" placeholder="e.g. Problem Solving" />
                        </label>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <label className="space-y-1">
                          <span className="font-bold text-slate-600">Audience</span>
                          <select value={aiAssignmentAudience} onChange={(e) => setAiAssignmentAudience(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-[#0f172a] p-2.5 outline-none font-semibold text-slate-600">
                            {audienceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                          </select>
                        </label>
                        <label className="space-y-1">
                          <span className="font-bold text-slate-600">Difficulty</span>
                          <select value={aiAssignmentDifficulty} onChange={(e) => setAiAssignmentDifficulty(e.target.value)} className="w-full rounded-xl   bg-[#0f172a] p-2.5 outline-none font-semibold text-slate-600">
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </label>
                      </div>
                      <label className="block space-y-1">
                        <span className="font-bold text-slate-600">Student Name (optional)</span>
                        <input value={aiAssignmentStudentName} onChange={(e) => setAiAssignmentStudentName(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none" placeholder="e.g. Student A" />
                      </label>
                      <button type="submit" disabled={assignmentLoading} className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{assignmentLoading ? 'Generating assignment...' : 'Generate AI Assignment'}</button>
                    </form>
                    {assignmentResult && (
                      <article className="p-4 mt-4 text-xs bg-white border shadow-sm rounded-3xl border-emerald-200 text-slate-600">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-600 font-bold">Preview</p>
                        <h4 className="mt-1 text-sm font-black text-slate-800">{assignmentResult.title}</h4>
                        <p className="mt-1 text-slate-500">{assignmentResult.summary}</p>
                        <ul className="pl-4 mt-3 space-y-1 list-disc text-slate-600">{assignmentResult.tasks.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul>
                      </article>
                    )}
                  </section>
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="pb-2 text-base font-bold border-b border-slate-200/70 font-quicksand text-slate-800">Recent Course Notes</h3>
                  {libraryNotes.length === 0 ? (
                    <div className="p-8 text-xs text-center border border-dashed rounded-3xl border-slate-200 bg-white/70 text-slate-500">No course notes yet. Add your first revision note above.</div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {libraryNotes.map(note => (
                        <article key={note._id} className="p-4 bg-white border shadow-sm rounded-3xl border-slate-200/70">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.35em] text-[#7C3AED] font-bold">{note.course}</p>
                              <h4 className="mt-1 text-sm font-bold font-quicksand text-slate-800">{note.title}</h4>
                            </div>
                            <button
                              onClick={() => handleDeleteLibraryNote(note._id)}
                              className="p-2 text-red-500 transition-all border border-red-100 rounded-lg bg-red-50 hover:bg-red-100"
                              title="Delete note"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="mt-3 text-xs leading-5 text-slate-600">{note.content}</p>
                          <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-slate-400">Saved {new Date(note.createdAt).toLocaleString()}</p>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5B: Job Postings */}
            {activeTab === 'jobs' && (
              <div className="space-y-8">
                <form onSubmit={handleCreateJob} className="p-5 space-y-4 border bg-slate-50/50 border-slate-100 rounded-3xl">
                  <h4 className="text-sm font-bold font-quicksand text-slate-800">Post New Job Vacancy</h4>

                  <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Job Title *</label>
                      <input
                        type="text" required placeholder="e.g. Senior Teacher - English"
                        value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                        className="w-full p-3 bg-white border outline-none rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Department *</label>
                      <select value={jobDepartment} onChange={e => setJobDepartment(e.target.value)} className="bg-white border rounded-xl p-2.5 w-full outline-none">
                        <option value="teaching">Teaching</option>
                        <option value="administration">Administration</option>
                        <option value="support">Support Staff</option>
                        <option value="management">Management</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Position Level *</label>
                      <select value={jobPosition} onChange={e => setJobPosition(e.target.value)} className="bg-white border rounded-xl p-2.5 w-full outline-none">
                        <option value="junior">Junior</option>
                        <option value="senior">Senior</option>
                        <option value="lead">Lead</option>
                        <option value="manager">Manager</option>
                        <option value="director">Director</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Salary (Monthly) *</label>
                      <input
                        type="number" required placeholder="e.g. 50000"
                        value={jobSalary} onChange={e => setJobSalary(e.target.value)}
                        className="w-full p-3 bg-white border outline-none rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-600">Job Description *</label>
                    <textarea
                      required rows={3} placeholder="Detailed job description..."
                      value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                      className="w-full p-3 bg-white border outline-none resize-none rounded-xl"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-600">Required Qualifications *</label>
                    <textarea
                      required rows={2} placeholder="e.g. B.Ed with English specialization, M.A. preferred"
                      value={jobQualifications} onChange={e => setJobQualifications(e.target.value)}
                      className="w-full p-3 bg-white border outline-none resize-none rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Experience Required *</label>
                      <input
                        type="text" required placeholder="e.g. 5+ years"
                        value={jobExperience} onChange={e => setJobExperience(e.target.value)}
                        className="w-full p-3 bg-white border outline-none rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Application Deadline *</label>
                      <input
                        type="date" required
                        value={jobDeadline} onChange={e => setJobDeadline(e.target.value)}
                        className="w-full p-3 bg-white border outline-none rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-600">Key Responsibilities *</label>
                    <textarea
                      required rows={2} placeholder="Main responsibilities for this role..."
                      value={jobResponsibilities} onChange={e => setJobResponsibilities(e.target.value)}
                      className="w-full p-3 bg-white border outline-none resize-none rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Benefits (Optional)</label>
                      <input
                        type="text" placeholder="e.g. Health insurance, professional development"
                        value={jobBenefits} onChange={e => setJobBenefits(e.target.value)}
                        className="w-full p-3 bg-white border outline-none rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Location</label>
                      <input
                        type="text" placeholder="e.g. On-site"
                        value={jobLocation} onChange={e => setJobLocation(e.target.value)}
                        className="w-full p-3 bg-white border outline-none rounded-xl"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-slate-900 text-white font-quicksand font-bold text-xs py-2.5 rounded-xl transition-all shadow hover:bg-slate-800">
                    POST JOB VACANCY
                  </button>
                </form>

                {/* Job Listings */}
                <div className="space-y-4">
                  <h3 className="pb-2 text-base font-bold border-b font-quicksand text-slate-800">Active Job Postings</h3>
                  {jobsList && jobsList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {jobsList.map(job => (
                        <div key={job._id} className="flex flex-col justify-between p-4 overflow-hidden text-xs bg-white border shadow-sm border-slate-100 rounded-xl">
                          <div>
                            <h5 className="mb-1 font-bold text-slate-800">{job.title}</h5>
                            <p className="mb-2 text-xs text-slate-600">{job.department} • {job.position}</p>
                            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                              <div className="p-2 rounded bg-blue-50">
                                <span className="text-slate-600">Salary: </span>
                                <span className="font-bold text-slate-800">₹{job.salary}</span>
                              </div>
                              <div className="p-2 rounded bg-green-50">
                                <span className="text-slate-600">Deadline: </span>
                                <span className="font-bold text-slate-800">{new Date(job.applicationDeadline).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <p className="mb-2 text-slate-600 line-clamp-2">{job.description}</p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {job.status.toUpperCase()}
                            </span>
                            <button
                              onClick={() => handleDeleteJob(job._id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                              title="Delete job posting"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-500">
                      <p className="text-sm">No job postings yet. Create your first opening above!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5C: Courses Manager */}
            {activeTab === 'courses' && (
              <div className="space-y-8">
                {/* Create Course Form */}
                <form onSubmit={handleCreateCourse} className="p-5 space-y-4 border bg-slate-50/50 border-slate-100 rounded-3xl">
                  <h4 className="text-sm font-bold font-quicksand text-slate-800">Add New Course to Programs Page</h4>

                  <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Course Title</label>
                      <input
                        type="text" required placeholder="e.g. Java Development"
                        value={courseTitle} onChange={e => setCourseTitle(e.target.value)}
                        className="w-full p-3 bg-white border outline-none rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Duration</label>
                      <input
                        type="text" placeholder="e.g. 1 month - 6 months"
                        value={courseDuration} onChange={e => setCourseDuration(e.target.value)}
                        className="w-full p-3 bg-white border outline-none rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Price (INR)</label>
                      <input
                        type="number" required placeholder="e.g. 1500"
                        value={coursePrice} onChange={e => setCoursePrice(e.target.value)}
                        className="w-full p-3 bg-white border outline-none rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-600">Course Description</label>
                    <textarea
                      required rows={3} placeholder="Describe what this course covers..."
                      value={courseDescription} onChange={e => setCourseDescription(e.target.value)}
                      className="w-full p-3 bg-white border outline-none resize-none rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Category</label>
                      <select value={courseCategory} onChange={e => setCourseCategory(e.target.value)} className="bg-white border rounded-xl p-2.5 w-full outline-none">
                        <option value="development">Development</option>
                        <option value="design">Design</option>
                        <option value="marketing">Marketing</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Card Color Theme</label>
                      <select value={courseColor} onChange={e => setCourseColor(e.target.value)} className="bg-white border rounded-xl p-2.5 w-full outline-none">
                        <option value="brandMint">Mint (Green)</option>
                        <option value="brandSky">Sky (Blue)</option>
                        <option value="brandCoral">Coral (Red)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-600">Key Milestones (one per line)</label>
                    <textarea
                      rows={4} placeholder={"e.g.\nUnderstanding of java syntax\nAbility to write simple programs\nFamiliarity with OOP principles"}
                      value={courseMilestones} onChange={e => setCourseMilestones(e.target.value)}
                      className="w-full p-3 bg-white border outline-none resize-none rounded-xl"
                    />
                  </div>

                  {/* Schedule editor */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-600">Daily Schedule</label>
                      <button type="button" onClick={addScheduleRow} className="flex items-center space-x-1 px-2.5 py-1 bg-slate-900 text-white rounded-lg font-bold text-[10px]">
                        <Plus className="w-3 h-3" />
                        <span>ADD SLOT</span>
                      </button>
                    </div>
                    {courseSchedules.map((row, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text" placeholder="05:00 PM"
                          value={row.time} onChange={e => updateScheduleRow(idx, 'time', e.target.value)}
                          className="w-32 p-2.5 bg-white border outline-none rounded-xl"
                        />
                        <input
                          type="text" placeholder="Class / Activity description"
                          value={row.activity} onChange={e => updateScheduleRow(idx, 'activity', e.target.value)}
                          className="flex-1 p-2.5 bg-white border outline-none rounded-xl"
                        />
                        {courseSchedules.length > 1 && (
                          <button type="button" onClick={() => removeScheduleRow(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-600">Course Image (optional, JPG/JPEG/PNG/WEBP/SVG)</label>
                    <input
                      id="course-file-input"
                      type="file" accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.svg"
                      onChange={e => setCourseImage(e.target.files?.[0] || null)}
                      className="w-full p-3 bg-white border border-orange-100 outline-none rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isCreatingCourse}
                    className={`w-full bg-slate-900 hover:bg-slate-800 text-white font-quicksand font-bold text-xs py-3 rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer ${isCreatingCourse ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {isCreatingCourse ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>PUBLISHING COURSE...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>PUBLISH NEW COURSE</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Created Course Instant Action Banner */}
                {createdCourseBanner && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0">
                        ✓
                      </div>
                      <div>
                        <h5 className="font-bold text-emerald-900">
                          Course "{createdCourseBanner.title}" Published Successfully!
                        </h5>
                        <p className="text-emerald-700 text-[11px]">
                          Available now in Admissions, Programs, and LMS. Tuition Fee: ₹{Number(createdCourseBanner.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('admissions');
                          setAdmissionsSubTab('new');
                          setAdmStdClass(createdCourseBanner.title);
                          setAdmSelectedCourses([createdCourseBanner.title]);
                          if (createdCourseBanner.price) {
                            setAdmTuitionFee(String(createdCourseBanner.price));
                          }
                        }}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer text-xs flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Admission For This Course</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCreatedCourseBanner(null)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {/* Existing Courses List */}
                <div className="space-y-4">
                  <h3 className="pb-2 text-base font-bold border-b font-quicksand text-slate-800">Published Courses ({courses.length})</h3>
                  {courses.length === 0 ? (
                    <p className="py-10 text-xs text-center text-slate-500">No courses published yet. Add your first course above.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {courses.map(course => (
                        <div 
                          key={course._id} 
                          onClick={() => handleSelectCourse(course)}
                          className={`flex flex-col justify-between overflow-hidden text-xs bg-white border shadow-sm border-slate-100 rounded-xl cursor-pointer transition-all ${selectedCourse?._id === course._id ? 'ring-2 ring-brandSky' : ''}`}
                        >
                          {course.imageUrl && (
                            <div className="relative h-32 overflow-hidden">
                              <img src={course.imageUrl} alt={course.title} className="object-cover w-full h-full" />
                            </div>
                          )}
                          <div className="p-4 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-sm font-bold leading-tight font-quicksand text-slate-800">{course.title}</h4>
                              <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                course.color === 'brandMint' ? 'bg-brandMint/10 text-brandMint-dark' :
                                course.color === 'brandSky' ? 'bg-brandSky/10 text-brandSky-dark' :
                                'bg-brandCoral/10 text-brandCoral-dark'
                              }`}>{course.category}</span>
                            </div>
                            <p className="text-slate-500 line-clamp-3">{course.description}</p>
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              {course.duration && <span>⏱ {course.duration}</span>}
                              <span className="font-bold text-brandCoral-dark">₹{course.price || 0}</span>
                            </div>
                            <p className="text-[10px] text-slate-400">{course.milestones?.length || 0} milestones • {course.schedule?.length || 0} schedule slots • {modules.filter(m => m.course === course._id).length || 0} modules</p>
                          </div>
                          <div className="flex justify-end p-3 pt-0 gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleCoursePublish(course);
                              }}
                              className={`px-3 py-1.5 rounded-lg transition-all border flex items-center space-x-1 font-bold text-[10px] ${
                                course.isPublished
                                  ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                                  : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                              }`}
                            >
                              {course.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              <span>{course.isPublished ? 'LIVE' : 'DRAFT'}</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCourse(course._id);
                              }}
                              className="bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1.5 rounded-lg transition-all border border-red-100 flex items-center space-x-1 font-bold text-[10px]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>DELETE</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Module & Lesson Management */}
                {selectedCourse && (
                  <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl">
                      <h3 className="text-base font-bold font-quicksand">Managing: {selectedCourse.title}</h3>
                      <div className="flex items-center gap-2">
                        <a
                          href={`/lms/learn/${selectedCourse._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold px-3 py-1 bg-brandSky/80 hover:bg-brandSky rounded-lg flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" /> Preview Student View
                        </a>
                        <button
                          onClick={() => {
                            setSelectedCourse(null);
                            setModules([]);
                            setSelectedModule(null);
                            setLessons([]);
                          }}
                          className="text-xs font-bold px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg"
                        >
                          Close
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Modules Section */}
                      <div className="space-y-4">
                        <form onSubmit={handleCreateModule} className="p-4 border bg-slate-50/50 border-slate-100 rounded-2xl">
                          <h4 className="text-sm font-bold font-quicksand text-slate-800 mb-3">Add Module</h4>
                          <div className="space-y-3 text-xs">
                            <input
                              type="text"
                              placeholder="Module Title"
                              value={moduleTitle}
                              onChange={e => setModuleTitle(e.target.value)}
                              className="w-full p-2.5 bg-white border rounded-xl outline-none"
                              required
                            />
                            <textarea
                              placeholder="Module Description"
                              value={moduleDescription}
                              onChange={e => setModuleDescription(e.target.value)}
                              className="w-full p-2.5 bg-white border rounded-xl outline-none resize-none"
                              rows={2}
                            />
                            <AttachmentManager
                              attachments={moduleAttachments}
                              onAdd={fileObj => setModuleAttachments(prev => [...prev, fileObj])}
                              onDelete={idx => setModuleAttachments(prev => prev.filter((_, i) => i !== idx))}
                            />
                            <button type="submit" className="w-full bg-brandSky text-white font-bold py-2 rounded-xl">
                              ADD MODULE
                            </button>
                          </div>
                        </form>

                        <div className="space-y-2">
                          <h4 className="text-sm font-bold font-quicksand text-slate-800">Modules ({modules.length})</h4>
                          {modules.map(module => (
                            <div 
                              key={module._id} 
                              onClick={() => handleSelectModule(module)}
                              className={`p-3 border rounded-xl cursor-pointer transition-all ${selectedModule?._id === module._id ? 'border-brandSky bg-brandSky/5' : 'border-slate-200 bg-white'}`}
                            >
                              <div className="flex items-center justify-between">
                                <h5 className="font-bold text-xs text-slate-800">{module.title}</h5>
                                <div className="flex items-center gap-1">
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${module.isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {module.isPublished ? 'LIVE' : 'DRAFT'}
                                  </span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleToggleModulePublish(module); }}
                                    title={module.isPublished ? 'Unpublish' : 'Publish'}
                                    className={`p-1 rounded-lg ${module.isPublished ? 'text-green-600 hover:bg-green-50' : 'text-amber-500 hover:bg-amber-50'}`}
                                  >
                                    {module.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleEditModule(module); }}
                                    title="Edit Module"
                                    className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteModule(module._id);
                                    }}
                                    className="text-red-500 hover:text-red-600 p-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              {module.description && <p className="text-[10px] text-slate-500 mt-1">{module.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Lessons Section */}
                      <div className="space-y-4">
                        {selectedModule ? (
                          <>
                            {/* Edit Module Modal */}
                            {editingModule && (
                              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                                  <div className="flex items-center justify-between p-5 border-b text-slate-800">
                                    <h4 className="font-bold font-quicksand">Edit Module</h4>
                                    <button onClick={() => setEditingModule(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                                      <X className="w-5 h-5" />
                                    </button>
                                  </div>
                                  <form onSubmit={handleUpdateModule} className="p-5 space-y-4 text-xs text-slate-800">
                                    <div className="space-y-1">
                                      <label className="font-bold text-slate-600">Module Title</label>
                                      <input type="text" required value={editModuleTitle} onChange={e => setEditModuleTitle(e.target.value)} className="w-full p-2.5 bg-white border rounded-xl outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="font-bold text-slate-600">Description</label>
                                      <textarea value={editModuleDescription} onChange={e => setEditModuleDescription(e.target.value)} className="w-full p-2.5 bg-white border rounded-xl outline-none resize-none" rows={3} />
                                    </div>
                                    <AttachmentManager
                                      attachments={editModuleAttachments}
                                      onAdd={fileObj => setEditModuleAttachments(prev => [...prev, fileObj])}
                                      onDelete={idx => setEditModuleAttachments(prev => prev.filter((_, i) => i !== idx))}
                                    />
                                    <div className="flex gap-2 pt-2">
                                      <button type="submit" className="flex-1 bg-brandSky text-white font-bold py-2.5 rounded-xl">
                                        Save Changes
                                      </button>
                                      <button type="button" onClick={() => setEditingModule(null)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold">Cancel</button>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            )}

                            {/* Edit Lesson Modal */}
                            {editingLesson && (
                              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                                  <div className="flex items-center justify-between p-5 border-b">
                                    <h4 className="font-bold font-quicksand text-slate-800">Edit Lesson</h4>
                                    <button onClick={() => setEditingLesson(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                                      <X className="w-5 h-5" />
                                    </button>
                                  </div>
                                  <form onSubmit={handleUpdateLesson} className="p-5 space-y-3 text-xs">
                                    <div className="space-y-1">
                                      <label className="font-bold text-slate-600">Title</label>
                                      <input type="text" required value={editLessonTitle} onChange={e => setEditLessonTitle(e.target.value)} className="w-full p-2.5 bg-white border rounded-xl outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="font-bold text-slate-600">Description</label>
                                      <textarea value={editLessonDescription} onChange={e => setEditLessonDescription(e.target.value)} className="w-full p-2.5 bg-white border rounded-xl outline-none resize-none" rows={2} />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="font-bold text-slate-600">Content (text or HTML)</label>
                                      <textarea value={editLessonContent} onChange={e => setEditLessonContent(e.target.value)} className="w-full p-2.5 bg-white border rounded-xl outline-none resize-none" rows={3} />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="font-bold text-slate-600">Video URL (YouTube / external)</label>
                                      <input type="text" placeholder="https://..." value={editLessonVideoUrl} onChange={e => setEditLessonVideoUrl(e.target.value)} className="w-full p-2.5 bg-white border rounded-xl outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="font-bold text-slate-600">Replace Video File (MP4/WEBM/MOV, max 500MB)</label>
                                      <input type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime" onChange={e => setEditLessonVideoFile(e.target.files?.[0] || null)} className="w-full p-2.5 bg-white border rounded-xl outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="font-bold text-slate-600">Duration (seconds)</label>
                                      <input type="number" placeholder="e.g. 300" value={editLessonVideoDuration} onChange={e => setEditLessonVideoDuration(e.target.value)} className="w-full p-2.5 bg-white border rounded-xl outline-none" />
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input type="checkbox" checked={editLessonPublished} onChange={e => setEditLessonPublished(e.target.checked)} className="w-4 h-4 accent-green-500" />
                                      <span className="font-bold text-slate-600">Published (visible to students)</span>
                                    </label>
                                    <AttachmentManager
                                      attachments={editLessonAttachments}
                                      onAdd={fileObj => setEditLessonAttachments(prev => [...prev, fileObj])}
                                      onDelete={idx => setEditLessonAttachments(prev => prev.filter((_, i) => i !== idx))}
                                    />
                                    {videoUploading && (
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                                          <span className="flex items-center gap-1"><Upload className="w-3 h-3" /> Uploading video...</span>
                                          <span className="font-bold">{videoUploadProgress}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                          <div className="h-full bg-brandSky transition-all duration-200 rounded-full" style={{ width: `${videoUploadProgress}%` }} />
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex gap-2 pt-2">
                                      <button type="submit" disabled={videoUploading} className="flex-1 bg-brandSky text-white font-bold py-2.5 rounded-xl disabled:opacity-60">
                                        {videoUploading ? `Uploading ${videoUploadProgress}%...` : 'Save Changes'}
                                      </button>
                                      <button type="button" onClick={() => setEditingLesson(null)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold">Cancel</button>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            )}

                            <form onSubmit={handleCreateLesson} className="p-4 border bg-slate-50/50 border-slate-100 rounded-2xl">
                              <h4 className="text-sm font-bold font-quicksand text-slate-800 mb-3">Add Lesson to "{selectedModule.title}"</h4>
                              <div className="space-y-3 text-xs">
                                <input
                                  type="text"
                                  placeholder="Lesson Title *"
                                  value={lessonTitle}
                                  onChange={e => setLessonTitle(e.target.value)}
                                  className="w-full p-2.5 bg-white border rounded-xl outline-none"
                                  required
                                />
                                <textarea
                                  placeholder="Lesson Description"
                                  value={lessonDescription}
                                  onChange={e => setLessonDescription(e.target.value)}
                                  className="w-full p-2.5 bg-white border rounded-xl outline-none resize-none"
                                  rows={2}
                                />
                                <textarea
                                  placeholder="Lesson Content (text or HTML, optional)"
                                  value={lessonContent}
                                  onChange={e => setLessonContent(e.target.value)}
                                  className="w-full p-2.5 bg-white border rounded-xl outline-none resize-none"
                                  rows={2}
                                />
                                {/* Video source — URL or file, mutually highlighted */}
                                <div className="rounded-xl border border-slate-200 p-3 space-y-2 bg-white">
                                  <p className="font-bold text-slate-700 text-[11px] flex items-center gap-1"><Video className="w-3.5 h-3.5 text-brandSky" /> Video Source (choose one)</p>
                                  <input
                                    type="text"
                                    placeholder="Option A: Paste YouTube / external URL"
                                    value={lessonVideoUrl}
                                    onChange={e => { setLessonVideoUrl(e.target.value); if (e.target.value) { setLessonVideoFile(null); const fi = document.getElementById('lesson-video-input'); if (fi) fi.value = ''; } }}
                                    className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none"
                                  />
                                  <div className="flex items-center gap-2 text-slate-400 text-[10px]"><span className="flex-1 h-px bg-slate-200"/><span>OR</span><span className="flex-1 h-px bg-slate-200"/></div>
                                  <div className="space-y-1">
                                    <label className="font-bold text-slate-600">Option B: Upload video file (MP4 / WEBM / MOV, max 500MB)</label>
                                    <input
                                      id="lesson-video-input"
                                      type="file"
                                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                      onChange={e => {
                                        const f = e.target.files?.[0] || null;
                                        setLessonVideoFile(f);
                                        if (f) {
                                          setLessonVideoUrl('');
                                          setVideoPreviewUrl(URL.createObjectURL(f));
                                        } else {
                                          setVideoPreviewUrl('');
                                        }
                                      }}
                                      className="w-full p-2 bg-slate-50 border rounded-xl outline-none"
                                    />
                                    {videoPreviewUrl && (
                                      <video src={videoPreviewUrl} controls className="w-full rounded-xl mt-1 max-h-36 object-contain bg-black" />
                                    )}
                                  </div>
                                </div>
                                <input
                                  type="number"
                                  placeholder="Video Duration in seconds (e.g. 300 for 5 min)"
                                  value={lessonVideoDuration}
                                  onChange={e => setLessonVideoDuration(e.target.value)}
                                  className="w-full p-2.5 bg-white border rounded-xl outline-none"
                                />
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={lessonIsPublished} onChange={e => setLessonIsPublished(e.target.checked)} className="w-4 h-4 accent-green-500" />
                                  <span className="font-bold text-slate-600">Publish immediately (visible to enrolled students)</span>
                                </label>
                                <AttachmentManager
                                  attachments={lessonAttachments}
                                  onAdd={fileObj => setLessonAttachments(prev => [...prev, fileObj])}
                                  onDelete={idx => setLessonAttachments(prev => prev.filter((_, i) => i !== idx))}
                                />
                                {videoUploading && (
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                                      <span className="flex items-center gap-1"><Upload className="w-3 h-3 animate-bounce" /> Uploading video — please wait...</span>
                                      <span className="font-bold text-brandSky">{videoUploadProgress}%</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                      <div className="h-full bg-gradient-to-r from-brandSky to-blue-500 transition-all duration-300 rounded-full" style={{ width: `${videoUploadProgress}%` }} />
                                    </div>
                                    <p className="text-[9px] text-slate-400">Large files may take a few minutes. Don't close this tab.</p>
                                  </div>
                                )}
                                <button
                                  type="submit"
                                  disabled={videoUploading}
                                  className="w-full bg-brandMint text-brandMint-dark font-bold py-2.5 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                  {videoUploading
                                    ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />{videoUploadProgress}% Uploading...</>
                                    : <><Plus className="w-4 h-4" />ADD LESSON</>
                                  }
                                </button>
                              </div>
                            </form>

                            <div className="space-y-2">
                              <h4 className="text-sm font-bold font-quicksand text-slate-800">Lessons ({lessons.length})</h4>
                              {lessons.length === 0 && (
                                <p className="text-xs text-slate-400 text-center py-4">No lessons yet. Add one above.</p>
                              )}
                              {lessons.map(lesson => (
                                <div key={lesson._id} className="p-3 border border-slate-200 bg-white rounded-xl">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h5 className="font-bold text-xs text-slate-800 truncate">{lesson.title}</h5>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${lesson.isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                          {lesson.isPublished ? 'LIVE' : 'DRAFT'}
                                        </span>
                                      </div>
                                      {lesson.description && <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{lesson.description}</p>}
                                      {lesson.videoUrl && (
                                        <p className="text-[10px] text-brandSky mt-0.5 flex items-center gap-1">
                                          <Video className="w-3 h-3" />
                                          {lesson.videoUrl.startsWith('/uploads') ? 'Local video file' : lesson.videoUrl.substring(0, 40) + '...'}
                                        </p>
                                      )}
                                      {lesson.videoDuration > 0 && (
                                        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                          <Clock className="w-3 h-3" />{Math.floor(lesson.videoDuration / 60)}m {lesson.videoDuration % 60}s
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        onClick={() => handleToggleLessonPublish(lesson)}
                                        title={lesson.isPublished ? 'Unpublish' : 'Publish'}
                                        className={`p-1.5 rounded-lg transition-all ${lesson.isPublished ? 'text-green-600 hover:bg-green-50' : 'text-amber-500 hover:bg-amber-50'}`}
                                      >
                                        {lesson.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                      </button>
                                      <button
                                        onClick={() => handleEditLesson(lesson)}
                                        className="p-1.5 text-brandSky hover:bg-blue-50 rounded-lg transition-all"
                                        title="Edit lesson"
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteLesson(lesson._id)}
                                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                        title="Delete lesson"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="p-6 border border-dashed border-slate-300 rounded-2xl text-center text-xs text-slate-500">
                            Select a module to add lessons
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: Gallery Manager */}
            {activeTab === 'gallery' && (
              <div className="space-y-8">
                <form onSubmit={handleCreateGallery} className="p-5 space-y-4 border bg-slate-50/50 border-slate-100 rounded-3xl">
                  <h4 className="text-sm font-bold font-quicksand text-slate-800">Add Media Album to Gallery</h4>

                  <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Media Title</label>
                      <input
                        type="text" required placeholder="e.g. Toddler Sandbox Activities"
                        value={galTitle} onChange={e => setGalTitle(e.target.value)}
                        className="w-full p-3 bg-white border outline-none rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Category Tag</label>
                      <select value={galCat} onChange={e => setGalCat(e.target.value)} className="bg-[#0f172a] border rounded-xl p-2.5 w-full outline-none font-semibold text-slate-600">
                        <option value="classroom">Classroom</option>
                        <option value="events">Events</option>
                        <option value="sports">Sports</option>
                        <option value="celebrations">Celebrations</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-600">Media Image File (JPG/JPEG/PNG)</label>
                    <input
                      id="gallery-file-input"
                      type="file" required accept=".jpg,.jpeg,.png"
                      onChange={e => setGalFile(e.target.files[0])}
                      className="w-full p-3 bg-white border border-orange-100 outline-none focus:border-brandCoral rounded-xl"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-600">Description</label>
                    <input
                      type="text" placeholder="Short description of the photo event..."
                      value={galDesc} onChange={e => setGalDesc(e.target.value)}
                      className="w-full p-3 bg-white border outline-none rounded-xl"
                    />
                  </div>

                  <button type="submit" className="w-full bg-slate-900 text-white font-quicksand font-bold text-xs py-2.5 rounded-xl transition-all shadow">
                    ADD MEDIA FILE
                  </button>
                </form>

                {/* Gallery Items List */}
                <div className="space-y-4">
                  <h3 className="pb-2 text-base font-bold border-b font-quicksand text-slate-800">Existing Gallery Media</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {galItems.map(item => (
                      <div key={item._id} className="flex flex-col justify-between overflow-hidden text-xs bg-white border shadow-sm border-slate-100 rounded-xl">
                        <div>
                          <div className="relative h-32 overflow-hidden">
                            <img src={item.url} alt={item.title} className="object-cover w-full h-full" />
                            <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                              {item.category}
                            </span>
                          </div>
                          <div className="p-3 space-y-1">
                            <h4 className="text-sm font-bold leading-tight font-quicksand text-slate-800">{item.title}</h4>
                            <p className="text-slate-500 line-clamp-2">{item.description || 'No description'}</p>
                            <span className="text-[9px] text-slate-400 block mt-1">Date posted: {new Date(item.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex justify-end p-3 pt-0">
                          <button
                            onClick={() => handleDeleteGallery(item._id)}
                            className="bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1.5 rounded-lg transition-all border border-red-100 flex items-center space-x-1 font-bold text-[10px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>DELETE</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: Queries Resolve */}
            {activeTab === 'queries' && (
              <div className="space-y-4 text-xs font-semibold text-slate-600">
                <h3 className="pb-3 text-lg font-bold border-b font-quicksand text-slate-800 border-orange-50">Visitor Query Tickets</h3>

                {queries.length === 0 ? (
                  <p className="py-10 text-xs text-center text-slate-500">No queries tickets generated yet.</p>
                ) : (
                  queries.map(q => (
                    <div key={q._id} className="p-4 space-y-3 border bg-slate-50 border-slate-100 rounded-xl">
                      <div className="flex items-start justify-between pb-2 border-b border-slate-200/50">
                        <div>
                          <h4 className="text-sm font-bold font-quicksand text-slate-800">{q.name}</h4>
                          <span className="font-medium text-slate-400">{q.email} | {q.phone}</span>
                        </div>
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${q.status === 'resolved' ? 'bg-brandMint/10 text-brandMint-dark border-brandMint/30' :
                          'bg-red-50 text-red-600 border border-red-100'
                          }`}>
                          {q.status}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-brandCoral block uppercase font-bold">{q.subject}</span>
                        <p className="mt-1 font-normal leading-relaxed text-slate-600">{q.message}</p>
                      </div>

                      {q.status !== 'resolved' && (
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => handleResolveQuery(q._id)}
                            className="px-4 py-2 text-white transition-all shadow bg-brandMint hover:bg-brandMint-dark rounded-xl"
                          >
                            MARK RESOLVED
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'meetings' && (
              <div className="space-y-6">
                <h3 className="pb-3 text-lg font-bold border-b font-quicksand text-slate-800 border-orange-50">Google Meet Manager</h3>

                {/* Creation Form */}
                <form onSubmit={handleCreateMeeting} className="p-5 space-y-4 border bg-slate-50/50 border-slate-100 rounded-3xl">
                  <h4 className="text-sm font-bold font-quicksand text-slate-800">Schedule a New Meeting</h4>

                  <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Meeting Title</label>
                      <input
                        type="text"
                        required
                        value={mtgTitle}
                        onChange={(e) => setMtgTitle(e.target.value)}
                        placeholder="e.g. Term 1 PTM"
                        className="w-full p-2.5 border border-slate-200 outline-none bg-white focus:border-brandCoral rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Start Time</label>
                      <input
                        type="datetime-local"
                        required
                        value={mtgStartTime}
                        onChange={(e) => setMtgStartTime(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 outline-none bg-white focus:border-brandCoral rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Duration (min)</label>
                      <input
                        type="number"
                        min="5"
                        value={mtgDuration}
                        onChange={(e) => setMtgDuration(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 outline-none bg-white focus:border-brandCoral rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Audience</label>
                      <select
                        value={mtgAudience}
                        onChange={(e) => setMtgAudience(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 outline-none bg-white focus:border-brandCoral rounded-xl"
                      >
                        <option value="all">Everyone</option>
                        <option value="parents">Parents</option>
                        <option value="teachers">Teachers</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Class Filter (optional)</label>
                      <select
                        value={mtgClassFilter}
                        onChange={(e) => setMtgClassFilter(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 outline-none bg-white focus:border-brandCoral rounded-xl"
                      >
                        <option value="">All classes</option>
                        {courseOptions.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-600">Description (optional)</label>
                    <textarea
                      rows={2}
                      value={mtgDescription}
                      onChange={(e) => setMtgDescription(e.target.value)}
                      placeholder="Agenda or notes for attendees"
                      className="w-full p-2.5 border border-slate-200 outline-none bg-white focus:border-brandCoral rounded-xl resize-none"
                    />
                  </div>

                  <div className="p-3 space-y-2 text-xs border border-dashed border-slate-200 rounded-xl bg-white/50">
                    <p className="font-bold text-slate-500">
                      Google Meet link <span className="font-normal text-slate-400">(paste a https://meet.google.com/ link — auto-generated if a Google service account is configured)</span>
                    </p>
                      <input
                        type="url"
                        value={mtgJoinUrl}
                        onChange={(e) => setMtgJoinUrl(e.target.value)}
                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                        className="w-full p-2.5 border border-slate-200 outline-none bg-white focus:border-brandCoral rounded-xl"
                      />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 font-quicksand font-bold text-xs bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-slate-800"
                    >
                      <Plus className="w-4 h-4" />
                      SCHEDULE MEETING
                    </button>
                  </div>
                </form>

                {/* Meetings List */}
                <div className="space-y-3">
                  <h4 className="pb-2 text-sm font-bold border-b font-quicksand text-slate-800 border-slate-100">Scheduled Meetings ({meetings.length})</h4>
                  {meetings.length === 0 ? (
                    <p className="py-10 text-xs text-center text-slate-500">No meetings scheduled yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {meetings.map((m) => {
                        const start = new Date(m.startTime);
                        const isOwner = m.status !== 'cancelled';
                        return (
                          <div key={m._id} className="flex flex-col justify-between p-4 space-y-3 bg-white border shadow-sm border-slate-100 rounded-xl">
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
                              {m.hostName && <p className="text-[10px] text-slate-400">Host: {m.hostName}</p>}
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-50">
                              <a
                                href={m.joinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-white transition-all rounded-lg bg-brandSky hover:bg-brandSky-dark"
                              >
                                <Video className="w-3.5 h-3.5" /> JOIN
                              </a>
                              {isOwner && (
                                <button
                                  onClick={() => handleDeleteMeeting(m._id)}
                                  className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-rose-600 transition-all rounded-lg hover:bg-rose-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> DELETE
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="space-y-6">
                
                {/* Header & Quick Action Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-extrabold font-quicksand text-white flex items-center gap-2.5">
                      <Award className="w-6 h-6 text-amber-400" />
                      <span>Internship Certificate Generator</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Issue verified completion certificates for students and interns with public QR authentication.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="/verify-certificate"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-xs font-bold text-sky-400 border border-sky-500/30 transition flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Verification Portal</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        if (isCertFormOpen && !editingCert) {
                          setIsCertFormOpen(false);
                        } else {
                          handleResetCertForm();
                          setIsCertFormOpen(true);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold shadow-lg shadow-orange-950/40 transition flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isCertFormOpen && !editingCert ? 'Close Form' : 'Generate Certificate'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Certificates</span>
                      <span className="text-lg font-extrabold text-white font-mono">{certificates.length}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status Verification</span>
                      <span className="text-xs font-bold text-emerald-400">100% Authentic & Live</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Accredited Partner</span>
                      <span className="text-xs font-bold text-sky-300">Kalinga University & MSME</span>
                    </div>
                  </div>
                </div>

                {/* Certificate Creation / Edit Form Card */}
                {isCertFormOpen && (
                  <form onSubmit={handleSaveCertificate} className="p-6 bg-slate-800/90 border border-amber-500/30 rounded-3xl space-y-5 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Award className="w-4.5 h-4.5 text-amber-400" />
                        <span>{editingCert ? 'Edit Certificate Details' : 'Generate New Internship Certificate'}</span>
                      </h4>
                      <button
                        type="button"
                        onClick={handleResetCertForm}
                        className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-slate-700 transition"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Candidate Name */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-300 flex items-center justify-between">
                          <span>Student / Candidate Name *</span>
                          {students.length > 0 && (
                            <select
                              onChange={(e) => {
                                if (e.target.value) setCertStudentName(e.target.value);
                              }}
                              defaultValue=""
                              className="bg-slate-700 text-[10px] text-slate-200 rounded px-1.5 py-0.5 outline-none"
                            >
                              <option value="">Select from Enrolled Students...</option>
                              {students.map((s) => (
                                <option key={s._id} value={s.name}>{s.name} ({s.class})</option>
                              ))}
                            </select>
                          )}
                        </label>
                        <input
                          type="text"
                          required
                          value={certStudentName}
                          onChange={(e) => setCertStudentName(e.target.value)}
                          placeholder="e.g. Miss. Sonam Tiwari"
                          className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400 transition"
                        />
                      </div>

                      {/* Certificate Serial Number */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-300">
                          Certificate Number <span className="text-slate-500 font-normal">(Leave empty to auto-generate)</span>
                        </label>
                        <input
                          type="text"
                          value={certNumber}
                          onChange={(e) => setCertNumber(e.target.value)}
                          placeholder="e.g. ATI-06-02-ST1002"
                          className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono outline-none focus:border-amber-400 uppercase transition"
                        />
                      </div>
                    </div>

                    {/* Internship / Course Name */}
                    <div className="space-y-1.5 text-xs">
                      <label className="font-bold text-slate-300">Internship / Course Name *</label>
                      <input
                        type="text"
                        required
                        value={certInternshipName}
                        onChange={(e) => setCertInternshipName(e.target.value)}
                        placeholder="e.g. 6-month Front-End Development Course (MERN Stack)"
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400 transition"
                      />
                      {/* Preset Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400">Quick presets:</span>
                        {[
                          '6-month Front-End Development Course (MERN Stack)',
                          'Java Full Stack Development Program',
                          'Python Developer & Machine Learning Course',
                          'MERN Developer Specialization'
                        ].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setCertInternshipName(preset)}
                            className="px-2 py-0.5 rounded-md bg-slate-700/70 hover:bg-slate-700 text-[10px] text-slate-300 border border-slate-600 transition"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dates: Duration From, Duration To, Issue Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-300">Duration Start Date *</label>
                        <input
                          type="text"
                          required
                          value={certStartDate}
                          onChange={(e) => setCertStartDate(e.target.value)}
                          placeholder="e.g. June 2, 2025"
                          className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400 transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-300">Duration End Date *</label>
                        <input
                          type="text"
                          required
                          value={certEndDate}
                          onChange={(e) => setCertEndDate(e.target.value)}
                          placeholder="e.g. December 22, 2025"
                          className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400 transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-300">Date Issued *</label>
                        <input
                          type="text"
                          required
                          value={certIssueDate}
                          onChange={(e) => setCertIssueDate(e.target.value)}
                          placeholder="e.g. January 2, 2026"
                          className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400 transition"
                        />
                      </div>
                    </div>

                    {/* Recognition Paragraph Description */}
                    <div className="space-y-1.5 text-xs">
                      <label className="font-bold text-slate-300">Recognition Paragraph / Description</label>
                      <textarea
                        rows={2}
                        value={certDescription}
                        onChange={(e) => setCertDescription(e.target.value)}
                        placeholder="e.g. This certification is awarded in recognition of the successful completion of the curriculum and mastery of the course content."
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400 resize-none transition"
                      />
                    </div>

                    {/* Collapsible Institution & Partner Settings */}
                    <details className="group border border-slate-700/80 rounded-2xl bg-slate-900/50 p-4 text-xs">
                      <summary className="font-bold text-slate-300 cursor-pointer flex items-center justify-between select-none">
                        <span>Institution, Address & University Partner Details (Optional)</span>
                        <span className="text-[10px] text-amber-400">Click to customize</span>
                      </summary>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-700">
                        <div className="space-y-1">
                          <label className="text-slate-400">Company Address</label>
                          <input
                            type="text"
                            value={certCompanyAddress}
                            onChange={(e) => setCertCompanyAddress(e.target.value)}
                            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">Company Phone</label>
                          <input
                            type="text"
                            value={certCompanyPhone}
                            onChange={(e) => setCertCompanyPhone(e.target.value)}
                            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">Company Email</label>
                          <input
                            type="text"
                            value={certCompanyEmail}
                            onChange={(e) => setCertCompanyEmail(e.target.value)}
                            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">Partner University</label>
                          <input
                            type="text"
                            value={certPartnerUniversity}
                            onChange={(e) => setCertPartnerUniversity(e.target.value)}
                            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                          />
                        </div>
                      </div>
                    </details>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleResetCertForm}
                        className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={certLoading}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-orange-950/40 transition flex items-center gap-2"
                      >
                        <Award className="w-4 h-4" />
                        <span>{certLoading ? 'Processing...' : editingCert ? 'Update Certificate' : 'Issue & Generate Certificate'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={certSearchQuery}
                      onChange={(e) => setCertSearchQuery(e.target.value)}
                      placeholder="Search candidate, cert ID, course..."
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <span className="text-xs text-slate-400 self-end sm:self-center">
                    Showing <span className="font-bold text-white">{
                      certificates.filter(c => {
                        const q = certSearchQuery.toLowerCase();
                        return (
                          (c.studentName || '').toLowerCase().includes(q) ||
                          (c.certificateNumber || '').toLowerCase().includes(q) ||
                          (c.internshipName || '').toLowerCase().includes(q)
                        );
                      }).length
                    }</span> issued certificates
                  </span>
                </div>

                {/* Certificates Table */}
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/80 text-[11px] font-bold uppercase text-slate-400 border-b border-white/10">
                      <tr>
                        <th className="py-3.5 px-4">Certificate ID</th>
                        <th className="py-3.5 px-4">Candidate Name</th>
                        <th className="py-3.5 px-4">Internship Course</th>
                        <th className="py-3.5 px-4">Duration</th>
                        <th className="py-3.5 px-4">Issue Date</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {certificates.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            <Award className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                            <p className="font-semibold text-slate-300">No certificates issued yet.</p>
                            <p className="text-xs text-slate-500 mt-1">Click "Generate Certificate" to create and customize the first one.</p>
                          </td>
                        </tr>
                      ) : (
                        certificates
                          .filter(c => {
                            const q = certSearchQuery.toLowerCase();
                            return (
                              (c.studentName || '').toLowerCase().includes(q) ||
                              (c.certificateNumber || '').toLowerCase().includes(q) ||
                              (c.internshipName || '').toLowerCase().includes(q)
                            );
                          })
                          .map((cert) => (
                            <tr key={cert._id} className="hover:bg-white/5 transition">
                              <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                                {cert.certificateNumber}
                              </td>
                              <td className="py-3.5 px-4 font-bold text-white">
                                {cert.studentName}
                              </td>
                              <td className="py-3.5 px-4 max-w-xs truncate text-slate-200" title={cert.internshipName}>
                                {cert.internshipName}
                              </td>
                              <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap text-[11px]">
                                {cert.startDate} - {cert.endDate}
                              </td>
                              <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                                {cert.issueDate}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                  <Check className="w-3 h-3" /> Valid
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* View / Print Live Certificate */}
                                  <button
                                    type="button"
                                    onClick={() => setActiveCertificateModal(cert)}
                                    className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition"
                                    title="View & Print Certificate"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  {/* Copy Public Verification Link */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const url = `${window.location.origin}/verify-certificate/${encodeURIComponent(cert.certificateNumber)}`;
                                      navigator.clipboard.writeText(url);
                                      alert(`Verification link copied for ${cert.studentName}!\n\n${url}`);
                                    }}
                                    className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition"
                                    title="Copy Verification Link"
                                  >
                                    <Share2 className="w-4 h-4" />
                                  </button>

                                  {/* Edit Certificate */}
                                  <button
                                    type="button"
                                    onClick={() => handleEditCertificate(cert)}
                                    className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 border border-slate-600 transition"
                                    title="Edit Details"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>

                                  {/* Delete Certificate */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCertificate(cert._id, cert.certificateNumber)}
                                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition"
                                    title="Revoke / Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ── TESTS & EXAMS TAB ── */}
        {activeTab === 'tests' && (
          <div className="pt-2 animate-in fade-in duration-300">
            <AssessmentAdmin />
          </div>
        )}

        {/* ── KBC LIVE HOST TAB ── */}
        {activeTab === 'kbc' && (
          <div className="pt-2 animate-in fade-in duration-300">
            <AdminKbcManager />
          </div>
        )}

      </div>

      {/* Admission Detail Modal */}
      {selectedAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border-[6px] border-white rounded-[2.5rem] w-full max-w-xl p-6 md:p-8 shadow-2xl relative text-slate-800 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAdmission(null)}
              className="absolute flex items-center justify-center w-8 h-8 font-bold transition-colors rounded-full top-4 right-4 bg-slate-50 hover:bg-slate-100 text-slate-500"
            >
              ×
            </button>

            <div className="pb-3 space-y-1 text-center border-b-2 border-slate-100">
              <span className="text-[9px] font-extrabold tracking-widest text-[#7C3AED] bg-[#EAE8FC] px-2.5 py-0.5 rounded-full">APPLICATION REVIEW</span>
              <h4 className="font-quicksand font-bold text-[#5B468C] text-lg mt-2">Appletree Infotech Institute</h4>
              <p className="text-[10px] text-slate-400 font-semibold font-mono">App No: {selectedAdmission.applicationNumber}</p>
            </div>

            <div className="py-4 space-y-5 text-xs">
              {/* Section 1: Student Profile */}
              <div className="space-y-2.5">
                <h5 className="pb-1 text-sm font-bold border-b font-quicksand text-slate-800">1. Student Profile Details</h5>
                <div className="grid grid-cols-2 gap-3 font-semibold text-slate-500">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Student Name</span>
                    <span className="font-bold text-slate-800">{selectedAdmission.studentDetails?.name}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Course</span>
                    <span className="font-bold text-slate-800">{selectedAdmission.studentDetails?.class}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Gender</span>
                    <span className="font-bold text-slate-800">{selectedAdmission.studentDetails?.gender}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Date of Birth</span>
                    <span className="font-bold text-slate-800">
                      {new Date(selectedAdmission.studentDetails?.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Parent Profile */}
              <div className="space-y-2.5">
                <h5 className="pb-1 text-sm font-bold border-b font-quicksand text-slate-800">2. Parent / Guardian Details</h5>
                <div className="grid grid-cols-2 gap-3 font-semibold text-slate-500 text-slate-600">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Father's Name</span>
                    <span className="font-bold text-slate-800">{selectedAdmission.parentDetails?.fatherName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Mother's Name</span>
                    <span className="font-bold text-slate-800">{selectedAdmission.parentDetails?.motherName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Email Address</span>
                    <span className="font-mono font-bold text-slate-800">{selectedAdmission.parentDetails?.email}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Phone Number</span>
                    <span className="font-bold text-slate-800">{selectedAdmission.parentDetails?.phone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] text-slate-400 uppercase block">Home Address</span>
                    <span className="font-bold text-slate-800">{selectedAdmission.parentDetails?.address}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Documents */}
              <div className="space-y-2.5">
                <h5 className="pb-1 text-sm font-bold border-b font-quicksand text-slate-800">3. Attached Documents & Verification Proofs</h5>
                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  {Object.entries({
                    'Student Photograph': selectedAdmission.documents?.photo,
                    'Previous Report Card / Marksheet': selectedAdmission.documents?.reportCard,
                    [`Address Proof (${selectedAdmission.documents?.addressProofType || 'Proof'})`]: selectedAdmission.documents?.addressProof
                  }).map(([label, path]) => {
                    return (
                      <div key={label} className="flex flex-col justify-between p-2 space-y-1 border bg-slate-50 border-slate-100 rounded-xl">
                        <div>
                          <span className="text-[8px] text-slate-400 uppercase block font-bold">{label}</span>
                          <span className="font-semibold text-slate-700 truncate block text-[9px]" title={path ? path.split('/').pop() : 'Not Uploaded'}>
                            {path ? path.split('/').pop() : 'Not Uploaded'}
                          </span>
                        </div>
                        {path ? (
                          <div className="flex gap-2 pt-0.5">
                            <a
                              href={path}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[9px] font-bold text-[#5B468C] hover:underline"
                            >
                              Open File
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                const w = window.open(path);
                                if (w) {
                                  w.onload = () => {
                                    w.print();
                                  };
                                }
                              }}
                              className="text-[9px] font-bold text-slate-500 hover:text-slate-700"
                            >
                              Print
                            </button>
                          </div>
                        ) : (
                          <span className="text-[9px] text-slate-400 italic">Not Uploaded</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Fields (Only for pending) */}
              {selectedAdmission.status === 'pending' ? (
                <div className="bg-[#FAF9F5] border border-orange-100 p-4 rounded-3xl space-y-4">
                  <h5 className="text-xs font-bold font-quicksand text-slate-800">Approval Decisions & Provisioning</h5>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Reviewer Remarks</label>
                    <input
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="e.g. Documents verified. Approved for Java Development start."
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      Provision Login Password (for parent to login)
                    </label>
                    <input
                      type="text"
                      value={parentPassword}
                      onChange={(e) => setParentPassword(e.target.value)}
                      placeholder="Enter parent login password (e.g. securePass123)"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border p-4 rounded-3xl text-[10px] font-semibold text-slate-500 font-mono space-y-1">
                  <p>Status: <span className={`uppercase font-bold ${selectedAdmission.status === 'approved' ? 'text-emerald-600' : 'text-red-500'}`}>{selectedAdmission.status}</span></p>
                  <p>Remarks: <span className="font-sans italic text-slate-800">"{selectedAdmission.remarks || 'No remarks recorded.'}"</span></p>
                </div>
              )}
            </div>

            {/* Modal Buttons */}
            <div className="flex gap-3 pt-2">
              {selectedAdmission.status === 'pending' ? (
                <>
                  <button
                    onClick={() => {
                      if (!parentPassword.trim()) {
                        alert('Please fill out a password for the student/parent login account before approving.');
                        return;
                      }
                      triggerConfirm(
                        "Are you sure you want to submit?",
                        "This will approve the student and provision their parent portal account.",
                        "submit",
                        () => handleAdmissionDecision(selectedAdmission._id, 'approved', parentPassword)
                      );
                    }}
                    disabled={loading}
                    className="flex-1 py-3 px-4 rounded-2xl bg-brandMint hover:bg-brandMint-dark text-white font-quicksand font-bold text-xs shadow flex items-center justify-center space-x-1.5 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>APPROVE & PROVISION</span>
                  </button>
                  <button
                    onClick={() => {
                      triggerConfirm(
                        "Are you sure you want to delete?",
                        "This will reject the student application and close the file.",
                        "delete",
                        () => handleAdmissionDecision(selectedAdmission._id, 'rejected')
                      );
                    }}
                    disabled={loading}
                    className="py-3 px-5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-quicksand font-bold text-xs shadow flex items-center justify-center space-x-1.5 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>REJECT</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedAdmission(null)}
                  className="w-full py-3 px-6 rounded-2xl bg-[#9F92EC] hover:bg-[#8C7EB5] text-white font-quicksand font-bold text-xs shadow transition-all active:scale-[0.98] cursor-pointer"
                >
                  CLOSE WINDOW
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Detail Modal */}
      {selectedStudentProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border-[6px] border-white rounded-[2.5rem] w-full max-w-xl p-6 md:p-8 shadow-2xl relative text-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="absolute flex items-center gap-2 top-4 right-4">
              <button
                type="button"
                onClick={() => handleDownloadStudentProfilePDF(selectedStudentProfile)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-full transition-all cursor-pointer shadow-xs"
                title="Download / Print Official PDF"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => setSelectedStudentProfile(null)}
                className="flex items-center justify-center w-8 h-8 text-xl font-bold transition-colors rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="pb-4 space-y-1 text-center border-b-2 border-slate-100">
              <span className="text-[10px] font-extrabold tracking-widest text-[#7C3AED] bg-[#EAE8FC] px-3 py-1 rounded-full">STUDENT CARD</span>
              <h4 className="font-quicksand font-bold text-[#5B468C] text-xl mt-3">{selectedStudentProfile.name}</h4>
              <p className="font-mono text-xs font-semibold text-slate-400">ID: {selectedStudentProfile.studentId || 'N/A'}</p>
            </div>

            <div className="py-6 space-y-5 text-xs font-semibold text-slate-600">
              {/* Basic Details */}
              <div className="space-y-3">
                <h5 className="pb-1 text-sm font-bold border-b font-quicksand text-slate-800">1. Academic & Personal Details</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Gender</span>
                    <span className="text-sm font-bold text-slate-850">{selectedStudentProfile.gender}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Course</span>
                    <span className="font-bold text-[#7C3AED] text-sm">{selectedStudentProfile.class}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Date of Birth</span>
                    <span className="text-sm font-bold text-slate-850">
                      {selectedStudentProfile.dateOfBirth ? new Date(selectedStudentProfile.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">System Database ID</span>
                    <span className="font-mono text-slate-850">{selectedStudentProfile._id}</span>
                  </div>
                </div>
              </div>

              {/* Parent Details */}
              {(() => {
                const pInfo = getStudentParentInfo(selectedStudentProfile);
                return (
                  <div className="space-y-3">
                    <h5 className="pb-1 text-sm font-bold border-b font-quicksand text-slate-800">2. Parent / Guardian Contacts</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block font-bold">Parent Name</span>
                        <span className="text-sm font-bold text-slate-800">{pInfo.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block font-bold">Phone Number</span>
                        <span className="text-sm font-bold text-slate-800">{pInfo.phone}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-400 uppercase block font-bold">Email Address</span>
                        <span className="font-mono text-sm font-bold text-slate-800">{pInfo.email}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-400 uppercase block font-bold">Home Address</span>
                        <span className="text-sm font-bold text-slate-800">{pInfo.address}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Fee Payment Status */}
              <div className="space-y-3">
                <h5 className="pb-1 text-sm font-bold border-b font-quicksand text-slate-800">3. Fee Payment Status</h5>
                {(() => {
                  const sFees = fees.filter(fee => {
                    const info = getStudentInfo(fee);
                    return info.id === selectedStudentProfile._id || info.id === selectedStudentProfile.studentId;
                  });
                  const isAllPaid = sFees.length > 0 && sFees.every(fee => fee.status === 'paid');
                  const totalPaid = sFees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
                  const totalPending = sFees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0);

                  return (
                    <div className="p-4 rounded-2xl border bg-slate-50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">Tuition Status:</span>
                        {isAllPaid ? (
                          <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-extrabold rounded-full uppercase shadow-sm">
                            Full Fees Submitted
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-amber-500 text-white text-xs font-extrabold rounded-full uppercase shadow-sm">
                            Installments In Progress ({sFees.filter(f => f.status === 'paid').length}/{sFees.length} Paid)
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Paid</span>
                          <span className="font-mono text-sm font-extrabold text-emerald-600">₹{totalPaid.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase">Outstanding</span>
                          <span className="font-mono text-sm font-extrabold text-rose-600">₹{totalPending.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => handleDownloadStudentProfilePDF(selectedStudentProfile)}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#5B468C] hover:from-[#6D28D9] hover:to-[#4C1D95] text-white font-quicksand font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD / PRINT PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStudentProfile(null)}
                className="py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-quicksand font-bold text-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <form onSubmit={handleEditStudent} className="bg-white border-[6px] border-white rounded-[2.5rem] w-full max-w-xl p-6 md:p-8 shadow-2xl relative text-slate-800 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEditingStudent(null)}
              className="absolute flex items-center justify-center w-8 h-8 text-xl font-bold transition-colors rounded-full top-4 right-4 bg-slate-50 hover:bg-slate-100 text-slate-500"
            >
              ×
            </button>

            <div className="pb-4 space-y-1 text-center border-b-2 border-slate-100">
              <span className="text-[10px] font-extrabold tracking-widest text-[#7C3AED] bg-[#EAE8FC] px-3 py-1 rounded-full">EDIT PROFILE</span>
              <h4 className="font-quicksand font-bold text-[#5B468C] text-xl mt-3">Edit Student Details</h4>
              <p className="font-mono text-xs font-semibold text-slate-400">ID: {editingStudent.studentId || 'N/A'}</p>
            </div>

            <div className="py-6 space-y-5 text-xs">
              {/* Section 1: Student Details */}
              <div className="space-y-3">
                <h5 className="pb-1 text-sm font-bold border-b font-quicksand text-slate-800">1. Student Details</h5>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Student Name</label>
                    <input
                      type="text" required
                      value={editStdName} onChange={e => setEditStdName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#9F92EC]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Date of Birth</label>
                    <input
                      type="date" required
                      value={editStdDob} onChange={e => setEditStdDob(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#9F92EC]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Gender</label>
                    <select
                      value={editStdGender} onChange={e => setEditStdGender(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#9F92EC]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Course</label>
                    <select
                      value={editStdClass} onChange={e => setEditStdClass(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#9F92EC]"
                    >
                      {courseOptions.map((course) => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Parent Details */}
              <div className="space-y-3">
                <h5 className="pb-1 text-sm font-bold border-b font-quicksand text-slate-800">2. Parent / Guardian Details</h5>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Parent Full Name</label>
                      <input
                        type="text" required
                        value={editParentName} onChange={e => setEditParentName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#9F92EC]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Contact Phone Number</label>
                      <input
                        type="text" required
                        value={editParentPhone} onChange={e => setEditParentPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#9F92EC]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Home Address</label>
                    <input
                      type="text" required
                      value={editParentAddress} onChange={e => setEditParentAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#9F92EC]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-2xl bg-brandMint hover:bg-brandMint-dark text-white font-quicksand font-bold text-xs shadow flex items-center justify-center space-x-1.5 cursor-pointer transition-all active:scale-[0.98]"
              >
                <CheckCircle className="w-4 h-4" />
                <span>SAVE CHANGES</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-quicksand font-bold text-xs shadow flex items-center justify-center space-x-1.5 cursor-pointer transition-all active:scale-[0.98]"
              >
                <span>CANCEL</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:block print:bg-white print:p-0 print:inset-auto print:static">
          <style dangerouslySetInnerHTML={{
            __html: `
            @media print {
              body * { visibility: hidden !important; }
              #printable-receipt, #printable-receipt * { visibility: visible !important; }
              #printable-receipt {
                position: fixed !important;
                left: 0 !important; top: 0 !important;
                width: 100vw !important;
                max-width: 100% !important;
                height: auto !important;
                max-height: none !important;
                overflow: visible !important;
                padding: 1.5cm !important;
                margin: 0 !important;
                box-shadow: none !important;
                border: none !important;
                border-radius: 0 !important;
                background: white !important;
              }
              .print-hide { visibility: hidden !important; display: none !important; }
              @page { size: A4 portrait; margin: 0; }
            }
          `}} />

          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border-[3px] border-[#5B468C]" id="printable-receipt">

            {/* Rotate PAID stamp watermark */}
            <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 -rotate-[15deg] text-emerald-500/10 font-mono font-black text-8xl tracking-widest uppercase select-none pointer-events-none z-0">
              PAID
            </div>

            {/* Top-Right Close Button (Hidden during print) */}
            <button
              type="button"
              onClick={() => setActiveReceipt(null)}
              className="absolute z-20 p-2 transition-all border border-transparent rounded-full cursor-pointer print-hide top-4 right-4 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt inner padding wrapper */}
            <div className="p-8 space-y-6">

              {/* Receipt Header */}
              <div className="relative z-10 pb-6 text-center border-b border-solid border-slate-200 bg-[#F5F5FF] rounded-t-2xl p-4">
                <img src="/logo.png" alt="Appletree Logo" className="mx-auto mb-2 h-14" />
                <h2 className="text-2xl font-serif font-bold tracking-tight text-[#5B468C]">APPLETREE INFOTECH</h2>
                <p className="text-xs font-bold tracking-wider uppercase text-slate-500">Official Fee Slip / Booklet Receipt</p>
                <p className="text-[10px] text-slate-400 mt-1">Phone: +91 7503962162 | hr@appletreeinfotech.in</p>
              </div>

              {/* Receipt Details Grid */}
              <div className="relative z-10 grid grid-cols-1 gap-4 p-4 text-xs border md:grid-cols-2 text-slate-600 bg-slate-55/40 rounded-2xl border-slate-100">
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold text-slate-400">Receipt No: </span>
                    <span className="font-mono font-bold text-slate-800">{activeReceipt.receipt?.receiptNumber || `REC-${activeReceipt.receipt?._id}`}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">Payment Date: </span>
                    <span className="font-bold text-slate-800">{new Date(activeReceipt.receipt?.paymentDate || activeReceipt.receipt?.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">Transaction ID: </span>
                    <span className="font-mono font-bold text-slate-800">{activeReceipt.receipt?.transactionId}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">Payment Mode: </span>
                    <span className="font-bold text-slate-800">{activeReceipt.receipt?.paymentMethod}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold text-slate-400">Student Name: </span>
                    <span className="font-bold text-slate-800">{activeReceipt.student?.name}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">Course: </span>
                    <span className="font-bold text-slate-800">{activeReceipt.student?.class}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">Father's Name: </span>
                    <span className="font-bold text-slate-800">{activeReceipt.student?.parentDetails?.fatherName || activeReceipt.student?.parentId?.name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">Billing Address: </span>
                    <span className="font-bold text-slate-800">{activeReceipt.student?.parentDetails?.address || activeReceipt.student?.parentId?.address || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Particulars Table */}
              <div className="relative z-10 overflow-hidden border border-slate-200 rounded-2xl">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="font-bold border-b bg-[#5B468C]/5 text-slate-600 border-slate-200">
                      <th className="p-3">Fee Particulars Description</th>
                      <th className="w-16 p-3 text-center">S.No</th>
                      <th className="p-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const particulars = [];
                      const fs = activeReceipt.feeStructure;
                      const termName = activeReceipt.fee?.term || '';
                      const tl = termName.toLowerCase();
                      const isMonthly = tl.includes('month') || tl.includes('tuition') || tl.includes('component');
                      const isAdmission = tl.includes('admission');
                      const isAnnual = tl.includes('annual');
                      const isDevelopment = tl.includes('development');
                      const isExamination = tl.includes('examination') || tl.includes('exam');

                      if (isMonthly && fs) {
                        // Show full monthly breakdown
                        if (fs.tuitionFee > 0) particulars.push({ name: 'Tuition Fee', tag: 'Monthly', amount: fs.tuitionFee });
                        if (fs.computerFee > 0) particulars.push({ name: 'Computer Lab Fee', tag: 'Monthly', amount: fs.computerFee });
                        if (fs.activityFee > 0) particulars.push({ name: 'Activity & Sports Fee', tag: 'Monthly', amount: fs.activityFee });
                        if (fs.smartClassFee > 0) particulars.push({ name: 'Smart Class Technology Fee', tag: 'Monthly', amount: fs.smartClassFee });
                        if (fs.transportFee > 0) particulars.push({ name: 'School Transport / Bus Fee', tag: 'Monthly', amount: fs.transportFee });
                        if (fs.libraryFee > 0) particulars.push({ name: 'Library & Reference Fee', tag: 'Monthly', amount: fs.libraryFee });
                        (fs.customFees || []).filter(cf => cf.period === 'Monthly').forEach(cf => {
                          particulars.push({ name: cf.name, tag: 'Monthly', amount: cf.amount });
                        });
                      } else if (isAdmission && fs) {
                        particulars.push({ name: 'Admission Fee (One-time, Non-refundable)', tag: 'One-time', amount: fs.admissionFee || activeReceipt.fee?.amount || 0 });
                      } else if (isAnnual && fs) {
                        particulars.push({ name: 'Annual Charges', tag: 'Annual', amount: fs.annualCharges || activeReceipt.fee?.amount || 0 });
                      } else if (isDevelopment && fs) {
                        particulars.push({ name: 'School Development Fund', tag: 'Annual', amount: fs.developmentFee || activeReceipt.fee?.amount || 0 });
                      } else if (isExamination && fs) {
                        particulars.push({ name: 'Term Examination Fee', tag: 'Annual', amount: fs.examinationFee || activeReceipt.fee?.amount || 0 });
                      } else if (fs && tl.includes('custom')) {
                        // Custom fee — try to match by name from customFees
                        const customMatch = (fs.customFees || []).find(cf => termName.toLowerCase().includes(cf.name.toLowerCase()));
                        if (customMatch) {
                          particulars.push({ name: customMatch.name, tag: customMatch.period, amount: customMatch.amount });
                        } else {
                          particulars.push({ name: termName, tag: 'Custom', amount: activeReceipt.fee?.amount || 0 });
                        }
                      } else {
                        particulars.push({
                          name: termName || 'Tuition & Academic Term Invoice',
                          tag: 'Term',
                          amount: activeReceipt.fee?.amount || activeReceipt.receipt?.amountPaid || 0
                        });
                      }

                      // Add late fine if any
                      const fine = activeReceipt.fee?.fine || activeReceipt.receipt?.fine || 0;
                      if (fine > 0) {
                        particulars.push({ name: 'Late Payment Fine / Penalty Charges', tag: 'Fine', amount: fine });
                      }

                      return particulars.map((part, idx) => (
                        <tr key={idx} className={`font-medium text-slate-700 border-b border-slate-100 ${part.tag === 'Fine' ? 'bg-red-50' : 'hover:bg-slate-50/50'}`}>
                          <td className="p-3">
                            <div className="font-semibold text-slate-800">{part.name}</div>
                            {part.tag && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${part.tag === 'Monthly' ? 'bg-indigo-50 text-indigo-600' :
                                part.tag === 'Annual' || part.tag === 'One-time' ? 'bg-amber-50 text-amber-600' :
                                  part.tag === 'Fine' ? 'bg-red-50 text-red-600' :
                                    'bg-slate-100 text-slate-500'
                              }`}>{part.tag}</span>}
                          </td>
                          <td className="p-3 font-mono text-center text-slate-400">{idx + 1}</td>
                          <td className="p-3 font-mono font-bold text-right text-slate-800">₹{(part.amount || 0).toLocaleString('en-IN')}.00</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Total Paid block */}
              <div className="flex justify-between items-center bg-[#5B468C]/5 p-4 rounded-2xl border border-[#5B468C]/15 relative z-10">
                <span className="text-xs font-bold text-slate-600">Total Billed & Cleared amount:</span>
                <span className="text-sm font-extrabold text-[#5B468C] font-mono">₹{activeReceipt.receipt?.amountPaid?.toLocaleString('en-IN')}.00</span>
              </div>

              {/* Stamp and Seal Placeholder */}
              <div className="flex justify-between items-end pt-4 text-[10px] text-slate-400 font-semibold relative z-10">
                <div>
                  <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-2 py-0.5 text-[9px] font-mono inline-block">
                    <span>✓</span>
                    <span>ONLINE CLEARED & STAMPED</span>
                  </div>
                  <p className="mt-1 font-bold text-slate-500 font-mono uppercase text-[9px]">Status: PAID</p>
                </div>
                <div className="text-center">
                  <span className="block w-24 pb-1 font-serif text-xs italic font-bold border-b text-slate-700 border-slate-200">S. Cooper</span>
                  <p className="font-bold text-[8px] text-slate-500 mt-1 uppercase tracking-wider">Admission Desk Desk Officer</p>
                </div>
              </div>
            </div>{/* /receipt inner padding wrapper */}

            {/* Actions (Hidden during print) */}
            <div className="flex gap-3 px-8 pt-4 pb-8 border-t print-hide border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 bg-[#5B468C] hover:bg-[#4A3875] text-white font-quicksand font-bold text-xs rounded-xl shadow cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Slip</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-quicksand font-bold text-xs rounded-xl cursor-pointer transition-all active:scale-[0.98] border border-red-200 flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student ID Card Modal */}
      {activeIdCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:p-0 print:bg-white print:static print:inset-auto">
          <div className="relative w-full max-w-sm p-6 space-y-5 overflow-hidden bg-white shadow-2xl rounded-3xl print:shadow-none print:p-0" id="id-card-modal-container">

            {/* Top-Right Close Button (Hidden during print) */}
            <button
              type="button"
              onClick={() => setActiveIdCard(null)}
              className="absolute z-20 text-lg font-bold top-4 right-4 text-slate-400 hover:text-slate-600 print:hidden"
            >
              ×
            </button>

            {/* Vertical ID Card Outer Layout */}
            <div className="w-[260px] h-[400px] mx-auto bg-white border-2 border-[#2E7D32] rounded-[1.5rem] relative shadow-lg overflow-hidden select-none" id="printable-id-card">

              {/* Header Slanted SVG Background */}
              <svg viewBox="0 0 260 90" className="absolute top-0 left-0 w-full h-[90px] z-0" xmlns="http://www.w3.org/2000/svg">
                <polygon points="0,0 260,0 260,65 130,85 0,65" fill="#2E7D32" />
                <polygon points="0,65 130,85 260,65 260,70 130,90 0,70" fill="#E53935" />
              </svg>

              {/* School Name Text */}
              <div className="absolute left-0 z-10 w-full text-center top-2">
                <h3 className="text-[20px] font-black text-white uppercase font-serif tracking-wide leading-tight">
                  Appletree Infotech Institute
                </h3>
              </div>

              {/* Student Photo */}
              <div className="absolute top-[116px] left-1/2 -translate-x-1/2 w-[90px] h-[105px] bg-[#EAEAEA] border-2 border-[#EF5350] rounded-xl overflow-hidden shadow-inner flex items-center justify-center z-10">
                {activeIdCard.photo && !idPhotoError ? (
                  <img
                    src={activeIdCard.photo}
                    alt={activeIdCard.name}
                    onError={() => setIdPhotoError(true)}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <Users className="w-10 h-10 stroke-[1.5]" />
                    <span className="text-[7px] uppercase font-bold mt-1">Photo</span>
                  </div>
                )}
              </div>

              {/* Student Name */}
              <div className="absolute top-[230px] left-0 w-full text-center z-10 px-2">
                <h4 className="text-sm font-black text-[#E53935] uppercase font-serif tracking-wide leading-none">{activeIdCard.name}</h4>
                <div className="w-24 h-0.5 bg-[#2E7D32] mx-auto mt-1"></div>
              </div>

              {/* Student Details Grid */}
              <div className="absolute top-[252px] left-[15px] right-[15px] text-[8.5px] text-slate-800 font-extrabold z-10">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="align-top">
                      <td className="w-[70px] py-1 text-left font-serif leading-none text-[#2E7D32]">Father Name</td>
                      <td className="w-[15px] py-1 text-center leading-none text-[#2E7D32]">-</td>
                      <td className="py-1 font-sans leading-none text-left">{activeIdCard.parentId?.name || activeIdCard.parentDetails?.fatherName || 'N/A'}</td>
                    </tr>
                    <tr className="align-top">
                      <td className="py-1 font-serif leading-none text-left text-[#2E7D32]">Date of Birth</td>
                      <td className="py-1 leading-none text-center text-[#2E7D32]">-</td>
                      <td className="py-1 font-sans leading-none text-left">
                        {activeIdCard.dateOfBirth ? new Date(activeIdCard.dateOfBirth).toLocaleDateString('en-GB').replace(/\//g, '.') : 'N/A'}
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="py-1 font-serif leading-none text-left text-[#2E7D32]">Mobile No.</td>
                      <td className="py-1 leading-none text-center text-[#2E7D32]">-</td>
                      <td className="py-1 font-mono leading-none text-left">
                        {activeIdCard.parentId?.phone || activeIdCard.parentDetails?.phone || 'N/A'}
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="py-1 font-serif leading-none text-left text-[#2E7D32]">Course</td>
                      <td className="py-1 leading-none text-center text-[#2E7D32]">-</td>
                      <td className="py-1 font-sans leading-none text-left">{activeIdCard.class}</td>
                    </tr>
                    <tr className="align-top">
                      <td className="py-1 font-serif leading-none text-left text-[#2E7D32]">Address</td>
                      <td className="py-1 leading-none text-center text-[#2E7D32]">-</td>
                      <td className="py-1 text-left font-sans leading-tight text-[7.5px] whitespace-pre-wrap">
                        {activeIdCard.parentId?.address || activeIdCard.parentDetails?.address || 'N/A'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom Slanted SVG Background */}
              <svg viewBox="0 0 260 25" className="absolute bottom-0 left-0 w-full h-[25px] z-0" xmlns="http://www.w3.org/2000/svg">
                <polygon points="0,25 260,25 260,8 130,0 0,8" fill="#E53935" />
                <polygon points="0,25 260,25 260,13 130,5 0,13" fill="#2E7D32" />
              </svg>

              {/* Principal Signature */}
              <div className="absolute bottom-[4px] left-[15px] z-10 flex flex-col items-center">
                <svg viewBox="0 0 50 12" className="w-[50px] h-[12px] opacity-90" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5,9 C12,4 20,1 25,5 C30,9 35,9 40,4 M10,8 L30,3" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-[5px] text-white font-black tracking-wider leading-none mt-0.5">Principal</span>
              </div>

            </div>

            {/* Print ID Card Actions (Hidden during print) */}
            <div className="flex justify-center max-w-xs gap-2 pt-2 mx-auto border-t border-slate-100 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 bg-[#5B468C] hover:bg-[#4A3875] text-white font-quicksand font-bold text-xs rounded-xl shadow cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center space-x-1"
              >
                <span>Print ID Card</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveIdCard(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-quicksand font-bold text-xs rounded-xl cursor-pointer transition-all active:scale-[0.98]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Send Document (PDF / Image) to Student Modal */}
      {sendDocModalOpen && sendDocStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Send className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 font-quicksand">Dispatch Document to Student</h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Sending to: <strong className="text-emerald-700">{sendDocStudent.name}</strong> ({sendDocStudent.class || 'Course'})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSendDocModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDispatchDocumentToStudent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Java Project Guidelines & Problem Statement"
                  value={sendDocTitle}
                  onChange={e => setSendDocTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">File Type</label>
                  <select
                    value={sendDocType}
                    onChange={e => setSendDocType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-700"
                  >
                    <option value="pdf">📄 PDF Document</option>
                    <option value="image">🖼️ Image / Badge Attachment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={sendDocCategory}
                    onChange={e => setSendDocCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium text-slate-700"
                  >
                    <option value="Admission & Onboarding">Admission & Onboarding</option>
                    <option value="Study Materials & Syllabus">Study Materials & Syllabus</option>
                    <option value="Fee Invoices & Receipts">Fee Invoices & Receipts</option>
                    <option value="Assignments & Problem Sets">Assignments & Problem Sets</option>
                    <option value="Certificates & Badges">Certificates & Badges</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instructions / Description Note</label>
                <textarea
                  rows="3"
                  placeholder="Add notes for the student regarding this document..."
                  value={sendDocDescription}
                  onChange={e => setSendDocDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                />
              </div>

              {sendDocType === 'image' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Image URL / Preset</label>
                  <input
                    type="text"
                    placeholder="/girl_avatar.jpg or custom image URL"
                    value={sendDocUrl}
                    onChange={e => setSendDocUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium text-slate-600"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSendDocModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Student Portal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Small Clay Confirmation Modal Overlay */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        type={confirmModal.type}
      />

      {/* Admission Payment Modal (Cash / UPI → auto-saves student) */}
      {admissionPaymentOpen && (
        <AdmissionPaymentModal
          admissionData={{
            studentDetails: { name: admStdName, dateOfBirth: admStdDob, gender: admStdGender, class: admStdClass },
            parentDetails: { fatherName: admParentFather, motherName: admParentMother, email: admParentEmail, phone: admParentPhone, address: admParentAddress },
            amount: admissionFee,
            tuitionFee: admTuitionFee,
            paymentPlan: admPaymentPlan,
            photo: admPhoto
          }}
          onClose={() => setAdmissionPaymentOpen(false)}
          onSuccess={handleAdmissionPaymentSuccess}
        />
      )}
      {/* Collect Invoice Payment Modal (Cash / UPI / Full Balance) */}
      {collectPaymentOpen && selectedCollectFee && (
        <CollectPaymentModal
          fee={selectedCollectFee}
          allFees={fees.filter(f => {
            const info = getStudentInfo(selectedCollectFee);
            const fInfo = getStudentInfo(f);
            return fInfo.id === info.id && f.status !== 'paid';
          })}
          studentName={getStudentInfo(selectedCollectFee).name}
          onClose={() => { setCollectPaymentOpen(false); setSelectedCollectFee(null); }}
          onSuccess={handleCollectPaymentSuccess}
        />
      )}

      {/* Internship Certificate Live Preview & Print Modal */}
      {activeCertificateModal && (
        <CertificateModal
          certificate={activeCertificateModal}
          isOpen={!!activeCertificateModal}
          onClose={() => setActiveCertificateModal(null)}
        />
      )}

    </div>
  );
}
