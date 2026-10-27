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
  Terminal,
  Zap,
  Activity,
  Cpu,
  ShieldCheck,
  FileText,
  Linkedin,
  Github,
  Instagram
} from 'lucide-react';
import ProjectModal from './ProjectModal';

export default function PortfolioCyberView({ data }) {
  const [selectedProject, setSelectedProject] = useState(null);

  const name = data?.name || 'Alex Morgan';
  const role = data?.role || 'Full-Stack Systems Engineer';
  const location = data?.location || 'San Francisco, CA';
  const bio = data?.bio || 'Architecting resilient distributed applications, high-concurrency pipelines, and immersive digital platforms.';
  const avatar = data?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
  const resumeUrl = data?.resumeUrl || '';
  const email = data?.email || 'alex@system.io';
  const phone = data?.phone || '+1 (555) 019-2831';

  const projects = Array.isArray(data?.projects) ? data.projects : [];
  const hasProjects = projects.length > 0;
  const experience = Array.isArray(data?.experience) ? data.experience : [];
  const skills = Array.isArray(data?.skills) ? data.skills : [];
  const socials = data?.socials || {};

  return (
    <div className="min-h-screen bg-[#07080B] text-[#E2E8F0] font-mono selection:bg-[#00F0FF] selection:text-black relative overflow-hidden">
      
      {/* ─────────────────────────────────────────────────────────────────────
          1. MOVING LIGHTS & LIGHTNING GLOW SYSTEM
      ───────────────────────────────────────────────────────────────────── */}
      {/* Moving Ambient Neon Light Orbs */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-[#00F0FF]/12 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-[35%] right-10 w-[600px] h-[600px] bg-[#8B5CF6]/14 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#00F0FF]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Cyber Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #00F0FF 1px, transparent 1px), linear-gradient(to bottom, #00F0FF 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* Animated Electric Lightning Line (Top Header Beam) */}
      <div className="relative z-30 h-[2px] w-full bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent shadow-[0_0_15px_#00F0FF]" />

      {/* ─────────────────────────────────────────────────────────────────────
          2. CYBER HUD NAVBAR
      ───────────────────────────────────────────────────────────────────── */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#0C1017] border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:border-[#00F0FF] transition-all">
            <Zap className="w-4 h-4 text-[#00F0FF] animate-bounce" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-widest text-white uppercase group-hover:text-[#00F0FF] transition-colors">
              {name.replace(/\s+/g, '_').toUpperCase()}
            </span>
            <span className="text-[10px] text-[#00F0FF] block tracking-wider font-sans">
              [SYSTEM_ONLINE]
            </span>
          </div>
        </a>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-8 text-xs tracking-wider uppercase text-[#94A3B8]">
          {hasProjects && <a href="#work" className="hover:text-[#00F0FF] transition-colors">// WORK</a>}
          <a href="#experience" className="hover:text-[#00F0FF] transition-colors">// EXPERIENCE</a>
          <a href="#skills" className="hover:text-[#00F0FF] transition-colors">// STACK</a>
          <a href="#about" className="hover:text-[#00F0FF] transition-colors">// CORE</a>
          <a href="#contact" className="hover:text-[#00F0FF] transition-colors">// CONTACT</a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          {resumeUrl && resumeUrl !== '#' && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 text-[#00F0FF] text-xs font-bold border border-[#00F0FF]/40 hover:border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all hover:-translate-y-0.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>RESUME_PDF</span>
              <Download className="w-3.5 h-3.5" />
            </a>
          )}
          <a
            href="#contact"
            className="px-4 py-2 rounded-lg bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/25 text-[#C084FC] text-xs font-bold border border-[#8B5CF6]/40 hover:border-[#8B5CF6] transition-all"
          >
            LET'S TALK ↗
          </a>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────────
          3. CENTERED TECHNICAL HERO SECTION
      ───────────────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-10 sm:pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Avatar with Animated Lightning Ring */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex justify-center order-2 lg:order-1"
          >
            <div className="relative">
              {/* Spinning Neon Gradient Aura */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#00F0FF] via-[#8B5CF6] to-[#00F0FF] opacity-75 blur-lg animate-spin" style={{ animationDuration: '8s' }} />
              
              {/* Inner Avatar Container */}
              <div className="relative w-64 sm:w-80 aspect-square rounded-2xl overflow-hidden bg-[#0D1117] border-2 border-[#00F0FF]/60 shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                <img src={avatar} alt={name} className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500" />
                
                {/* HUD Overlay Stamp */}
                <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-[#00F0FF]/30 flex items-center justify-between text-[10px]">
                  <span className="text-[#00F0FF] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
                    STATUS: READY
                  </span>
                  <span className="text-slate-400 font-sans">{location}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Typography & Terminal Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 space-y-6 order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-semibold">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>LEVEL 99 // {role.toUpperCase()}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-sans uppercase">
              Hello, I am <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#00F0FF]">
                {name}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
              {bio}
            </p>

            {/* Terminal Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              {resumeUrl && resumeUrl !== '#' && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#38BDF8] hover:from-[#38BDF8] hover:to-[#00F0FF] text-black font-bold text-sm tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all hover:-translate-y-0.5"
                >
                  <FileText className="w-4 h-4 text-black" />
                  <span>DOWNLOAD_RESUME.PDF</span>
                  <Download className="w-4 h-4" />
                </a>
              )}

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0D1117] hover:bg-[#161B22] text-white font-semibold text-sm border border-[#30363D] hover:border-[#00F0FF]/50 transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <span>INITIATE_CONTACT</span>
                <ArrowUpRight className="w-4 h-4 text-[#00F0FF]" />
              </a>

              <a
                href="#about"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-transparent hover:bg-white/5 text-slate-400 hover:text-white text-sm transition-colors"
              >
                <span>// ABOUT_ME</span>
              </a>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          4. SELECTED PROJECTS (HIGH-TECH HUD CARDS)
      ───────────────────────────────────────────────────────────────────── */}
      {hasProjects && (
        <section id="work" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-16">
          <div className="flex items-center justify-between mb-10 border-b border-[#1E293B] pb-4">
            <div>
              <span className="text-xs text-[#00F0FF] tracking-widest block mb-1">MODULE // 01</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white uppercase">
                Featured Projects & Architecture
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">[{projects.length} REPOSITORIES]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj, idx) => (
              <div
                key={proj.id || idx}
                onClick={() => setSelectedProject(proj)}
                className="group cursor-pointer rounded-2xl bg-[#0C1017] border border-[#1E293B] hover:border-[#00F0FF]/60 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Screenshot */}
                  {proj.screenshot && (
                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black relative border border-white/5">
                      <img
                        src={proj.screenshot}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0C1017] via-transparent to-transparent opacity-60" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] text-[#00F0FF] uppercase tracking-wider font-semibold">
                      {proj.category || 'SYSTEM'}
                    </span>
                    <h3 className="text-lg font-bold font-sans text-white group-hover:text-[#00F0FF] transition-colors">
                      {proj.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 font-sans line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs text-[#00F0FF] font-semibold mt-4">
                  <span>VIEW_DETAILS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          5. EXPERIENCE TIMELINE
      ───────────────────────────────────────────────────────────────────── */}
      {experience.length > 0 && (
        <section id="experience" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-16">
          <div className="mb-10 border-b border-[#1E293B] pb-4">
            <span className="text-xs text-[#8B5CF6] tracking-widest block mb-1">MODULE // 02</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white uppercase">
              Career & Deployment Timeline
            </h2>
          </div>

          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <div
                key={exp.id || idx}
                className="p-6 rounded-2xl bg-[#0C1017] border border-[#1E293B] hover:border-[#8B5CF6]/50 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-base sm:text-lg font-bold text-white font-sans">
                      {exp.role}
                    </span>
                    <span className="text-xs text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30">
                      @{exp.company}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    {exp.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-[#A855F7] font-bold block">
                    {exp.period}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {exp.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          6. SKILLS & CAPABILITIES MATRIX
      ───────────────────────────────────────────────────────────────────── */}
      {skills.length > 0 && (
        <section id="skills" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-16">
          <div className="mb-10 border-b border-[#1E293B] pb-4">
            <span className="text-xs text-[#00F0FF] tracking-widest block mb-1">MODULE // 03</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white uppercase">
              Tech Stack & Tooling Matrix
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((group, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0C1017] border border-[#1E293B] space-y-4"
              >
                <div className="flex items-center gap-2 text-[#00F0FF]">
                  <Cpu className="w-4 h-4" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    {group.category}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {Array.isArray(group.items) && group.items.map((item, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-lg bg-[#161B22] border border-[#30363D] text-slate-200 hover:border-[#00F0FF] transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          7. ABOUT SECTION
      ───────────────────────────────────────────────────────────────────── */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0C1017] to-[#111827] border border-[#1E293B] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6">
          <div className="flex items-center gap-2 text-[#00F0FF]">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-bold">Philosophy & Engineering Ethos</span>
          </div>

          <p className="text-base sm:text-lg text-slate-200 font-sans leading-relaxed">
            {data?.aboutText || bio}
          </p>

          {resumeUrl && (
            <div className="pt-2">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 text-[#00F0FF] border border-[#00F0FF]/40 text-xs font-bold transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>INSPECT_FULL_RESUME.PDF</span>
                <Download className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          8. FOOTER
      ───────────────────────────────────────────────────────────────────── */}
      <footer id="contact" className="relative z-10 border-t border-[#1E293B] bg-[#050608] py-12 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div>
            <span className="text-white font-bold block mb-1">{name}</span>
            <span>{email} • {phone}</span>
          </div>

          <div className="flex items-center gap-4">
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#00F0FF] transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-[#00F0FF] transition-colors">
                <Github className="w-4 h-4" />
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noreferrer" className="hover:text-[#00F0FF] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </footer>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
