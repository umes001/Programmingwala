import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, TrendingUp, Sparkles, Server, Cloud, Terminal, 
  Code2, Globe, Database, ArrowRight, CheckCircle2, Star, 
  ShieldCheck, Award, MessageCircle, MapPin
} from 'lucide-react';
import { CAREER_TRACKS } from '../../data/careerTracksData.js';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function CareerTrackHub() {
  const { isDark } = useTheme();
  const tracks = Object.values(CAREER_TRACKS);

  const getIcon = (name) => {
    switch(name) {
      case 'Server': return Server;
      case 'Cloud': return Cloud;
      case 'Terminal': return Terminal;
      case 'Code2': return Code2;
      case 'Globe': return Globe;
      case 'Database': return Database;
      default: return Briefcase;
    }
  };

  useEffect(() => {
    document.title = 'Top Trending Tech Careers & High-Paying Job Tracks 2026 | ProgrammingWala';
    
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = 'Explore top trending tech jobs in 2026: Java Full Stack Developer, AWS DevOps Engineer, Python AI Developer, React Frontend, and MERN Stack. Roadmaps, salaries & 100% placement support.';

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://programmingwala.com/careers';
  }, []);

  return (
    <div className={"min-h-screen py-12 px-4 sm:px-6 lg:px-8 " + (isDark ? "bg-[#0b0f19] text-white" : "bg-brandCream text-slate-900")}>
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>2026 Industry Hiring & Tech Career Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            High-Paying <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 bg-clip-text text-transparent">Tech Job Tracks</span> & Roadmaps
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-medium">
            Explore verified career roadmaps, salary insights, hiring companies, and interview preparation for the most in-demand software engineering careers across India and global remote markets.
          </p>
        </div>

        {/* Global Hiring Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 text-center shadow-lg">
            <span className="text-2xl sm:text-3xl font-black text-pink-400 block">120,000+</span>
            <span className="text-xs text-slate-400 font-bold uppercase mt-1 block">Active Tech Jobs</span>
          </div>
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 text-center shadow-lg">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 block">₹8 – ₹32 LPA</span>
            <span className="text-xs text-slate-400 font-bold uppercase mt-1 block">Avg. Salary Packages</span>
          </div>
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 text-center shadow-lg">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">100%</span>
            <span className="text-xs text-slate-400 font-bold uppercase mt-1 block">Placement Assistance</span>
          </div>
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 text-center shadow-lg">
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 block">ISO Certified</span>
            <span className="text-xs text-slate-400 font-bold uppercase mt-1 block">Industry Curriculum</span>
          </div>
        </div>

        {/* Career Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => {
            const Icon = getIcon(track.iconName);
            return (
              <motion.div
                key={track.slug}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col justify-between p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-pink-500/40 shadow-xl space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={"w-12 h-12 rounded-2xl bg-gradient-to-br " + track.accentColor + " flex items-center justify-center text-white shadow-lg"}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-amber-300 font-mono">
                      {track.avgSalaryIndia}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-pink-400 tracking-wider block">
                      {track.heroTag}
                    </span>
                    <h2 className="text-xl font-black text-white mt-1">
                      {track.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {track.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {track.summary}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Demand Index:</span>
                      <strong className="text-emerald-400 font-bold">{track.demandScore}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Active Roles:</span>
                      <strong className="text-white font-mono">{track.openRolesCount}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    to={"/careers/" + track.slug}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 text-white text-xs font-black transition-all shadow-md"
                  >
                    <span>View Career Roadmap & Jobs</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-pink-950/60 border border-purple-500/30 text-center space-y-4 shadow-2xl">
          <h3 className="text-2xl font-black text-white">Need Free 1-on-1 Career Counselling?</h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Speak directly with our senior industry mentors and lead architects to choose the best career path tailored for you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://wa.me/917503962162?text=Hi%2C%20I%20want%20to%20discuss%20which%20career%20track%20is%20best%20for%20me."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-lg transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Career Advisor</span>
            </a>
            <Link
              to="/practice"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-black text-xs border border-slate-700 transition"
            >
              <Code2 className="w-4 h-4" />
              <span>Start Free Practice Hub</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
