import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Layers, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ProjectModal({ project, isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-3xl bg-[#FFFDFB] rounded-3xl shadow-2xl border border-[#F2E8E1] overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]"
          >
            {/* Top Bar with Close */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F2E8E1]/80 bg-white/70 backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E05A38]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#E05A38]">
                  {project.category || 'Featured Work'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#F5EDE8] hover:bg-[#EBE0D8] text-[#554D49] flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* Project Screenshot / Hero Preview */}
              {project.screenshot ? (
                <div className="relative w-full rounded-2xl overflow-hidden bg-[#F6ECE4] border border-[#F0DFD5] shadow-inner group max-h-80 flex items-center justify-center">
                  <img
                    src={project.screenshot}
                    alt={project.title}
                    className="w-full h-auto max-h-80 object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {project.category && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-medium text-[#2C2523] shadow-sm">
                      {project.category}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-48 rounded-2xl bg-gradient-to-tr from-[#FFE7DC] via-[#FFF3EC] to-[#FCEEE6] border border-[#F3DFD2] flex flex-col items-center justify-center p-6 text-center">
                  <Layers className="w-10 h-10 text-[#E05A38]/60 mb-2" />
                  <p className="text-sm font-medium text-[#5B4F4A]">{project.title}</p>
                  <p className="text-xs text-[#9B8980]">Interactive Digital Experience</p>
                </div>
              )}

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1F1917] tracking-tight font-serif">
                  {project.title}
                </h3>
                {project.subtitle && (
                  <p className="text-base text-[#E05A38] font-medium mt-1">
                    {project.subtitle}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="bg-[#FAF5F0] rounded-2xl p-5 border border-[#F0E6DE]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A6B63] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E05A38]" />
                  About The Project
                </h4>
                <p className="text-sm sm:text-base text-[#423935] leading-relaxed whitespace-pre-line">
                  {project.description || 'A modern digital solution engineered for seamless performance, thoughtful aesthetic interfaces, and engaging user journeys.'}
                </p>
              </div>

              {/* Highlights or Impact if present */}
              {project.highlights && project.highlights.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A6B63] mb-3">
                    Key Highlights & Results
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-[#4E433E] bg-white rounded-xl p-3 border border-[#F0E5DC]">
                        <CheckCircle2 className="w-4 h-4 text-[#E05A38] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies / Tags */}
              {project.tags && project.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A6B63] mb-2.5">
                    Technologies & Methods
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#EBE0D7] text-[#473C37] shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#F2E8E1] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E05A38] hover:bg-[#CB4B2B] text-white text-sm font-semibold shadow-md shadow-[#E05A38]/25 hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      <span>Visit Live Demo</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#FAF4EF] text-[#2C2523] border border-[#E0D4CB] text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5"
                    >
                      <Github className="w-4 h-4" />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-sm font-medium text-[#7A6B63] hover:text-[#2C2523] hover:bg-[#F5ECE5] transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
