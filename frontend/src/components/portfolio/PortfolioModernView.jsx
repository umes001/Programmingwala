import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Briefcase,
  Code2,
  User,
  Sparkles,
  Layers,
  ChevronRight,
  Linkedin,
  Github,
  Globe,
  Instagram,
  CheckCircle,
  FileText
} from 'lucide-react';
import ProjectModal from './ProjectModal';
import PortfolioCyberView from './PortfolioCyberView';
import PortfolioEmeraldView from './PortfolioEmeraldView';
import PortfolioAuroraView from './PortfolioAuroraView';

export default function PortfolioModernView({
  data,
  isEditing = false,
  onEditSection = () => {},
  showWindowMockup = true
}) {
  const currentTheme = data?.theme || 'editorial-warm';

  // Dynamic Theme Switching
  if (currentTheme === 'cyber-neon') {
    return <PortfolioCyberView data={data} />;
  }
  if (currentTheme === 'midnight-emerald') {
    return <PortfolioEmeraldView data={data} />;
  }
  if (currentTheme === 'cosmic-aurora') {
    return <PortfolioAuroraView data={data} />;
  }

  const [selectedProject, setSelectedProject] = useState(null);

  // Fallback defaults to ensure rock-solid rendering
  const name = data?.name || 'Alex Morgan';
  const role = data?.role || 'Brand & Web Designer';
  const location = data?.location || 'Toronto, Canada';
  const bio = data?.bio || 'I help startups and creative brands build thoughtful identities and digital experiences that connect.';
  const avatar = data?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
  const availability = data?.availability || {
    status: 'Available for work',
    period: 'May 2026',
    description: "I'm currently accepting new projects and opportunities."
  };
  const resumeUrl = data?.resumeUrl || '#';
  const email = data?.email || 'hello@alexmorgan.design';
  const phone = data?.phone || '+1 (647) 555-0198';

  // Projects list (can be empty)
  const projects = Array.isArray(data?.projects) ? data.projects : [];
  const hasProjects = projects.length > 0;

  // Experience list
  const experience = Array.isArray(data?.experience) ? data.experience : [
    {
      id: 'exp-1',
      role: 'Senior Product Designer & Developer',
      company: 'Studio Helix',
      period: '2024 — Present',
      location: 'Remote',
      description: 'Lead end-to-end design systems and engineered high-performance web applications with React and Tailwind CSS.',
      achievements: [
        'Boosted page conversion rates by 38% through streamlined checkout flows.',
        'Architected reusable component library used across 12 product teams.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Frontend Engineer & UI Specialist',
      company: 'Vanguard Labs',
      period: '2022 — 2024',
      location: 'Toronto, Canada',
      description: 'Collaborated with engineering leads to build resilient SaaS dashboards and accessible client experiences.',
      achievements: [
        'Reduced bundle size by 42% via code-splitting and asset optimization.',
        'Delivered responsive dashboard with 99.9% uptime.'
      ]
    }
  ];

  // Skills categorized
  const skills = Array.isArray(data?.skills) ? data.skills : [
    {
      category: 'Core Engineering',
      items: ['React.js', 'Next.js', 'JavaScript / TypeScript', 'Node.js', 'REST APIs', 'MySQL / PostgreSQL']
    },
    {
      category: 'Design & Systems',
      items: ['UI / UX Architecture', 'Figma', 'Design Systems', 'Responsive Motion', 'Wireframing & Prototyping']
    },
    {
      category: 'Cloud & Tooling',
      items: ['Git & GitHub', 'Tailwind CSS', 'Docker Basics', 'Vite', 'Postman', 'Performance Tuning']
    }
  ];

  // Testimonial / Quote
  const quote = data?.quote || {
    text: 'Alex is an exceptional designer who delivers clean, strategic work that elevates our brand every single time.',
    author: 'James Carter',
    role: 'Founder, Helix',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  };

  // Social Links
  const socials = data?.socials || {
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    dribbble: 'https://dribbble.com',
    instagram: 'https://instagram.com'
  };

  // Generate initials for monogram
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('') || 'AM';

  const slug = data?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <div className="w-full font-sans antialiased text-[#1C1917] selection:bg-[#E05A38] selection:text-white">
      {/* =========================================================================
          PORTFOLIO BODY (Warm Peach & Coral Radial Theme)
      ========================================================================= */}
      <div className="relative min-h-screen bg-gradient-to-br from-[#FFF7F3] via-[#FFFBF9] to-[#FFEDE3] overflow-hidden">
          
          {/* Ambient Glow Orbs */}
          <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-[#FF8865]/25 via-[#FFA88B]/15 to-transparent rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />
          <div className="absolute top-[40%] left-0 w-[450px] h-[450px] bg-gradient-to-tr from-[#FFCBB8]/20 to-transparent rounded-full blur-3xl pointer-events-none -ml-40" />
          <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-gradient-to-t from-[#FFE1D4]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* ─────────────────────────────────────────────────────────────────────
              1. TOP NAVIGATION BAR
          ───────────────────────────────────────────────────────────────────── */}
          <header className="relative z-20 px-6 sm:px-12 lg:px-16 py-6 flex items-center justify-between">
            {/* Monogram Logo */}
            <a href="#hero" className="flex items-center gap-1 group">
              <span className="text-2xl font-serif font-black tracking-tighter text-[#1C1917] group-hover:text-[#E05A38] transition-colors">
                {initials}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#E05A38] inline-block animate-pulse" />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#645953]">
              {hasProjects && (
                <a href="#work" className="hover:text-[#1C1917] transition-colors">Work</a>
              )}
              <a href="#experience" className="hover:text-[#1C1917] transition-colors">Experience</a>
              <a href="#skills" className="hover:text-[#1C1917] transition-colors">Skills</a>
              <a href="#about" className="hover:text-[#1C1917] transition-colors">About</a>
              <a href="#contact" className="hover:text-[#1C1917] transition-colors">Contact</a>
            </nav>

            {/* CTA Pill Buttons */}
            <div className="flex items-center gap-3">
              {resumeUrl && resumeUrl !== '#' && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1C1917] hover:bg-black text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all hover:-translate-y-0.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#E05A38]" />
                  <span>Resume (PDF)</span>
                  <Download className="w-3.5 h-3.5 opacity-80" />
                </a>
              )}
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/90 hover:bg-white text-[#1C1917] text-xs sm:text-sm font-semibold border border-[#ECD9CE] shadow-sm hover:shadow-md hover:border-[#E05A38]/30 transition-all hover:-translate-y-0.5"
              >
                <span>Let's talk</span>
                <ArrowUpRight className="w-4 h-4 text-[#E05A38]" />
              </a>
            </div>
          </header>

          {/* ─────────────────────────────────────────────────────────────────────
              2. HERO SECTION
          ───────────────────────────────────────────────────────────────────── */}
          <section id="hero" className="relative z-10 px-6 sm:px-12 lg:px-16 pt-8 sm:pt-16 pb-20">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Typography & CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 space-y-6"
              >
                {/* Greeting & Name */}
                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-[#1C1917] leading-[1.08] font-serif">
                  Hi, I'm <br />
                  <span className="text-[#E05A38] inline-block">{name}.</span>
                </h1>

                {/* Subtitle / Role & Location */}
                <p className="text-xl sm:text-2xl font-medium text-[#2F2724]">
                  {role}{' '}
                  <span className="text-[#84756D] font-normal">based in</span>{' '}
                  <strong className="text-[#1C1917] font-semibold">{location}.</strong>
                </p>

                {/* Bio Description */}
                <p className="text-base sm:text-lg text-[#5E514B] leading-relaxed max-w-xl">
                  {bio}
                </p>

                {/* Hero Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  {resumeUrl && resumeUrl !== '#' && (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#E05A38] hover:bg-[#CF4E2C] text-white text-sm sm:text-base font-semibold shadow-lg shadow-[#E05A38]/25 hover:shadow-xl hover:shadow-[#E05A38]/35 transition-all hover:-translate-y-0.5"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Resume (PDF)</span>
                      <Download className="w-4 h-4 opacity-80" />
                    </a>
                  )}

                  <a
                    href="#about"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/80 hover:bg-white text-[#2C2320] text-sm sm:text-base font-semibold border border-[#E9DACF] shadow-sm hover:shadow transition-all hover:-translate-y-0.5"
                  >
                    <span>About me</span>
                    <User className="w-4 h-4 text-[#8C7B73]" />
                  </a>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-stone-900 hover:bg-black text-white text-sm sm:text-base font-semibold shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <span>Get in touch</span>
                    <ArrowUpRight className="w-4 h-4 text-[#E05A38]" />
                  </a>
                </div>
              </motion.div>

              {/* Right Column: Circular Portrait & Floating Glassmorphism Status Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="lg:col-span-5 relative flex justify-center lg:justify-end"
              >
                {/* Main Circular Portrait */}
                <div className="relative w-72 sm:w-88 md:w-96 aspect-square">
                  {/* Subtle decorative glow ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#E05A38]/20 to-transparent blur-xl" />

                  {/* Circular Image Frame */}
                  <div className="relative w-full h-full rounded-full overflow-hidden border-[10px] border-white/80 shadow-2xl bg-[#FFEAE0]">
                    <img
                      src={avatar}
                      alt={name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
              </motion.div>

            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────────────────
              3. TRUSTED BY / CORE PLATFORMS TICKER
          ───────────────────────────────────────────────────────────────────── */}
          <div className="border-y border-[#EDE1D6]/80 bg-white/40 backdrop-blur-sm py-6 px-6 sm:px-12 lg:px-16">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center md:justify-between gap-6 sm:gap-8 text-xs font-semibold tracking-wider uppercase text-[#8F8077]">
              <span className="text-[#B5A69D] font-mono">Core Tooling & Stack</span>
              <div className="flex flex-wrap items-center gap-8 sm:gap-12 opacity-80">
                <span className="flex items-center gap-1.5 hover:text-[#1C1917] transition-colors">
                  <span className="w-2 h-2 rounded-full bg-[#1C1917]" /> FRAME
                </span>
                <span className="hover:text-[#1C1917] transition-colors">WEBFLOW</span>
                <span className="hover:text-[#1C1917] transition-colors">REACT</span>
                <span className="hover:text-[#1C1917] transition-colors">NODE.JS</span>
                <span className="hover:text-[#1C1917] transition-colors">NOTION</span>
                <span className="hover:text-[#1C1917] transition-colors">FIGMA</span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────────────
              4. SELECTED WORK / PROJECTS SECTION
              Rule: If student hasn't entered projects, do NOT show this section!
          ───────────────────────────────────────────────────────────────────── */}
          {hasProjects && (
            <section id="work" className="px-6 sm:px-12 lg:px-16 py-20">
              <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E05A38]" />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#E05A38]">
                        Selected Work
                      </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#1C1917] tracking-tight">
                      Designing digital experiences that make an impact.
                    </h2>
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8A7B73] shrink-0">
                    {projects.length} {projects.length === 1 ? 'Project' : 'Projects'} Showcased
                  </span>
                </div>

                {/* 3-Column Responsive Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((proj, index) => (
                    <motion.div
                      key={proj.id || index}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setSelectedProject(proj)}
                      className="group cursor-pointer rounded-3xl bg-white/80 backdrop-blur-md p-3.5 border border-[#EADBCE] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      {/* Screenshot / Project Thumbnail */}
                      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF2EB] border border-[#F0E4DA] mb-4">
                        {proj.screenshot ? (
                          <img
                            src={proj.screenshot}
                            alt={proj.title}
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-tr from-[#FFE8DC] to-[#FFF6F0]">
                            <Layers className="w-8 h-8 text-[#E05A38]/50 mb-2" />
                            <span className="text-xs font-medium text-[#7D6E66]">Interactive Preview</span>
                          </div>
                        )}

                        {/* Floating Category Pill */}
                        {proj.category && (
                          <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-[#2C2320] shadow-sm">
                            {proj.category}
                          </span>
                        )}
                      </div>

                      {/* Card Footer Bar */}
                      <div className="flex items-center justify-between px-2 pb-1">
                        <div>
                          <h3 className="text-lg font-bold text-[#1C1917] group-hover:text-[#E05A38] transition-colors">
                            {proj.title}
                          </h3>
                          <p className="text-xs text-[#8A7A72]">
                            {proj.subtitle || proj.category || 'Digital Experience'}
                          </p>
                        </div>

                        {/* Circular Arrow Button (Triggers modal) */}
                        <div className="w-9 h-9 rounded-full bg-[#F7EFE9] group-hover:bg-[#E05A38] text-[#4A3F3A] group-hover:text-white flex items-center justify-center transition-colors shadow-sm">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

              </div>
            </section>
          )}

          {/* ─────────────────────────────────────────────────────────────────────
              5. EXPERIENCE SECTION (Dedicated Block)
          ───────────────────────────────────────────────────────────────────── */}
          <section id="experience" className="px-6 sm:px-12 lg:px-16 py-20 border-t border-[#EFE4DA]/70 bg-white/30 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto space-y-12">
              
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E05A38]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#E05A38]">
                    Experience & Career
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#1C1917] tracking-tight">
                  Professional Journey & Impact
                </h2>
              </div>

              {/* Timeline Cards */}
              <div className="space-y-6">
                {experience.map((exp, idx) => (
                  <motion.div
                    key={exp.id || idx}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-[#EADBCE] shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0E4DA] pb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#1C1917] font-serif">
                          {exp.role}
                        </h3>
                        <p className="text-sm font-semibold text-[#E05A38] mt-0.5">
                          {exp.company}{' '}
                          {exp.location && (
                            <span className="text-[#8F8077] font-normal">• {exp.location}</span>
                          )}
                        </p>
                      </div>

                      <span className="px-3.5 py-1.5 rounded-full bg-[#FAF1E9] text-xs font-semibold text-[#665750] self-start sm:self-auto">
                        {exp.period}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-[#574A44] leading-relaxed">
                      {exp.description}
                    </p>

                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {exp.achievements.map((ach, aIdx) => (
                          <div key={aIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4E423C]">
                            <CheckCircle className="w-4 h-4 text-[#E05A38] shrink-0 mt-0.5" />
                            <span>{ach}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────────────────
              6. SKILLS SECTION (Dedicated Block)
          ───────────────────────────────────────────────────────────────────── */}
          <section id="skills" className="px-6 sm:px-12 lg:px-16 py-20 border-t border-[#EFE4DA]/70">
            <div className="max-w-6xl mx-auto space-y-12">
              
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E05A38]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#E05A38]">
                    Capabilities & Tools
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#1C1917] tracking-tight">
                  Technical Architecture & Skills
                </h2>
              </div>

              {/* Categorized Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {skills.map((skillGroup, idx) => (
                  <div
                    key={idx}
                    className="p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-[#EADBCE] shadow-sm flex flex-col justify-between space-y-6"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-[#E05A38]" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#73635C]">
                          {skillGroup.category || `Category ${idx + 1}`}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(skillGroup.items || []).map((item, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FFF9F5] border border-[#ECDCD0] text-[#3B312D] shadow-xs"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#F2E8E0] text-[11px] font-mono text-[#998981]">
                      Validated via technical examinations & live delivery.
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────────────────
              7. ABOUT SECTION (Dedicated Block)
          ───────────────────────────────────────────────────────────────────── */}
          <section id="about" className="px-6 sm:px-12 lg:px-16 py-20 border-t border-[#EFE4DA]/70 bg-white/40 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E05A38]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#E05A38]">
                    About Me
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#1C1917] tracking-tight leading-tight">
                  Crafting resilient code with thoughtful aesthetic intention.
                </h2>

                <p className="text-base sm:text-lg text-[#5E514B] leading-relaxed">
                  {data?.aboutText || bio}
                </p>

                <p className="text-sm sm:text-base text-[#6F6059] leading-relaxed">
                  My work is anchored in understanding real human needs and translating them into robust, clean, and scalable digital solutions. Whether designing intuitive user interfaces or architecting secure backend APIs, I prioritize clarity, high performance, and long-term sustainability.
                </p>

                <div className="pt-2 flex items-center gap-4">
                  {resumeUrl && (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1C1917] hover:bg-[#332C2A] text-white text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Full Resume</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Endorsement / Quote Banner (as in bottom block of reference image) */}
              <div className="lg:col-span-6">
                <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#FFF5EF] to-[#FFEBE0] border border-[#F2DECF] shadow-lg relative space-y-6">
                  {/* Peach Double Quotation Mark */}
                  <span className="text-6xl sm:text-7xl font-serif text-[#E05A38]/50 leading-none select-none block -mb-4">
                    “
                  </span>

                  <p className="text-base sm:text-xl font-medium text-[#2E2421] leading-relaxed italic font-serif">
                    {quote.text}
                  </p>

                  <div className="flex items-center gap-3 pt-2 border-t border-[#ECD6C6]">
                    {quote.avatar ? (
                      <img
                        src={quote.avatar}
                        alt={quote.author}
                        className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#E05A38] text-white flex items-center justify-center font-bold text-sm">
                        {quote.author ? quote.author[0] : 'J'}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-[#1C1917]">{quote.author}</h4>
                      <p className="text-xs text-[#7F7068]">{quote.role}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────────────────
              8. CONTACT FOOTER
          ───────────────────────────────────────────────────────────────────── */}
          <footer id="contact" className="px-6 sm:px-12 lg:px-16 py-16 border-t border-[#EDE1D6] bg-white/60">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              
              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#1C1917]">
                  Let's create something amazing together.
                </h3>
                <p className="text-sm text-[#70615A]">
                  Open for software engineering roles, client collaborations, and ambitious ideas.
                </p>
              </div>

              {/* Direct Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 text-sm">
                <div className="space-y-1">
                  <a
                    href={`mailto:${email}`}
                    className="block font-semibold text-[#1C1917] hover:text-[#E05A38] transition-colors"
                  >
                    {email}
                  </a>
                  <span className="block text-[#82726B]">{phone}</span>
                </div>

                {/* Social Icon Pills */}
                <div className="flex items-center gap-2">
                  {socials.linkedin && (
                    <a
                      href={socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-[#FAF2EB] hover:bg-[#FFE7DA] text-[#3D332F] hover:text-[#E05A38] flex items-center justify-center transition-colors shadow-xs"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {socials.github && (
                    <a
                      href={socials.github}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-[#FAF2EB] hover:bg-[#FFE7DA] text-[#3D332F] hover:text-[#E05A38] flex items-center justify-center transition-colors shadow-xs"
                      aria-label="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {socials.instagram && (
                    <a
                      href={socials.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-[#FAF2EB] hover:bg-[#FFE7DA] text-[#3D332F] hover:text-[#E05A38] flex items-center justify-center transition-colors shadow-xs"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

            </div>
          </footer>

        </div>

      {/* Interactive Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
