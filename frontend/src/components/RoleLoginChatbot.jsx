import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Key, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Code2,
  Award,
  Wallet,
  Calendar,
  Layers,
  LogOut,
  CornerDownRight,
  Printer,
  CreditCard,
  ShoppingBag,
  Percent,
  Check,
  Search,
  FileText,
  Edit3,
  CheckCheck,
  Smartphone,
  BookMarked,
  QrCode,
  CheckCircle,
  Clock,
  DollarSign,
  Receipt
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Initial student registry for interactive Admin operations
const INITIAL_STUDENTS = [
  {
    id: 'std-1',
    name: 'Ishika Rani',
    email: 'ishika.rani@gmail.com',
    phone: '+91 98765 43210',
    parentPhone: '+91 98765 43211',
    course: 'Java Full Stack & DSA Mastery',
    totalFee: 12000,
    paidAmount: 8000,
    remainingAmount: 4000,
    status: 'PARTIAL',
    grade: 'A+ (Grandmaster)',
    attendance: '96%',
    month1Paid: true,
    month2Paid: true,
    month3Paid: false
  },
  {
    id: 'std-2',
    name: 'Aryan Mehta',
    email: 'aryan.mehta@gmail.com',
    phone: '+91 98123 45678',
    parentPhone: '+91 98123 45679',
    course: 'MERN Stack Web Dev',
    totalFee: 10000,
    paidAmount: 10000,
    remainingAmount: 0,
    status: 'PAID',
    grade: 'A (Master)',
    attendance: '92%',
    month1Paid: true,
    month2Paid: true,
    month3Paid: true
  },
  {
    id: 'std-3',
    name: 'Sneha Kapoor',
    email: 'sneha.kapoor@gmail.com',
    phone: '+91 99887 76655',
    parentPhone: '+91 99887 76656',
    course: 'Python & AI Specialist',
    totalFee: 11000,
    paidAmount: 3666,
    remainingAmount: 7334,
    status: 'PARTIAL',
    grade: 'A (Top Performer)',
    attendance: '98%',
    month1Paid: true,
    month2Paid: false,
    month3Paid: false
  },
  {
    id: 'std-4',
    name: 'Rohan Verma',
    email: 'rohan.verma@gmail.com',
    phone: '+91 91234 56780',
    parentPhone: '+91 91234 56781',
    course: 'Full Stack Super Combo',
    totalFee: 18000,
    paidAmount: 18000,
    remainingAmount: 0,
    status: 'PAID',
    grade: 'A+ (Top 1% Ranker)',
    attendance: '100%',
    month1Paid: true,
    month2Paid: true,
    month3Paid: true
  }
];

// Standard course catalogue
const AVAILABLE_COURSES = [
  {
    id: 'java-fullstack',
    title: 'Java Full Stack Developer Masterclass',
    price: 12000,
    monthlyInstallment: 4000,
    duration: '3 Months (Live + Lab)',
    highlights: ['Core Java & OOPs', 'Spring Boot & Microservices', 'React.js & Tailwind CSS', 'SQL & Docker Deployment'],
    badge: 'Bestseller'
  },
  {
    id: 'mern-stack',
    title: 'MERN Stack Web Dev Pro',
    price: 10000,
    monthlyInstallment: 3333,
    duration: '3 Months (Hands-on)',
    highlights: ['MongoDB & Mongoose', 'Express.js REST APIs', 'React 18 & Next.js', 'Node.js Backend & JWT Auth'],
    badge: 'Popular'
  },
  {
    id: 'python-datascience',
    title: 'Python & AI / Data Science Specialist',
    price: 11000,
    monthlyInstallment: 3666,
    duration: '3 Months (Projects)',
    highlights: ['Python 3 & Pandas', 'NumPy & Data Visualization', 'Machine Learning Models', 'FastAPI & AI Integration'],
    badge: 'Hot Career'
  },
  {
    id: 'frontend-spec',
    title: 'Frontend & UI/UX Specialist',
    price: 7500,
    monthlyInstallment: 3750,
    duration: '2 Months (Fast Track)',
    highlights: ['HTML5 & Modern CSS3', 'Tailwind CSS & Animations', 'JavaScript ES6+ & TypeScript', 'React UI Components'],
    badge: 'Quick Launch'
  }
];

// Special combo courses
const COMBO_COURSES = [
  {
    id: 'fullstack-combo',
    title: '🚀 Full Stack Super Combo (Java + MERN + 1000 DSA)',
    price: 18000,
    originalPrice: 22000,
    discount: '35% OFF',
    duration: '5 Months (Comprehensive)',
    description: 'Master both Enterprise Java (Spring Boot) and modern MERN Web Development, with full DSA preparation for top tech product companies.',
    badge: 'Best Value'
  },
  {
    id: 'ai-fullstack-bundle',
    title: '🤖 AI + Full Stack Career Bundle (Python AI + React + Java)',
    price: 21000,
    originalPrice: 27000,
    discount: '40% OFF',
    duration: '6 Months (Complete Master)',
    description: 'Combines full stack web development with Python GenAI, Machine Learning, and Cloud deployments for high-paying AI Engineer roles.',
    badge: 'Ultimate Bundle'
  },
  {
    id: 'placement-guaranteed',
    title: '💼 100% Placement Track (All Courses + 1-on-1 Mock Interviews)',
    price: 24999,
    originalPrice: 35000,
    discount: 'Direct Referral',
    duration: '6 Months + Placement',
    description: 'All courses included with dedicated mentor guidance, resume ATS optimization, mock interviews, and guaranteed corporate interviews.',
    badge: 'Job Guarantee'
  }
];

