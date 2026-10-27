import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Save,
  Share2,
  ExternalLink,
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Eye,
  Edit3,
  Layers,
  Briefcase,
  Code2,
  User,
  Quote as QuoteIcon,
  Mail,
  Copy,
  FolderPlus,
  Sliders,
  Rocket,
  FileText,
  Download,
  Palette,
  Zap,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext.jsx';
import PortfolioModernView from '../../components/portfolio/PortfolioModernView.jsx';

export default function PortfolioBuilder() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const avatarInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  // Active Tab: 'hero' | 'design' | 'projects' | 'experience' | 'skills' | 'about' | 'contact'
  const [activeTab, setActiveTab] = useState('hero');

  // View Mode: 'split' | 'editor' | 'preview'
  const [viewMode, setViewMode] = useState('split');

  // Selected Design / Lighting Theme: 'editorial-warm' | 'cyber-neon' | 'midnight-emerald' | 'cosmic-aurora'
  const [theme, setTheme] = useState('editorial-warm');

  // State: Hero & Identity
  const [name, setName] = useState('Alex Morgan');
  const [role, setRole] = useState('Brand & Web Designer');
  const [location, setLocation] = useState('Toronto, Canada');
  const [bio, setBio] = useState(
    'I help startups and creative brands build thoughtful identities and digital experiences that connect.'
  );
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  );
  const [availability, setAvailability] = useState({
    status: 'Available for work',
    period: 'May 2026',
    description: "I'm currently accepting new projects and roles for"
  });
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');

  // State: Projects (with screenshots)
  const [projects, setProjects] = useState([
    {
      id: 'proj-1',
      title: 'ROSE Skincare',
      category: 'Branding',
      subtitle: 'Visual Identity & E-Commerce',
      screenshot: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      description: 'A tactile, minimalist brand identity and bespoke digital storefront for luxury organic skincare. Engineered for high conversion with fluid interactive transitions.',
      highlights: [
        'Designed custom design system with 40+ atomic components.',
        'Increased checkout speed by 45% using headless architecture.'
      ],
      tags: ['React', 'Next.js', 'Tailwind CSS', 'Shopify Storefront API'],
      liveUrl: 'https://example.com/rose-skincare',
      repoUrl: 'https://github.com/example/rose-skincare'
    },
    {
      id: 'proj-2',
      title: 'Helix SaaS',
      category: 'Web Design',
      subtitle: 'Website Design & Interactive App',
      screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      description: 'High-throughput analytics platform website featuring real-time interactive charts, customer conversion funnels, and enterprise security compliance.',
      highlights: [
        'Interactive real-time SVG charting engine with 60fps animations.',
        'Automated multi-tenant onboarding pipeline.'
      ],
      tags: ['TypeScript', 'Vite', 'Chart.js', 'Node.js', 'PostgreSQL'],
      liveUrl: 'https://example.com/helix-saas',
      repoUrl: 'https://github.com/example/helix-saas'
    },
    {
      id: 'proj-3',
      title: 'Momentum',
      category: 'UI/UX',
      subtitle: 'Mobile Application & Design System',
      screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      description: 'An intuitive productivity companion designed to eliminate friction in daily sprint tracking, habit formation, and collaborative team boards.',
      highlights: [
        'Awarded Best Utility App concept at Global Design Showcase.',
        'Offline-first synchronization with zero data loss.'
      ],
      tags: ['React Native', 'Figma', 'GraphQL', 'Tailwind CSS'],
      liveUrl: 'https://example.com/momentum-app',
      repoUrl: 'https://github.com/example/momentum-app'
    }
  ]);

  // State: Experience
  const [experience, setExperience] = useState([
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
  ]);

  // State: Skills
  const [skills, setSkills] = useState([
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
  ]);

  // State: About & Quote
  const [aboutText, setAboutText] = useState(
    'I help startups and creative brands build thoughtful identities and digital experiences that connect with human intent and engineering precision.'
  );
  const [quote, setQuote] = useState({
    text: 'Alex is an exceptional designer who delivers clean, strategic work that elevates our brand every single time.',
    author: 'James Carter',
    role: 'Founder, Helix',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  });

  // State: Contact & Socials
  const [email, setEmail] = useState('hello@alexmorgan.design');
  const [phone, setPhone] = useState('+1 (647) 555-0198');
  const [socials, setSocials] = useState({
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    dribbble: 'https://dribbble.com',
    instagram: 'https://instagram.com'
  });

  // State: Operations
  const [saving, setSaving] = useState(false);
  const [savedSlug, setSavedSlug] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [deployed, setDeployed] = useState(false);
  const [aiLoadingField, setAiLoadingField] = useState(null);

  // 1. Load initial student profile if available
  useEffect(() => {
    let activeEmail = null;
    if (authUser && authUser.email) {
      activeEmail = authUser.email;
      if (authUser.name) setName(authUser.name);
      if (authUser.photo) setAvatar(authUser.photo);
      setEmail(authUser.email);
    } else {
      const saved = localStorage.getItem('arena_student') || localStorage.getItem('user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.email) {
            activeEmail = parsed.email;
            if (parsed.name) setName(parsed.name);
            if (parsed.photo) setAvatar(parsed.photo);
            setEmail(parsed.email);
          }
        } catch (e) {}
      }
    }

    if (activeEmail) {
      fetch(`/api/portfolio/${encodeURIComponent(activeEmail)}`)
        .then(res => res.json())
        .then(res => {
          if (res.success && res.portfolio) {
            const p = res.portfolio;
            if (p.theme) setTheme(p.theme);
            if (p.name) setName(p.name);
            if (p.role) setRole(p.role);
            if (p.location) setLocation(p.location);
            if (p.bio) setBio(p.bio);
            if (p.avatar || p.photoUrl) setAvatar(p.avatar || p.photoUrl);
            if (p.availability) setAvailability(p.availability);
            if (p.resumeUrl) setResumeUrl(p.resumeUrl);
            if (p.resumeFileName || p.resumePdfName) setResumeFileName(p.resumeFileName || p.resumePdfName);
            if (Array.isArray(p.projects)) setProjects(p.projects);
            if (Array.isArray(p.experience)) setExperience(p.experience);
            if (Array.isArray(p.skills)) setSkills(p.skills);
            if (p.aboutText) setAboutText(p.aboutText);
            if (p.quote) setQuote(p.quote);
            if (p.email) setEmail(p.email);
            if (p.phone) setPhone(p.phone);
            if (p.socials) setSocials(p.socials);
            if (p.slug) {
              setSavedSlug(p.slug);
              setCustomSlug(p.slug);
              setDeployed(true);
            }
          }
        })
        .catch(() => {});
    }
  }, [authUser]);

  // Handle Avatar Upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatar(ev.target.result);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Avatar updated!',
        showConfirmButton: false,
        timer: 1500
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle Resume PDF Upload
  const handlePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      Swal.fire({
        icon: 'error',
        title: 'PDF Format Required',
        text: 'Please upload your resume in PDF format (.pdf).'
      });
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'PDF size should not exceed 25MB.'
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setResumeUrl(ev.target.result);
      setResumeFileName(file.name);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Attached PDF: ${file.name}`,
        showConfirmButton: false,
        timer: 2000
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle Project Screenshot Upload
  const handleProjectScreenshotUpload = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const updated = [...projects];
      updated[index].screenshot = ev.target.result;
      setProjects(updated);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Project screenshot uploaded!',
        showConfirmButton: false,
        timer: 1500
      });
    };
    reader.readAsDataURL(file);
  };

  // AI Text Enhancement with Gemini
  const handleAiEnhance = async (field, index = null) => {
    const loadingKey = index !== null ? `${field}-${index}` : field;
    setAiLoadingField(loadingKey);
    try {
      let draftText = '';
      if (field === 'bio') draftText = bio;
      else if (field === 'headline') draftText = role;
      else if (field === 'project' && index !== null) draftText = projects[index]?.description || projects[index]?.title;
      else if (field === 'experience' && index !== null) draftText = experience[index]?.description;
      else if (field === 'quote') draftText = quote.text;

      const res = await fetch('/api/portfolio/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field,
          text: draftText,
          name,
          role
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'AI enhancement failed');
      }

      if (field === 'bio' && data.data?.bio) {
        setBio(data.data.bio);
      } else if (field === 'headline' && data.data?.subtitle) {
        setBio(data.data.subtitle);
      } else if (field === 'project' && index !== null) {
        const updated = [...projects];
        if (data.data?.title && !updated[index].title) updated[index].title = data.data.title;
        if (data.data?.category) updated[index].category = data.data.category;
        if (data.data?.subtitle) updated[index].subtitle = data.data.subtitle;
        if (data.data?.description) updated[index].description = data.data.description;
        setProjects(updated);
      } else if (field === 'experience' && index !== null) {
        const updated = [...experience];
        if (data.data?.description) updated[index].description = data.data.description;
        setExperience(updated);
      } else if (field === 'quote' && data.data?.quote) {
        setQuote(prev => ({ ...prev, text: data.data.quote }));
      }

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: '✨ AI Enhanced Copy!',
        showConfirmButton: false,
        timer: 1600
      });

    } catch (err) {
      console.error('AI Enhance error:', err);
      Swal.fire({
        icon: 'error',
        title: 'AI Note',
        text: err.message || 'Could not enhance text right now.'
      });
    } finally {
      setAiLoadingField(null);
    }
  };

  // Add New Project
  const handleAddProject = () => {
    const newProject = {
      id: `proj-${Date.now()}`,
      title: 'New Featured Project',
      category: 'Web Design',
      subtitle: 'Modern Digital Application',
      screenshot: '',
      description: 'Engineered an intuitive and performant digital experience focusing on speed, clean UI patterns, and accessibility.',
      highlights: ['Achieved 99+ Lighthouse performance score.'],
      tags: ['React', 'Tailwind CSS'],
      liveUrl: '',
      repoUrl: ''
    };
    setProjects(prev => [...prev, newProject]);
    setActiveTab('projects');
  };

  // Remove Project
  const handleRemoveProject = (index) => {
    setProjects(prev => prev.filter((_, i) => i !== index));
  };

  // Add New Experience
  const handleAddExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      role: 'Full Stack Engineer',
      company: 'Tech Solutions Inc.',
      period: '2024 — Present',
      location: 'Remote',
      description: 'Developed scalable features and maintained microservices architecture with automated CI/CD deployment.',
      achievements: ['Optimized query performance and reduced API response time by 30%.']
    };
    setExperience(prev => [...prev, newExp]);
    setActiveTab('experience');
  };

  // Remove Experience
  const handleRemoveExperience = (index) => {
    setExperience(prev => prev.filter((_, i) => i !== index));
  };

  // Deploy Portfolio (stores data, triggers confetti & provides programmingwala.com/{student-name})
  const handleDeployPortfolio = async () => {
    setSaving(true);
    try {
      const generatedSlug = (customSlug.trim() || name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'portfolio';

      const payload = {
        name,
        role,
        location,
        bio,
        avatar,
        availability,
        resumeUrl,
        resumeFileName,
        projects,
        experience,
        skills,
        aboutText,
        quote,
        email,
        phone,
        socials,
        theme,
        slug: generatedSlug
      };

      const res = await fetch('/api/portfolio/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to deploy portfolio');
      }

      const finalSlug = data.slug || generatedSlug;
      setSavedSlug(finalSlug);
      setCustomSlug(finalSlug);
      setDeployed(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      const publicUrl = `https://programmingwala.com/${finalSlug}`;
      const localTestUrl = `/${finalSlug}`;

      Swal.fire({
        icon: 'success',
        title: '🎉 Portfolio Deployed Successfully!',
        html: `
          <div class="space-y-4 text-left font-sans">
            <p class="text-sm text-stone-600">
              Your personal portfolio is stored in the database and published live at your personalized URL:
            </p>
            
            <div class="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200 text-center space-y-1">
              <span class="text-[10px] font-bold uppercase tracking-widest text-[#E05A38] block">
                Your Public Portfolio URL
              </span>
              <a href="${localTestUrl}" target="_blank" class="text-base sm:text-lg font-mono font-bold text-[#E05A38] hover:underline block break-all">
                ${publicUrl}
              </a>
            </div>

            <div class="flex flex-wrap gap-2.5 pt-2 justify-center">
              <button
                id="swal-copy-btn"
                class="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs transition inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>📋 Copy Live URL</span>
              </button>
              <a
                href="${localTestUrl}"
                target="_blank"
                class="px-5 py-2.5 rounded-xl bg-[#E05A38] hover:bg-[#CF4E2C] text-white font-bold text-xs transition inline-flex items-center gap-1.5 shadow-md shadow-[#E05A38]/30 cursor-pointer"
              >
                <span>🚀 Visit Live Portfolio ↗</span>
              </a>
            </div>
          </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        didOpen: () => {
          const btn = document.getElementById('swal-copy-btn');
          if (btn) {
            btn.onclick = () => {
              navigator.clipboard.writeText(publicUrl);
              btn.innerHTML = '<span>✔ Copied to Clipboard!</span>';
              setTimeout(() => {
                btn.innerHTML = '<span>📋 Copy Live URL</span>';
              }, 2500);
            };
          }
        }
      });

    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Deploy Failed', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  // Copy share link
  const handleCopyLink = () => {
    const slug = savedSlug || customSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const url = `https://programmingwala.com/${slug}`;
    navigator.clipboard.writeText(url);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Copied: ${url}`,
      showConfirmButton: false,
      timer: 2000
    });
  };

  // Aggregate current portfolio data for live preview
  const livePortfolioData = {
    name,
    role,
    location,
    bio,
    avatar,
    availability,
    resumeUrl,
    resumeFileName,
    projects,
    experience,
    skills,
    aboutText,
    quote,
    email,
    phone,
    socials,
    theme,
    slug: savedSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  };

  return (
    <div className="min-h-screen bg-[#141211] text-[#EFECE6] font-sans">
      
      {/* ─────────────────────────────────────────────────────────────────────
          TOP CONTROL BAR
      ───────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#1A1716]/95 backdrop-blur-md border-b border-[#2C2725] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/arena')}
            className="p-2 rounded-xl bg-[#25211F] hover:bg-[#332D2B] text-[#A69B95] hover:text-white transition-colors"
            title="Back to Student Arena"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E05A38] animate-pulse" />
              <h1 className="text-sm font-bold text-white tracking-tight font-serif">
                Alex Morgan Style Portfolio Creator
              </h1>
            </div>
            <p className="text-[11px] text-[#8C8079]">
              Editorial showcase • Projects, Experience & Skills
            </p>
          </div>
        </div>

        {/* Center: View Switcher (Desktop) */}
        <div className="hidden md:flex items-center bg-[#25211F] p-1 rounded-xl border border-[#332D2B] text-xs">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'split'
                ? 'bg-[#E05A38] text-white shadow-sm'
                : 'text-[#A69B95] hover:text-white'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setViewMode('editor')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'editor'
                ? 'bg-[#E05A38] text-white shadow-sm'
                : 'text-[#A69B95] hover:text-white'
            }`}
          >
            Editor Only
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'preview'
                ? 'bg-[#E05A38] text-white shadow-sm'
                : 'text-[#A69B95] hover:text-white'
            }`}
          >
            Live Showcase
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {savedSlug && (
            <a
              href={`/${savedSlug}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Site ↗</span>
            </a>
          )}

          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl bg-[#25211F] hover:bg-[#332D2B] text-[#D8CCC4] text-xs font-semibold border border-[#3A3330] transition-colors"
            title="Copy Public URL"
          >
            <Share2 className="w-4 h-4 text-[#E05A38]" />
          </button>

          <button
            onClick={handleDeployPortfolio}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-[#E05A38] to-[#F59E0B] hover:from-[#CF4E2C] hover:to-[#D97706] text-white text-xs font-bold shadow-lg shadow-[#E05A38]/30 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>{saving ? 'Deploying...' : '🚀 Deploy Portfolio'}</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────────
          MAIN WORKSPACE (SPLIT OR FOCUSED VIEW)
      ───────────────────────────────────────────────────────────────────── */}
      <div className="flex h-[calc(100vh-61px)] overflow-hidden">
        
        {/* =================================================================
            LEFT: EDITOR PANEL
        ================================================================= */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <aside className={`${viewMode === 'split' ? 'w-full lg:w-[480px] xl:w-[540px]' : 'w-full max-w-4xl mx-auto'} bg-[#1A1716] border-r border-[#2C2725] flex flex-col h-full z-20 shrink-0`}>
            
            {/* Editor Tab Navigation */}
            <div className="flex items-center gap-1 p-2 bg-[#171413] border-b border-[#2C2725] overflow-x-auto text-xs scrollbar-none">
              {[
                { id: 'hero', label: 'Hero & Bio', icon: User },
                { id: 'design', label: 'Theme & Lights', icon: Palette },
                { id: 'projects', label: `Projects (${projects.length})`, icon: Layers },
                { id: 'experience', label: `Experience (${experience.length})`, icon: Briefcase },
                { id: 'skills', label: 'Skills', icon: Code2 },
                { id: 'about', label: 'About & Quote', icon: QuoteIcon },
                { id: 'contact', label: 'Contact', icon: Mail }
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      active
                        ? 'bg-[#E05A38] text-white shadow-sm'
                        : 'text-[#8E8078] hover:text-[#EFECE6] hover:bg-[#25211F]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* ─────────────────────────────────────────────────────────────
                  TAB 1: HERO & BIO
              ───────────────────────────────────────────────────────────── */}
              {activeTab === 'hero' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#A69B95] flex items-center gap-2">
                      <User className="w-4 h-4 text-[#E05A38]" />
                      Hero & Visual Identity
                    </h2>
                  </div>

                  {/* Active Theme Status & Quick Switcher */}
                  <div className="p-3.5 rounded-2xl bg-[#231F1D] border border-[#332D2B] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#E05A38]/15 border border-[#E05A38]/30 flex items-center justify-center text-[#E05A38] shrink-0">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block">Active Design Theme</span>
                        <span className="text-[11px] text-[#A69B95] block">
                          {theme === 'cyber-neon' ? '⚡ Cyber Neon (Electric Lightning)' :
                           theme === 'midnight-emerald' ? '👑 Midnight Emerald (Royal Luxury)' :
                           theme === 'cosmic-aurora' ? '🌌 Cosmic Aurora (Moving Lights)' :
                           '🌸 Editorial Warm (Alex Morgan)'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('design')}
                      className="px-3 py-1.5 rounded-lg bg-[#2E2825] hover:bg-[#38312E] text-white text-xs font-semibold transition-colors shrink-0"
                    >
                      Change Theme ↗
                    </button>
                  </div>

                  {/* Circular Avatar Selector */}
                  <div className="p-4 rounded-2xl bg-[#231F1D] border border-[#332D2B] flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#E05A38] shadow-md bg-[#2F2927] shrink-0">
                      <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-white block">Profile Picture</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-[#E05A38] hover:bg-[#CF4E2C] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Photo</span>
                        </button>
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Custom Portfolio URL & Slug */}
                  <div className="p-4 rounded-2xl bg-[#231F1D] border border-[#332D2B] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#A69B95] flex items-center gap-1.5">
                        <Rocket className="w-3.5 h-3.5 text-[#E05A38]" />
                        Your Public Portfolio URL
                      </label>
                      {deployed && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          ● Deployed
                        </span>
                      )}
                    </div>
                    <div className="flex items-center rounded-xl bg-[#1A1716] border border-[#38312F] overflow-hidden focus-within:border-[#E05A38]">
                      <span className="px-3 text-xs font-mono text-[#8E8078] bg-[#141211] py-2.5 border-r border-[#2C2725] select-none shrink-0">
                        https://programmingwala.com/
                      </span>
                      <input
                        type="text"
                        placeholder={name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'your-name'}
                        value={customSlug}
                        onChange={e => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        className="w-full px-3 py-2 text-xs font-mono text-white bg-transparent focus:outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-[#8E8078]">
                      Clicking <strong className="text-[#E05A38]">🚀 Deploy Portfolio</strong> saves your data and makes it live at this address.
                    </p>
                  </div>

                  {/* Name & Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#B8ACA4] mb-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#231F1D] border border-[#38312F] text-white text-sm focus:outline-none focus:border-[#E05A38]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#B8ACA4] mb-1">Headline Role</label>
                      <input
                        type="text"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#231F1D] border border-[#38312F] text-white text-sm focus:outline-none focus:border-[#E05A38]"
                      />
                    </div>
                  </div>

                  {/* Location & Resume PDF (PDF Format Required) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#B8ACA4] mb-1">Location</label>
                      <input
                        type="text"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#231F1D] border border-[#38312F] text-white text-sm focus:outline-none focus:border-[#E05A38]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-[#B8ACA4]">
                          Student Resume <span className="text-[#E05A38] font-bold">(.PDF)</span>
                        </label>
                        {resumeUrl && (
                          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            PDF Ready
                          </span>
                        )}
                      </div>

                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={handlePdfUpload}
                        className="hidden"
                      />

                      {resumeUrl ? (
                        <div className="p-2.5 rounded-xl bg-[#231F1D] border border-[#38312F] flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-[#E05A38]/15 border border-[#E05A38]/30 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 text-[#E05A38]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-white truncate max-w-[140px] sm:max-w-[170px]">
                                {resumeFileName || 'Resume.pdf'}
                              </p>
                              <span className="text-[10px] text-[#8E8078] block">
                                PDF Document Attached
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                if (resumeUrl.startsWith('data:') || resumeUrl.startsWith('/uploads') || resumeUrl.startsWith('http')) {
                                  window.open(resumeUrl, '_blank');
                                } else {
                                  Swal.fire('Resume', 'Preview not available directly', 'info');
                                }
                              }}
                              className="p-1.5 rounded-lg bg-[#2E2825] hover:bg-[#38312E] text-white text-xs transition-colors"
                              title="Preview PDF in new tab"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => pdfInputRef.current?.click()}
                              className="p-1.5 rounded-lg bg-[#2E2825] hover:bg-[#38312E] text-[#B8ACA4] hover:text-white text-xs transition-colors"
                              title="Change PDF"
                            >
                              <Upload className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setResumeUrl('');
                                setResumeFileName('');
                              }}
                              className="p-1.5 rounded-lg bg-[#2E2825] hover:bg-red-500/20 text-[#B8ACA4] hover:text-red-400 text-xs transition-colors"
                              title="Remove PDF"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => pdfInputRef.current?.click()}
                          className="px-3.5 py-2.5 rounded-xl bg-[#231F1D] border border-dashed border-[#423936] hover:border-[#E05A38] cursor-pointer transition-colors flex items-center justify-center gap-2 group text-center"
                        >
                          <Upload className="w-4 h-4 text-[#E05A38] group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-medium text-[#B8ACA4] group-hover:text-white transition-colors">
                            Upload Resume (PDF format)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio Tagline with AI button */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-[#B8ACA4]">Hero Bio Tagline</label>
                      <button
                        type="button"
                        onClick={() => handleAiEnhance('bio')}
                        disabled={aiLoadingField === 'bio'}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E05A38] hover:text-[#FFA285] transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{aiLoadingField === 'bio' ? 'Enhancing...' : 'AI Enhance'}</span>
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#231F1D] border border-[#38312F] text-white text-sm focus:outline-none focus:border-[#E05A38] leading-relaxed"
                    />
                  </div>

                  {/* Floating Availability Card Settings */}
                  <div className="p-4 rounded-2xl bg-[#231F1D] border border-[#332D2B] space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A69B95] block">
                      Floating Availability Card
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#8E8078] mb-1">Status Badge</label>
                        <input
                          type="text"
                          value={availability.status}
                          onChange={e => setAvailability({ ...availability, status: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#8E8078] mb-1">Target Period</label>
                        <input
                          type="text"
                          value={availability.period}
                          onChange={e => setAvailability({ ...availability, period: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB: DESIGN THEMES & LIGHTING EFFECTS
              ───────────────────────────────────────────────────────────── */}
              {activeTab === 'design' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-[#A69B95] flex items-center gap-2">
                        <Palette className="w-4 h-4 text-[#E05A38]" />
                        Portfolio Designs & Lighting Styles
                      </h2>
                      <p className="text-[11px] text-[#8E8078]">
                        Select from 4 unique, premium designs with distinct layouts, lighting effects, and animations.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        id: 'editorial-warm',
                        name: 'Editorial Warm (Alex Morgan)',
                        tagline: 'Warm Peach & Coral, Serif Elegance, Ambient Radial Glow',
                        accentColor: '#E05A38',
                        icon: Sparkles,
                        badge: 'Editorial Classic',
                        lighting: 'Ambient Radial Glow & Soft Pulse',
                        features: ['Two-column editorial hero', 'Circular luxury portrait frame', 'Clean toolset ticker', 'Warm peach lighting']
                      },
                      {
                        id: 'cyber-neon',
                        name: 'Cyber Neon (Tech & Systems)',
                        tagline: 'Electric Lightning, Moving Neon Lights, Obsidian HUD',
                        accentColor: '#00F0FF',
                        icon: Zap,
                        badge: '⚡ Electric Lightning',
                        lighting: 'Electric Lightning Beam & Moving Neon Orbs',
                        features: ['Animated lightning border', 'Terminal & HUD interface', 'Cyan/violet moving light flares', 'Monospace systems look']
                      },
                      {
                        id: 'midnight-emerald',
                        name: 'Midnight Emerald (Royal Luxury)',
                        tagline: 'Emerald Aurora Waves, Champagne Gold Shimmer, Arched Crest',
                        accentColor: '#10B981',
                        icon: Crown,
                        badge: '👑 Royal Luxury',
                        lighting: 'Shifting Aurora Waves & Gold Shimmer Line',
                        features: ['Arched portrait crest with gold trim', 'Emerald aurora wave background', 'Gemstone milestone nodes', 'Regal luxury serif typography']
                      },
                      {
                        id: 'cosmic-aurora',
                        name: 'Cosmic Aurora (Creative Founder)',
                        tagline: 'Fluid Moving Light Blobs, Iridescent Halo, Frosted 20px Glass',
                        accentColor: '#EC4899',
                        icon: Layers,
                        badge: '🌌 Cosmic Aurora',
                        lighting: 'Multi-layer Moving Light Blobs & Rotating Halo',
                        features: ['Continuously floating moving light orbs', 'Spinning iridescent halo avatar ring', '20px blur frosted glassmorphism', 'Grand centered modern hero']
                      }
                    ].map(opt => {
                      const Icon = opt.icon;
                      const isSelected = theme === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            setTheme(opt.id);
                            Swal.fire({
                              toast: true,
                              position: 'top-end',
                              icon: 'success',
                              title: `Switched to ${opt.name}`,
                              showConfirmButton: false,
                              timer: 1500
                            });
                          }}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden ${
                            isSelected
                              ? 'bg-[#231F1D] border-[#E05A38] shadow-lg shadow-[#E05A38]/20 ring-1 ring-[#E05A38]'
                              : 'bg-[#1D1918] border-[#332D2B] hover:border-[#4D433F] hover:bg-[#231F1D]'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                              <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
                                style={{
                                  backgroundColor: `${opt.accentColor}15`,
                                  borderColor: `${opt.accentColor}40`,
                                  color: opt.accentColor
                                }}
                              >
                                <Icon className="w-6 h-6" />
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-bold text-white">
                                    {opt.name}
                                  </h3>
                                  <span
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                                    style={{
                                      backgroundColor: `${opt.accentColor}20`,
                                      borderColor: `${opt.accentColor}40`,
                                      color: opt.accentColor
                                    }}
                                  >
                                    {opt.badge}
                                  </span>
                                </div>
                                <p className="text-xs text-[#A69B95]">
                                  {opt.tagline}
                                </p>
                                <div className="flex items-center gap-1.5 text-[11px] text-[#8E8078] pt-1">
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: opt.accentColor }} />
                                  <span>Lighting: <strong className="text-[#D8CCC4]">{opt.lighting}</strong></span>
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-2">
                              {isSelected ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E05A38] text-white text-xs font-bold shadow-sm">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Active Design</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  className="px-3 py-1.5 rounded-xl bg-[#2A2422] hover:bg-[#38302D] text-[#D8CCC4] text-xs font-semibold transition-colors"
                                >
                                  Apply Design
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Feature Tags */}
                          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#2C2725]">
                            {opt.features.map((feat, fIdx) => (
                              <span
                                key={fIdx}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-[#171413] text-[#8E8078] border border-[#2E2826]"
                              >
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB 2: PROJECTS & SCREENSHOTS
                  Crucial rule: If 0 projects, don't show project section!
              ───────────────────────────────────────────────────────────── */}
              {activeTab === 'projects' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-[#A69B95] flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#E05A38]" />
                        Selected Work & Projects
                      </h2>
                      <p className="text-[11px] text-[#8E8078]">
                        If no projects are added, the work section is automatically hidden.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddProject}
                      className="px-3 py-1.5 rounded-xl bg-[#E05A38] hover:bg-[#CF4E2C] text-white text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  {projects.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-[#231F1D] border border-dashed border-[#3A3330] text-center space-y-3">
                      <Layers className="w-10 h-10 text-[#8E8078] mx-auto opacity-50" />
                      <p className="text-sm font-semibold text-white">No projects added yet</p>
                      <p className="text-xs text-[#8E8078] max-w-sm mx-auto">
                        The Selected Work section is currently hidden from your live portfolio. Click below to add your first showcase project!
                      </p>
                      <button
                        type="button"
                        onClick={handleAddProject}
                        className="px-4 py-2 rounded-xl bg-[#E05A38] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add First Project</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {projects.map((proj, idx) => (
                        <div
                          key={proj.id || idx}
                          className="p-5 rounded-2xl bg-[#231F1D] border border-[#332D2B] space-y-4 relative"
                        >
                          {/* Project Header */}
                          <div className="flex items-center justify-between border-b border-[#332D2B] pb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#E05A38] flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#E05A38]" />
                              Project #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveProject(idx)}
                              className="text-[#8E8078] hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
                              title="Delete project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>

                          {/* Screenshot Uploader or URL */}
                          <div>
                            <label className="block text-xs font-semibold text-[#B8ACA4] mb-1.5">
                              Project Screenshot / Preview
                            </label>
                            
                            <div className="flex flex-col sm:flex-row gap-3 items-center">
                              {proj.screenshot ? (
                                <div className="w-24 h-18 rounded-xl overflow-hidden bg-[#171413] border border-[#3A3330] shrink-0">
                                  <img src={proj.screenshot} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-24 h-18 rounded-xl bg-[#171413] border border-dashed border-[#3A3330] flex flex-col items-center justify-center text-[10px] text-[#8E8078] shrink-0">
                                  <ImageIcon className="w-5 h-5 mb-1 opacity-50" />
                                  <span>No Image</span>
                                </div>
                              )}

                              <div className="flex-1 w-full space-y-2">
                                <input
                                  type="text"
                                  placeholder="Enter Image URL or upload below..."
                                  value={proj.screenshot}
                                  onChange={e => {
                                    const updated = [...projects];
                                    updated[idx].screenshot = e.target.value;
                                    setProjects(updated);
                                  }}
                                  className="w-full px-3 py-1.5 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs focus:outline-none focus:border-[#E05A38]"
                                />

                                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2E2825] hover:bg-[#38312E] text-white text-xs font-medium cursor-pointer border border-[#423936] transition-colors">
                                  <Upload className="w-3.5 h-3.5 text-[#E05A38]" />
                                  <span>Upload Local Screenshot</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => handleProjectScreenshotUpload(idx, e)}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Title & Category */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-[#B8ACA4] mb-1">Title</label>
                              <input
                                type="text"
                                value={proj.title}
                                onChange={e => {
                                  const updated = [...projects];
                                  updated[idx].title = e.target.value;
                                  setProjects(updated);
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[#B8ACA4] mb-1">Category Badge</label>
                              <input
                                type="text"
                                value={proj.category}
                                placeholder="Branding, Web Design, UI/UX..."
                                onChange={e => {
                                  const updated = [...projects];
                                  updated[idx].category = e.target.value;
                                  setProjects(updated);
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                              />
                            </div>
                          </div>

                          {/* Subtitle */}
                          <div>
                            <label className="block text-xs font-semibold text-[#B8ACA4] mb-1">Subtitle / Descriptor</label>
                            <input
                              type="text"
                              value={proj.subtitle || ''}
                              placeholder="Visual Identity & E-Commerce"
                              onChange={e => {
                                const updated = [...projects];
                                updated[idx].subtitle = e.target.value;
                                setProjects(updated);
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                            />
                          </div>

                          {/* Description with AI Polish */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-semibold text-[#B8ACA4]">
                                About This Project (Shown in Modal)
                              </label>
                              <button
                                type="button"
                                onClick={() => handleAiEnhance('project', idx)}
                                disabled={aiLoadingField === `project-${idx}`}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E05A38] hover:text-[#FFA285] transition-colors"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>{aiLoadingField === `project-${idx}` ? 'Polishing...' : '✨ AI Polish'}</span>
                              </button>
                            </div>
                            <textarea
                              rows={3}
                              value={proj.description}
                              onChange={e => {
                                const updated = [...projects];
                                updated[idx].description = e.target.value;
                                setProjects(updated);
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs leading-relaxed"
                            />
                          </div>

                          {/* Tech Tags */}
                          <div>
                            <label className="block text-xs font-semibold text-[#B8ACA4] mb-1">
                              Tech Stack (Comma-separated)
                            </label>
                            <input
                              type="text"
                              value={(proj.tags || []).join(', ')}
                              placeholder="React, Next.js, Tailwind CSS, Node.js"
                              onChange={e => {
                                const updated = [...projects];
                                updated[idx].tags = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                setProjects(updated);
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                            />
                          </div>

                          {/* Links: Live & Repo */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-[#B8ACA4] mb-1">Live Demo URL</label>
                              <input
                                type="text"
                                placeholder="https://..."
                                value={proj.liveUrl || ''}
                                onChange={e => {
                                  const updated = [...projects];
                                  updated[idx].liveUrl = e.target.value;
                                  setProjects(updated);
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[#B8ACA4] mb-1">GitHub / Source URL</label>
                              <input
                                type="text"
                                placeholder="https://github.com/..."
                                value={proj.repoUrl || ''}
                                onChange={e => {
                                  const updated = [...projects];
                                  updated[idx].repoUrl = e.target.value;
                                  setProjects(updated);
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB 3: EXPERIENCE BLOCK
              ───────────────────────────────────────────────────────────── */}
              {activeTab === 'experience' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-[#A69B95] flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[#E05A38]" />
                        Work & Career Milestones
                      </h2>
                      <p className="text-[11px] text-[#8E8078]">
                        Rendered in a clean, dedicated timeline section.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="px-3 py-1.5 rounded-xl bg-[#E05A38] hover:bg-[#CF4E2C] text-white text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Experience</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {experience.map((exp, idx) => (
                      <div
                        key={exp.id || idx}
                        className="p-5 rounded-2xl bg-[#231F1D] border border-[#332D2B] space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-[#332D2B] pb-2">
                          <span className="text-xs font-bold text-[#E05A38]">Experience #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(idx)}
                            className="text-[#8E8078] hover:text-red-400 text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-[#8E8078] mb-1">Role Title</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={e => {
                                const updated = [...experience];
                                updated[idx].role = e.target.value;
                                setExperience(updated);
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-[#8E8078] mb-1">Company / Organization</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={e => {
                                const updated = [...experience];
                                updated[idx].company = e.target.value;
                                setExperience(updated);
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-[#8E8078] mb-1">Period (e.g. 2024 — Present)</label>
                            <input
                              type="text"
                              value={exp.period}
                              onChange={e => {
                                const updated = [...experience];
                                updated[idx].period = e.target.value;
                                setExperience(updated);
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-[#8E8078] mb-1">Location / Remote</label>
                            <input
                              type="text"
                              value={exp.location || ''}
                              onChange={e => {
                                const updated = [...experience];
                                updated[idx].location = e.target.value;
                                setExperience(updated);
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] text-[#8E8078]">Responsibilities & Description</label>
                            <button
                              type="button"
                              onClick={() => handleAiEnhance('experience', idx)}
                              disabled={aiLoadingField === `experience-${idx}`}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E05A38] hover:text-[#FFA285] transition-colors"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>{aiLoadingField === `experience-${idx}` ? 'Polishing...' : 'AI Enhance'}</span>
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={exp.description}
                            onChange={e => {
                              const updated = [...experience];
                              updated[idx].description = e.target.value;
                              setExperience(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB 4: SKILLS BLOCK
              ───────────────────────────────────────────────────────────── */}
              {activeTab === 'skills' && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#A69B95] flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-[#E05A38]" />
                      Technical Skills & Architecture
                    </h2>
                    <p className="text-[11px] text-[#8E8078]">
                      Organized into separate categorized capability blocks.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {skills.map((group, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#231F1D] border border-[#332D2B] space-y-3"
                      >
                        <div>
                          <label className="block text-[11px] text-[#8E8078] mb-1">Category Name</label>
                          <input
                            type="text"
                            value={group.category}
                            onChange={e => {
                              const updated = [...skills];
                              updated[idx].category = e.target.value;
                              setSkills(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-[#8E8078] mb-1">
                            Skills (Comma-separated)
                          </label>
                          <input
                            type="text"
                            value={(group.items || []).join(', ')}
                            onChange={e => {
                              const updated = [...skills];
                              updated[idx].items = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                              setSkills(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB 5: ABOUT & QUOTE
              ───────────────────────────────────────────────────────────── */}
              {activeTab === 'about' && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#A69B95] flex items-center gap-2">
                      <QuoteIcon className="w-4 h-4 text-[#E05A38]" />
                      About Me & Endorsement Quote
                    </h2>
                  </div>

                  {/* Extended Story */}
                  <div>
                    <label className="block text-xs font-semibold text-[#B8ACA4] mb-1">
                      Extended Personal Narrative / About Story
                    </label>
                    <textarea
                      rows={4}
                      value={aboutText}
                      onChange={e => setAboutText(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#231F1D] border border-[#38312F] text-white text-sm focus:outline-none focus:border-[#E05A38] leading-relaxed"
                    />
                  </div>

                  {/* Quote / Endorsement Card */}
                  <div className="p-4 rounded-2xl bg-[#231F1D] border border-[#332D2B] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#E05A38]">
                        Client / Peer Quote Block
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAiEnhance('quote')}
                        disabled={aiLoadingField === 'quote'}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E05A38] hover:text-[#FFA285] transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{aiLoadingField === 'quote' ? 'Enhancing...' : 'AI Enhance'}</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#8E8078] mb-1">Quote Text</label>
                      <textarea
                        rows={2}
                        value={quote.text}
                        onChange={e => setQuote({ ...quote, text: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#8E8078] mb-1">Author Name</label>
                        <input
                          type="text"
                          value={quote.author}
                          onChange={e => setQuote({ ...quote, author: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#8E8078] mb-1">Author Role / Company</label>
                        <input
                          type="text"
                          value={quote.role}
                          onChange={e => setQuote({ ...quote, role: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB 6: CONTACT & SOCIALS
              ───────────────────────────────────────────────────────────── */}
              {activeTab === 'contact' && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#A69B95] flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#E05A38]" />
                      Contact & Social Profiles
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#B8ACA4] mb-1">Direct Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#231F1D] border border-[#38312F] text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#B8ACA4] mb-1">Phone / WhatsApp</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#231F1D] border border-[#38312F] text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A69B95] block">
                      Social Profiles
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#8E8078] mb-1">LinkedIn Profile</label>
                        <input
                          type="text"
                          value={socials.linkedin || ''}
                          placeholder="https://linkedin.com/in/..."
                          onChange={e => setSocials({ ...socials, linkedin: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#8E8078] mb-1">GitHub Profile</label>
                        <input
                          type="text"
                          value={socials.github || ''}
                          placeholder="https://github.com/..."
                          onChange={e => setSocials({ ...socials, github: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#8E8078] mb-1">Instagram Handle</label>
                        <input
                          type="text"
                          value={socials.instagram || ''}
                          placeholder="https://instagram.com/..."
                          onChange={e => setSocials({ ...socials, instagram: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#8E8078] mb-1">Personal Portfolio / Website</label>
                        <input
                          type="text"
                          value={socials.dribbble || ''}
                          placeholder="https://..."
                          onChange={e => setSocials({ ...socials, dribbble: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#1A1716] border border-[#332D2B] text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </aside>
        )}

        {/* =================================================================
            RIGHT: LIVE INTERACTIVE PREVIEW
        ================================================================= */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <main className="flex-1 bg-[#100E0D] overflow-y-auto p-4 sm:p-6 lg:p-8 flex justify-center items-start">
            <div className="w-full max-w-5xl">
              <PortfolioModernView
                data={livePortfolioData}
                isEditing={true}
                showWindowMockup={false}
              />
            </div>
          </main>
        )}

      </div>

    </div>
  );
}
