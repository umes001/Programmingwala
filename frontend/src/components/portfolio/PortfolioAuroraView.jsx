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
  Compass,
  Flame,
  FileText,
  Linkedin,
  Github,
  Instagram
} from 'lucide-react';
import ProjectModal from './ProjectModal';

export default function PortfolioAuroraView({ data }) {
  const [selectedProject, setSelectedProject] = useState(null);

  const name = data?.name || 'Alex Morgan';
  const role = data?.role || 'Creative Technologist & Founder';
  const location = data?.location || 'Tokyo & Remote';
  const bio = data?.bio || 'Building at the intersection of generative AI, high-craft user interfaces, and modern full-stack systems.';
  const avatar = data?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
  const resumeUrl = data?.resumeUrl || '';
  const email = data?.email || 'alex@aurora.studio';
  const phone = data?.phone || '+81 3 5555 0142';

  const projects = Array.isArray(data?.projects) ? data.projects : [];
  const hasProjects = projects.length > 0;
  const experience = Array.isArray(data?.experience) ? data.experience : [];
  const skills = Array.isArray(data?.skills) ? data.skills : [];
  const socials = data?.socials || {};

  return (
    <div className="min-h-screen bg-[#070614] text-[#F1F5F9] font-sans selection:bg-[#EC4899] selection:text-white relative overflow-hidden">
      
      {/* ─────────────────────────────────────────────────────────────────────
          1. FLUID MOVING AURORA LIGHT BLOBS
      ───────────────────────────────────────────────────────────────────── */}
      {/* Aurora Orb 1: Violet/Magenta (Top Center) */}
      <div 
        className="absolute top-[-100px] left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#8B5CF6]/30 via-[#EC4899]/25 to-transparent blur-[160px] pointer-events-none animate-pulse"
        style={{ animationDuration: '7s' }}
      />
      {/* Aurora Orb 2: Electric Cyan (Middle Right) */}
      <div 
        className="absolute top-[35%] right-[-150px] w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-[#06B6D4]/25 via-[#3B82F6]/20 to-transparent blur-[180px] pointer-events-none animate-pulse"
        style={{ animationDuration: '9s' }}
      />
      {/* Aurora Orb 3: Deep Pink/Indigo (Bottom Left) */}
      <div 
        className="absolute bottom-[-100px] left-[-100px] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#A855F7]/25 via-[#EC4899]/15 to-transparent blur-[170px] pointer-events-none animate-pulse"
        style={{ animationDuration: '11s' }}
      />

      {/* Iridescent Top Glow Line */}
      <div className="relative z-30 h-[2px] w-full bg-gradient-to-r from-transparent via-[#EC4899] to-transparent shadow-[0_0_15px_#EC4899]" />

      {/* ─────────────────────────────────────────────────────────────────────
          2. FROSTED GLASS NAVBAR
      ───────────────────────────────────────────────────────────────────── */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-7 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#EC4899] to-[#8B5CF6] p-[1px]">
            <div className="w-full h-full rounded-2xl bg-[#0B091E] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-[#F472B6]" />
            </div>
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white block group-hover:text-[#F472B6] transition-colors">
              {name}
            </span>
            <span className="text-[10px] text-pink-400 font-mono tracking-wider">
              AURORA EDITION
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-300">
          {hasProjects && <a href="#work" className="hover:text-pink-400 transition-colors">Creations</a>}
          <a href="#experience" className="hover:text-pink-400 transition-colors">Journey</a>
          <a href="#skills" className="hover:text-pink-400 transition-colors">Capabilities</a>
          <a href="#about" className="hover:text-pink-400 transition-colors">About</a>
          <a href="#contact" className="hover:text-pink-400 transition-colors">Connect</a>
        </nav>

        <div className="flex items-center gap-3">
          {resumeUrl && resumeUrl !== '#' && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold backdrop-blur-xl border border-white/15 transition-all shadow-[0_0_15px_rgba(236,72,153,0.2)]"
            >
              <FileText className="w-3.5 h-3.5 text-pink-400" />
              <span>Resume (PDF)</span>
              <Download className="w-3.5 h-3.5" />
            </a>
          )}
          <a
            href="#contact"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] hover:from-[#DB2777] hover:to-[#7C3AED] text-white text-xs font-bold shadow-md shadow-pink-500/25 transition-all"
          >
            LET'S TALK
          </a>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────────
          3. GRAND CENTER-ALIGNED HALO HERO
      ───────────────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 pt-12 sm:pt-20 pb-24 text-center">
        
        {/* Floating Halo Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            {/* Rotating Rainbow Light Ring */}
            <div 
              className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#EC4899] via-[#8B5CF6] to-[#06B6D4] opacity-80 blur-md animate-spin"
              style={{ animationDuration: '9s' }}
            />
            {/* Avatar Frame */}
            <div className="relative w-36 sm:w-44 aspect-square rounded-full overflow-hidden p-1 bg-[#0F0D24]">
              <img src={avatar} alt={name} className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
        </motion.div>

        {/* Hero Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/10 text-xs font-medium text-pink-300">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>{role} • {location}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Engineering Experiences <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] via-[#C084FC] to-[#38BDF8]">
              That Transcend The Ordinary.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            {bio}
          </p>

          {/* Action Group */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {resumeUrl && resumeUrl !== '#' && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] hover:from-[#DB2777] hover:to-[#7C3AED] text-white font-bold text-sm shadow-xl shadow-pink-500/30 transition-all hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4 text-white" />
                <span>Download Resume (PDF)</span>
                <Download className="w-4 h-4" />
              </a>
            )}

            <a
              href="#about"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white text-sm font-semibold backdrop-blur-xl border border-white/15 transition-all hover:-translate-y-0.5"
            >
              <span>Explore Story</span>
              <User className="w-4 h-4 text-pink-400" />
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-transparent hover:bg-white/5 text-slate-300 text-sm font-medium transition-colors"
            >
              <span>Get in touch</span>
              <ArrowUpRight className="w-4 h-4 text-cyan-400" />
            </a>
          </div>
        </motion.div>

      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          4. SELECTED CREATIONS (FROSTED GLASS CARDS)
      ───────────────────────────────────────────────────────────────────── */}
      {hasProjects && (
        <section id="work" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-pink-400 font-bold block mb-1">Portfolio</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Featured Works & Experiments
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">[{projects.length} Showcases]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj, idx) => (
              <div
                key={proj.id || idx}
                onClick={() => setSelectedProject(proj)}
                className="group cursor-pointer rounded-3xl bg-white/[0.04] hover:bg-white/[0.07] backdrop-blur-2xl border border-white/10 hover:border-pink-500/50 p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(236,72,153,0.15)] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {proj.screenshot && (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black/40 relative border border-white/10">
                      <img
                        src={proj.screenshot}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-pink-400 font-bold">
                      {proj.category || 'PROJECT'}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors mt-1">
                      {proj.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-pink-400 font-semibold mt-4">
                  <span>Explore Case Study</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          5. EXPERIENCE / JOURNEY
      ───────────────────────────────────────────────────────────────────── */}
      {experience.length > 0 && (
        <section id="experience" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-20 border-t border-white/5">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-widest text-pink-400 font-bold block mb-1">Career</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Professional Journey
            </h2>
          </div>

          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <div
                key={exp.id || idx}
                className="p-7 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-violet-500/40 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-[0_0_8px_#EC4899]" />
                    <h3 className="text-lg font-bold text-white">
                      {exp.role}
                    </h3>
                    <span className="text-xs text-pink-300 bg-pink-500/10 px-3 py-0.5 rounded-full border border-pink-500/20">
                      @{exp.company}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-light">
                    {exp.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-cyan-400 font-semibold block">
                    {exp.period}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    {exp.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          6. CAPABILITIES & SKILLS
      ───────────────────────────────────────────────────────────────────── */}
      {skills.length > 0 && (
        <section id="skills" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-20 border-t border-white/5">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold block mb-1">Stack</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Expertise & Superpowers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((group, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 space-y-4"
              >
                <div className="flex items-center gap-2 text-pink-400">
                  <Flame className="w-4 h-4" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    {group.category}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {Array.isArray(group.items) && group.items.map((item, i) => (
                    <span
                      key={i}
                      className="text-xs px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-slate-200"
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
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-20 border-t border-white/5">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-2xl border border-white/15 shadow-2xl space-y-6">
          <span className="text-xs uppercase tracking-widest text-pink-400 font-bold">About the Creator</span>
          <p className="text-lg sm:text-xl font-light text-slate-100 leading-relaxed">
            {data?.aboutText || bio}
          </p>
          {resumeUrl && (
            <div className="pt-2">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/20 text-xs font-semibold transition-all shadow-md"
              >
                <FileText className="w-4 h-4 text-pink-400" />
                <span>View Full Resume (PDF)</span>
                <Download className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          8. FOOTER
      ───────────────────────────────────────────────────────────────────── */}
      <footer id="contact" className="relative z-10 border-t border-white/10 bg-[#05040E] py-14 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div>
            <h4 className="text-white font-bold text-sm mb-1">{name}</h4>
            <span>{email} • {phone}</span>
          </div>

          <div className="flex items-center gap-4">
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors">
                <Github className="w-4 h-4" />
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </footer>

      <ProjectModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