export default function RoleLoginChatbot() {
  const { user } = useAuth();
  const location = useLocation();

  // Hide chatbot on admin dashboard or exam pages
  const isExcluded = 
    location.pathname.startsWith('/dashboard/admin') || 
    location.pathname.startsWith('/portal/admin') || 
    location.pathname.startsWith('/test');

  if (isExcluded) return null;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  // Razorpay dynamic QR state simulation
  const [qrVerifyingId, setQrVerifyingId] = useState(null);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Load registered students from localStorage merged with defaults
  useEffect(() => {
    try {
      const storedFees = JSON.parse(localStorage.getItem('appletree_student_fees') || '{}');
      const loadedList = [...INITIAL_STUDENTS];

      Object.entries(storedFees).forEach(([key, val]) => {
        const existingIdx = loadedList.findIndex(s => s.email.toLowerCase() === key.toLowerCase() || s.name.toLowerCase() === key.toLowerCase());
        if (existingIdx >= 0) {
          loadedList[existingIdx] = {
            ...loadedList[existingIdx],
            ...val,
            totalFee: val.totalFee || loadedList[existingIdx].totalFee,
            paidAmount: val.paidAmount !== undefined ? val.paidAmount : loadedList[existingIdx].paidAmount,
            remainingAmount: val.remainingAmount !== undefined ? val.remainingAmount : loadedList[existingIdx].remainingAmount,
            status: val.status || loadedList[existingIdx].status
          };
        } else {
          loadedList.push({
            id: `std-custom-${Date.now()}-${Math.random()}`,
            name: val.studentName || key,
            email: key.includes('@') ? key : `${key}@student.edu`,
            phone: '+91 98765 00000',
            parentPhone: '+91 98765 00001',
            course: val.course || 'Java Full Stack & DSA Mastery',
            totalFee: val.totalFee || 12000,
            paidAmount: val.paidAmount || 8000,
            remainingAmount: val.remainingAmount !== undefined ? val.remainingAmount : 4000,
            status: val.status || 'PARTIAL',
            grade: 'A (Active Scholar)',
            attendance: '95%',
            month1Paid: true,
            month2Paid: true,
            month3Paid: (val.remainingAmount || 0) === 0
          });
        }
      });

      setStudents(loadedList);
    } catch (e) {
      console.error('Failed to load student fees database:', e);
    }
  }, [isOpen]);

  // Initial personalized greeting strictly role-based (matches user's screenshot)
  const getGreetingMessage = () => {
    const role = user?.role || 'guest';

    if (role === 'admin') {
      return {
        id: 'welcome-admin',
        sender: 'bot',
        role: 'admin',
        text: `🛡️ **Welcome Administrator ${user.name || 'School Administrator'}!**\n\nYou are logged in with **Admin privileges** (${user.email || 'admin@pranidha.edu'}).\n\nI can help you:\n\n• **Update Student Information (Fees, Courses, Grades, Phone)**\n\n• **Audit student remaining & submitted balances**\n\n• **Issue month-wise official fee receipts**\n\n• **Inspect academy financial metrics**\n\nSelect an action below or ask a question:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        userDetected: true,
        showAdminActions: true
      };
    }

    if (role === 'teacher') {
      return {
        id: 'welcome-teacher',
        sender: 'bot',
        role: 'teacher',
        text: `👨‍🏫 **Welcome Faculty Member ${user.name}!**\n\nYou are signed in as **Teacher / Faculty** (${user.email}).\n\nI can help you:\n• **Log Batch Student Attendance**\n• **Grade Student DSA & Code Submissions**\n• **Post Course Notes & Cheat Sheets**\n• **Inspect Batch Performance**\n\nSelect an action below or ask a question:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        userDetected: true,
        showTeacherActions: true
      };
    }

    if (role === 'parent') {
      return {
        id: 'welcome-parent',
        sender: 'bot',
        role: 'parent',
        text: `👨‍👩‍👦 **Welcome ${user.name}!**\n\nYou are logged in as **Parent / Guardian** (${user.email}).\n\nI can help you:\n• **Track Child Attendance & Performance**\n• **View Remaining Tuition Installments**\n• **Download Month 1, 2, 3 Official Receipts**\n• **Schedule Faculty Meeting**\n\nSelect an action below:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        userDetected: true,
        showParentActions: true
      };
    }

    if (role === 'student' || role === 'user') {
      return {
        id: 'welcome-student',
        sender: 'bot',
        role: 'student',
        text: `👋 **Welcome back, ${user.name}!**\n\nYou are logged in with **Student privileges** (${user.email}).\n\nI can help you:\n• **Download Official Fee Receipts (Month 1, 2, or 3)**\n• **Check Remaining & Submitted Fees**\n• **Explore Tech & 1000 DSA Algorithm Tutorials**\n• **View Official Admin Dispatched Documents**\n\nSelect an action below:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        userDetected: true,
        showStudentActions: true
      };
    }

    // Guest / Unauthenticated Viewer
    return {
      id: 'welcome-guest',
      sender: 'bot',
      role: 'guest',
      text: `👋 **Welcome to AppleTree Infotech Education!**\n\nYou are browsing as **Guest Visitor**.\n\nI can help you:\n• **Browse All Courses & Live Pricing**\n• **Explore Super Combo Bundles (40% OFF)**\n• **How to Enroll & Buy Courses**\n• **Free DSA Algorithms & Interactive Visualizers**\n\nSelect an action below:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userDetected: false,
      showGuestActions: true
    };
  };

  useEffect(() => {
    setMessages([getGreetingMessage()]);
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // ═══════════════════════════════════════════════════════════════════
  // ── ADMIN WORKFLOW: SUBMIT & COLLECT STUDENT FEES (QR / CASH) ──
  // ═══════════════════════════════════════════════════════════════════

  // Step 1: Admin triggers Fee Submission
  const handleStartAdminFeeCollection = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '💰 Submit / Take Student Fees',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `💰 **Student Fee Submission & Collection Desk**\n\nWhich student's fees do you want to submit? Select from the registered students below:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAdminFeeStudentSelect: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 300);
  };

  // Step 2: Admin selects specific Student
  const handleAdminSelectFeeStudent = (student) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `Select Student: ${student.name} (${student.course})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Selected Student**: **${student.name}**\n• **Course**: ${student.course}\n• **Total Course Fee**: ₹${student.totalFee.toLocaleString('en-IN')}\n• ✅ **Already Submitted**: ₹${student.paidAmount.toLocaleString('en-IN')}\n• ⏳ **Remaining Balance Due**: **₹${student.remainingAmount.toLocaleString('en-IN')}**\n\n**Which month's fee do you want to submit for ${student.name}?**`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAdminFeeMonthSelect: true,
        selectedFeeStudent: student
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 300);
  };

  // Step 3: Admin selects Month / Installment
  const handleAdminSelectFeeMonth = (student, monthName, amount) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `Submit ${monthName} (₹${amount.toLocaleString('en-IN')}) for ${student.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Collecting ₹${amount.toLocaleString('en-IN')} for ${student.name} (${monthName})**\n\nChoose payment collection mode:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAdminFeePaymentModeSelect: true,
        selectedFeeStudent: student,
        selectedFeeMonth: monthName,
        selectedFeeAmount: amount
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 300);
  };

  // Step 4: Admin chooses Payment Mode (Razorpay QR or Cash)
  const handleAdminSelectPaymentMode = (student, monthName, amount, mode) => {
    if (mode === 'razorpay') {
      const userMsg = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: `Generate Razorpay Dynamic UPI QR (₹${amount.toLocaleString('en-IN')})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        const qrId = `qr-${Date.now()}`;
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `📱 **Razorpay Dynamic UPI QR Generated for ${student.name}**\n\nScan with **Google Pay**, **PhonePe**, **Paytm**, or any UPI app to pay. Razorpay auto-detection is listening for confirmation:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRazorpayQR: true,
          qrData: {
            qrId,
            student,
            monthName,
            amount,
            upiId: 'appletree.infotech@icici',
            txnRef: `RZP-TXN-${Date.now().toString().slice(-6)}`
          }
        };
        setIsTyping(false);
        setMessages(prev => [...prev, botMsg]);
      }, 350);
    } else {
      // Cash mode
      const userMsg = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: `Accept Cash Payment of ₹${amount.toLocaleString('en-IN')} at Counter`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        handleCompleteFeePayment(student, monthName, amount, 'Cash at Counter');
      }, 350);
    }
  };

  // Step 5: Complete & Verify Payment (Syncs database and creates receipts)
  const handleCompleteFeePayment = (student, monthName, amount, paymentMethod) => {
    const newPaidAmount = Math.min(student.totalFee, student.paidAmount + amount);
    const newRemainingAmount = Math.max(0, student.totalFee - newPaidAmount);
    const newStatus = newRemainingAmount === 0 ? 'PAID' : 'PARTIAL';

    // Update in-memory state
    setStudents(prev => prev.map(s => {
      if (s.id === student.id || s.email === student.email) {
        return {
          ...s,
          paidAmount: newPaidAmount,
          remainingAmount: newRemainingAmount,
          status: newStatus
        };
      }
      return s;
    }));

    // Update localStorage persistent fees store
    const storedFees = JSON.parse(localStorage.getItem('appletree_student_fees') || '{}');
    const studentKey = (student.email || student.name).toLowerCase();
    storedFees[studentKey] = {
      studentName: student.name,
      course: student.course,
      totalFee: student.totalFee,
      paidAmount: newPaidAmount,
      remainingAmount: newRemainingAmount,
      status: newStatus,
      lastUpdated: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    localStorage.setItem('appletree_student_fees', JSON.stringify(storedFees));

    // Generate Verified Digital Receipt in Student Documents
    const receiptNo = paymentMethod.includes('Razorpay') 
      ? `REC-RZP-${Math.floor(1000 + Math.random() * 9000)}` 
      : `REC-CSH-${Math.floor(1000 + Math.random() * 9000)}`;

    const newDoc = {
      id: `doc-rec-${Date.now()}`,
      studentEmail: studentKey,
      studentName: student.name,
      title: `Verified Payment Receipt — ${monthName} (₹${amount.toLocaleString('en-IN')} Paid)`,
      category: 'Fee Invoices & Receipts',
      fileType: 'pdf',
      size: '190 KB',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      verified: true,
      sender: 'Accounts & Finance Desk',
      receiptData: {
        receiptNo,
        studentName: student.name,
        course: student.course,
        totalFee: student.totalFee,
        paidAmount: amount,
        remainingAmount: newRemainingAmount,
        status: newStatus,
        paymentMethod: paymentMethod
      }
    };

    const existingDocs = JSON.parse(localStorage.getItem('appletree_student_documents') || '[]');
    localStorage.setItem('appletree_student_documents', JSON.stringify([newDoc, ...existingDocs]));

    const botMsg = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `✅ **Fees Submitted & Verified Successfully!**\n\n• **Student**: ${student.name}\n• **Installment**: ${monthName}\n• **Amount Collected**: **₹${amount.toLocaleString('en-IN')}**\n• **Payment Method**: ${paymentMethod}\n• **Remaining Due**: **₹${newRemainingAmount.toLocaleString('en-IN')}** (${newStatus})\n\nOfficial verified digital receipt has been generated and dispatched to the student's dashboard.`,
      isReceipt: true,
      receiptData: {
        receiptNo,
        studentName: student.name,
        course: student.course,
        totalFee: student.totalFee,
        paidAmount: amount,
        remainingAmount: newRemainingAmount,
        status: newStatus,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        paymentMethod
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      showAdminActions: true
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMsg]);
    confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
  };

  // ═══════════════════════════════════════════════════════════════════
  // ── ADMIN: UPDATE STUDENT INFORMATION ──
  // ═══════════════════════════════════════════════════════════════════
  const handleStartAdminStudentUpdate = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '✏️ Update Student Information',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Admin Student Record Updater:**\n\nChoose a student whose profile or status you want to update:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAdminStudentSelect: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 300);
  };

  const handleSelectStudentToUpdate = (student) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `Select Student: ${student.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Current Record for ${student.name}:**\n• **Course**: ${student.course}\n• **Fees**: ₹${student.paidAmount} Paid / ₹${student.remainingAmount} Due (${student.status})\n• **Performance**: ${student.grade}\n• **Phone**: ${student.phone}\n\n**What would you like to update for ${student.name}?**`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAdminFieldSelect: true,
        selectedStudent: student
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 300);
  };

  const handleExecuteAdminUpdate = (studentId, fieldType, newValue, updateSummary) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        if (fieldType === 'fee_mark_paid') {
          return {
            ...s,
            paidAmount: s.totalFee,
            remainingAmount: 0,
            status: 'PAID'
          };
        }
        if (fieldType === 'course') return { ...s, course: newValue };
        if (fieldType === 'grade') return { ...s, grade: newValue };
        if (fieldType === 'phone') return { ...s, phone: newValue };
      }
      return s;
    }));

    const updatedStudent = students.find(s => s.id === studentId);

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `Update ${fieldType}: ${newValue || 'Marked as Full Paid'}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `✅ **Student Record Successfully Updated!**\n\n${updateSummary}\n\n• **Student**: ${updatedStudent?.name}\n• **Sync**: Real-time database synchronized.`,
        actionText: 'View in Admin Dashboard',
        actionLink: '/dashboard/admin',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showAdminActions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    }, 350);
  };

  // ═══════════════════════════════════════════════════════════════════
  // ── ADMIN: AUDIT REMAINING BALANCES & FINANCIAL METRICS ──
  // ═══════════════════════════════════════════════════════════════════
  const handleAdminAuditFees = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '📊 Audit Student Remaining & Submitted Balances',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const totalRevenue = students.reduce((sum, s) => sum + s.totalFee, 0);
      const totalCollected = students.reduce((sum, s) => sum + s.paidAmount, 0);
      const totalPending = students.reduce((sum, s) => sum + s.remainingAmount, 0);

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `📊 **Academy Student Fee Audit Report:**\n\n` +
          `• 💰 **Total Invoiced**: ₹${totalRevenue.toLocaleString('en-IN')}\n` +
          `• ✅ **Total Collected**: ₹${totalCollected.toLocaleString('en-IN')} (${Math.round((totalCollected/totalRevenue)*100)}%)\n` +
          `• ⏳ **Outstanding Pending**: **₹${totalPending.toLocaleString('en-IN')}**\n\n` +
          `**Student Breakdown:**\n` +
          students.map(s => `• **${s.name}**: ₹${s.paidAmount.toLocaleString('en-IN')} Paid / ₹${s.remainingAmount.toLocaleString('en-IN')} Due [${s.status}]`).join('\n'),
        actionText: 'Open Full Fee Ledger',
        actionLink: '/dashboard/admin',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showAdminActions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 350);
  };

  const handleAdminFinancialMetrics = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '📈 Inspect Academy Financial Metrics',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `📈 **AppleTree Academy Live Financial Metrics:**\n\n• **Monthly Active Cashflow**: ₹3,84,000 / month\n• **Total Enrolled Learners**: 48 active scholars\n• **Payment Gateways**: Razorpay UPI, Cash Desk, NetBanking\n• **Default Rate**: < 4.2% (Industry benchmark: 12%)\n• **Next Settlement Cycle**: 25th of current month`,
        actionText: 'View Admin Analytics',
        actionLink: '/dashboard/admin',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showAdminActions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 350);
  };

  // ═══════════════════════════════════════════════════════════════════
  // ── STUDENT & GUEST WORKFLOWS ──
  // ═══════════════════════════════════════════════════════════════════
  const handlePromptMonthReceipt = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '🧾 Issue / Download Month-Wise Fee Receipt',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Which month's fee receipt do you need?**\n\nPlease select the specific installment or consolidated receipt below:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMonthReceiptPrompt: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 300);
  };

  const handleGenerateSpecificMonthReceipt = (monthName, amount, status, periodDescription) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `Generate ${monthName} Receipt (₹${amount.toLocaleString('en-IN')})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Verified Official Tax Receipt for ${monthName}:**\n\n• **Billing Cycle**: ${periodDescription}\n• **Amount Surcharged**: ₹${amount.toLocaleString('en-IN')}\n• **Status**: ${status}`,
        isReceipt: true,
        receiptData: {
          receiptNo: `REC-2024-${monthName.replace(/\s+/g, '').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
          studentName: user?.name || 'Ishika Rani',
          course: `Java Full Stack - ${monthName} Installment`,
          totalFee: amount,
          paidAmount: amount,
          remainingAmount: status === 'PAID' ? 0 : 4000,
          status: status,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showStudentActions: user?.role === 'student',
        showAdminActions: user?.role === 'admin'
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    }, 350);
  };

  const handleStudentRemainingFees = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '💳 How much fees is remaining / submitted for my course?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Your Fee Account Status (${user?.name || 'Student'}):**\n\n• **Course**: Java Full Stack & DSA Mastery\n• **Total Price**: ₹12,000\n• ✅ **Fees Submitted (Paid)**: ₹8,000 (Month 1 & 2)\n• ⏳ **Remaining Fees Due**: **₹4,000**\n• 📅 **Next Installment Due**: 15th of next month`,
        actionText: 'Open Student Fee Panel',
        actionLink: '/dashboard/student',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showStudentActions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 350);
  };

  const handlePromptDSATopic = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '🧠 Tech & 1000 DSA Knowledge Hub: Explore Algorithms',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Tech & DSA Knowledge Hub — Select a Topic:**\n\nChoose an algorithm, system design, or programming concept to inspect diagrams, complexity, and code:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDSAPrompt: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 300);
  };

  const handleShowDSASolution = (topicName, complexity, summary, link) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `Explain ${topicName}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**${topicName} Overview:**\n\n• **Complexity**: \`${complexity}\`\n• **Architecture & Concept**: ${summary}\n\nFull multi-language code (Java, C++, Python, JS), interactive diagrams, and runtime visualizers are ready on the AppleTree Tutorials Hub:`,
        actionText: `Open ${topicName} in Tutorials Hub`,
        actionLink: link,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 350);
  };

  const handleShowAllCourses = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '📚 Show all present courses and prices',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Current Available Courses & Live Fees:**\n\n` + 
          AVAILABLE_COURSES.map(c => `• **${c.title}** (${c.duration})\n  💰 **₹${c.price.toLocaleString('en-IN')}** total (or ₹${c.monthlyInstallment.toLocaleString('en-IN')}/month)\n  ⚡ *Highlights*: ${c.highlights.join(' • ')}`).join('\n\n'),
        actionText: 'Enroll in a Course',
        actionLink: '/programs',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showGuestActions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 350);
  };

  const handleShowComboCourses = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '🎁 Show combo courses and discount bundles',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Special Combo Courses & Discount Bundles:**\n\n` +
          COMBO_COURSES.map(c => `⭐ **${c.title}**\n  💰 **Offer Price: ₹${c.price.toLocaleString('en-IN')}** ~~(Regular: ₹${c.originalPrice.toLocaleString('en-IN')} - ${c.discount})~~\n  ⏱️ Duration: ${c.duration}\n  📝 ${c.description}`).join('\n\n'),
        actionText: 'Claim Combo Offer',
        actionLink: '/programs',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showGuestActions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 350);
  };

  const handleShowHowToBuy = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '🛒 How to buy and enroll in courses?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**How to Enroll & Buy a Course:**\n\n1. Go to **Courses Catalogue** (/programs) or click the button below.\n2. Choose between **Full Payment** (instant 10% discount) or **3 Monthly EMI Installments**.\n3. Pay securely via **UPI (GPay / PhonePe / Paytm)**, **Cards**, or **NetBanking** via Razorpay.\n4. Instant credentials, enrollment letter, and student portal access unlocked!`,
        actionText: 'Browse & Buy Courses',
        actionLink: '/programs',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showGuestActions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 350);
  };

  // Text message submission handler
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const query = inputValue.trim().toLowerCase();
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      if (query.includes('submit fee') || query.includes('take fee') || query.includes('collect fee')) {
        handleStartAdminFeeCollection();
        return;
      } else if (query.includes('receipt') || query.includes('invoice') || query.includes('bill')) {
        handlePromptMonthReceipt();
        return;
      } else if (query.includes('update') || query.includes('edit') || query.includes('modify')) {
        handleStartAdminStudentUpdate();
        return;
      } else if (query.includes('audit') || query.includes('balance')) {
        handleAdminAuditFees();
        return;
      } else if (query.includes('price') || query.includes('cost') || query.includes('buy')) {
        handleShowAllCourses();
        return;
      } else if (query.includes('combo') || query.includes('bundle') || query.includes('discount')) {
        handleShowComboCourses();
        return;
      } else if (query.includes('dsa') || query.includes('algorithm') || query.includes('geek')) {
        handlePromptDSATopic();
        return;
      } else {
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `I've noted your question: *"**${userMsg.text}**"*\n\nHere are available quick actions based on your login:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showAdminActions: user?.role === 'admin',
          showStudentActions: user?.role === 'student' || user?.role === 'user',
          showGuestActions: !user
        };
        setIsTyping(false);
        setMessages(prev => [...prev, botMsg]);
      }
    }, 350);
  };

  const handleResetChat = () => {
    setMessages([getGreetingMessage()]);
  };

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const role = user?.role || 'guest';

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none print:hidden">
      
      {/* ── CHAT FLOATING TRIGGER BUTTON ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#1c1d21] text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] border border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#1c1d21]" />
          </div>
          <div className="text-left font-quicksand">
            <span className="block text-xs font-black uppercase tracking-wider text-amber-300">AppleTree Assistant</span>
            <span className="block text-[10px] text-slate-300 font-medium">
              {user ? `Logged in: ${user.name} (${user.role})` : 'Fees, Tutorials & Role Login'}
            </span>
          </div>
        </button>
      )}

      {/* ── CHATBOT WINDOW DIALOG ── */}
      {isOpen && (
        <div className="w-[94vw] sm:w-[470px] h-[650px] max-h-[88vh] bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-[#1c1d21] text-white p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm font-quicksand text-white flex items-center gap-1.5">
                  <span>AppleTree Smart Assistant</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  {user ? `Connected as ${user.name} (${user.role})` : 'Online • Role Based Assistant'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Restart Conversation"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User Status Bar */}
          {user && (
            <div className="bg-gradient-to-r from-emerald-950 to-[#1c1d21] text-emerald-200 px-4 py-2 border-b border-emerald-500/20 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Detected: <strong className="text-white">{user.name}</strong> ({user.role})</span>
              </div>
              <button
                onClick={() => {
                  if (user.role === 'admin') handleNavigate('/dashboard/admin');
                  else if (user.role === 'teacher') handleNavigate('/dashboard/teacher');
                  else if (user.role === 'parent') handleNavigate('/dashboard/parent');
                  else handleNavigate('/dashboard/student');
                }}
                className="text-[10px] font-bold text-amber-300 hover:text-amber-200 uppercase tracking-wider underline cursor-pointer shrink-0 ml-2"
              >
                Open Portal →
              </button>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#faf8f2] via-[#fbf7eb] to-[#f7f3e6]">
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Message Bubble */}
                <div
                  className={`max-w-[94%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#1c1d21] text-white rounded-br-none border border-slate-800'
                      : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/80'
                  }`}
                >
                  <div className="space-y-2 whitespace-pre-line font-medium">
                    {msg.text.split('\n').map((line, idx) => {
                      if (line.startsWith('🛡️') || line.startsWith('👋') || line.startsWith('👨‍🏫') || line.startsWith('👨‍👩‍👦')) {
                        return <p key={idx} className="font-black text-sm text-slate-900">{line}</p>;
                      }
                      if (line.startsWith('•') && line.includes('**')) {
                        const parts = line.split('**');
                        return (
                          <p key={idx} className="font-semibold text-slate-800 flex items-start gap-1">
                            <span>{parts.map((p, i) => (i % 2 === 1 ? <strong key={i} className="text-slate-950 font-black">{p}</strong> : p))}</span>
                          </p>
                        );
                      }
                      if (line.includes('**')) {
                        const parts = line.split('**');
                        return (
                          <p key={idx}>
                            {parts.map((p, i) => (i % 2 === 1 ? <strong key={i} className="text-slate-900 font-bold">{p}</strong> : p))}
                          </p>
                        );
                      }
                      return <p key={idx}>{line}</p>;
                    })}
                  </div>

                  {/* ── 1. ADMIN ACTIONS EMBEDDED IN GREETING OR RESPONSES ── */}
                  {msg.showAdminActions && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-1 gap-1.5">
                      <button
                        onClick={handleStartAdminFeeCollection}
                        className="w-full text-left p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-xs font-extrabold text-emerald-950 flex items-center justify-between transition-all cursor-pointer shadow-2xs"
                      >
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                          <span>💰 Submit / Take Student Fees (QR / Cash)</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                      </button>

                      <button
                        onClick={handleStartAdminStudentUpdate}
                        className="w-full text-left p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs font-extrabold text-purple-950 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5 text-purple-700" />
                          <span>✏️ Update Student Information (Fees, Tracks, Grades)</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-purple-600" />
                      </button>

                      <button
                        onClick={handleAdminAuditFees}
                        className="w-full text-left p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-extrabold text-blue-950 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5 text-blue-700" />
                          <span>📊 Audit Student Remaining & Submitted Balances</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
                      </button>

                      <button
                        onClick={handlePromptMonthReceipt}
                        className="w-full text-left p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-extrabold text-amber-950 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Receipt className="w-3.5 h-3.5 text-amber-700" />
                          <span>🧾 Issue Month-Wise Official Fee Receipts</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                      </button>

                      <button
                        onClick={handleAdminFinancialMetrics}
                        className="w-full text-left p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-extrabold text-slate-800 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-slate-600" />
                          <span>📈 Inspect Academy Financial Metrics</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </div>
                  )}

                  {/* ── 2. ADMIN FEE SUBMISSION: STEP 1 (SELECT STUDENT) ── */}
                  {msg.isAdminFeeStudentSelect && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Select Student for Fee Payment:
                      </p>
                      {students.map((std) => (
                        <button
                          key={std.id}
                          onClick={() => handleAdminSelectFeeStudent(std)}
                          className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 hover:text-amber-950 flex items-center justify-between transition-all cursor-pointer"
                        >
                          <div>
                            <span className="block font-black text-slate-900">{std.name}</span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {std.course} • Total: ₹{std.totalFee} • Due: <strong className={std.remainingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}>₹{std.remainingAmount}</strong>
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            std.remainingAmount === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {std.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ── 3. ADMIN FEE SUBMISSION: STEP 2 (SELECT MONTH) ── */}
                  {msg.isAdminFeeMonthSelect && msg.selectedFeeStudent && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Select Installment for {msg.selectedFeeStudent.name}:
                      </p>
                      <button
                        onClick={() => handleAdminSelectFeeMonth(msg.selectedFeeStudent, 'Month 1 Installment', 4000)}
                        className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>🧾 Month 1 Fee (Core Java / Foundations)</span>
                        <span className="font-mono text-emerald-700 font-black">₹4,000</span>
                      </button>
                      <button
                        onClick={() => handleAdminSelectFeeMonth(msg.selectedFeeStudent, 'Month 2 Installment', 4000)}
                        className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>🧾 Month 2 Fee (Frameworks & APIs)</span>
                        <span className="font-mono text-emerald-700 font-black">₹4,000</span>
                      </button>
                      <button
                        onClick={() => handleAdminSelectFeeMonth(msg.selectedFeeStudent, 'Month 3 Installment', 4000)}
                        className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>🧾 Month 3 Fee (Capstone & ISO Certification)</span>
                        <span className="font-mono text-emerald-700 font-black">₹4,000</span>
                      </button>
                      <button
                        onClick={() => handleAdminSelectFeeMonth(
                          msg.selectedFeeStudent, 
                          'Full Remaining Balance Clearance', 
                          msg.selectedFeeStudent.remainingAmount || 4000
                        )}
                        className="w-full text-left p-2.5 rounded-xl bg-[#1c1d21] text-amber-300 hover:bg-black text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>📑 Settle Full Remaining Balance</span>
                        <span className="font-mono font-black text-amber-400">₹{(msg.selectedFeeStudent.remainingAmount || 4000).toLocaleString('en-IN')}</span>
                      </button>
                    </div>
                  )}

                  {/* ── 4. ADMIN FEE SUBMISSION: STEP 3 (SELECT PAYMENT MODE) ── */}
                  {msg.isAdminFeePaymentModeSelect && msg.selectedFeeStudent && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Choose Collection Mode:
                      </p>
                      <button
                        onClick={() => handleAdminSelectPaymentMode(
                          msg.selectedFeeStudent,
                          msg.selectedFeeMonth,
                          msg.selectedFeeAmount,
                          'razorpay'
                        )}
                        className="w-full p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black flex items-center justify-between transition-all cursor-pointer shadow-md"
                      >
                        <div className="flex items-center gap-2">
                          <QrCode className="w-5 h-5 text-amber-300" />
                          <div className="text-left">
                            <span className="block text-white">Razorpay Dynamic UPI QR</span>
                            <span className="block text-[10px] text-blue-100 font-normal">Auto-detects live GPay, PhonePe & Paytm payment</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white" />
                      </button>

                      <button
                        onClick={() => handleAdminSelectPaymentMode(
                          msg.selectedFeeStudent,
                          msg.selectedFeeMonth,
                          msg.selectedFeeAmount,
                          'cash'
                        )}
                        className="w-full p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black flex items-center justify-between transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-emerald-700" />
                          <div className="text-left">
                            <span className="block">Cash Collection at Front Desk</span>
                            <span className="block text-[10px] text-emerald-700 font-normal">Mark as received and generate instant receipt</span>
                          </div>
                        </div>
                        <Check className="w-4 h-4 text-emerald-700" />
                      </button>
                    </div>
                  )}

                  {/* ── 5. RAZORPAY DYNAMIC QR CODE DISPLAY CARD ── */}
                  {msg.isRazorpayQR && msg.qrData && (
                    <div className="mt-3 p-4 rounded-3xl bg-slate-900 text-white shadow-xl border border-white/10 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Razorpay UPI Gateway</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[9px] font-bold">
                          Live Active
                        </span>
                      </div>

                      {/* QR Visual */}
                      <div className="p-3 bg-white rounded-2xl max-w-[200px] mx-auto text-slate-900 text-center shadow-inner">
                        {/* Crisp SVG QR Code Representation */}
                        <svg viewBox="0 0 100 100" className="w-36 h-36 mx-auto" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100" height="100" fill="white" />
                          {/* Corner squares */}
                          <rect x="5" y="5" width="30" height="30" fill="black" rx="4" />
                          <rect x="9" y="9" width="22" height="22" fill="white" rx="2" />
                          <rect x="13" y="13" width="14" height="14" fill="#0f172a" rx="1" />

                          <rect x="65" y="5" width="30" height="30" fill="black" rx="4" />
                          <rect x="69" y="9" width="22" height="22" fill="white" rx="2" />
                          <rect x="73" y="13" width="14" height="14" fill="#0f172a" rx="1" />

                          <rect x="5" y="65" width="30" height="30" fill="black" rx="4" />
                          <rect x="9" y="69" width="22" height="22" fill="white" rx="2" />
                          <rect x="13" y="73" width="14" height="14" fill="#0f172a" rx="1" />

                          {/* Data points */}
                          <rect x="42" y="10" width="8" height="8" fill="#0f172a" />
                          <rect x="42" y="25" width="8" height="8" fill="#0f172a" />
                          <rect x="15" y="42" width="8" height="8" fill="#0f172a" />
                          <rect x="30" y="42" width="8" height="8" fill="#0f172a" />
                          <rect x="45" y="45" width="12" height="12" fill="#0284c7" rx="2" />
                          <rect x="65" y="42" width="8" height="8" fill="#0f172a" />
                          <rect x="80" y="42" width="8" height="8" fill="#0f172a" />
                          <rect x="42" y="65" width="8" height="8" fill="#0f172a" />
                          <rect x="42" y="80" width="8" height="8" fill="#0f172a" />
                          <rect x="65" y="65" width="8" height="8" fill="#0f172a" />
                          <rect x="80" y="80" width="8" height="8" fill="#0f172a" />
                        </svg>

                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-wider block mt-1">
                          Scan with Any UPI App
                        </span>
                      </div>

                      {/* Payment details */}
                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between text-slate-300">
                          <span>Student:</span>
                          <strong className="text-white">{msg.qrData.student.name}</strong>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Installment:</span>
                          <span className="text-white">{msg.qrData.monthName}</span>
                        </div>
                        <div className="flex justify-between text-amber-400 font-bold border-t border-white/10 pt-1">
                          <span>Payable Amount:</span>
                          <span className="font-mono text-sm">₹{msg.qrData.amount.toLocaleString('en-IN')}.00</span>
                        </div>
                      </div>

                      {/* Auto-detect button */}
                      <button
                        onClick={() => {
                          setQrVerifyingId(msg.qrData.qrId);
                          setTimeout(() => {
                            setQrVerifyingId(null);
                            handleCompleteFeePayment(
                              msg.qrData.student,
                              msg.qrData.monthName,
                              msg.qrData.amount,
                              'Razorpay Dynamic UPI'
                            );
                          }, 1000);
                        }}
                        disabled={qrVerifyingId === msg.qrData.qrId}
                        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg disabled:opacity-75"
                      >
                        {qrVerifyingId === msg.qrData.qrId ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            <span>Verifying Razorpay Webhook...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>⚡ Auto-Detect & Verify Razorpay Payment</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* ── 6. NESTED SUB-QUESTION: ADMIN SELECT STUDENT TO UPDATE PROFILE ── */}
                  {msg.isAdminStudentSelect && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Choose Student to Edit:
                      </p>
                      {students.map((std) => (
                        <button
                          key={std.id}
                          onClick={() => handleSelectStudentToUpdate(std)}
                          className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 hover:text-amber-900 flex items-center justify-between transition-all cursor-pointer"
                        >
                          <div>
                            <span className="block">{std.name}</span>
                            <span className="text-[10px] text-slate-500 font-normal">{std.course} • {std.status}</span>
                          </div>
                          <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ── 7. NESTED SUB-QUESTION: ADMIN SELECT FIELD TO UPDATE ── */}
                  {msg.isAdminFieldSelect && msg.selectedStudent && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Select Field to Update for {msg.selectedStudent.name}:
                      </p>
                      <button
                        onClick={() => handleExecuteAdminUpdate(
                          msg.selectedStudent.id, 
                          'fee_mark_paid', 
                          null, 
                          `Marked all pending fees as **PAID** (₹${msg.selectedStudent.totalFee} Total Settled). All installments cleared.`
                        )}
                        className="w-full text-left p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-900 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>💰 Mark Pending Fees as Fully Paid (₹0 Due)</span>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                      <button
                        onClick={() => handleExecuteAdminUpdate(
                          msg.selectedStudent.id, 
                          'course', 
                          'Full Stack Super Combo (Java + MERN + AI)', 
                          `Upgraded course track to **Full Stack Super Combo (Java + MERN + AI)**.`
                        )}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>🎓 Upgrade Track: Super Combo Track</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                      </button>
                      <button
                        onClick={() => handleExecuteAdminUpdate(
                          msg.selectedStudent.id, 
                          'grade', 
                          'A+ (Grandmaster & Top 1%)', 
                          `Promoted student performance rating to **A+ Grandmaster (Top 1%)**.`
                        )}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>🎖️ Upgrade Grade: A+ Grandmaster</span>
                        <Award className="w-3.5 h-3.5 text-purple-600" />
                      </button>
                    </div>
                  )}

                  {/* ── 8. MONTH RECEIPT PROMPT ── */}
                  {msg.isMonthReceiptPrompt && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Select Month Invoice:
                      </p>
                      <button
                        onClick={() => handleGenerateSpecificMonthReceipt('Month 1', 4000, 'PAID', 'Admission & Core OOPs')}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 hover:text-amber-900 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>🧾 Month 1 Receipt (Admission - ₹4,000)</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">PAID</span>
                      </button>
                      <button
                        onClick={() => handleGenerateSpecificMonthReceipt('Month 2', 4000, 'PAID', 'Spring Boot & Database Frameworks')}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 hover:text-amber-900 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>🧾 Month 2 Receipt (Mid-Term - ₹4,000)</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">PAID</span>
                      </button>
                      <button
                        onClick={() => handleGenerateSpecificMonthReceipt('Month 3', 4000, 'DUE', 'Capstone Project & ISO Certificate')}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 hover:text-amber-900 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>🧾 Month 3 Receipt (Final Phase - ₹4,000)</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded-md">PENDING</span>
                      </button>
                      <button
                        onClick={() => handleGenerateSpecificMonthReceipt('Full Course Consolidated', 12000, 'PARTIAL', 'Complete 3-Month Program Invoice')}
                        className="w-full text-left p-2 rounded-xl bg-[#1c1d21] text-amber-300 hover:bg-black text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>📑 Full Consolidated Invoice (₹12,000)</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    </div>
                  )}

                  {/* ── 9. DSA SUB-QUESTIONS ── */}
                  {msg.isDSAPrompt && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Select Algorithm / System Design Topic:
                      </p>
                      <button
                        onClick={() => handleShowDSASolution(
                          'Binary Search Tree (BST)', 
                          'O(log N) average, O(N) worst-case', 
                          'A node-based hierarchical data structure where left subtree has keys < root, and right subtree has keys > root.',
                          '/tutorials'
                        )}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>🌲 Binary Search Tree: Insertion & Traversals</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                      </button>
                      <button
                        onClick={() => handleShowDSASolution(
                          'Sliding Window Technique', 
                          'O(N) Linear Time, O(1) Auxiliary Space', 
                          'Optimizes nested O(N^2) subarray problems into single-pass O(N) by maintaining two pointers.',
                          '/tutorials'
                        )}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>⚡ Sliding Window: Max Subarray & Substrings</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                      </button>
                    </div>
                  )}

                  {/* ── 10. DIGITAL RECEIPT CARD ── */}
                  {msg.isReceipt && msg.receiptData && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 text-slate-900 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                        <div>
                          <p className="font-black text-xs text-[#5B468C] tracking-tight">AppleTree Infotech Pvt. Ltd.</p>
                          <p className="text-[9px] text-slate-500">Official Verified Fee Receipt</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-black border border-emerald-200">
                          {msg.receiptData.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <span className="text-slate-400 block font-bold">RECEIPT NO:</span>
                          <span className="font-mono font-bold text-slate-800">{msg.receiptData.receiptNo}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold">DATE:</span>
                          <span className="font-bold text-slate-800">{msg.receiptData.date}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block font-bold">STUDENT:</span>
                          <span className="font-bold text-slate-900 text-xs">{msg.receiptData.studentName}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block font-bold">PROGRAM:</span>
                          <span className="font-semibold text-slate-800">{msg.receiptData.course}</span>
                        </div>
                      </div>

                      <div className="border-t border-amber-200/80 pt-2 space-y-1 text-[11px]">
                        <div className="flex justify-between text-slate-600">
                          <span>Total Course Fee:</span>
                          <span className="font-bold">₹{msg.receiptData.totalFee.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Amount Collected:</span>
                          <span>₹{msg.receiptData.paidAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-rose-600 font-black border-t border-dashed border-amber-300 pt-1">
                          <span>Remaining Balance Due:</span>
                          <span>₹{msg.receiptData.remainingAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => window.print()}
                          className="flex-1 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <Printer className="w-3 h-3 text-slate-600" />
                          <span>Print / PDF</span>
                        </button>
                        {msg.receiptData.remainingAmount > 0 && (
                          <button
                            onClick={() => handleNavigate(user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/student')}
                            className="flex-1 py-1.5 rounded-xl bg-[#1c1d21] hover:bg-black text-white text-[10px] font-bold flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                          >
                            <CreditCard className="w-3 h-3 text-amber-400" />
                            <span>Pay Balance</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 1-Click Action Link */}
                  {msg.actionLink && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleNavigate(msg.actionLink)}
                        className="inline-flex items-center gap-1.5 bg-[#1c1d21] hover:bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer"
                      >
                        <span>{msg.actionText || 'Continue'}</span>
                        <ArrowRight className="w-3 h-3 text-amber-400" />
                      </button>
                    </div>
                  )}

                </div>

                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl rounded-bl-none max-w-[120px] shadow-sm">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-amber-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── PERSISTENT ROLE-BASED QUICK CHIPS BAR ── */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200/80 overflow-x-auto">
            <div className="flex items-center gap-1.5 text-[11px] font-bold whitespace-nowrap">
              
              {/* IF ADMIN LOGGED IN: ONLY SHOW ADMIN QUESTIONS */}
              {role === 'admin' && (
                <>
                  <button
                    onClick={handleStartAdminFeeCollection}
                    className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-2xs"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                    <span>💰 Submit Student Fee</span>
                  </button>

                  <button
                    onClick={handleStartAdminStudentUpdate}
                    className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-purple-700" />
                    <span>✏️ Update Student Record</span>
                  </button>

                  <button
                    onClick={handleAdminAuditFees}
                    className="px-3 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-950 border border-blue-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Wallet className="w-3.5 h-3.5 text-blue-700" />
                    <span>📊 Audit Fee Balances</span>
                  </button>

                  <button
                    onClick={handlePromptMonthReceipt}
                    className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Receipt className="w-3.5 h-3.5 text-amber-700" />
                    <span>🧾 Issue Fee Receipt</span>
                  </button>

                  <button
                    onClick={handleAdminFinancialMetrics}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition-all cursor-pointer shrink-0"
                  >
                    <span>📈 Financial Metrics</span>
                  </button>
                </>
              )}

              {/* IF STUDENT LOGGED IN: ONLY SHOW STUDENT QUESTIONS */}
              {(role === 'student' || role === 'user') && (
                <>
                  <button
                    onClick={handlePromptMonthReceipt}
                    className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Receipt className="w-3.5 h-3.5 text-amber-700" />
                    <span>🧾 My Fee Receipts</span>
                  </button>

                  <button
                    onClick={handleStudentRemainingFees}
                    className="px-3 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Wallet className="w-3.5 h-3.5 text-blue-700" />
                    <span>💳 Remaining Fees Due</span>
                  </button>

                  <button
                    onClick={handlePromptDSATopic}
                    className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Code2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>🧠 DSA Tutorials Hub</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('/dashboard/student')}
                    className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-700" />
                    <span>📄 Admin Documents</span>
                  </button>
                </>
              )}

              {/* IF GUEST: ONLY SHOW GUEST / PROSPECTIVE STUDENT QUESTIONS */}
              {role === 'guest' && (
                <>
                  <button
                    onClick={handleShowAllCourses}
                    className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
                    <span>📚 All Courses & Prices</span>
                  </button>

                  <button
                    onClick={handleShowComboCourses}
                    className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Percent className="w-3.5 h-3.5 text-rose-700" />
                    <span>🎁 Combo Bundles (40% OFF)</span>
                  </button>

                  <button
                    onClick={handleShowHowToBuy}
                    className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <span>🛒 How to Buy</span>
                  </button>

                  <button
                    onClick={handlePromptDSATopic}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition-all cursor-pointer shrink-0"
                  >
                    <span>🧠 Free DSA Guide</span>
                  </button>
                </>
              )}

            </div>
          </div>

          {/* Footer Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={role === 'admin' ? "Submit fee, edit student, audit ledger..." : "Ask about fee receipts, courses, DSA..."}
              className="flex-1 bg-slate-100 text-slate-900 px-3.5 py-2.5 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-2xl bg-[#1c1d21] text-amber-400 hover:bg-black flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
