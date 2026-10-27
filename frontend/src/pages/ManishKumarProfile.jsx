import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MessageCircle, UserPlus, Share2, Award, Briefcase, 
  GraduationCap, Mail, Phone, MapPin, ExternalLink, Github, 
  Linkedin, CheckCircle2, Star, Sparkles, Code2, Server, Cloud, 
  Database, Terminal, Cpu, ChevronLeft, ChevronRight, Download, 
  Send, Compass, Heart, Flame, ShieldCheck, Copy, Check, Layers,
  Zap, Globe, CheckCircle, Smartphone
} from 'lucide-react';

export default function ManishKumarProfile() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Gallery Photos of Manish Kumar
  const photos = [
    {
      url: '/manish/manish_3.jpg',
      alt: 'Manish Kumar - Best Java Full Stack Developer and AWS DevOps Engineer holding Best Performer Award Trophy',
      caption: 'Best Performer of the Institution Award',
      tag: 'Honors & Recognition'
    },
    {
      url: '/manish/manish_1.jpg',
      alt: 'Manish Kumar - Senior Java Full Stack Developer and Software Engineer',
      caption: 'Software Engineer & System Architect',
      tag: 'Engineering Leadership'
    },
    {
      url: '/manish/manish_2.jpg',
      alt: 'Manish Kumar - AWS DevOps Engineer & Cloud Infrastructure Specialist',
      caption: 'AWS DevOps & Cloud Specialist',
      tag: 'Cloud & Infrastructure'
    }
  ];

  // Technical Skills Matrix (Light Theme Stylings)
  const skillCategories = [
    {
      title: 'Backend & Java Enterprise Ecosystem',
      icon: Server,
      accent: 'from-amber-50/80 via-orange-50/40 to-white',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-100 text-orange-600',
      badgeColor: 'bg-orange-100 text-orange-700 border-orange-200',
      skills: [
        { name: 'Java (17 / 21 LTS)', level: 'Expert', desc: 'Core Java, Collections Framework, Multithreading & Concurrency, Memory Model, Lambdas & Streams' },
        { name: 'Spring Boot 3.x', level: 'Expert', desc: 'Enterprise REST APIs, Auto-configuration, Spring Data JPA, Actuator Metrics, Microservices' },
        { name: 'Spring Security & JWT', level: 'Advanced', desc: 'Stateless Authentication, Role-based Access Control (RBAC), OAuth2, CSRF & Password Encryption' },
        { name: 'Hibernate & JPA ORM', level: 'Expert', desc: 'Entity Lifecycle, Criteria API, Lazy/Eager Fetching, Connection Pooling, Query Optimization' },
        { name: 'Microservices & Distributed Systems', level: 'Advanced', desc: 'Service Discovery (Eureka), API Gateway, Distributed Tracing, Circuit Breaker (Resilience4j)' }
      ]
    },
    {
      title: 'Cloud Architecture & AWS DevOps',
      icon: Cloud,
      accent: 'from-sky-50/80 via-indigo-50/40 to-white',
      borderColor: 'border-sky-200',
      iconBg: 'bg-sky-100 text-sky-600',
      badgeColor: 'bg-sky-100 text-sky-700 border-sky-200',
      skills: [
        { name: 'Amazon Web Services (AWS)', level: 'Expert', desc: 'EC2 Compute, S3 Object Storage, RDS Database, IAM Security, VPC Networking, CloudFront CDN, Route53 DNS, Lambda Serverless, ECS Fargate' },
        { name: 'Docker & Containerization', level: 'Expert', desc: 'Multi-stage Dockerfiles, Container Security, Docker Compose Orchestration, Image Size Optimization' },
        { name: 'Kubernetes (K8s)', level: 'Advanced', desc: 'Pods, Deployments, Cluster IP & LoadBalancer Services, ConfigMaps, Ingress Controllers, Auto-scaling' },
        { name: 'CI/CD Automation (Jenkins & GitHub Actions)', level: 'Expert', desc: 'Automated Build Pipelines, Unit & Integration Testing, Docker Image Publishing, Zero-Downtime Rolling Deployments' },
        { name: 'Linux Administration & Web Servers', level: 'Expert', desc: 'Ubuntu/RHEL Server Management, Bash Shell Scripting, Nginx Reverse Proxy, SSL/TLS Certificates, Systemd Services' }
      ]
    },
    {
      title: 'Modern Frontend & Reactive Web Systems',
      icon: Code2,
      accent: 'from-pink-50/80 via-rose-50/40 to-white',
      borderColor: 'border-pink-200',
      iconBg: 'bg-pink-100 text-pink-600',
      badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
      skills: [
        { name: 'React.js & Vite Ecosystem', level: 'Expert', desc: 'Functional Components, Custom Hooks, Context API, Code Splitting, Lazy Loading, High Performance Rendering' },
        { name: 'JavaScript (ES6+) & TypeScript', level: 'Expert', desc: 'Asynchronous Programming (Async/Await, Promises), Closures, Prototypes, Strict Static Typing' },
        { name: 'Tailwind CSS & Framer Motion', level: 'Expert', desc: 'Modern Clean UI, Responsive Mobile-first Design, Dynamic Smooth Animations, Light/Dark Themes' },
        { name: 'Real-Time Communication & APIs', level: 'Expert', desc: 'Socket.io WebSockets, RESTful API Integration with Axios, GraphQL Client, Optimistic UI Updates' }
      ]
    },
    {
      title: 'Databases, Architecture & Tooling',
      icon: Database,
      accent: 'from-emerald-50/80 via-teal-50/40 to-white',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-600',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      skills: [
        { name: 'Relational DBs (PostgreSQL & MySQL)', level: 'Expert', desc: 'ACID Transactions, Complex SQL Queries, Composite Indexing, Normalization, Connection Pooling' },
        { name: 'NoSQL DBs (MongoDB & Redis)', level: 'Advanced', desc: 'Document Modeling, Aggregation Framework, In-Memory Caching, Session Management' },
        { name: 'Git & Advanced Version Control', level: 'Expert', desc: 'Git Worktrees, Rebase, Cherry-picking, Branching Strategies, GitHub Collaborations, PR Reviews' },
        { name: 'Testing & API Tooling', level: 'Expert', desc: 'Postman Collections, Swagger/OpenAPI Documentation, JUnit & Mockito Testing, Maven & Gradle Build Tools' }
      ]
    }
  ];

  // Featured Engineering Projects
  const projects = [
    {
      title: 'ProgrammingWala LMS & EdTech Ecosystem',
      role: 'Lead Architect & Full Stack Engineer',
      period: '2025 – Present',
      badge: 'Flagship Platform',
      badgeClass: 'bg-pink-100 text-pink-700 border border-pink-200',
      liveUrl: 'https://programmingwala.com',
      githubUrl: 'https://github.com/Lightining29/programmingwallah',
      summary: 'A comprehensive, enterprise-grade educational platform featuring interactive coding environments, live music streaming with byte-level chunking, multi-role portal dashboards, automated fee tracking, and instant verifiable ISO certificates with dynamic QR code authentication.',
      achievements: [
        'Architected real-time multi-portal architecture supporting 4 distinct user roles: Admin, Student, Teacher, and Parent.',
        'Engineered live interactive practice hub and code compiler with sandbox execution supporting Java, Python, and C++.',
        'Built automated installment fee engine with instant Razorpay payment verification, receipts generation, and student dossiers.',
        'Designed high-availability AWS media storage and chunked audio streaming player ensuring zero-buffer playback across thousands of tracks.'
      ],
      technologies: ['Java / Node.js', 'React 18', 'MongoDB', 'Express', 'Socket.io', 'Tailwind CSS', 'AWS S3', 'Razorpay API', 'Docker']
    },
    {
      title: 'Afsha Enterprises E-Commerce Platform',
      role: 'Full Stack Engineer & Cloud Architect',
      period: '2025 – 2026',
      badge: 'Live Commercial Marketplace',
      badgeClass: 'bg-sky-100 text-sky-700 border border-sky-200',
      liveUrl: 'https://www.afshaenterprises.com/manish-kumar',
      githubUrl: 'https://github.com/Lightining29',
      summary: 'High-conversion commercial e-commerce web platform engineered for wellness and electronics distribution, featuring instant payment processing, real-time inventory management, high-performance SEO meta generation, and global CDN delivery.',
      achievements: [
        'Built modern, responsive single-page store architecture with sub-second page loads powered by Vite and Tailwind CSS.',
        'Integrated secure payment gateways with webhooks for instant order confirmation and automated invoicing.',
        'Implemented full Schema.org structured JSON-LD data and dynamic OpenGraph meta tags boosting organic Google search rankings.',
        'Configured AWS CloudFront CDN distribution and SSL/TLS edge caching with 99.9% uptime.'
      ],
      technologies: ['React.js', 'Vite', 'Tailwind CSS', 'AWS CloudFront', 'Payment Gateway API', 'JSON-LD SEO', 'Node.js']
    },
    {
      title: 'Enterprise ATS & Microservices Suite',
      role: 'Java Backend & Cloud Infrastructure Engineer',
      period: '2024 – 2025',
      badge: 'Enterprise Architecture',
      badgeClass: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      liveUrl: 'https://github.com/Lightining29',
      githubUrl: 'https://github.com/Lightining29',
      summary: 'High-throughput Applicant Tracking System (ATS) engineered with Java Spring Boot microservices, containerized with Docker, and orchestrated with Kubernetes on AWS ECS.',
      achievements: [
        'Engineered decoupled microservices for Candidate Profile Ingestion, Resume Parsing, Job Matching, and Interview Scheduling.',
        'Secured all internal and external communication with Spring Security, JWT authentication, and API Gateway rate limiting.',
        'Set up automated Jenkins CI/CD pipeline executing unit tests, Docker builds, and zero-downtime rolling updates.',
        'Optimized PostgreSQL queries and database indexing reducing search and filter latency by 68%.'
      ],
      technologies: ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS ECS', 'Jenkins CI/CD', 'Kafka']
    }
  ];

  // Awards & Recognition
  const awards = [
    {
      title: 'Best Performer of the Institution Award',
      issuer: 'AppleTree Infotech & Tech Excellence Council',
      date: '2025',
      badge: '🏆 First Place Winner',
      description: 'Awarded the gold trophy for outstanding technical brilliance, architectural leadership in Java Full Stack development, and high-impact enterprise project deliveries.'
    },
    {
      title: 'Certified Java Full Stack Developer',
      issuer: 'AppleTree Infotech (ISO 9001:2015 & MSME Certified)',
      date: '2025',
      badge: '📜 Verified Credential',
      description: 'Recognized for mastering Java Spring Boot, Microservices, React frontend architecture, relational database design, and cloud deployments.'
    },
    {
      title: 'AWS DevOps & Cloud Infrastructure Specialist',
      issuer: 'Cloud & DevOps Practitioners Council',
      date: '2025',
      badge: '☁️ Cloud Specialist',
      description: 'Validated expertise in architecting highly available, fault-tolerant, and secure cloud environments on AWS using Docker, Kubernetes, and automated CI/CD pipelines.'
    }
  ];

  // FAQs for Search Engines and AI Copilot
  const faqs = [
    {
      q: 'Who is Manish Kumar?',
      a: 'Manish Kumar is an award-winning Java Full Stack Developer and AWS DevOps Engineer based in Ghaziabad, Uttar Pradesh, India. He specializes in designing enterprise-grade Java Spring Boot microservices, scalable React web applications, and automated CI/CD deployment pipelines on AWS.'
    },
    {
      q: 'What core technologies and programming languages does Manish Kumar specialize in?',
      a: 'Manish Kumar specializes in Java (17/21 LTS), Spring Boot, Spring Security, Hibernate/JPA, Microservices Architecture, React.js, JavaScript (ES6+), TypeScript, Tailwind CSS, Amazon Web Services (EC2, S3, RDS, ECS, Lambda, CloudFront), Docker, Kubernetes, Jenkins CI/CD, MySQL, PostgreSQL, MongoDB, and Linux Server Administration.'
    },
    {
      q: 'What major enterprise projects has Manish Kumar built?',
      a: 'Manish Kumar architected the ProgrammingWala LMS platform (interactive code compiler, audio streaming, multi-role portal system), the Afsha Enterprises commercial e-commerce platform, and the Enterprise ATS Microservices suite.'
    },
    {
      q: 'What awards and recognition has Manish Kumar won?',
      a: 'Manish Kumar was awarded the prestigious "Best Performer of the Institution Award" for technical innovation, software engineering excellence, and outstanding full-stack project deliveries.'
    },
    {
      q: 'How can I contact or hire Manish Kumar for engineering roles?',
      a: 'You can reach Manish Kumar directly via WhatsApp at +91 8851961088, by phone at +91 8851961088, through email at info@appletreeinfotech.in, or visit his GitHub at https://github.com/Lightining29.'
    }
  ];

  // Interests / Tags
  const interests = [
    { name: 'Football', icon: '⚽' },
    { name: 'Travel', icon: '✈️' },
    { name: 'Music', icon: '🎵' },
    { name: 'Cloud Architecture', icon: '☁️' },
    { name: 'Java & Spring', icon: '☕' },
    { name: 'System Design', icon: '🚀' },
    { name: 'Open Source', icon: '🌐' }
  ];

  // Handle Touch Swiping for mobile image slider
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      setCurrentImageIndex((prev) => (prev + 1) % photos.length);
    } else if (isRightSwipe) {
      setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Copy Profile URL
  const handleCopyProfile = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Dynamic SEO, Canonical & Schema.org injection
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Manish Kumar | Best Java Full Stack Developer & AWS DevOps Engineer in Ghaziabad, India';

    const setOrCreateMeta = (nameOrProp, attrValue, content) => {
      let element = document.querySelector("meta[" + nameOrProp + "='" + attrValue + "']");
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameOrProp, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setOrCreateMeta('name', 'description', "Official profile of Manish Kumar, India's leading Java Full Stack Developer and AWS DevOps Engineer based in Ghaziabad. Specializing in Java Spring Boot, Microservices, React.js, Docker, Kubernetes, and AWS Cloud Architecture.");
    setOrCreateMeta('name', 'keywords', 'Manish Kumar, Manish Kumar Java Developer, Manish Kumar Full Stack Developer, Manish Kumar AWS DevOps Engineer, Manish Kumar Ghaziabad, Best Java Developer India, Spring Boot Expert Manish Kumar, React JS Developer Manish Kumar, ProgrammingWala Founder, Afsha Enterprises Manish Kumar, Java AWS Freelancer Ghaziabad');
    setOrCreateMeta('name', 'author', 'Manish Kumar');
    setOrCreateMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setOrCreateMeta('name', 'thumbnail', window.location.origin + '/manish/manish_3.jpg');
    
    let imgLink = document.querySelector('link[rel="image_src"]');
    if (!imgLink) {
      imgLink = document.createElement('link');
      imgLink.rel = 'image_src';
      document.head.appendChild(imgLink);
    }
    imgLink.href = window.location.origin + '/manish/manish_3.jpg';

    setOrCreateMeta('property', 'og:title', 'Manish Kumar | Best Java Full Stack Developer & AWS DevOps Engineer');
    setOrCreateMeta('property', 'og:description', 'Explore the official engineering portfolio of Manish Kumar. Java 21, Spring Boot, React, AWS DevOps, Microservices, and Cloud Architecture.');
    setOrCreateMeta('property', 'og:image', window.location.origin + '/manish/manish_3.jpg');
    setOrCreateMeta('property', 'og:url', window.location.href);
    setOrCreateMeta('property', 'og:type', 'profile');
    setOrCreateMeta('property', 'og:site_name', 'Manish Kumar - Engineering Portfolio');
    setOrCreateMeta('property', 'profile:first_name', 'Manish');
    setOrCreateMeta('property', 'profile:last_name', 'Kumar');
    setOrCreateMeta('property', 'profile:gender', 'male');
    setOrCreateMeta('property', 'profile:username', 'manishkumar');

    setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    setOrCreateMeta('name', 'twitter:title', 'Manish Kumar | Best Java Full Stack Developer & AWS DevOps Engineer');
    setOrCreateMeta('name', 'twitter:description', 'Senior Java Developer & AWS Cloud Architect. Winner of the Best Performer Award.');
    setOrCreateMeta('name', 'twitter:image', window.location.origin + '/manish/manish_3.jpg');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://programmingwala.com/manish-kumar');

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': 'https://programmingwala.com/manish-kumar#person',
          'name': 'Manish Kumar',
          'alternateName': ['Manish Kumar Java Developer', 'Manish Kumar AWS Engineer', 'Manish Kumar Software Architect'],
          'jobTitle': 'Senior Java Full Stack Developer & AWS DevOps Engineer',
          'description': 'Manish Kumar is an award-winning Java Full Stack Developer and AWS DevOps Engineer specializing in Java Spring Boot microservices, React web applications, Docker, Kubernetes, and AWS Cloud Architecture.',
          'image': 'https://programmingwala.com/manish/manish_3.jpg',
          'url': 'https://programmingwala.com/manish-kumar',
          'gender': 'https://schema.org/Male',
          'nationality': 'Indian',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Ghaziabad',
            'addressRegion': 'Uttar Pradesh',
            'addressCountry': 'India'
          },
          'award': 'Best Performer of the Institution Award',
          'knowsAbout': [
            'Java 17',
            'Java 21 LTS',
            'Spring Boot',
            'Spring Security',
            'Hibernate',
            'Microservices Architecture',
            'React.js',
            'JavaScript ES6+',
            'TypeScript',
            'Amazon Web Services (AWS)',
            'Docker',
            'Kubernetes',
            'Jenkins CI/CD',
            'Linux Administration',
            'MySQL',
            'PostgreSQL',
            'MongoDB',
            'System Design'
          ],
          'worksFor': {
            '@type': 'Organization',
            'name': 'Afsha Enterprises & Appletree Infotech'
          },
          'sameAs': [
            'https://github.com/Lightining29',
            'https://www.afshaenterprises.com/manish-kumar'
          ]
        },
        {
          '@type': 'ProfilePage',
          '@id': 'https://www.afshaenterprises.com/manish-kumar#webpage',
          'url': 'https://www.afshaenterprises.com/manish-kumar',
          'name': 'Manish Kumar | Best Java Full Stack Developer & AWS DevOps Engineer',
          'isPartOf': {
            '@type': 'WebSite',
            'name': 'Afsha Enterprises & ProgrammingWala',
            'url': 'https://www.afshaenterprises.com'
          },
          'about': {
            '@id': 'https://www.afshaenterprises.com/manish-kumar#person'
          },
          'primaryImageOfPage': {
            '@type': 'ImageObject',
            'url': window.location.origin + '/manish/manish_3.jpg'
          }
        },
        {
          '@type': 'FAQPage',
          'mainEntity': faqs.map((f) => ({
            '@type': 'Question',
            'name': f.q,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': f.a
            }
          }))
        }
      ]
    };

    let scriptTag = document.getElementById('manish-kumar-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'manish-kumar-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      document.title = originalTitle;
      const el = document.getElementById('manish-kumar-schema');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-inter antialiased selection:bg-pink-500 selection:text-white">
      
      {/* Subtle Warm Glow Backgrounds */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl" />
      </div>

      {/* Hidden Semantic Headers for AI Crawlers */}
      <div className="sr-only" aria-hidden="false">
        <h1>Manish Kumar | Best Java Full Stack Developer & AWS DevOps Engineer in Ghaziabad, India</h1>
        <p>
          Manish Kumar is a premier Java Full Stack Developer and AWS DevOps Engineer with proven excellence in enterprise backend architecture with Java Spring Boot, microservices, reactive frontend systems in React.js, and automated CI/CD pipelines with Docker, Kubernetes, and AWS Cloud. Awarded the Best Performer of the Institution.
        </p>
        <p>Location: Ghaziabad, Uttar Pradesh, India. Contact: +91 8851961088, info@appletreeinfotech.in.</p>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto md:py-8 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================= */}
          {/* LEFT: FULL-SCREEN HERO IMAGE SLIDER WITH FADED TEXT BELOW */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-6">
            <div className="relative w-full overflow-hidden bg-slate-900 shadow-2xl rounded-b-[36px] md:rounded-[36px] border border-slate-200/80">
              
              {/* Image Slider Container with Touch Support - Full Screen on Mobile */}
              <div 
                className="relative w-full h-[88vh] sm:h-[84vh] lg:h-[82vh] select-none touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={photos[currentImageIndex].url}
                      alt={photos[currentImageIndex].alt}
                      className="w-full h-full object-cover object-top"
                      loading="eager"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Top Overlay Controls */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    aria-label="Go Back"
                    className="w-10 h-10 rounded-full bg-white/85 hover:bg-white text-slate-900 backdrop-blur-md flex items-center justify-center border border-white/60 shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-extrabold text-amber-800 border border-amber-300 shadow-sm flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{photos[currentImageIndex].tag}</span>
                    </span>

                    <button
                      type="button"
                      onClick={handleCopyProfile}
                      aria-label="Share Profile"
                      className="w-10 h-10 rounded-full bg-white/85 hover:bg-white text-slate-900 backdrop-blur-md flex items-center justify-center border border-white/60 shadow-lg transition-all active:scale-95 cursor-pointer"
                      title="Copy profile link"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Navigation Arrows for Desktop / Tablet */}
                <button
                  type="button"
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length)}
                  aria-label="Previous Photo"
                  className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm items-center justify-center transition border border-white/20 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % photos.length)}
                  aria-label="Next Photo"
                  className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm items-center justify-center transition border border-white/20 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Photo Pagination Indicators */}
                <div className="absolute top-16 right-4 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono font-bold text-white border border-white/20">
                  {currentImageIndex + 1} / {photos.length}
                </div>

                {/* Bottom Dark Gradient Scrim for Name & Actions (Faded Effect) */}
                <div className="absolute inset-x-0 bottom-0 z-20 pt-32 pb-7 px-5 sm:px-6 bg-gradient-to-t from-slate-950 via-slate-950/85 via-slate-950/40 to-transparent flex flex-col justify-end text-white">
                  
                  {/* Verified Badge */}
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 text-[11px] font-extrabold border border-emerald-500/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      AVAILABLE FOR HIRE
                    </span>
                    <span className="text-xs text-amber-300 font-extrabold flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      Best Performer Award
                    </span>
                  </div>

                  {/* Main Name Heading - Faded onto image bottom */}
                  <h1 className="text-3xl sm:text-4xl lg:text-4xl font-black text-white tracking-tight drop-shadow-xl">
                    Manish Kumar
                  </h1>

                  {/* Location & Title Subheading */}
                  <p className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mt-1 flex items-center gap-1.5 drop-shadow">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>GHAZIABAD, INDIA • JAVA & AWS DEVOPS</span>
                  </p>

                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-3 mt-4">
                    <a
                      href="https://wa.me/918851961088?text=Hi%20Manish%2C%20I%20saw%20your%20profile%20and%20would%20like%20to%20hire%20you%20for%20Java%20Full%20Stack%20%2F%20AWS%20DevOps."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#d946ef] to-[#ec4899] hover:from-[#c026d3] hover:to-[#db2777] text-white font-black text-sm shadow-lg shadow-pink-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Say Hello</span>
                    </a>

                    <a
                      href="tel:+918851961088"
                      className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md transition-all active:scale-95 cursor-pointer"
                      title="Direct Call"
                    >
                      <Phone className="w-5 h-5" />
                    </a>

                    <a
                      href="mailto:info@appletreeinfotech.in?subject=Job%20Opportunity%20for%20Manish%20Kumar"
                      className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md transition-all active:scale-95 cursor-pointer"
                      title="Send Email"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>

                  {/* Thumbnail Strip Dots */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {photos.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentImageIndex(idx)}
                        aria-label={"View photo " + (idx + 1)}
                        className={"h-1.5 rounded-full transition-all cursor-pointer " + (idx === currentImageIndex ? "w-8 bg-pink-500" : "w-2 bg-white/40 hover:bg-white/70")}
                      />
                    ))}
                  </div>

                </div>
              </div>
            </div>

            {/* Quick Contact & Action Card on Desktop (Clean Light Card) */}
            <div className="hidden lg:block mt-6 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Direct Connect</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  Open for Opportunities
                </span>
              </div>
              <div className="space-y-2.5 text-xs">
                <a href="tel:+918851961088" className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-pink-300 text-slate-800 transition">
                  <Phone className="w-4 h-4 text-pink-600 shrink-0" />
                  <span className="font-mono font-bold">+91 8851961088</span>
                </a>
                <a href="mailto:info@appletreeinfotech.in" className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 text-slate-800 transition">
                  <Mail className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="font-mono truncate font-medium">info@appletreeinfotech.in</span>
                </a>
                <a href="https://github.com/Lightining29" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 text-slate-800 transition">
                  <Github className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="font-medium">github.com/Lightining29</span>
                </a>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: CONTINUOUS FULL SINGLE-PAGE SHOWCASE (LUXURY LIGHT THEME) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 px-4 sm:px-6 lg:px-0 space-y-8">
            
            {/* 1. ABOUT & EXECUTIVE BIO SECTION */}
            <section aria-labelledby="about-heading" className="space-y-4">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-600" />
                    <h2 id="about-heading" className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Executive Bio & Engineering Philosophy
                    </h2>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 font-bold border border-pink-200">
                    Java & AWS DevOps Leader
                  </span>
                </div>

                <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed">
                  I am a high-performing <span className="text-slate-900 font-black underline decoration-pink-500 decoration-2">Java Full Stack Developer</span> & <span className="text-slate-900 font-black underline decoration-sky-500 decoration-2">AWS DevOps Engineer</span> based in Ghaziabad, India. I specialize in architecting resilient backend systems with Java Spring Boot, crafting reactive React web platforms, and automating cloud infrastructure with Docker, Kubernetes, and AWS CI/CD pipelines.
                </p>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Winner of the prestigious <strong className="text-amber-800 font-bold">Best Performer of the Institution Award</strong>, I bring end-to-end expertise spanning microservices orchestration, real-time event streaming, database query optimization, and production cloud monitoring. My focus is writing clean, scalable, maintainable code that drives business results and high system reliability.
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-2xl font-black text-slate-900 block">100%</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Success Rate</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-2xl font-black text-amber-600 block">🏆 #1</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Best Performer</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-2xl font-black text-pink-600 block">15+</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Cloud Deploys</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-2xl font-black text-sky-600 block">24/7</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Architecture SLA</span>
                  </div>
                </div>
              </div>

              {/* Interests & Focus Chips */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-lg space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Interests & Specializations
                </h3>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {interests.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 hover:border-pink-400 text-xs font-bold text-slate-700 shadow-sm transition-all"
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. RICH TECH STACK & ARCHITECTURE SECTION */}
            <section aria-labelledby="tech-stack-heading" className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-pink-600" />
                  <h2 id="tech-stack-heading" className="text-lg sm:text-xl font-black text-slate-900">
                    Core Technical Stack & Engineering Matrix
                  </h2>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold border border-slate-200">
                  Full Stack + DevOps
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {skillCategories.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <div 
                      key={idx} 
                      className={"p-6 rounded-3xl bg-gradient-to-br " + cat.accent + " border " + cat.borderColor + " shadow-lg space-y-4"}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className={"w-9 h-9 rounded-2xl " + cat.iconBg + " flex items-center justify-center shadow-sm"}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900">{cat.title}</h3>
                        </div>
                        <span className={"text-[10px] font-black px-2.5 py-0.5 rounded-full border " + cat.badgeColor}>
                          Verified
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {cat.skills.map((s, sIdx) => (
                          <div 
                            key={sIdx} 
                            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition space-y-1.5 shadow-sm"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-sm text-slate-900">{s.name}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                                {s.level}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 3. FEATURED PROJECTS SHOWCASE */}
            <section aria-labelledby="projects-heading" className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-sky-600" />
                  <h2 id="projects-heading" className="text-lg sm:text-xl font-black text-slate-900">
                    Featured Enterprise Engineering Projects
                  </h2>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold border border-slate-200">
                  Production Systems
                </span>
              </div>

              <div className="space-y-5">
                {projects.map((proj, idx) => (
                  <article 
                    key={idx} 
                    className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-5 hover:border-pink-300 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className={"text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full " + proj.badgeClass}>
                          {proj.badge}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{proj.title}</h3>
                        <p className="text-xs text-slate-500 font-bold">{proj.role} • {proj.period}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 text-xs font-bold border border-slate-200"
                            title="View GitHub Repository"
                          >
                            <Github className="w-4 h-4" />
                            <span>Code</span>
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white transition flex items-center gap-1.5 text-xs font-black shadow-md"
                            title="Open Live Application"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Live Site</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {proj.summary}
                    </p>

                    {/* Key Technical Highlights */}
                    <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-black uppercase text-slate-600 tracking-wider block">
                        Architectural Milestones & Deliverables:
                      </span>
                      <ul className="space-y-1.5">
                        {proj.achievements.map((ach, achIdx) => (
                          <li key={achIdx} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies.map((t) => (
                        <span key={t} className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* 4. AWARDS & HONORS SECTION */}
            <section aria-labelledby="awards-heading" className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h2 id="awards-heading" className="text-lg sm:text-xl font-black text-slate-900">
                    Honors, Certifications & Achievements
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {awards.map((aw, idx) => (
                  <div 
                    key={idx} 
                    className="p-6 rounded-3xl bg-gradient-to-r from-amber-50/80 via-white to-amber-50/30 border border-amber-200 shadow-md space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-300">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900">{aw.title}</h3>
                          <p className="text-xs text-slate-500 font-semibold">{aw.issuer} • {aw.date}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        {aw.badge}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed pl-13">
                      {aw.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. SEARCH ENGINE & COPILOT AI GROUNDING FAQS */}
            <section aria-labelledby="faq-heading" className="space-y-4">
              <div className="flex items-center gap-2 pb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h2 id="faq-heading" className="text-lg sm:text-xl font-black text-slate-900">
                  Verified Knowledge & FAQ Grounding
                </h2>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-semibold flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 text-cyan-600" />
                <span>Optimized for Microsoft Copilot, ChatGPT, Gemini, and Google Search indexing.</span>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-md space-y-2">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-black shrink-0">
                        Q
                      </span>
                      <span>{faq.q}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-8.5">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Bottom Footer Bar */}
            <footer className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pb-12">
              <p>© {new Date().getFullYear()} Manish Kumar. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="https://github.com/Lightining29" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition flex items-center gap-1 font-medium">
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a href="https://www.afshaenterprises.com/manish-kumar" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition flex items-center gap-1 font-medium">
                  <ExternalLink className="w-4 h-4" />
                  <span>Afsha Enterprises Profile</span>
                </a>
              </div>
            </footer>

          </div>

        </div>
      </div>

    </div>
  );
}
