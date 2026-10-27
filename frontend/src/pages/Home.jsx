import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, Briefcase, CheckCircle2, Code2, GraduationCap, Rocket, Sparkles, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const [careerIndex, setCareerIndex] = useState(0);

  const courses = [
    {
      name: 'Java Development',
      description: 'Build a strong foundation in Java, OOP, collections, and backend logic with practical assignments focused on real-world application development.',
      points: ['OOP, exception handling, and collections', 'Backend logic with real coding labs', 'Interview-ready Java problem practice'],
      icon: Code2,
      badge: 'Beginner to Advanced'
    },
    {
      name: 'MERN Development',
      description: 'Learn MongoDB, Express, React, and Node.js to create polished full-stack applications from scratch with production-ready workflows.',
      points: ['Frontend + backend integration', 'REST APIs, auth, and database design', 'Portfolio projects for placement readiness'],
      icon: Rocket,
      badge: 'Full Stack Track'
    },
    {
      name: 'C++ Programming',
      description: 'Master problem solving, data structures, and competitive programming with expert-led training that prepares you for coding interviews.',
      points: ['Arrays, stacks, queues, and trees', 'Logic building with time optimization', 'Competitive coding and mock tests'],
      icon: GraduationCap,
      badge: 'Core Concepts'
    },
    {
      name: 'Frontend Development',
      description: 'Create modern user interfaces with HTML, CSS, JavaScript, React, and responsive design using practical project-based learning.',
      points: ['Responsive UI and animation basics', 'React components and state management', 'Portfolio-ready website projects'],
      icon: BookOpen,
      badge: 'UI / UX Focus'
    }
  ];

  const highlights = [
    { title: 'Expert Mentors', text: 'Learn from experienced trainers with real-world industry knowledge.', icon: Users },
    { title: 'Live Projects', text: 'Build practical apps and strengthen your portfolio with each module.', icon: Rocket },
    { title: 'Placement Support', text: 'Get resume help, mock interviews, and career coaching for your next role.', icon: Briefcase },
    { title: 'Flexible Batches', text: 'Choose weekday, weekend, or fast-track classes that fit your schedule.', icon: BookOpen }
  ];

  const careerSteps = ['Student', 'Coder', 'Developer', 'Engineer', 'Tech Lead'];

  const journeyCards = [
    { title: 'Foundation', text: 'Build logic, problem-solving, and coding confidence from day one.', badge: 'Stage 1' },
    { title: 'Build Projects', text: 'Turn concepts into apps, systems, and polished portfolio work.', badge: 'Stage 2' },
    { title: 'Launch Career', text: 'Prepare for placements, interviews, and real-world engineering roles.', badge: 'Stage 3' }
  ];

  const stats = [
    { value: '500+', label: 'Students Trained' },
    { value: '50+', label: 'Live Projects' },
    { value: '95%', label: 'Placement Rate' },
    { value: '4.9★', label: 'Average Rating' },
  ];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCareerIndex((prev) => (prev + 1) % careerSteps.length);
    }, 2400);
    return () => window.clearInterval(interval);
  }, [careerSteps.length]);

  // Simple fade-in animation for sections
  const fadeIn = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.5, ease: 'easeOut' }
  };

  return (
    <div className="home-page overflow-hidden text-slate-800 dark:text-white bg-[#FAF8F5] dark:bg-slate-950 transition-colors duration-300">

      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative px-4 py-14 sm:py-20 md:px-8 md:py-28 overflow-hidden text-white">
        {/* Background */}
        <div className="absolute inset-0">
          <video
            autoPlay loop muted playsInline
            className="object-cover w-full h-full"
            poster="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1400&q=80"
          >
            <source src="https://cdn.coverr.co/videos/coverr-coding-on-laptop-1560359230/1080p.mp4" type="video/mp4" />
          </video>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.8)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right, rgba(49, 46, 129, 0.4), transparent, rgba(22, 78, 99, 0.3))' }} />
          <div className="absolute inset-x-0 bottom-0 h-32" style={{ background: 'linear-gradient(to top, var(--hero-fade, #FAF8F5), transparent)' }} />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-2">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="space-y-5 text-center lg:text-left"
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full backdrop-blur-sm"
                style={{ border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.12)', color: '#ffffff' }}
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#67e8f9' }} />
                <span>Future-ready Java & C++ academy</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-black leading-[1.15] tracking-tight"
                style={{ color: '#ffffff' }}
              >
                Master Java & C++ with high-impact coding training.
              </h1>

              <p className="max-w-xl mx-auto text-sm sm:text-base md:text-lg lg:mx-0" style={{ color: '#cbd5e1' }}>
                Algorithms, data structures, OOP, competitive coding, and system design — through immersive mentorship and live projects.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-full transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#22d3ee', color: '#0f172a' }}
                >
                  Start Coding Today <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/programs"
                  className="w-full sm:w-auto px-6 py-3 font-semibold text-center rounded-full transition-opacity hover:opacity-80"
                  style={{ color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)' }}
                >
                  Explore Academy
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-5 text-xs sm:text-sm pt-1" style={{ color: '#cbd5e1' }}>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#34d399' }} /> Live debugging & compilation labs</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#34d399' }} /> Competitive coding practice</div>
              </div>
            </motion.div>

            {/* Right: Stats + Featured */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
              className="space-y-4"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl backdrop-blur-sm p-4 text-center"
                    style={{ border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.08)' }}
                  >
                    <div className="text-2xl sm:text-3xl font-black" style={{ color: '#67e8f9' }}>{stat.value}</div>
                    <div className="text-[10px] sm:text-xs uppercase tracking-widest mt-1" style={{ color: '#94a3b8' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Featured Tracks Card */}
              <div
                className="rounded-2xl backdrop-blur-sm p-4"
                style={{ border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest" style={{ color: '#67e8f9' }}>Featured Tracks</p>
                <div className="w-16 h-0.5 mt-2 rounded-full" style={{ background: 'linear-gradient(to right, #22d3ee, #818cf8)' }} />
                <div className="mt-4 space-y-2.5">
                  {courses.slice(0, 3).map((course) => {
                    const Icon = course.icon;
                    return (
                      <div
                        key={course.name}
                        className="flex items-center gap-3 rounded-xl p-3 transition-opacity hover:opacity-90"
                        style={{ border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.06)' }}
                      >
                        <div className="p-2 rounded-full shrink-0" style={{ backgroundColor: 'rgba(34,211,238,0.1)', color: '#67e8f9' }}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm truncate" style={{ color: '#ffffff' }}>{course.name}</h3>
                          <p className="text-xs" style={{ color: '#94a3b8' }}>{course.badge}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 2: Code Reveal ═══════ */}
      <motion.section {...fadeIn} className="px-4 py-12 sm:py-16 md:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl sm:rounded-3xl border border-orange-100 dark:border-white/10 bg-white dark:bg-slate-900/80 p-5 sm:p-7 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-brandCoral dark:text-cyan-300">Why Choose Us</p>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white leading-tight">
              From code to career, every lesson is designed for real-world impact.
            </h2>
            <p className="max-w-xl mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Smooth, focused lessons with premium mentorship for Java, C++, and MERN tracks.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-orange-100 dark:border-white/10 bg-white dark:bg-slate-900/80 p-5 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between text-[10px] sm:text-xs uppercase tracking-widest text-brandCoral dark:text-cyan-200">
              <span>Sample Code</span>
              <span className="text-slate-400">Java</span>
            </div>
            <pre className="mt-4 max-w-full overflow-x-auto rounded-xl border border-orange-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950/80 p-3 sm:p-4 text-[11px] sm:text-sm leading-relaxed text-slate-800 dark:text-cyan-100 font-mono">
{`public class Appletree {
  public static void main(String[] args) {
    Java java = new Java();
    Cpp cpp = new Cpp();
    java.build(); cpp.solve();
  }
}`}
            </pre>
          </div>
        </div>
      </motion.section>

      {/* ═══════ SECTION 3: Journey Cards ═══════ */}
      <motion.section {...fadeIn} className="px-4 py-12 sm:py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center sm:text-left">
            <p className="text-xs sm:text-sm uppercase tracking-widest text-brandCoral dark:text-cyan-300">Your Journey</p>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
              Your journey unfolds in three chapters.
            </h2>
            <p className="max-w-xl mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 mx-auto sm:mx-0">
              Each stage builds on the last to move you from beginner to job-ready developer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {journeyCards.map((card, index) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="rounded-2xl sm:rounded-3xl border border-orange-100 dark:border-white/10 bg-white dark:bg-slate-900/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-[10px] sm:text-xs uppercase tracking-widest text-brandCoral dark:text-cyan-200">{card.badge}</div>
                <h3 className="mt-3 text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{card.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════ SECTION 4: Morphing Career ═══════ */}
      <motion.section {...fadeIn} className="px-4 py-12 sm:py-16 md:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6 lg:grid-cols-2 rounded-2xl sm:rounded-3xl border border-orange-100 dark:border-white/10 bg-white dark:bg-slate-900/80 p-5 sm:p-8 shadow-sm">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-widest text-brandCoral dark:text-cyan-300">Career Growth</p>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white leading-tight">
              From a student to a future tech lead.
            </h2>
            <p className="max-w-xl mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Watch your career title evolve as you grow through each milestone of the program.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950/60 p-5 sm:p-6">
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-brandCoral dark:text-cyan-200">Current Stage</div>
            <div className="mt-4 flex min-h-[60px] sm:min-h-[72px] items-center text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white">
              <AnimatePresence mode="wait">
                <motion.span
                  key={careerSteps[careerIndex]}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.3 }}
                >
                  {careerSteps[careerIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 text-xs">
              {careerSteps.map((step, index) => (
                <span
                  key={step}
                  className={`rounded-full border px-3 py-1 font-semibold transition-colors ${
                    index === careerIndex
                      ? 'border-brandCoral bg-brandCoral/10 text-brandCoral dark:border-cyan-400/40 dark:bg-cyan-400/10 dark:text-cyan-100'
                      : 'border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
                  }`}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════ SECTION 5: Courses Bento Grid ═══════ */}
      <motion.section {...fadeIn} className="px-4 py-8 sm:py-12 md:px-8">
        <div className="mx-auto max-w-7xl bg-gradient-to-br from-[#faf8f2] via-[#fbf7eb] to-[#fdf2d2] rounded-[38px] border border-white/90 shadow-[0_25px_80px_rgba(0,0,0,0.06)] p-6 sm:p-10 space-y-8">
          <div className="max-w-2xl text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#1c1d21] text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>CAREER PATHWAYS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Choose a learning path that fits your career goals.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Each track combines deep concepts, real enterprise projects, and 1-on-1 mentor guidance.
            </p>
          </div>

          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {courses.map((course, index) => {
              const Icon = course.icon;
              return (
                <motion.div
                  key={course.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="rounded-[30px] border border-white bg-white/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex p-3 rounded-2xl bg-[#1c1d21] text-white shadow-sm">
                        <Icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-full">
                        {course.badge}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900 leading-snug">{course.name}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 font-medium">{course.description}</p>
                    
                    <ul className="mt-4 space-y-2 text-xs text-slate-700 font-medium">
                      {course.points.map((point) => (
                        <li key={point} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">Full Track</span>
                    <Link
                      to="/programs"
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
                    >
                      <span>Explore</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ═══════ SECTION 5b: Tech Gallery Bento ═══════ */}
      <motion.section {...fadeIn} className="px-4 pb-12 md:px-8">
        <div className="mx-auto max-w-7xl bg-gradient-to-br from-[#faf8f2] via-[#fbf7eb] to-[#fdf2d2] rounded-[38px] border border-white/90 shadow-[0_25px_80px_rgba(0,0,0,0.06)] p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#1c1d21] text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>MOMENTS & LABS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Inside Appletree Learning Labs
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-white px-4 py-2.5 rounded-full border border-slate-200 text-slate-800 hover:bg-slate-50 transition-all shadow-sm self-start sm:self-auto"
            >
              <span>View Full Gallery</span>
              <span>↗</span>
            </Link>
          </div>

          {/* Mosaic Gallery Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Java — wide card */}
            <div className="lg:col-span-2 relative rounded-[28px] overflow-hidden h-56 sm:h-64 group shadow-sm border border-white">
              <img
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
                alt="Java programming on laptop"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="absolute bottom-4 left-4 text-white font-bold text-sm sm:text-base drop-shadow">Java Development</span>
              <span className="absolute top-3 right-3 text-[10px] font-bold bg-[#1c1d21]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full uppercase tracking-wider">Backend</span>
            </div>

            {/* C++ */}
            <div className="relative rounded-[28px] overflow-hidden h-56 sm:h-64 group shadow-sm border border-white">
              <img
                src="https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=500&q=80"
                alt="C++ competitive programming"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="absolute bottom-4 left-4 text-white font-bold text-sm drop-shadow">C++ Programming</span>
              <span className="absolute top-3 right-3 text-[10px] font-bold bg-[#1c1d21]/90 backdrop-blur-sm text-cyan-300 px-3 py-1 rounded-full uppercase tracking-wider">DSA</span>
            </div>

            {/* MERN Stack */}
            <div className="relative rounded-[28px] overflow-hidden h-56 sm:h-64 group shadow-sm border border-white">
              <img
                src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=500&q=80"
                alt="MERN full stack development"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="absolute bottom-4 left-4 text-white font-bold text-sm drop-shadow">MERN Stack</span>
              <span className="absolute top-3 right-3 text-[10px] font-bold bg-[#1c1d21]/90 backdrop-blur-sm text-amber-300 px-3 py-1 rounded-full uppercase tracking-wider">Full Stack</span>
            </div>

            {/* Frontend / React */}
            <div className="relative rounded-[28px] overflow-hidden h-48 sm:h-56 group shadow-sm border border-white">
              <img
                src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=500&q=80"
                alt="React frontend development"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="absolute bottom-4 left-4 text-white font-bold text-sm drop-shadow">Frontend / React</span>
              <span className="absolute top-3 right-3 text-[10px] font-bold bg-[#1c1d21]/90 backdrop-blur-sm text-pink-300 px-3 py-1 rounded-full uppercase tracking-wider">UI / UX</span>
            </div>

            {/* Code review / mentor session */}
            <div className="relative rounded-[28px] overflow-hidden h-48 sm:h-56 group shadow-sm border border-white">
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=500&q=80"
                alt="Code on monitor during class"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="absolute bottom-4 left-4 text-white font-bold text-sm drop-shadow">Live Coding Lab</span>
            </div>

            {/* Team collaboration — wide */}
            <div className="lg:col-span-2 relative rounded-[28px] overflow-hidden h-48 sm:h-56 group shadow-sm border border-white">
              <img
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"
                alt="Students collaborating on tech project"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
              <span className="absolute bottom-4 left-4 text-white font-bold text-sm font-quicksand drop-shadow">Project Collaboration</span>
              <span className="absolute top-3 right-3 text-[10px] font-bold bg-green-400/30 backdrop-blur-sm text-green-100 px-2.5 py-1 rounded-full uppercase tracking-wider">Placement Prep</span>
            </div>

          </div>
        </div>
      </motion.section>

      {/* ═══════ SECTION 6: Why Appletree ═══════ */}
      <motion.section {...fadeIn} className="px-4 py-12 sm:py-16 border-y border-orange-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-8 text-center sm:text-left">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-brandCoral dark:text-cyan-300">Why Appletree</p>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
              Training that balances strong concepts with practical growth.
            </h2>
            <p className="max-w-2xl mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              From mentor support to project-based practice, every module helps learners become confident, job-ready developers.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="rounded-2xl border border-orange-100 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-2.5 inline-flex rounded-full bg-brandCoral/10 text-brandCoral dark:bg-cyan-400/10 dark:text-cyan-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="mt-3 text-base sm:text-lg font-semibold text-slate-800 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ═══════ SECTION 7: CTA Banner ═══════ */}
      <motion.section {...fadeIn} className="px-4 py-12 sm:py-16 md:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-6 sm:p-8 md:p-10 text-white shadow-lg">
          <div className="flex flex-col gap-5 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
            <div className="max-w-2xl">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-indigo-100">Ready to begin</p>
              <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold">Start your coding journey with Appletree today.</h2>
              <p className="mt-2 text-sm sm:text-base md:text-lg text-indigo-50">
                Join a learning community that makes complex topics simple, practical, and career-focused.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-indigo-700 bg-white rounded-full hover:bg-indigo-50 transition-colors self-center lg:self-auto shrink-0"
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
