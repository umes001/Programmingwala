import React, { useState, useEffect } from 'react';
import { BookOpen, Smile, Award, CheckCircle, Clock, GraduationCap, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EnrollCourseModal from '../components/EnrollCourseModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// Color theme mapping for badges
const COLOR_THEMES = {
  brandMint: {
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50',
    gradient: 'from-emerald-400 to-teal-600'
  },
  brandSky: {
    badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200 dark:border-sky-900/50',
    gradient: 'from-sky-400 to-indigo-600'
  },
  brandCoral: {
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50',
    gradient: 'from-rose-400 to-orange-600'
  }
};

const fallbackCourses = [
  {
    _id: 'fallback-1',
    title: 'Java Development',
    description: 'It includes the basics of java programming language and its applications. The curriculum covers fundamental concepts such as variables, data types, control structures, object-oriented programming, and basic algorithms.',
    duration: '1 month - 6 months',
    price: 3500,
    category: 'development',
    milestones: [
      'Understanding of java syntax and basic programming concepts',
      'Ability to write simple java programs and solve basic coding problems',
      'Familiarity with object-oriented programming principles',
      'Completion of a small java project demonstrating learned skills'
    ],
    schedule: [
      { time: '05:00 PM', activity: 'Java Programming Class' },
      { time: '06:00 PM', activity: 'Java Programming Class' }
    ],
    color: 'brandMint',
    imageUrl: ''
  }
];

export default function Programs() {
  const [programsData, setProgramsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollCourse, setEnrollCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEnroll = async (course) => {
    const isFree = !course.price || Number(course.price) <= 0;

    if (isFree) {
      if (user) {
        // User is logged in: silently call the backend to enroll the user so their progress tracks
        try {
          const token = localStorage.getItem('token');
          await fetch(`/api/lms/courses/${course._id}/enroll`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (err) {
          console.error('Silent enrollment error:', err);
        }
      }
      // Go straight to the course workspace/learning page (works for guest users too as free courses have public access)
      navigate(`/lms/learn/${course._id}`);
      return;
    }

    if (!user) {
      alert('Please log in to enroll in a course.');
      return;
    }
    setEnrollCourse(course);
  };

  useEffect(() => {
    fetch('/api/public/courses')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setProgramsData(data.data);
        } else {
          setProgramsData(fallbackCourses);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load courses:', err);
        setProgramsData(fallbackCourses);
        setLoading(false);
      });
  }, []);

  const getPlaceholderIcon = (category) => {
    switch (category) {
      case 'design':
        return <Award className="w-12 h-12 text-white/90" />;
      case 'marketing':
        return <Smile className="w-12 h-12 text-white/90" />;
      case 'development':
        return <BookOpen className="w-12 h-12 text-white/90" />;
      default:
        return <GraduationCap className="w-12 h-12 text-white/90" />;
    }
  };

  return (
    <div className="px-4 py-8 sm:py-12 mx-auto space-y-10 max-w-7xl md:px-8 select-none">
      
      {/* ── MASTER CANVAS CONTAINER (Crextio Golden-Butter Theme) ── */}
      <div className="bg-gradient-to-br from-[#faf8f2] via-[#fbf7eb] to-[#fdf2d2] rounded-[38px] border border-white/90 shadow-[0_25px_80px_rgba(0,0,0,0.08)] p-6 sm:p-10 space-y-8">
        
        {/* Title Header */}
        <div className="max-w-2xl mx-auto space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 bg-[#1c1d21] text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>CAREER-READY CURRICULUM</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            Our Syllabus & Certified Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Industry-aligned software engineering and design modules curated by Appletree Infotech for hands-on job readiness.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 rounded-full animate-spin border-slate-900 border-t-transparent"></div>
            <p className="mt-4 text-xs text-slate-500 font-bold">Loading curriculum...</p>
          </div>
        ) : programsData.length === 0 ? (
          <div className="py-20 text-center bg-white/70 rounded-3xl border border-white p-8">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
            <p className="mt-4 text-sm text-slate-600 font-bold">No courses available yet. Please check back soon!</p>
          </div>
        ) : (
          <>
            {/* Courses Cards Grid (Luxury Bento Design) */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programsData.map((course) => {
                const theme = COLOR_THEMES[course.color] || COLOR_THEMES.brandMint;
                return (
                  <div
                    key={course._id}
                    className="group relative flex flex-col justify-between overflow-hidden bg-white/85 border border-white rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
                  >
                    {/* Image / Banner */}
                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      {course.imageUrl ? (
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-tr ${theme.gradient} flex items-center justify-center`}>
                          {getPlaceholderIcon(course.category)}
                        </div>
                      )}
                      
                      {/* Category Floating Pill */}
                      <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 text-[9px] font-extrabold tracking-widest uppercase rounded-full bg-[#1c1d21]/90 text-white backdrop-blur-md shadow-sm">
                        {course.category}
                      </span>

                      {/* Price Floating Pill */}
                      <span className="absolute bottom-4 right-4 bg-[#facc15] text-amber-950 font-black px-3.5 py-1.5 rounded-full shadow-lg text-xs font-sans">
                        {course.price > 0 ? `₹${course.price.toLocaleString('en-IN')}` : 'Free'}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-col justify-between flex-grow p-6 space-y-4">
                      <div className="space-y-2">
                        <h2 className="text-lg font-bold font-sans leading-tight text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                          {course.title}
                        </h2>

                        {course.duration && (
                          <div className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{course.duration}</span>
                          </div>
                        )}

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      {/* Stats Pills Bar */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>{course.milestones?.length || 4} Milestones</span>
                        <span>•</span>
                        <span>{course.schedule?.length || 2} Live Batches</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2.5 pt-1">
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="flex-1 py-2.5 text-xs font-bold rounded-full text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all text-center cursor-pointer"
                        >
                          Details ↗
                        </button>
                        <button
                          onClick={() => handleEnroll(course)}
                          className="flex-1 py-2.5 text-xs font-bold rounded-full text-white bg-[#1c1d21] hover:bg-black shadow-md hover:shadow-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Enroll Now</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Curriculum Highlights Row */}
            <section className="grid grid-cols-1 gap-4 p-6 bg-white/70 border border-white rounded-3xl md:grid-cols-3 shadow-sm">
              <div className="space-y-1 text-center sm:text-left p-2">
                <h4 className="font-bold text-xs text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Hands-on Project Portfolio</span>
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Build full-stack, enterprise-grade applications reviewed by senior developers.
                </p>
              </div>
              <div className="space-y-1 text-center sm:text-left p-2">
                <h4 className="font-bold text-xs text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span>ISO Verified Certification</span>
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Receive verifiable certificates with unique QR verification by Appletree Infotech.
                </p>
              </div>
              <div className="space-y-1 text-center sm:text-left p-2">
                <h4 className="font-bold text-xs text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Interview & Placement Support</span>
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Mock technical interviews, resume refinement, and direct hiring partner referrals.
                </p>
              </div>
            </section>
          </>
        )}

      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-orange-100 dark:border-slate-800 flex flex-col">
            {/* Sticky Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold font-quicksand text-slate-850 dark:text-slate-105">
                  {selectedCourse.title}
                </h3>
                <span className="inline-block px-3 py-1 text-[10px] font-extrabold tracking-widest uppercase rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {selectedCourse.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                {/* Left Column: Description & Milestones */}
                <div className="space-y-6 md:col-span-7">
                  {selectedCourse.imageUrl && (
                    <div className="w-full h-56 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
                      <img
                        src={selectedCourse.imageUrl}
                        alt={selectedCourse.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-lg font-bold font-quicksand text-slate-800 dark:text-slate-105">
                      Course Overview
                    </h4>
                    <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                      {selectedCourse.description}
                    </p>
                  </div>

                  {/* Milestones list */}
                  {selectedCourse.milestones && selectedCourse.milestones.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="flex items-center space-x-2 text-lg font-bold font-quicksand text-slate-800 dark:text-slate-105">
                        <Award className="w-5 h-5 text-brandCoral" />
                        <span>Key Developmental Milestones</span>
                      </h4>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {selectedCourse.milestones.map((ms, idx) => (
                          <div key={idx} className="flex items-start space-x-2.5">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-xs text-slate-600 dark:text-slate-300 leading-normal">{ms}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Routine Schedule */}
                <div className="md:col-span-5">
                  {selectedCourse.schedule && selectedCourse.schedule.length > 0 ? (
                    <div className="p-6 space-y-4 bg-orange-50/20 dark:bg-slate-950/40 rounded-2xl border border-orange-100/50 dark:border-slate-800/80">
                      <h4 className="flex items-center pb-2 space-x-2 text-lg font-bold border-b border-orange-100 dark:border-slate-800 font-quicksand text-slate-850 dark:text-slate-105">
                        <Clock className="w-5 h-5 text-brandSky" />
                        <span>Typical Daily Schedule</span>
                      </h4>
                      <div className="space-y-4">
                        {selectedCourse.schedule.map((item, idx) => (
                          <div key={idx} className="flex items-start space-x-4">
                            <span className="text-xs font-bold text-brandCoral bg-white dark:bg-slate-900 px-2.5 py-1 rounded-md border border-orange-100/60 dark:border-slate-800 whitespace-nowrap shadow-sm">
                              {item.time}
                            </span>
                            <div className="text-xs text-slate-600 dark:text-slate-300 font-medium pt-0.5">
                              {item.activity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      No daily schedule specified for this course.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-950/80 backdrop-blur-md px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-450 dark:text-slate-500 uppercase font-extrabold tracking-wider">
                  Course Fee
                </span>
                <span className="text-xl font-extrabold text-slate-850 dark:text-slate-105 font-quicksand">
                  {selectedCourse.price > 0 ? `₹${selectedCourse.price.toLocaleString('en-IN')}` : 'Free'}
                </span>
              </div>
              <button
                onClick={() => {
                  const courseToEnroll = selectedCourse;
                  setSelectedCourse(null);
                  handleEnroll(courseToEnroll);
                }}
                className="flex items-center space-x-2 px-6 py-3 text-xs font-bold text-white rounded-full bg-brandCoral hover:bg-brandCoral-dark shadow-md hover:shadow-lg transition-all"
              >
                <span>ENROLL NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {enrollCourse && (
        <EnrollCourseModal course={enrollCourse} onClose={() => setEnrollCourse(null)} />
      )}
    </div>
  );
}
