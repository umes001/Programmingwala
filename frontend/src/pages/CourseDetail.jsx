import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { 
  PlayCircle, Clock, BookOpen, Star, Users, ChevronRight, 
  CheckCircle, CreditCard, Lock, ShieldCheck, Zap, LogIn, 
  Award, Video, Download, MessageSquare, BarChart, ChevronLeft, 
  Bookmark, Share2, Play, Eye, BookOpenCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Color theme mapping for gradients
const CATEGORY_THEMES = {
  development: 'from-blue-600 to-indigo-800 shadow-blue-500/10',
  design: 'from-pink-600 to-rose-800 shadow-rose-500/10',
  marketing: 'from-purple-600 to-violet-800 shadow-purple-500/10',
  'early-learning': 'from-emerald-600 to-teal-800 shadow-emerald-500/10',
  default: 'from-orange-500 to-brandCoral shadow-orange-500/10'
};

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { isDark } = useTheme();

  // Core State
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [paymentStep, setPaymentStep] = useState('idle'); // idle | creating | checkout | verifying | done

  // Accordion active state for modules
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const authToken = token || localStorage.getItem('token');
      const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};

      const courseResponse = await fetch(`/api/lms/courses/${id}`, { headers });
      const courseData = await courseResponse.json();
      
      if (courseData.success) {
        setCourse(courseData.data);
        setEnrollment(courseData.data.enrollment);
        
        const modulesResponse = await fetch(`/api/lms/courses/${id}/modules`, { headers });
        const modulesData = await modulesResponse.json();
        
        if (modulesData.success) {
          setModules(modulesData.data);
          // Expand first module by default
          if (modulesData.data.length > 0) {
            setExpandedModules({ [modulesData.data[0]._id]: true });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Helper to load Razorpay
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
  };

  // Handle Enrollment / Purchase Flow
  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const authToken = token || localStorage.getItem('token');
    const isFree = !course.price || Number(course.price) <= 0;

    // ── FREE COURSE ── direct enroll and redirect to learning page
    if (isFree) {
      setEnrolling(true);
      try {
        const res = await fetch(`/api/lms/courses/${id}/enroll`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();
        if (data.success) {
          setEnrollment(data.data);
          confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
          navigate(`/lms/learn/${id}`);
        } else {
          alert(data.message || 'Enrollment failed');
        }
      } catch (err) {
        console.error(err);
        alert('Something went wrong. Please try again.');
      } finally {
        setEnrolling(false);
      }
      return;
    }

    // ── PAID COURSE ── Razorpay standard web checkout
    setPaymentStep('creating');
    try {
      // Create Razorpay order on backend
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${authToken}` 
        },
        body: JSON.stringify({
          amount: Math.round(Number(course.price) * 100),
          currency: 'INR',
          receipt: `course_${id}_${Date.now()}`
        })
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        alert(orderData.message || 'Could not initiate payment');
        setPaymentStep('idle');
        return;
      }

      setPaymentStep('checkout');
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert('Failed to load Razorpay. Please check your internet connection.');
        setPaymentStep('idle');
        return;
      }

      const options = {
        key: orderData.keyId || 'rzp_test_TDN5lD1IiJZXoG',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Appletree Coaching Centre',
        description: `Enrollment: ${course.title}`,
        order_id: orderData.order_id,
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || ''
        },
        theme: { color: '#FF7043' },
        modal: {
          ondismiss: () => {
            setPaymentStep('idle');
          }
        },
        handler: async (response) => {
          setPaymentStep('verifying');
          try {
            // Verify payment on server
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
              },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              alert('Payment verification failed. Please contact support.');
              setPaymentStep('idle');
              return;
            }

            // Enroll after verified payment
            const enrollRes = await fetch(`/api/lms/courses/${id}/enroll`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` 
              },
              body: JSON.stringify({ paymentId: response.razorpay_payment_id })
            });

            const enrollData = await enrollRes.json();
            if (enrollData.success) {
              setEnrollment(enrollData.data);
              setPaymentStep('done');
              confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
              navigate(`/lms/learn/${id}`);
            } else {
              alert(enrollData.message || 'Enrollment completion failed. Please contact support.');
              setPaymentStep('idle');
            }
          } catch (err) {
            console.error('Verify/enroll error:', err);
            alert('Something went wrong during verification.');
            setPaymentStep('idle');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        alert(resp.error?.description || 'Payment transaction failed.');
        setPaymentStep('idle');
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      alert('Could not complete checkout initialization.');
      setPaymentStep('idle');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-quicksand ${
        isDark ? 'bg-slate-950 text-white' : 'bg-brandCream text-slate-800'
      }`}>
        <div className="text-center space-y-3">
          <div className="animate-spin text-brandCoral text-3xl">⏳</div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-70">Loading Course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center font-quicksand ${
        isDark ? 'bg-slate-950 text-white' : 'bg-brandCream text-slate-800'
      }`}>
        <div className="text-center space-y-4 max-w-sm p-8 border rounded-3xl bg-white/5 border-white/10">
          <p className="text-sm font-bold text-rose-500">Course not found or has been removed.</p>
          <Link to="/lms" className="inline-block px-5 py-2.5 rounded-full bg-brandCoral text-white font-extrabold text-xs tracking-wider">
            BACK TO COURSES
          </Link>
        </div>
      </div>
    );
  }

  const isEnrolled = !!enrollment;
  const isFree = !course.price || Number(course.price) <= 0;
  const displayPrice = course.price;
  const totalLessons = modules.reduce((total, module) => total + (module.lessons?.length || 0), 0);
  const themeClass = CATEGORY_THEMES[course.category] || CATEGORY_THEMES.default;

  return (
    <div className={`min-h-screen font-quicksand pb-24 transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-brandCream text-slate-800'
    }`}>
      
      {/* 1. HERO BANNER HEADER */}
      <div className={`relative overflow-hidden py-16 text-white bg-gradient-to-r ${themeClass}`}>
        {/* Background glow animations */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider opacity-80 mb-6">
            <Link to="/lms" className="hover:underline flex items-center space-x-1">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>COURSES</span>
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="opacity-70">{course.category?.replace('-', ' ')}</span>
          </div>

          {/* Title and Short description */}
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
              {course.title}
            </h1>
            <p className="text-sm md:text-base leading-relaxed opacity-90 font-medium mb-8">
              {course.description}
            </p>
          </div>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-5 text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center space-x-2">
              <img
                src={course.instructor?.profileImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                alt={course.instructor?.name}
                className="w-7 h-7 rounded-full object-cover border border-white/20"
              />
              <span className="opacity-95">{course.instructor?.name || 'School Instructor'}</span>
            </div>

            <div className="h-4 w-px bg-white/20" />

            <div className="flex items-center text-amber-300">
              <Star className="w-4 h-4 fill-amber-300 mr-1.5" />
              <span className="text-white">{course.rating?.toFixed(1) || '5.0'}</span>
              <span className="opacity-60 lowercase ml-1">({course.totalRatings || 1} ratings)</span>
            </div>

            <div className="h-4 w-px bg-white/20" />

            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1.5 opacity-80" />
              <span>{course.totalEnrollments || 0} students enrolled</span>
            </div>

            <div className="h-4 w-px bg-white/20" />

            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5 opacity-80" />
              <span>{course.totalDuration || 60} mins total duration</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SPLIT LAYOUT GRID */}
      <div className="container mx-auto px-6 max-w-6xl mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: OVERVIEW & CURRICULUM ACCORDION */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Overview / About Section */}
            <div className={`p-8 rounded-3xl border ${
              isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white border-orange-100/50 shadow-sm'
            }`}>
              <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-brandCoral" />
                <span>About this Course</span>
              </h2>
              <div className={`text-xs leading-relaxed font-semibold space-y-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {course.detailedDescription || course.description}
              </div>

              {/* Milestones grid */}
              {course.milestones && course.milestones.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-4">What you will learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.milestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs font-semibold">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Curriculum Accordion */}
            <div className={`p-8 rounded-3xl border ${
              isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white border-orange-100/50 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black flex items-center gap-2">
                    <BookOpenCheck className="w-5 h-5 text-brandCoral" />
                    <span>Course Curriculum</span>
                  </h2>
                  <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                    {modules.length} Modules • {totalLessons} Lessons
                  </p>
                </div>
              </div>

              {/* Module list accordion */}
              {modules.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-2xl border-orange-100 dark:border-white/5">
                  <PlayCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-400">Curriculum is being prepared. Check back shortly!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {modules.map((mod, modIdx) => {
                    const isExpanded = expandedModules[mod._id];
                    return (
                      <div key={mod._id} className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                        isDark ? 'border-white/5 bg-slate-950/40' : 'border-orange-100 bg-slate-50/50'
                      }`}>
                        {/* Module header tab */}
                        <button
                          onClick={() => toggleModule(mod._id)}
                          className="w-full flex items-center justify-between p-4 text-left font-bold"
                        >
                          <div className="pr-4">
                            <span className="text-[10px] uppercase tracking-widest text-brandCoral font-black">
                              Module {modIdx + 1}
                            </span>
                            <h3 className="text-sm font-black mt-0.5 text-slate-800 dark:text-white">
                              {mod.title}
                            </h3>
                          </div>
                          <span className="text-xs text-brandCoral font-black uppercase shrink-0">
                            {isExpanded ? 'Hide' : 'Show'}
                          </span>
                        </button>

                        {/* Module lessons panel */}
                        {isExpanded && (
                          <div className="border-t border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900/30">
                            {!mod.lessons || mod.lessons.length === 0 ? (
                              <p className="p-4 text-xs font-semibold text-slate-400">No lessons uploaded yet.</p>
                            ) : (
                              <div className="divide-y divide-slate-100 dark:divide-white/5">
                                {mod.lessons.map((lesson, lesIdx) => (
                                  <div key={lesson._id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="flex items-center space-x-3 pr-4">
                                      <Play className="w-4 h-4 text-slate-400 shrink-0" />
                                      <div>
                                        <h4 className="text-xs font-black text-slate-800 dark:text-slate-105">
                                          {lesIdx + 1}. {lesson.title}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">
                                          {lesson.description || 'Watch tutorial lesson video'}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2 shrink-0">
                                      {lesson.videoDuration > 0 && (
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                                          {Math.round(lesson.videoDuration / 60)}m
                                        </span>
                                      )}
                                      {isEnrolled || isFree ? (
                                        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                                          Unlocked
                                        </span>
                                      ) : (
                                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Instructor Profile card */}
            <div className={`p-8 rounded-3xl border ${
              isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white border-orange-100/50 shadow-sm'
            }`}>
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-brandCoral" />
                <span>Your Instructor</span>
              </h2>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <img
                  src={course.instructor?.profileImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200'}
                  alt={course.instructor?.name}
                  className="w-20 h-20 rounded-3xl object-cover shadow-lg border border-brandCoral/20 shrink-0"
                />
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-base font-black text-slate-800 dark:text-white">
                    {course.instructor?.name || 'Miss Emily Stone'}
                  </h3>
                  <p className="text-[10px] font-black tracking-widest text-brandCoral uppercase">
                    {course.instructor?.qualifications || 'Early Childhood Specialist'}
                  </p>
                  <p className={`text-xs font-semibold leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                    {course.instructor?.bio || 'Dedicated child education coordinator guiding early developers using sandbox environments, coding toys, and logical visual-reasoning models.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY PURCHASE CARD */}
          <div className="space-y-6 lg:sticky lg:top-24">
            
            <div className={`overflow-hidden rounded-3xl border transition-all duration-300 shadow-xl ${
              isDark 
                ? 'border-white/10 bg-slate-900/60 backdrop-blur-md shadow-cyan-950/10' 
                : 'border-orange-100 bg-white shadow-orange-100/40'
            }`}>
              {/* Image banner / placeholder */}
              <div className="relative aspect-video bg-slate-950/20 overflow-hidden flex items-center justify-center border-b dark:border-white/5">
                {course.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-brandCoral/30 to-brandSky/20 flex items-center justify-center">
                    <Video className="w-10 h-10 text-brandCoral/80 animate-pulse" />
                  </div>
                )}
                
                {/* Floating free preview badge */}
                {(isEnrolled || isFree) && (
                  <Link
                    to={`/lms/learn/${id}`}
                    className="absolute inset-0 bg-black/40 hover:bg-black/50 transition-all flex items-center justify-center group"
                  >
                    <div className="w-12 h-12 rounded-full bg-brandCoral flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </Link>
                )}
              </div>

              {/* Price & CTA details */}
              <div className="p-6 space-y-6">
                
                {/* Price display tags */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                    Course Investment
                  </span>
                  {isFree ? (
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-black text-emerald-500">FREE</span>
                      <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">
                        Open Access
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-end gap-2.5">
                      <span className="text-3xl font-black text-slate-800 dark:text-white">
                        ₹{displayPrice}
                      </span>
                      {course.discountedPrice > 0 && course.discountedPrice < course.price && (
                        <span className="text-sm font-bold text-slate-400 line-through mb-1">
                          ₹{course.discountedPrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Main Action Button */}
                <div>
                  {isEnrolled ? (
                    <Link
                      to={`/lms/learn/${id}`}
                      className="w-full py-4 rounded-2xl bg-brandCoral hover:bg-orange-600 text-white font-extrabold text-xs tracking-wider transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 flex items-center justify-center space-x-2"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>START LEARNING NOW</span>
                    </Link>
                  ) : isFree ? (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full py-4 rounded-2xl bg-brandCoral hover:bg-orange-600 text-white font-extrabold text-xs tracking-wider transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 flex items-center justify-center space-x-2"
                    >
                      {enrolling ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>ENROLLING...</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4" />
                          <span>ENROLL & START WATCHING</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={paymentStep !== 'idle'}
                      className="w-full py-4 rounded-2xl bg-brandCoral hover:bg-orange-600 text-white font-extrabold text-xs tracking-wider transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 flex items-center justify-center space-x-2"
                    >
                      {paymentStep !== 'idle' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>
                            {paymentStep === 'creating' && 'PREPARING ORDER...'}
                            {paymentStep === 'checkout' && 'OPENING CHECKOUT...'}
                            {paymentStep === 'verifying' && 'VERIFYING...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>BUY NOW & GET ACCESS</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Bullet details list */}
                <div className="space-y-4 pt-5 border-t border-slate-100 dark:border-white/5 text-[11px] font-bold text-slate-500">
                  <div className="flex items-center">
                    <Video className="w-4 h-4 mr-3 text-brandCoral" />
                    <span>{totalLessons} Lessons on-demand tutorial video</span>
                  </div>
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-3 text-brandCoral" />
                    <span>Downloadable learning resources packs</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-3 text-brandCoral" />
                    <span>Dedicated student support discussions</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-3 text-brandCoral" />
                    <span>Certificate of completion included</span>
                  </div>
                  <div className="flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-3 text-brandCoral" />
                    <span>PCI-DSS Secured Transaction systems</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}