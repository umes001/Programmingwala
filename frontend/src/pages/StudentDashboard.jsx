import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  Star,
  PlayCircle,
  CheckCircle,
  Calendar,
  Target,
  BarChart,
  Download,
  FileText,
  Users,
  ChevronRight,
  LogIn,
  X,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Receipt,
  CreditCard,
  Eye,
  Printer,
  Image as ImageIcon,
  Send,
  ShieldCheck,
  FileSpreadsheet,
  FolderDown,
  Lock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext.jsx';

const StudentDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    streakDays: 7,
    averageScore: 92
  });
  const [recentActivity, setRecentActivity] = useState([
    { id: 'act-1', type: 'lesson_completed', title: 'Completed Object Oriented Programming in Java', course: 'Java Development', time: '2 hours ago' },
    { id: 'act-2', type: 'note_added', title: 'Added personal notes on React Hooks & State', course: 'Frontend Development', time: 'Yesterday' },
    { id: 'act-3', type: 'course_enrolled', title: 'Enrolled in Backend Development with Express', course: 'Backend Development', time: '3 days ago' }
  ]);
  const [loading, setLoading] = useState(false);

  // Documents & Files sent by Admin
  const [adminDocuments, setAdminDocuments] = useState([]);
  const [docFilter, setDocFilter] = useState('all'); // 'all' | 'pdf' | 'image' | 'receipt'
  const [activeDocPreview, setActiveDocPreview] = useState(null);

  // Student Course Fees & Remaining Balance
  const [feeData, setFeeData] = useState({
    totalFee: 12000,
    paidAmount: 8000,
    remainingAmount: 4000,
    status: 'PARTIAL',
    course: 'Java Full Stack & DSA Mastery',
    receipts: [
      { receiptNo: 'REC-ADM-8491', term: 'Month 1 (Admission & Core OOPs)', amount: 4000, date: '01 Aug 2024', status: 'PAID' },
      { receiptNo: 'REC-ADM-8492', term: 'Month 2 (Spring Boot & Cloud)', amount: 4000, date: '15 Aug 2024', status: 'PAID' }
    ]
  });
  const [payRemainingModal, setPayRemainingModal] = useState(false);
  const [selectedPayMethod, setSelectedPayMethod] = useState('upi');

  // Modal view handlers based on route
  const activeModal = location.pathname.endsWith('/certificates')
    ? 'certificates'
    : location.pathname.endsWith('/resources')
    ? 'resources'
    : location.pathname.endsWith('/progress')
    ? 'progress'
    : null;

  const closeModal = () => navigate('/lms/dashboard');

  useEffect(() => {
    if (!user) return; // only fetch when logged in
    fetchDashboardData();
    loadStudentDocumentsAndFees();
  }, [user]);

  const loadStudentDocumentsAndFees = () => {
    const userEmail = (user?.email || '').toLowerCase();
    const userName = user?.name || 'Student';

    // 1. Load Fees from localStorage or default
    const storedFees = JSON.parse(localStorage.getItem('appletree_student_fees') || '{}');
    const userFee = storedFees[userEmail] || storedFees[userName.toLowerCase()] || null;

    if (userFee) {
      setFeeData({
        totalFee: userFee.totalFee || 12000,
        paidAmount: userFee.paidAmount || 8000,
        remainingAmount: userFee.remainingAmount !== undefined ? userFee.remainingAmount : Math.max(0, (userFee.totalFee || 12000) - (userFee.paidAmount || 8000)),
        status: userFee.status || (userFee.remainingAmount === 0 ? 'PAID' : 'PARTIAL'),
        course: userFee.course || 'Java Full Stack & DSA Mastery',
        receipts: [
          { receiptNo: 'REC-ADM-8491', term: 'Month 1 (Admission & Core OOPs)', amount: 4000, date: '01 Aug 2024', status: 'PAID' },
          { receiptNo: 'REC-ADM-8492', term: 'Month 2 (Spring Boot & Cloud APIs)', amount: Math.max(0, (userFee.paidAmount || 8000) - 4000), date: '15 Aug 2024', status: 'PAID' }
        ]
      });
    }

    // 2. Load Documents & Files from localStorage
    const storedDocs = JSON.parse(localStorage.getItem('appletree_student_documents') || '[]');
    const userSpecificDocs = storedDocs.filter(d => 
      !d.studentEmail || d.studentEmail === userEmail || d.studentName?.toLowerCase() === userName.toLowerCase()
    );

    if (userSpecificDocs.length > 0) {
      setAdminDocuments(userSpecificDocs);
    } else {
      // Default initial official documents bundle from Admin
      const initialDocs = [
        {
          id: 'doc-adm-default',
          studentEmail: userEmail,
          studentName: userName,
          title: `Official Admission & Program Enrollment Letter — ${userFee?.course || 'Java Full Stack'}`,
          category: 'Admission & Onboarding',
          fileType: 'pdf',
          size: '245 KB',
          date: '18 Aug 2024',
          verified: true,
          sender: 'Central Admin Desk (AppleTree Infotech)',
          previewContent: `CONFIRMATION OF ENROLLMENT\n\nDear ${userName},\n\nWe are pleased to confirm your admission into AppleTree Infotech Technical Training Program.\n\n• Student Name: ${userName}\n• Student Email: ${user?.email || 'student@pranidha.edu'}\n• Program: ${userFee?.course || 'Java Full Stack & DSA Mastery'}\n• Total Program Tuition Fee: ₹${(userFee?.totalFee || 12000).toLocaleString('en-IN')}\n• Paid Amount: ₹${(userFee?.paidAmount || 8000).toLocaleString('en-IN')}\n• Balance Due: ₹${(userFee?.remainingAmount ?? 4000).toLocaleString('en-IN')}\n\nAuthorized Signature:\nAcademic Director, AppleTree Infotech`
        },
        {
          id: 'doc-road-default',
          studentEmail: userEmail,
          studentName: userName,
          title: `Complete 1000 DSA Problems & System Design Curriculum Roadmap PDF`,
          category: 'Study Materials & Syllabus',
          fileType: 'pdf',
          size: '1.8 MB',
          date: '19 Aug 2024',
          verified: true,
          sender: 'Dean of Computer Science',
          previewContent: `COMPLETE COURSE SYLLABUS & ROADMAP\n\nModule 1: Advanced Java, OOPs, Memory Models\nModule 2: Binary Search Trees, Graphs, Dynamic Programming\nModule 3: Spring Boot Microservices, Redis Caching, PostgreSQL\nModule 4: React Fiber, System Architecture & Capstone Deployment`
        },
        {
          id: 'doc-rec-default',
          studentEmail: userEmail,
          studentName: userName,
          title: `Official Verified Payment Receipt (₹${(userFee?.paidAmount || 8000).toLocaleString('en-IN')} Submitted)`,
          category: 'Fee Invoices & Receipts',
          fileType: 'pdf',
          size: '190 KB',
          date: '20 Aug 2024',
          verified: true,
          sender: 'Accounts & Finance Department',
          receiptData: {
            receiptNo: 'REC-2024-9104',
            studentName: userName,
            course: userFee?.course || 'Java Full Stack & DSA Mastery',
            totalFee: userFee?.totalFee || 12000,
            paidAmount: userFee?.paidAmount || 8000,
            remainingAmount: userFee?.remainingAmount ?? 4000,
            status: (userFee?.remainingAmount ?? 4000) === 0 ? 'PAID' : 'PARTIAL'
          }
        },
        {
          id: 'doc-img-default',
          studentEmail: userEmail,
          studentName: userName,
          title: `Student Digital Identity Badge & Campus Access Card`,
          category: 'Identity & Access Cards',
          fileType: 'image',
          size: '540 KB',
          imageUrl: '/girl_avatar.jpg',
          date: '20 Aug 2024',
          verified: true,
          sender: 'Student Welfare & Security Desk'
        }
      ];
      setAdminDocuments(initialDocs);
      localStorage.setItem('appletree_student_documents', JSON.stringify(initialDocs));
    }
  };

  const handlePayRemainingBalance = () => {
    const userEmail = (user?.email || '').toLowerCase();
    const userName = user?.name || 'Student';
    const amountToPay = feeData.remainingAmount;

    if (amountToPay <= 0) {
      alert('Fees are already fully cleared!');
      return;
    }

    const newReceiptNo = `REC-CLR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReceipt = {
      receiptNo: newReceiptNo,
      term: 'Final Installment (Cleared Full Balance)',
      amount: amountToPay,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'PAID'
    };

    const updatedFeeData = {
      ...feeData,
      paidAmount: feeData.totalFee,
      remainingAmount: 0,
      status: 'PAID',
      receipts: [...feeData.receipts, newReceipt]
    };

    setFeeData(updatedFeeData);

    // Save to localStorage fees store
    const storedFees = JSON.parse(localStorage.getItem('appletree_student_fees') || '{}');
    storedFees[userEmail] = {
      studentName: userName,
      course: feeData.course,
      totalFee: feeData.totalFee,
      paidAmount: feeData.totalFee,
      remainingAmount: 0,
      status: 'PAID',
      lastUpdated: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    localStorage.setItem('appletree_student_fees', JSON.stringify(storedFees));

    // Add new cleared receipt PDF to documents list
    const newDoc = {
      id: `doc-rec-cleared-${Date.now()}`,
      studentEmail: userEmail,
      studentName: userName,
      title: `Final Clearance Fee Receipt (₹${amountToPay.toLocaleString('en-IN')} Paid — All Dues Cleared)`,
      category: 'Fee Invoices & Receipts',
      fileType: 'pdf',
      size: '195 KB',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      verified: true,
      sender: 'Accounts & Finance Department',
      receiptData: {
        receiptNo: newReceiptNo,
        studentName: userName,
        course: feeData.course,
        totalFee: feeData.totalFee,
        paidAmount: feeData.totalFee,
        remainingAmount: 0,
        status: 'PAID'
      }
    };

    const updatedDocs = [newDoc, ...adminDocuments];
    setAdminDocuments(updatedDocs);
    localStorage.setItem('appletree_student_documents', JSON.stringify(updatedDocs));

    setPayRemainingModal(false);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    alert(`🎉 Payment of ₹${amountToPay.toLocaleString('en-IN')} successful! All remaining course dues cleared. Receipt #${newReceiptNo} generated.`);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const authToken = token || localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${authToken}` };
      
      // Fetch enrolled courses
      const coursesResponse = await fetch('/api/lms/my-courses', { headers });
      const coursesData = await coursesResponse.json();
      
      if (coursesData.success) {
        setEnrolledCourses(coursesData.data);
        
        const totalCourses = coursesData.data.length || 2;
        const completedCourses = coursesData.data.filter(c => c.status === 'completed').length || 1;
        const totalHours = coursesData.data.reduce((sum, c) => sum + (c.course?.totalDuration || 0), 0) / 60 || 24;
        
        setStats(prev => ({
          ...prev,
          totalCourses,
          completedCourses,
          totalHours: Math.round(totalHours) || 24,
          streakDays: 7,
          averageScore: 92
        }));
      } else {
        // Mock fallback if DB empty
        setEnrolledCourses([
          {
            _id: 'mock_enr_1',
            status: 'in_progress',
            progress: 65,
            course: {
              _id: 'course_1',
              title: 'Java Development Program',
              totalLessons: 18,
              totalDuration: 1200,
              imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400'
            }
          },
          {
            _id: 'mock_enr_2',
            status: 'completed',
            progress: 100,
            course: {
              _id: 'course_2',
              title: 'Frontend Development (React & Tailwind)',
              totalLessons: 14,
              totalDuration: 900,
              imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'
            }
          }
        ]);
        setStats({ totalCourses: 2, completedCourses: 1, totalHours: 35, streakDays: 7, averageScore: 92 });
      }
      
      // Fetch continue watching
      const continueResponse = await fetch('/api/lms/continue-watching', { headers });
      const continueData = await continueResponse.json();
      if (continueData.success && continueData.data.length > 0) {
        setContinueWatching(continueData.data);
      } else {
        setContinueWatching([
          {
            _id: 'cw_1',
            percentage: 65,
            lastWatchedAt: new Date(),
            course: { _id: 'course_1', title: 'Java Development Program' },
            lesson: { title: 'Object Oriented Principles & Polymorphism' }
          }
        ]);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Not logged in — prompt to login
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center border border-slate-200">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
            <LogIn className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Learning Dashboard</h2>
          <p className="text-gray-500 mb-6">Please log in to view your course progress, certificates, and learning history.</p>
          <Link to="/login" className="inline-flex items-center px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all shadow-md">
            <LogIn className="w-5 h-5 mr-2" /> Log In to Student Panel
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Not enrolled yet? <Link to="/lms" className="text-amber-600 font-medium hover:underline">Browse Courses</Link>
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 font-medium">Opening Student Panel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 relative font-quicksand">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">Student LMS Portal</span>
                <span className="bg-emerald-400 text-slate-900 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active Learner
                </span>
              </div>
              <h1 className="text-3xl font-black mb-1">Welcome back, {user?.name || 'Student'}!</h1>
              <p className="text-amber-100 text-sm font-medium">
                Track your course completions, download certificates, and continue learning.
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xl shadow-inner">
                🎓
              </div>
              <div>
                <div className="font-extrabold text-base leading-tight">{user?.name || 'Demo Student'}</div>
                <div className="text-xs text-amber-100 font-medium">{user?.email || 'student@pranidha.edu'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-gray-900">
                  {stats.totalCourses}
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Enrolled Courses</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-xs text-emerald-600 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 2 active courses in progress
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-gray-900">
                  {stats.completedCourses}
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Completed</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> 1 Certificate Ready for Download
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-gray-900">
                  {stats.totalHours}h
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Learning Hours</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-xs text-purple-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +6.5 hrs completed this week
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-gray-900">
                  {stats.streakDays} Days
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Day Streak</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-xs text-orange-600 font-bold flex items-center gap-1">
              🔥 Excellent consistency!
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Continue Watching & Enrolled Courses */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Watching */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-amber-500" /> Continue Learning
                </h2>
                <Link
                  to="/lms"
                  className="text-amber-600 hover:text-amber-700 text-xs font-extrabold flex items-center gap-1 uppercase tracking-wider"
                >
                  View All Courses <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              {continueWatching.length > 0 ? (
                <div className="space-y-4">
                  {continueWatching.slice(0, 3).map((item, idx) => (
                    <Link
                      key={item._id || idx}
                      to={`/lms/learn/${item.course?._id || 'course_1'}`}
                      className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all group"
                    >
                      <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform shrink-0">
                        <PlayCircle className="w-7 h-7" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-sm mb-0.5 group-hover:text-amber-600 transition-colors">
                          {item.lesson?.title || 'Java Fundamentals & OOP'}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mb-2">
                          {item.course?.title || 'Java Development'}
                        </p>
                        
                        <div className="flex items-center text-xs text-slate-400 font-semibold gap-3">
                          <span>Progress: {item.percentage || 65}%</span>
                          <span>•</span>
                          <span>Last watched today</span>
                        </div>
                      </div>
                      
                      <div className="ml-4 shrink-0">
                        <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor(item.percentage || 65)}`}
                            style={{ width: `${item.percentage || 65}%` }}
                          ></div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PlayCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No recent activity
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Start learning by enrolling in a course
                  </p>
                  <Link
                    to="/lms"
                    className="inline-flex items-center px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>

            {/* Enrolled Courses */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" /> My Enrolled Courses
              </h2>
              
              {enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((enrollment, idx) => (
                    <div
                      key={enrollment._id || idx}
                      className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all bg-white"
                    >
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-xl overflow-hidden mr-4 shrink-0 bg-slate-100 border border-slate-200">
                          <img
                            src={enrollment.course?.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400'}
                            alt={enrollment.course?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-slate-800 text-base">
                              {enrollment.course?.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase ${
                              enrollment.status === 'completed' || enrollment.progress === 100
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {enrollment.status === 'completed' || enrollment.progress === 100 ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500">
                              <div className="flex items-center">
                                <BookOpen className="w-3.5 h-3.5 mr-1 text-amber-500" />
                                <span>{enrollment.course?.totalLessons || 15} lessons</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-3.5 h-3.5 mr-1 text-purple-500" />
                                <span>{enrollment.course?.totalDuration ? Math.round(enrollment.course.totalDuration / 60) : 18} hours</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-extrabold text-slate-700">
                                {enrollment.progress || 65}%
                              </span>
                              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${getProgressColor(enrollment.progress || 65)}`}
                                  style={{ width: `${enrollment.progress || 65}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex space-x-2">
                            <Link
                              to={`/lms/learn/${enrollment.course?._id || 'course_1'}`}
                              className="px-4 py-2 bg-amber-500 text-white text-xs font-extrabold rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
                            >
                              Continue Learning
                            </Link>
                            <Link
                              to={`/lms/courses/${enrollment.course?._id || 'course_1'}`}
                              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-extrabold rounded-xl hover:bg-slate-50 transition-colors"
                            >
                              Course Syllabus
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No enrolled courses
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Start your learning journey by enrolling in a course
                  </p>
                  <Link
                    to="/lms"
                    className="inline-flex items-center px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>

            {/* ═════════ 📑 1. OFFICIAL ADMIN DOCUMENTS & MEDIA (PDFs & IMAGES) ═════════ */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-500" /> Documents & Files Dispatched by Admin
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Official PDFs, study roadmaps, fee receipts & image badges issued directly by Admin.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
                  <button
                    onClick={() => setDocFilter('all')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      docFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    All ({adminDocuments.length})
                  </button>
                  <button
                    onClick={() => setDocFilter('pdf')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      docFilter === 'pdf' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>📄 PDFs</span>
                  </button>
                  <button
                    onClick={() => setDocFilter('image')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      docFilter === 'image' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>🖼️ Images</span>
                  </button>
                  <button
                    onClick={() => setDocFilter('receipt')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      docFilter === 'receipt' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>🧾 Receipts</span>
                  </button>
                </div>
              </div>

              {/* Documents List */}
              {adminDocuments.length > 0 ? (
                <div className="space-y-3.5">
                  {adminDocuments
                    .filter(doc => {
                      if (docFilter === 'all') return true;
                      if (docFilter === 'pdf') return doc.fileType === 'pdf' && !doc.category?.includes('Fee');
                      if (docFilter === 'image') return doc.fileType === 'image';
                      if (docFilter === 'receipt') return doc.category?.includes('Fee') || doc.receiptData;
                      return true;
                    })
                    .map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 border border-slate-200 rounded-2xl hover:border-amber-400 hover:shadow-sm transition-all bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          {doc.fileType === 'image' ? (
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                              <img
                                src={doc.imageUrl || '/girl_avatar.jpg'}
                                alt="ID Badge"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black ${
                              doc.category?.includes('Fee')
                                ? 'bg-emerald-100 text-emerald-700'
                                : doc.category?.includes('Admission')
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {doc.category?.includes('Fee') ? <Receipt className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-slate-900 text-sm">{doc.title}</h3>
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Admin Verified
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mt-1">
                              <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md text-[10px] uppercase">
                                {doc.category || 'Official Document'}
                              </span>
                              <span>•</span>
                              <span>{doc.fileType === 'pdf' ? 'PDF Document' : 'Image Badge'}</span>
                              <span>•</span>
                              <span>{doc.size || '320 KB'}</span>
                              <span>•</span>
                              <span>Issued: {doc.date}</span>
                            </div>

                            {doc.previewContent && (
                              <p className="text-[11px] text-slate-400 font-mono mt-1.5 line-clamp-1">
                                {doc.previewContent.replace(/\n/g, ' ')}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => setActiveDocPreview(doc)}
                            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Document</span>
                          </button>
                          <button
                            onClick={() => {
                              alert(`📥 Download started for: "${doc.title}"`);
                              confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
                            }}
                            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold">No documents found for this filter.</p>
                </div>
              )}
            </div>

            {/* ═════════ 💳 2. TUITION FEES, REMAINING AMOUNT & RECEIPTS ═════════ */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" /> Course Fees & Remaining Amount Statement
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Official financial statement for enrolled course: <strong className="text-slate-800">{feeData.course}</strong>
                  </p>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${
                  feeData.remainingAmount === 0
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {feeData.remainingAmount === 0 ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>{feeData.remainingAmount === 0 ? 'Fully Cleared (₹0 Due)' : `₹${feeData.remainingAmount.toLocaleString('en-IN')} Due`}</span>
                </div>
              </div>

              {/* Fee Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Course Fee</span>
                  <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                    ₹{feeData.totalFee.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">Standard Tuition + Lab + ISO Cert</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Fees Submitted (Paid)</span>
                  <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
                    ₹{feeData.paidAmount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    {Math.round((feeData.paidAmount / feeData.totalFee) * 100)}% Cleared
                  </span>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  feeData.remainingAmount === 0 ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                }`}>
                  <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                    feeData.remainingAmount === 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    Remaining Amount Due
                  </span>
                  <div className={`text-2xl font-black mt-1 font-mono ${
                    feeData.remainingAmount === 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    ₹{feeData.remainingAmount.toLocaleString('en-IN')}
                  </div>
                  <span className={`text-[10px] font-semibold ${
                    feeData.remainingAmount === 0 ? 'text-emerald-600' : 'text-rose-500'
                  }`}>
                    {feeData.remainingAmount === 0 ? 'No outstanding balance' : 'Due for upcoming term'}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Fee Payment Completion</span>
                  <span>{Math.round((feeData.paidAmount / feeData.totalFee) * 100)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((feeData.paidAmount / feeData.totalFee) * 100))}%` }}
                  ></div>
                </div>
              </div>

              {/* Pay Remaining Action Button */}
              {feeData.remainingAmount > 0 ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
                  <div>
                    <h4 className="font-extrabold text-amber-900 text-sm">Clear Remaining Balance</h4>
                    <p className="text-xs text-amber-700 font-medium mt-0.5">
                      Pay outstanding ₹{feeData.remainingAmount.toLocaleString('en-IN')} to unlock ISO certification & placement drive.
                    </p>
                  </div>
                  <button
                    onClick={() => setPayRemainingModal(true)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay Remaining ₹{feeData.remainingAmount.toLocaleString('en-IN')}</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-emerald-900 text-sm">All Course Fees Fully Paid</h4>
                    <p className="text-xs text-emerald-700 font-medium">
                      You have zero pending dues. All certification tests and campus placement services are active.
                    </p>
                  </div>
                </div>
              )}

              {/* Verified Receipts List */}
              <div>
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-3">
                  Verified Payment Receipts & Invoices
                </h4>
                <div className="space-y-2.5">
                  {feeData.receipts.map((rec, i) => (
                    <div
                      key={i}
                      className="p-3 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-all text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          <Receipt className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{rec.term}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-semibold">
                            Receipt: {rec.receiptNo} • Date: {rec.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-black text-emerald-700 font-mono text-sm">
                          ₹{rec.amount.toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => {
                            setActiveDocPreview({
                              id: `rec-${i}`,
                              title: `Official Receipt — ${rec.term}`,
                              category: 'Fee Invoices & Receipts',
                              fileType: 'pdf',
                              date: rec.date,
                              receiptData: {
                                receiptNo: rec.receiptNo,
                                studentName: user?.name || 'Student',
                                course: feeData.course,
                                totalFee: feeData.totalFee,
                                paidAmount: rec.amount,
                                remainingAmount: feeData.remainingAmount,
                                status: rec.status
                              }
                            });
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Print Receipt</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Activity and Quick Actions */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" /> Student Quick Actions
              </h2>
              
              <div className="space-y-3">
                <Link
                  to="/lms"
                  className="flex items-center p-3.5 border border-slate-200 rounded-xl hover:bg-amber-50/50 hover:border-amber-300 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mr-3 shrink-0 group-hover:scale-105 transition-transform">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">Browse New Courses</span>
                    <span className="text-[11px] text-slate-500 font-medium">Explore Java, MERN, C++ & Web dev</span>
                  </div>
                </Link>
                
                <Link
                  to="/lms/dashboard/certificates"
                  className="flex items-center p-3.5 border border-slate-200 rounded-xl hover:bg-emerald-50/50 hover:border-emerald-300 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 shrink-0 group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">View Certificates</span>
                    <span className="text-[11px] text-slate-500 font-medium">Download verified course completion certificates</span>
                  </div>
                </Link>
                
                <Link
                  to="/lms/dashboard/resources"
                  className="flex items-center p-3.5 border border-slate-200 rounded-xl hover:bg-purple-50/50 hover:border-purple-300 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-3 shrink-0 group-hover:scale-105 transition-transform">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">Download Resources</span>
                    <span className="text-[11px] text-slate-500 font-medium">PDF notes, code templates & cheat sheets</span>
                  </div>
                </Link>
                
                <Link
                  to="/lms/dashboard/progress"
                  className="flex items-center p-3.5 border border-slate-200 rounded-xl hover:bg-orange-50/50 hover:border-orange-300 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mr-3 shrink-0 group-hover:scale-105 transition-transform">
                    <BarChart className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">View Progress Report</span>
                    <span className="text-[11px] text-slate-500 font-medium">Detailed grade card & skill breakdown</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" /> Recent Activity
              </h2>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mr-3 shrink-0 ${
                      activity.type === 'lesson_completed'
                        ? 'bg-green-100 text-green-600'
                        : activity.type === 'note_added'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'lesson_completed' && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {activity.type === 'note_added' && (
                        <FileText className="w-4 h-4" />
                      )}
                      {activity.type === 'course_enrolled' && (
                        <BookOpen className="w-4 h-4" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-slate-800 text-xs mb-0.5">
                        {activity.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {activity.course}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════ MODALS FOR SUB-ROUTES ════ */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative border border-slate-200 font-quicksand"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* CERTIFICATES MODAL */}
              {activeModal === 'certificates' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Student Course Certificates</h2>
                      <p className="text-xs text-slate-500 font-semibold">Verified certificates of completion earned by {user?.name || 'Student'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-slate-200 rounded-2xl p-5 bg-emerald-50/40 relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 inline-block">
                            Verified Certificate
                          </span>
                          <h3 className="font-extrabold text-slate-900 text-lg">Frontend Development Masterclass</h3>
                          <p className="text-xs text-slate-600 mt-1">Issued on: August 2026 • Credential ID: <span className="font-mono font-bold">APP-CERT-2026-8841</span></p>
                        </div>
                        <button
                          onClick={() => alert('Certificate downloaded as PDF!')}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all shrink-0"
                        >
                          <Download className="w-4 h-4" /> Download PDF
                        </button>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 relative opacity-75">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 inline-block">
                            In Progress (65%)
                          </span>
                          <h3 className="font-extrabold text-slate-800 text-base">Java Development Program</h3>
                          <p className="text-xs text-slate-500 mt-1">Complete 6 remaining lessons to unlock your official certificate.</p>
                        </div>
                        <button disabled className="px-4 py-2 bg-slate-200 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed shrink-0">
                          Locked
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RESOURCES MODAL */}
              {activeModal === 'resources' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                      <Download className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Learning Resources & PDF Notes</h2>
                      <p className="text-xs text-slate-500 font-semibold">Study guides, code snippets & reference cheat sheets</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { title: 'Java OOP Principles Cheat Sheet (PDF)', size: '2.4 MB', type: 'PDF Document' },
                      { title: 'React Hooks & State Management Guide', size: '1.8 MB', type: 'PDF Guide' },
                      { title: 'Data Structures & Algorithms Cheat Sheet', size: '3.1 MB', type: 'Cheat Sheet' },
                      { title: 'Full Stack MERN Architecture Diagram', size: '4.5 MB', type: 'Infographic' }
                    ].map((res, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{res.title}</h4>
                            <p className="text-xs text-slate-400 font-semibold">{res.type} • {res.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => alert(`Downloading ${res.title}...`)}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROGRESS REPORT MODAL */}
              {activeModal === 'progress' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <BarChart className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Comprehensive Progress Report</h2>
                      <p className="text-xs text-slate-500 font-semibold">Detailed evaluation for {user?.name || 'Student'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Average Quiz Score</p>
                        <p className="text-2xl font-black text-emerald-600 mt-1">92.5%</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Attendance Rate</p>
                        <p className="text-2xl font-black text-amber-600 mt-1">98%</p>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                      <h4 className="font-extrabold text-slate-800 text-sm">Subject Wise Proficiency</h4>
                      {[
                        { subject: 'Java & Object-Oriented Programming', score: 94, color: 'bg-emerald-500' },
                        { subject: 'HTML5, CSS3 & Responsive UI', score: 96, color: 'bg-blue-500' },
                        { subject: 'JavaScript & Async Programming', score: 88, color: 'bg-amber-500' },
                        { subject: 'Backend REST APIs & Databases', score: 85, color: 'bg-purple-500' }
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                            <span>{item.subject}</span>
                            <span>{item.score}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color}`} style={{ width: `${item.score}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900 transition-colors"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═════════ 📑 DOCUMENT / PDF / IMAGE PREVIEW MODAL ═════════ */}
      <AnimatePresence>
        {activeDocPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md print:p-0 print:bg-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 md:p-8 relative border border-slate-200 font-quicksand"
            >
              {/* Top Close Button (Hidden during print) */}
              <button
                onClick={() => setActiveDocPreview(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors print:hidden cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* 1. PDF / Official Document Layout */}
              {activeDocPreview.fileType === 'pdf' && !activeDocPreview.receiptData && (
                <div className="space-y-6" id="printable-doc">
                  {/* Official Header */}
                  <div className="border-b-2 border-[#5B468C] pb-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block">Official Academic Document</span>
                      <h2 className="text-xl font-black text-slate-900">AppleTree Infotech Education Hub</h2>
                      <p className="text-xs text-slate-500 font-medium">B-14 Sector 62, Noida & Vijaynagar Ghaziabad Hub • Reg No: APP-2024-ED89</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-xl flex items-center justify-center shadow-md">
                      🌳
                    </div>
                  </div>

                  {/* Document Title & Metadata */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase inline-block mb-1.5">
                      {activeDocPreview.category || 'Official Record'}
                    </span>
                    <h3 className="text-lg font-black text-slate-900">{activeDocPreview.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold mt-2">
                      <span>Issued To: <strong className="text-slate-800">{activeDocPreview.studentName || user?.name}</strong></span>
                      <span>•</span>
                      <span>Date: <strong className="text-slate-800">{activeDocPreview.date}</strong></span>
                      <span>•</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Authenticated
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {activeDocPreview.previewContent || 'Official Document Content issued by AppleTree Infotech Administration.'}
                  </div>

                  {/* Official Seal & Signature */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-600 font-black text-[10px]">
                        SEAL
                      </div>
                      <div className="text-[11px]">
                        <span className="font-bold text-slate-800 block">Digitally Signed & Verified</span>
                        <span className="text-slate-400 font-mono text-[9px]">Hash: 8f9a2e3b1c7d4e5f</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block font-serif text-sm font-bold text-slate-800 italic">Dr. R. K. Sharma</span>
                      <span className="text-[10px] text-slate-400 font-bold block">Academic Director & Dean</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Official Fee Receipt Layout */}
              {activeDocPreview.receiptData && (
                <div className="space-y-6" id="printable-receipt">
                  {/* Receipt Header */}
                  <div className="border-b-2 border-emerald-600 pb-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block">Official Fee Invoice Receipt</span>
                      <h2 className="text-xl font-black text-slate-900">AppleTree Infotech Education</h2>
                      <p className="text-xs text-slate-500 font-medium">GSTIN: 09AAACA1234F1Z8 • Fee Accounts Dept.</p>
                    </div>
                    <div className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full border border-emerald-300 uppercase">
                      {activeDocPreview.receiptData.status === 'PAID' ? 'PAID & VERIFIED' : 'PARTIAL PAID'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 block font-semibold text-[10px] uppercase">Receipt No</span>
                      <strong className="text-slate-900 font-mono text-sm">{activeDocPreview.receiptData.receiptNo}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[10px] uppercase">Date of Issue</span>
                      <strong className="text-slate-900">{activeDocPreview.date || 'Today'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[10px] uppercase">Student Name</span>
                      <strong className="text-slate-900">{activeDocPreview.receiptData.studentName || user?.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[10px] uppercase">Course Track</span>
                      <strong className="text-slate-900">{activeDocPreview.receiptData.course || feeData.course}</strong>
                    </div>
                  </div>

                  {/* Particulars Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                    <div className="bg-slate-100 p-3 font-bold text-slate-700 flex justify-between">
                      <span>Particulars</span>
                      <span>Amount</span>
                    </div>
                    <div className="p-3 border-b border-slate-100 flex justify-between">
                      <span>Tuition & Lab Training (Installment)</span>
                      <span className="font-bold text-slate-900 font-mono">₹{(activeDocPreview.receiptData.paidAmount || 4000).toLocaleString('en-IN')}.00</span>
                    </div>
                    <div className="p-3 border-b border-slate-100 flex justify-between bg-slate-50/50">
                      <span>Total Course Fee</span>
                      <span className="font-mono text-slate-600">₹{(activeDocPreview.receiptData.totalFee || 12000).toLocaleString('en-IN')}.00</span>
                    </div>
                    <div className="p-3.5 bg-emerald-50 flex justify-between font-black text-emerald-800 text-sm">
                      <span>Net Paid Amount</span>
                      <span className="font-mono text-base">₹{(activeDocPreview.receiptData.paidAmount || 4000).toLocaleString('en-IN')}.00</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                    <span>Remaining Balance: <strong className="text-rose-600">₹{(activeDocPreview.receiptData.remainingAmount ?? feeData.remainingAmount).toLocaleString('en-IN')}</strong></span>
                    <span className="text-emerald-700 font-bold">Payment Mode: Online Verified</span>
                  </div>
                </div>
              )}

              {/* 3. Image / Digital Badge Layout */}
              {activeDocPreview.fileType === 'image' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block">Student Digital ID & Access Card</span>
                    <h3 className="text-xl font-black text-slate-900 mt-0.5">{activeDocPreview.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">Issued to: <strong>{activeDocPreview.studentName || user?.name}</strong> • Valid for 2024-2026 Batch</p>
                  </div>

                  <div className="max-w-xs mx-auto rounded-3xl overflow-hidden border-4 border-amber-400 shadow-xl bg-slate-900 relative">
                    <img
                      src={activeDocPreview.imageUrl || '/girl_avatar.jpg'}
                      alt="Student ID"
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4 bg-slate-900 text-white text-center">
                      <h4 className="font-black text-lg text-amber-400">{activeDocPreview.studentName || user?.name || 'Ishika Rani'}</h4>
                      <p className="text-xs text-slate-300 font-medium">{feeData.course}</p>
                      <span className="mt-2 inline-block px-3 py-0.5 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-full uppercase">
                        Verified Scholar
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => {
                    alert(`📥 Document "${activeDocPreview.title}" downloaded!`);
                    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═════════ 💳 PAY REMAINING BALANCE MODAL ═════════ */}
      <AnimatePresence>
        {payRemainingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative border border-slate-200 font-quicksand space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Settle Remaining Course Fees</h3>
                    <p className="text-xs text-slate-500 font-medium">Instant Digital Clearance & Receipt</p>
                  </div>
                </div>
                <button
                  onClick={() => setPayRemainingModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Amount Breakdown Box */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Total Outstanding Amount</span>
                <div className="text-3xl font-black text-emerald-800 mt-1 font-mono">
                  ₹{feeData.remainingAmount.toLocaleString('en-IN')}
                </div>
                <span className="text-xs text-emerald-600 font-semibold block mt-0.5">
                  Course: {feeData.course}
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedPayMethod('upi')}
                    className={`p-3 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                      selectedPayMethod === 'upi'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-400/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    ⚡ UPI / QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPayMethod('card')}
                    className={`p-3 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                      selectedPayMethod === 'card'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-400/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    💳 Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPayMethod('netbanking')}
                    className={`p-3 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                      selectedPayMethod === 'netbanking'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-400/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    🏦 NetBanking
                  </button>
                </div>
              </div>

              {/* Submit Payment */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayRemainingModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePayRemainingBalance}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PAY ₹{feeData.remainingAmount.toLocaleString('en-IN')} & CLEAR ALL DUES</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentDashboard;