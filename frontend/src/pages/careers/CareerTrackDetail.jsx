import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle2, TrendingUp, Building2, HelpCircle, 
  BookOpen, Sparkles, Award, MessageCircle, Phone, ArrowRight,
  Code2, Server, Cloud, Terminal, Globe, Database, Share2, Check
} from 'lucide-react';
import { CAREER_TRACKS } from '../../data/careerTracksData.js';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function CareerTrackDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  const trackKey = slug || 'java-full-stack-developer';
  const track = CAREER_TRACKS[trackKey] || CAREER_TRACKS['java-full-stack-developer'];

  useEffect(() => {
    document.title = track.seoTitle;

    const setOrCreateMeta = (nameOrProp, attrValue, content) => {
      let element = document.querySelector("meta[" + nameOrProp + "='" + attrValue + "']");
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameOrProp, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setOrCreateMeta('name', 'description', track.metaDesc);
    setOrCreateMeta('name', 'keywords', track.keywords);
    setOrCreateMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large');
    setOrCreateMeta('property', 'og:title', track.seoTitle);
    setOrCreateMeta('property', 'og:description', track.metaDesc);
    setOrCreateMeta('property', 'og:url', window.location.href);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = "https://programmingwala.com/careers/" + track.slug;

    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Occupation',
          'name': track.title,
          'description': track.summary,
          'estimatedSalary': [
            {
              '@type': 'MonetaryAmountDistribution',
              'name': 'base',
              'currency': 'INR',
              'duration': 'P1Y',
              'percentile10': '600000',
              'percentile90': '2400000'
            }
          ],
          'occupationLocation': [{ '@type': 'Country', 'name': 'India' }, { '@type': 'Country', 'name': 'Worldwide' }]
        },
        {
          '@type': 'Course',
          'name': track.title + " Professional Training & Placement Program",
          'description': track.metaDesc,
          'provider': {
            '@type': 'EducationalOrganization',
            'name': 'AppleTree Infotech & ProgrammingWala',
            'sameAs': 'https://programmingwala.com'
          }
        },
        {
          '@type': 'FAQPage',
          'mainEntity': track.interviewQuestions.map(q => ({
            '@type': 'Question',
            'name': q.q,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': q.a
            }
          }))
        }
      ]
    };

    let scriptTag = document.getElementById('career-track-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'career-track-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemaData);

    return () => {
      const el = document.getElementById('career-track-schema');
      if (el) el.remove();
    };
  }, [track]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={"min-h-screen py-10 px-4 sm:px-6 lg:px-8 " + (isDark ? "bg-[#0b0f19] text-white" : "bg-brandCream text-slate-900")}>
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Navigation & Share */}
        <div className="flex items-center justify-between">
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Career Tracks</span>
          </Link>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Share Guide'}</span>
          </button>
        </div>

        {/* Hero Section */}
        <header className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-black uppercase tracking-wider">
              {track.heroTag}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black">
              {track.demandScore}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {track.h1}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-medium">
              {track.subtitle}
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            {track.summary}
          </p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xl sm:text-2xl font-black text-white block">{track.avgSalaryIndia}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">India Salary</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xl sm:text-2xl font-black text-amber-400 block">{track.avgSalaryGlobal}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">Global Salary</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xl sm:text-2xl font-black text-pink-400 block">{track.openRolesCount}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">Open Vacancies</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xl sm:text-2xl font-black text-cyan-400 block">4 Months</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">Training Duration</span>
            </div>
          </div>
        </header>

        {/* 1. Core Technical Skills Required */}
        <section aria-labelledby="skills-req-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-pink-400" />
            <h2 id="skills-req-heading" className="text-xl sm:text-2xl font-black text-white">
              Essential Technical Competencies & Skills Matrix
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {track.skills.map((skill, idx) => (
              <div key={idx} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white">{skill.name}</h3>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-black border border-pink-500/30">
                    {skill.level}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skill.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Month-by-Month Career Roadmap */}
        <section aria-labelledby="roadmap-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 id="roadmap-heading" className="text-xl sm:text-2xl font-black text-white">
              Step-by-Step Learning & Career Roadmap
            </h2>
          </div>

          <div className="space-y-3">
            {track.roadmap.map((step, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center gap-4 shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg shrink-0 border border-amber-500/30">
                  0{idx + 1}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-white">{step.phase}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{step.topics}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Top Hiring Companies */}
        <section aria-labelledby="companies-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            <h2 id="companies-heading" className="text-xl sm:text-2xl font-black text-white">
              Top Companies Actively Hiring {track.title}s
            </h2>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-lg">
            <div className="flex flex-wrap gap-2.5">
              {track.topCompanies.map(comp => (
                <div key={comp} className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-black text-slate-200 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{comp}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Top Real-World Interview Questions & Model Answers */}
        <section aria-labelledby="interview-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <h2 id="interview-heading" className="text-xl sm:text-2xl font-black text-white">
              Trending Technical Interview Questions & Answers
            </h2>
          </div>

          <div className="space-y-3">
            {track.interviewQuestions.map((q, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-2">
                <h3 className="text-sm sm:text-base font-black text-white flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    Q
                  </span>
                  <span>{q.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8.5">
                  {q.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Direct Action CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-pink-950/50 via-slate-900 to-indigo-950/50 border border-pink-500/30 text-center space-y-4 shadow-2xl">
          <h3 className="text-2xl font-black text-white">Ready to Launch Your Career as a {track.title}?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Join AppleTree Infotech & ProgrammingWala to receive hands-on mentoring, live project certification, resume building, and direct interviews.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={"https://wa.me/917503962162?text=Hi%2C%20I%20want%20to%20enroll%20in%20the%20" + encodeURIComponent(track.title) + "%20program."}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-lg transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enroll & Book Free Trial Class</span>
            </a>
            <Link
              to="/practice"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-black text-xs border border-slate-700 transition"
            >
              <Code2 className="w-4 h-4" />
              <span>Practice Code Now</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
