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
  Crown,
  Gem,
  Award,
  FileText,
  Linkedin,
  Github,
  Instagram
} from 'lucide-react';
import ProjectModal from './ProjectModal';

export default function PortfolioEmeraldView({ data }) {
  const [selectedProject, setSelectedProject] = useState(null);

  const name = data?.name || 'Alex Morgan';
  const role = data?.role || 'Lead Product Architect';
  const location = data?.location || 'Zurich, Switzerland';
  const bio = data?.bio || 'Crafting bespoke digital artifacts, strategic brand architectures, and high-performance software systems for global ventures.';
  const avatar = data?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
  const resumeUrl = data?.resumeUrl || '';
  const email = data?.email || 'alex@morgan.luxury';
  const phone = data?.phone || '+41 44 215 5000';

  const projects = Array.isArray(data?.projects) ? data.projects : [];
  const hasProjects = projects.length > 0;
  const experience = Array.isArray(data?.experience) ? data.experience : [];
  const skills = Array.isArray(data?.skills) ? data.skills : [];
  const socials = data?.socials || {};

  return (
    <div className="min-h-screen bg-[#040C0E] text-[#ECFDF5] font-sans selection:bg-[#10B981] selection:text-black relative overflow-hidden">
      
      {/* ─────────────────────────────────────────────────────────────────────
          1. MOVING EMERALD AURORA LIGHTS & GOLDEN SHIMMER
      ───────────────────────────────────────────────────────────────────── */}
      {/* Moving Aurora Waves */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[550px] bg-gradient-to-b from-[#10B981]/15 via-[#059669]/10 to-transparent rounded-full blur-[160px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[40%] left-[-100px] w-[600px] h-[600px] bg-gradient-to-tr from-[#F59E0B]/10 via-[#10B981]/10 to-transparent rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#10B981]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle Gold Shimmer Bar (Top) */}
      <div className="relative z-30 h-[2px] w-full bg-gradient-to-r from-transparent via-[#F59E0B]/60 to-transparent shadow-[0_0_12px_#F59E0B]" />

      {/* ─────────────────────────────────────────────────────────────────────
          2. LUXURY NAVIGATION
      ───────────────────────────────────────────────────────────────────── */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-8 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10B981]/20 to-[#F59E0B]/20 border border-[#10B981]/40 flex items-center justify-center text-[#F59E0B] shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Crown className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div>
            <span className="text-base font-serif font-bold tracking-wider text-white block group-hover:text-[#10B981] transition-colors">
              {name}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#F59E0B] block font-mono">
              Bespoke Edition
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-9 text-xs uppercase tracking-widest text-emerald-100/70 font-medium">
          {hasProjects && <a href="#work" className="hover:text-[#F59E0B] transition-colors">Portfolio</a>}
          <a href="#experience" className="hover:text-[#F59E0B] transition-colors">Milestones</a>
          <a href="#skills" className="hover:text-[#F59E0B] transition-colors">Expertise</a>
          <a href="#about" className="hover:text-[#F59E0B] transition-colors">Vision</a>
          <a href="#contact" className="hover:text-[#F59E0B] transition-colors">Inquire</a>
        </nav>

        <div className="flex items-center gap-3">
          {resumeUrl && resumeUrl !== '#' && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#34D399] border border-[#10B981]/40 text-xs font-semibold tracking-wide transition-all shadow-[0_0_12px_rgba(16,185,129,0.15)]"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Dossier (PDF)</span>
              <Download className="w-3.5 h-3.5" />
            </a>
          )}
          <a
            href="#contact"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-black text-xs font-bold tracking-wider transition-all shadow-md shadow-[#F59E0B]/20"
          >
            INQUIRE
          </a>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────────
          3. ASYMMETRIC ROYAL HERO WITH ARCHED PORTRAIT
      ───────────────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 pt-10 sm:pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-7"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-xs text-[#34D399] font-medium tracking-wide">
              <Gem className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{role} • {location}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-bold font-serif text-white tracking-tight leading-[1.1]">
              Elevating Ideas Into <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#34D399] via-[#F59E0B] to-[#10B981]">
                Enduring Masterpieces.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/80 leading-relaxed max-w-xl font-light">
              {bio}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {resumeUrl && resumeUrl !== '#' && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-semibold text-sm shadow-lg shadow-[#10B981]/25 hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  <FileText className="w-4 h-4 text-emerald-200" />
                  <span>Curriculum Vitae (PDF)</span>
                  <Download className="w-4 h-4 opacity-80" />
                </a>
              )}

              <a
                href="#about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#081E22] hover:bg-[#0C2A30] text-emerald-200 text-sm font-semibold border border-[#10B981]/30 transition-all hover:-translate-y-0.5"
              >
                <span>Read Philosophy</span>
                <User className="w-4 h-4 text-[#F59E0B]" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-transparent hover:bg-white/5 text-emerald-300 text-sm font-medium transition-colors"
              >
                <span>Private Consultation</span>
                <ArrowUpRight className="w-4 h-4 text-[#F59E0B]" />
              </a>
            </div>
          </motion.div>

          {/* Right: Arched Portrait with Gold-Trimmed Glass Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Emerald Backlight Halo */}
              <div className="absolute inset-0 rounded-t-[140px] rounded-b-3xl bg-gradient-to-t from-[#10B981]/20 to-[#F59E0B]/20 blur-2xl -z-10" />

              {/* Arched Picture Frame */}
              <div className="relative w-72 sm:w-84 h-96 sm:h-[420px] rounded-t-[140px] rounded-b-3xl overflow-hidden border-2 border-[#F59E0B]/40 shadow-[0_15px_40px_rgba(0,0,0,0.6)] bg-[#0A1F24]">
                <img src={avatar} alt={name} className="w-full h-full object-cover object-top" />
                
                {/* Gold Crest Ribbon */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#040C0E] via-[#040C0E]/80 to-transparent flex items-center justify-between text-xs">
                  <span className="text-[#F59E0B] font-serif font-bold tracking-wider">{name}</span>
                  <span className="text-emerald-400 text-[11px]">Available for Commission</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          4. SELECTED MASTERWORKS (PROJECTS)
      ───────────────────────────────────────────────────────────────────── */}
      {hasProjects && (
        <section id="work" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-20 border-t border-[#0F2A30]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#F59E0B] font-semibold block">Curated Portfolio</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white">
                Selected Works & Deployments
              </h2>
            </div>
            <span className="text-xs text-emerald-400 font-mono">[{projects.length} Works Cataloged]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj, idx) => (
              <div
                key={proj.id || idx}
                onClick={() => setSelectedProject(proj)}
                className="group cursor-pointer rounded-3xl bg-gradient-to-b from-[#081B20] to-[#040E11] border border-[#12363F] hover:border-[#F59E0B]/60 p-5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {proj.screenshot && (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black relative border border-white/5">
                      <img
                        src={proj.screenshot}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#F59E0B] font-bold">
                      {proj.category || 'COMMISSION'}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#34D399] transition-colors mt-1">
                      {proj.title}
                    </h3>
                  </div>

                  <p className="text-xs text-emerald-100/70 line-clamp-3 leading-relaxed font-light">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#12363F] flex items-center justify-between text-xs text-[#34D399] font-medium mt-4">
                  <span>Examine Showcase</span>
                  <ArrowRight className="w-4 h-4 text-[#F59E0B] group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          5. CAREER MILESTONES (EXPERIENCE)
      ───────────────────────────────────────────────────────────────────── */}
      {experience.length > 0 && (
        <section id="experience" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-20 border-t border-[#0F2A30]">
          <div className="mb-12 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#F59E0B] font-semibold block">Track Record</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white">
              Professional Milestones
            </h2>
          </div>

          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <div
                key={exp.id || idx}
                className="p-7 rounded-3xl bg-[#081B20]/80 border border-[#12363F] hover:border-[#10B981]/50 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]" />
                    <h3 className="text-lg font-serif font-bold text-white">
                      {exp.role}
                    </h3>
                    <span className="text-xs text-[#34D399] bg-[#10B981]/10 px-3 py-0.5 rounded-full border border-[#10B981]/30">
                      {exp.company}
                    </span>
                  </div>
                  <p className="text-sm text-emerald-100/75 leading-relaxed font-light">
                    {exp.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-[#F59E0B] font-semibold block">
                    {exp.period}
                  </span>
                  <span className="text-xs text-emerald-400/60 block mt-0.5">
                    {exp.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          6. DOMAIN EXPERTISE (SKILLS)
      ───────────────────────────────────────────────────────────────────── */}
      {skills.length > 0 && (
        <section id="skills" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-20 border-t border-[#0F2A30]">
          <div className="mb-12 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#F59E0B] font-semibold block">Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white">
              Areas of Mastery & Core Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((group, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-[#081B20]/90 border border-[#12363F] space-y-4"
              >
                <div className="flex items-center gap-2 text-[#F59E0B]">
                  <Award className="w-4 h-4" />
                  <h3 className="text-sm font-serif font-bold uppercase tracking-wider text-white">
                    {group.category}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {Array.isArray(group.items) && group.items.map((item, i) => (
                    <span
                      key={i}
                      className="text-xs px-3.5 py-1.5 rounded-full bg-[#051317] border border-[#15424D] text-emerald-200"
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
          7. ABOUT / VISION
      ───────────────────────────────────────────────────────────────────── */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-20 border-t border-[#0F2A30]">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#081E23] via-[#05161A] to-[#040C0E] border border-[#14424D] shadow-2xl space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#F59E0B] font-bold">Personal Vision & Practice</span>
          <p className="text-lg sm:text-xl font-serif text-emerald-50 leading-relaxed">
            {data?.aboutText || bio}
          </p>
          {resumeUrl && (
            <div className="pt-2">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#34D399] border border-[#10B981]/40 text-xs font-semibold transition-all shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>Download Executive Dossier (PDF)</span>
                <Download className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          8. LUXURY FOOTER
      ───────────────────────────────────────────────────────────────────── */}
      <footer id="contact" className="relative z-10 border-t border-[#0F2A30] bg-[#03090B] py-14 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-emerald-200/60">
          <div>
            <h4 className="text-white font-serif font-bold text-sm mb-1">{name}</h4>
            <span>{email} • {phone}</span>
          </div>

          <div className="flex items-center gap-4">
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#F59E0B] transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-[#F59E0B] transition-colors">
                <Github className="w-4 h-4" />
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noreferrer" className="hover:text-[#F59E0B] transition-colors">
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
