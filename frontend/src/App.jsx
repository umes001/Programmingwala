import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx';

// Public Pages
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Admissions from './pages/Admissions.jsx';
import Programs from './pages/Programs.jsx';
import Facilities from './pages/Facilities.jsx';
import Gallery from './pages/Gallery.jsx';
import Calendar from './pages/Calendar.jsx';
import Meetings from './pages/Meetings.jsx';
import Fees from './pages/Fees.jsx';
import Brochure from './pages/Brochure.jsx';
import FeeStructurePage from './pages/FeeStructurePage.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Practice from './pages/Practice.jsx';
import Tutorials from './pages/Tutorials.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import RazorpayTestPage from './pages/RazorpayTestPage.jsx';
import VerifyCertificate from './pages/VerifyCertificate.jsx';
import ManishKumarProfile from './pages/ManishKumarProfile.jsx';
import CareerTrackHub from './pages/careers/CareerTrackHub.jsx';
import CareerTrackDetail from './pages/careers/CareerTrackDetail.jsx';
import GhaziabadCourseHub from './pages/courses/GhaziabadCourseHub.jsx';
import GhaziabadCourseDetail from './pages/courses/GhaziabadCourseDetail.jsx';

// LMS Pages
import LMS from './pages/LMS.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import LearningPage from './pages/LearningPage.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';

// Portal Dashboards
import ParentDashboard from './portals/ParentDashboard.jsx';
import TeacherDashboard from './portals/TeacherDashboard.jsx';
import AdminDashboard from './portals/AdminDashboard.jsx';

// Online Examination System
import ExamRegister from './pages/exam/ExamRegister.jsx';
import ExamLogin from './pages/exam/ExamLogin.jsx';
import ExamDashboard from './pages/exam/ExamDashboard.jsx';
import ExamTaker from './pages/exam/ExamTaker.jsx';
import ExamResult from './pages/exam/ExamResult.jsx';
import AdminExamSuite from './portals/examAdmin/AdminExamSuite.jsx';
import TakeTest from './pages/exam/TakeTest.jsx';
import StudentRegister from './pages/exam/StudentRegister.jsx';
import AssessmentAdmin from './pages/AssessmentAdmin.jsx';
import KbcExam from './pages/exam/KbcExam.jsx';
import AdminKbcManager from './portals/examAdmin/AdminKbcManager.jsx';
import ArenaHub from './pages/arena/ArenaHub.jsx';
import ArenaProblem from './pages/arena/ArenaProblem.jsx';
import ArenaProfile from './pages/arena/ArenaProfile.jsx';
import PortfolioBuilder from './pages/portfolio/PortfolioBuilder.jsx';
import PublicPortfolio from './pages/portfolio/PublicPortfolio.jsx';

// Layout Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import RoleLoginChatbot from './components/RoleLoginChatbot.jsx';

// Private Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brandCream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-bounce font-quicksand font-bold text-3xl text-brandCoral">🧸</div>
          <p className="mt-2 text-slate-500 font-quicksand font-medium">Entering School gates...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
    if (user.role === 'teacher') return <Navigate to="/dashboard/teacher" replace />;
    if (user.role === 'parent') return <Navigate to="/dashboard/parent" replace />;
    if (user.role === 'user' || user.role === 'student') return <Navigate to="/dashboard/student" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

// Global Canonical & SEO Manager (Guarantees every page has an exact self-referential canonical URL)
function CanonicalManager() {
  const location = useLocation();

  React.useEffect(() => {
    const cleanPath = location.pathname.replace(/\/+$/, '') || '';
    const canonicalUrl = cleanPath === '' ? 'https://programmingwala.com/' : `https://programmingwala.com${cleanPath}`;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [location.pathname]);

  return null;
}

// Inner layout — must be inside <Router> so useLocation works
function AppLayout({ pointer, glowY, glowX, isDark, onPointerMove }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isExamPage = location.pathname.startsWith('/test') || location.pathname.startsWith('/kbc') || location.pathname.startsWith('/dashboard/admin/tests') || location.pathname.startsWith('/assessment-admin');
  const isAdminPage = location.pathname.startsWith('/dashboard/admin') || location.pathname.startsWith('/portal/admin');
  const isArenaProblem = location.pathname.startsWith('/arena/problem');

  // List of standard known root paths that belong to the school portal / main website
  const standardRootPaths = new Set([
    '', 'about', 'admissions', 'programs', 'facilities', 'gallery', 'calendar', 'meetings',
    'fees', 'fee-structure', 'brochure', 'contact', 'login', 'practice', 'arena', 'coding-arena',
    'hackerrank', 'leaderboard', 'tutorials', 'music', 'games', 'payment-demo', 'verify-certificate',
    'certificate', 'cert', 'manish-kumar', 'profile', 'manish', 'careers', 'job-roles', 'trending-tech-jobs',
    'courses-in-ghaziabad', 'coaching-in-rdc-ghaziabad', 'courses', 'coaching', 'lms', 'student',
    'student-portal', 'dashboard', 'portal', 'test', 'assessment', 'assessment-admin', 'kbc'
  ]);

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const firstSegment = (pathSegments[0] || '').toLowerCase();
  
  // A portfolio route is /portfolio/*, /p/*, /student/portfolio, OR any single slug like /manishrajput
  const isPortfolioRoute = location.pathname.startsWith('/portfolio') ||
                           location.pathname.startsWith('/p/') ||
                           location.pathname === '/student/portfolio' ||
                           (pathSegments.length === 1 && !standardRootPaths.has(firstSegment));

  const hideHeaderFooter = isLoginPage || isExamPage || isArenaProblem || isPortfolioRoute;
  const hideChatbot = hideHeaderFooter || isAdminPage || isPortfolioRoute;

  return (
    <div
      onMouseMove={onPointerMove}
      className={`relative flex min-h-screen flex-col overflow-x-hidden transition-colors duration-300 ${
        isPortfolioRoute
          ? 'bg-transparent text-[#1C1917]'
          : isDark ? 'bg-slate-950 text-white' : 'bg-brandCream text-slate-800'
      }`}
    >
      <CanonicalManager />
      {!isPortfolioRoute && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 opacity-80"
            style={{
              background: isDark
                ? `radial-gradient(380px circle at ${pointer.x}px ${pointer.y}px, rgba(56, 189, 248, 0.14), transparent 35%), radial-gradient(420px circle at 85% 18%, rgba(99, 102, 241, 0.12), transparent 26%), linear-gradient(135deg, rgba(2, 6, 23, 0.95), rgba(15, 23, 42, 0.98))`
                : `radial-gradient(420px circle at ${pointer.x}px ${pointer.y}px, rgba(255, 112, 67, 0.10), transparent 35%), radial-gradient(460px circle at 85% 12%, rgba(79, 195, 247, 0.12), transparent 28%), linear-gradient(135deg, rgba(252, 251, 247, 0.96), rgba(243, 239, 233, 0.98))`
            }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed left-[8%] top-[12%] h-40 w-40 rounded-full bg-cyan-400/8 blur-3xl"
            style={{ y: glowY, x: glowX }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed bottom-[10%] right-[6%] h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl"
            style={{ y: glowY, x: glowX }}
          />
        </>
      )}
      {!hideHeaderFooter && <Navbar />}
      <main className={`relative z-10 flex-grow ${isPortfolioRoute ? 'p-0 m-0 w-full min-h-screen' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/fee-structure" element={<Navigate to="/fees" replace />} />
          <Route path="/brochure" element={<Brochure />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/arena" element={<ArenaHub />} />
          <Route path="/coding-arena" element={<Navigate to="/arena" replace />} />
          <Route path="/hackerrank" element={<Navigate to="/arena" replace />} />
          <Route path="/arena/problem/:id" element={<ArenaProblem />} />
          <Route path="/arena/profile" element={<ArenaProfile />} />
          <Route path="/student/profile" element={<ArenaProfile />} />
          <Route path="/student/portfolio" element={<PortfolioBuilder />} />
          <Route path="/portfolio" element={<Navigate to="/student/portfolio" replace />} />
          <Route path="/portfolio/:id" element={<PublicPortfolio />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/music" element={<Navigate to="/" replace />} />
          <Route path="/games" element={<Navigate to="/" replace />} />
          <Route path="/payment-demo" element={<RazorpayTestPage />} />
          <Route path="/verify-certificate" element={<VerifyCertificate />} />
          <Route path="/verify-certificate/:certNumber" element={<VerifyCertificate />} />
          <Route path="/certificate/:certNumber" element={<VerifyCertificate />} />
          <Route path="/cert/:certNumber" element={<VerifyCertificate />} />
          <Route path="/manish-kumar" element={<ManishKumarProfile />} />
          <Route path="/profile/manish-kumar" element={<Navigate to="/manish-kumar" replace />} />
          <Route path="/manish" element={<Navigate to="/manish-kumar" replace />} />
          
          {/* High-Impact SEO Tech Career Tracks */}
          <Route path="/careers" element={<CareerTrackHub />} />
          <Route path="/job-roles" element={<Navigate to="/careers" replace />} />
          <Route path="/trending-tech-jobs" element={<Navigate to="/careers" replace />} />
          <Route path="/careers/:slug" element={<CareerTrackDetail />} />
          <Route path="/jobs/:slug" element={<Navigate to="/careers" replace />} />

          {/* Local SEO: Best Tech Coaching in RDC Ghaziabad */}
          <Route path="/courses-in-ghaziabad" element={<GhaziabadCourseHub />} />
          <Route path="/coaching-in-rdc-ghaziabad" element={<Navigate to="/courses-in-ghaziabad" replace />} />
          <Route path="/courses/best-tech-coaching-rdc-ghaziabad" element={<Navigate to="/courses-in-ghaziabad" replace />} />
          <Route path="/courses/:slug" element={<GhaziabadCourseDetail />} />
          <Route path="/coaching/:slug" element={<Navigate to="/courses-in-ghaziabad" replace />} />

          {/* LMS & Student Portal Routes */}
          <Route path="/lms" element={<LMS />} />
          <Route path="/lms/courses/:id" element={<CourseDetail />} />
          <Route path="/lms/learn/:id" element={<LearningPage />} />
          <Route path="/lms/dashboard" element={<StudentDashboard />} />
          <Route path="/lms/dashboard/*" element={<StudentDashboard />} />
          <Route path="/dashboard/student" element={<ProtectedRoute allowedRoles={['user', 'student', 'admin', 'parent', 'teacher']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/student/*" element={<ProtectedRoute allowedRoles={['user', 'student', 'admin', 'parent', 'teacher']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/portal/student" element={<ProtectedRoute allowedRoles={['user', 'student', 'admin', 'parent', 'teacher']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/portal/student/*" element={<ProtectedRoute allowedRoles={['user', 'student', 'admin', 'parent', 'teacher']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student" element={<Navigate to="/dashboard/student" replace />} />
          <Route path="/student/dashboard" element={<Navigate to="/dashboard/student" replace />} />
          <Route path="/student-portal" element={<Navigate to="/dashboard/student" replace />} />

          {/* Protected Portal Dashboards */}
          <Route path="/dashboard/parent" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/teacher" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

          {/* Online Examination / Test Module Routes */}
          <Route path="/test/register" element={<ExamRegister />} />
          <Route path="/test/login" element={<ExamLogin />} />
          <Route path="/test/dashboard" element={<ExamDashboard />} />
          <Route path="/test/exam/:examId" element={<ExamTaker />} />
          <Route path="/test/result/:attemptId" element={<ExamResult />} />
          <Route path="/test/results" element={<ExamDashboard />} />
          <Route path="/test/:id/register" element={<StudentRegister />} />
          <Route path="/assessment/register/:id" element={<StudentRegister />} />
          <Route path="/test/:id" element={<TakeTest />} />
          <Route path="/test" element={<Navigate to="/test/login" replace />} />

          {/* Kaun Banega Crorepati (KBC) MERN & SQL Quiz Arena */}
          <Route path="/kbc" element={<KbcExam />} />
          <Route path="/test/kbc" element={<KbcExam />} />
          <Route path="/exam/kbc" element={<KbcExam />} />
          <Route path="/dashboard/admin/kbc" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><AdminKbcManager /></ProtectedRoute>} />

          {/* Assessment Management Suite */}
          <Route path="/assessment-admin" element={<AssessmentAdmin />} />
          <Route path="/assessment-admin/*" element={<AssessmentAdmin />} />
          <Route path="/dashboard/admin/assessment" element={<AssessmentAdmin />} />

          {/* Admin Examination Control Suite */}
          <Route path="/dashboard/admin/tests" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><AdminExamSuite /></ProtectedRoute>} />
          <Route path="/dashboard/admin/tests/*" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><AdminExamSuite /></ProtectedRoute>} />

          {/* Direct Personal Portfolio Root URL: https://programmingwala.com/{student-name} */}
          <Route path="/p/:id" element={<PublicPortfolio />} />
          <Route path="/:studentSlug" element={<PublicPortfolio />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
      {!hideChatbot && <RoleLoginChatbot />}
    </div>
  );
}

function AppInner() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const glowY = useTransform(scrollY, [0, 400], [0, 24]);
  const glowX = useTransform(scrollY, [0, 400], [0, -18]);
  const { isDark } = useTheme();

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <AuthProvider>
      <Router>
        <AppLayout
          pointer={pointer}
          glowY={glowY}
          glowX={glowX}
          isDark={isDark}
          onPointerMove={handlePointerMove}
        />
      </Router>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
