import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Star, Phone, Clock, CheckCircle2, Navigation, 
  Sparkles, Award, ArrowRight, ShieldCheck, HelpCircle, Code2, 
  MessageCircle, ExternalLink, Calendar, BookOpen, Check, Share2,
  Briefcase, GraduationCap, ChevronDown, CheckCircle
} from 'lucide-react';
import { GHAZIABAD_COURSES } from '../../data/ghaziabadCoursesData.js';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function GhaziabadCourseDetail() {
  const { slug } = useParams();
  const { isDark } = useTheme();

  const courseKey = slug || 'java-coaching-in-ghaziabad';
  const course = GHAZIABAD_COURSES[courseKey] || 
                 GHAZIABAD_COURSES['java-coaching-in-ghaziabad'] || 
                 GHAZIABAD_COURSES['java-course-in-ghaziabad'] || 
                 Object.values(GHAZIABAD_COURSES)[0];

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <p className="text-slate-500 mb-4">The requested course could not be loaded.</p>
          <Link to="/courses-in-ghaziabad" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Browse All Courses</Link>
        </div>
      </div>
    );
  }

  const courseImage = course.thumbnailImage || `https://programmingwala.com/assets/images/courses/${course.slug}.png`;

  useEffect(() => {
    document.title = course.seoTitle;

    const setOrCreateMeta = (nameOrProp, attrValue, content) => {
      let element = document.querySelector("meta[" + nameOrProp + "='" + attrValue + "']");
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameOrProp, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setOrCreateMeta('name', 'description', course.metaDesc);
    setOrCreateMeta('name', 'keywords', course.keywords);
    setOrCreateMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setOrCreateMeta('name', 'thumbnail', courseImage);

    let imgLink = document.querySelector('link[rel="image_src"]');
    if (!imgLink) {
      imgLink = document.createElement('link');
      imgLink.rel = 'image_src';
      document.head.appendChild(imgLink);
    }
    imgLink.href = courseImage;

    setOrCreateMeta('property', 'og:title', course.seoTitle);
    setOrCreateMeta('property', 'og:description', course.metaDesc);
    setOrCreateMeta('property', 'og:image', courseImage);
    setOrCreateMeta('property', 'og:image:width', '1200');
    setOrCreateMeta('property', 'og:image:height', '1200');
    setOrCreateMeta('property', 'og:url', window.location.href);
    setOrCreateMeta('property', 'og:type', 'product');

    setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    setOrCreateMeta('name', 'twitter:title', course.seoTitle);
    setOrCreateMeta('name', 'twitter:description', course.metaDesc);
    setOrCreateMeta('name', 'twitter:image', courseImage);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = "https://programmingwala.com/courses/" + course.slug;

    // Google Rich Snippet JSON-LD: Product + Course + LocalBusiness + BreadcrumbList
    const googleRichSnippetSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Product',
          '@id': 'https://programmingwala.com/courses/' + course.slug + '#product',
          'name': course.courseName,
          'image': [
            courseImage,
            'https://programmingwala.com/logo.png'
          ],
          'description': course.overview,
          'sku': 'PW-' + course.slug.toUpperCase(),
          'brand': {
            '@type': 'Brand',
            'name': 'AppleTree Infotech & ProgrammingWala'
          },
          'offers': {
            '@type': 'Offer',
            'url': 'https://programmingwala.com/courses/' + course.slug,
            'priceCurrency': 'INR',
            'price': '3500.00',
            'priceValidUntil': '2027-12-31',
            'availability': 'https://schema.org/InStock',
            'itemCondition': 'https://schema.org/NewCondition',
            'seller': {
              '@type': 'EducationalOrganization',
              'name': 'AppleTree Infotech & ProgrammingWala'
            }
          },
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.9',
            'reviewCount': '520',
            'bestRating': '5',
            'worstRating': '1'
          }
        },
        {
          '@type': 'Course',
          '@id': 'https://programmingwala.com/courses/' + course.slug + '#course',
          'name': course.courseName,
          'description': course.overview,
          'image': courseImage,
          'provider': {
            '@type': 'EducationalOrganization',
            'name': 'AppleTree Infotech & ProgrammingWala',
            'sameAs': 'https://programmingwala.com',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': 'C-60, R.K. Tower, 3rd Floor, RDC',
              'addressLocality': 'Ghaziabad',
              'addressRegion': 'Uttar Pradesh',
              'postalCode': '201001',
              'addressCountry': 'IN'
            }
          },
          'hasCourseInstance': {
            '@type': 'CourseInstance',
            'courseMode': ['IN_PERSON', 'ONLINE'],
            'courseWorkload': course.duration,
            'location': {
              '@type': 'Place',
              'name': 'AppleTree Infotech RDC Ghaziabad Campus',
              'hasMap': 'https://maps.google.com/?q=C-60+R.K.+Tower+RDC+Ghaziabad+Uttar+Pradesh+201001',
              'geo': {
                '@type': 'GeoCoordinates',
                'latitude': 28.6750,
                'longitude': 77.4410
              },
              'address': {
                '@type': 'PostalAddress',
                'streetAddress': 'C-60, R.K. Tower, 3rd Floor, RDC',
                'addressLocality': 'Ghaziabad',
                'postalCode': '201001',
                'addressCountry': 'IN'
              }
            }
          }
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://programmingwala.com'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Courses in Ghaziabad',
              'item': 'https://programmingwala.com/courses-in-ghaziabad'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': course.shortTitle || course.courseName,
              'item': 'https://programmingwala.com/courses/' + course.slug
            }
          ]
        },
        {
          '@type': 'FAQPage',
          'mainEntity': (course.faqs || []).map(f => ({
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

    let script = document.getElementById('ghz-course-schema');
    if (!script) {
      script = document.createElement('script');
      script.id = 'ghz-course-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(googleRichSnippetSchema);

    return () => {
      const el = document.getElementById('ghz-course-schema');
      if (el) el.remove();
    };
  }, [course]);

  return (
    <div className={"min-h-screen py-10 px-4 sm:px-6 lg:px-8 " + (isDark ? "bg-[#0b0f19] text-white" : "bg-[#f8fafc] text-slate-900")}>
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Navigation & Breadcrumbs */}
        <div className="flex items-center justify-between">
          <Link
            to="/courses-in-ghaziabad"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Courses in RDC Ghaziabad</span>
          </Link>

          <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
            Admissions Open for New Batch
          </span>
        </div>

        {/* Hero Section */}
        <header className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-black uppercase tracking-wider">
                {course.tagline}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{course.rating}</span>
              </span>
            </div>

            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Google Verified Course</span>
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {course.h1}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-rose-600 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{course.address}</span>
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {course.overview}
              </p>
            </div>

            <div className="w-full md:w-56 flex-shrink-0 flex justify-center">
              <div className="rounded-3xl overflow-hidden border-2 border-slate-200 shadow-xl bg-slate-900 max-w-[220px]">
                <img 
                  src={`/assets/images/courses/${course.slug}.png`}
                  alt={`${course.courseName} in Ghaziabad`}
                  className="w-full h-auto object-cover"
                  width="220"
                  height="220"
                  loading="eager"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/logo.png';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xl sm:text-2xl font-black text-slate-900 block">{course.duration}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase mt-1 block">Course Duration</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 block">{course.fees.split(' ')[0]}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase mt-1 block">Monthly Fee</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xl sm:text-2xl font-black text-amber-600 block">Classroom Lab</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase mt-1 block">RDC Campus</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xl sm:text-2xl font-black text-cyan-600 block">100%</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase mt-1 block">Placement Support</span>
            </div>
          </div>

          {/* Quick Connect & Direct Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-sky-50 to-blue-50 border border-emerald-200/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">Admissions & Technical Counseling Desk</p>
                <a href="tel:+917503962162" className="text-sm sm:text-base font-black text-emerald-700 hover:underline">
                  +91 7503962162 (Direct Call / WhatsApp)
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href={"https://wa.me/917503962162?text=Hi%2C%20I%20want%20to%20know%20more%20about%20" + encodeURIComponent(course.courseName) + "%20at%20RDC%20Ghaziabad."}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp 7503962162</span>
              </a>

              <a
                href="tel:+917503962162"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </header>

        {/* 1. Highlights & Lab Features */}
        <section aria-labelledby="highlights-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-600" />
            <h2 id="highlights-heading" className="text-xl sm:text-2xl font-black text-slate-900">
              Why Join This Training at RDC Ghaziabad Campus?
            </h2>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-3 shadow-lg">
            <ul className="space-y-2.5">
              {course.highlights.map((h, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 2. Structured Syllabus & Modules */}
        <section aria-labelledby="syllabus-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <h2 id="syllabus-heading" className="text-xl sm:text-2xl font-black text-slate-900">
              Complete Course Curriculum & Hands-on Modules
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {course.curriculumTracks.map((mod, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    Module 0{idx + 1}
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-semibold">{mod.duration}</span>
                </div>
                <h3 className="text-base font-black text-slate-900">{mod.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Live Enterprise Capstones & Production Projects */}
        <section aria-labelledby="projects-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-600" />
            <h2 id="projects-heading" className="text-xl sm:text-2xl font-black text-slate-900">
              Live Enterprise Capstones & Production Portfolio Projects
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Build industry-grade applications following clean architecture, SOLID design principles, and automated test-driven patterns to showcase on your GitHub resume.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-black text-slate-900">Enterprise Core Banking Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-threaded financial ledger simulation handling concurrent debits/credits, deadlock avoidance, ACID transaction boundaries, and audit trail generation.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Multithreading</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">OOP</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">ReentrantLock</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
              <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-black text-slate-900">High-Throughput E-Commerce Catalog</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Product indexer utilizing Java Collections hierarchy (ConcurrentHashMap, TreeMap), stream filtering, custom comparators, and sub-millisecond query search.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Collections</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Streams API</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Generics</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-black text-slate-900">Hospital Patient Management Database</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Relational record storage system using MySQL, JDBC PreparedStatement, HikariCP connection pooling, and Hibernate ORM for entity lifecycle persistence.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">JDBC</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">MySQL</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">HikariCP</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                04
              </div>
              <h3 className="text-base font-black text-slate-900">Secure Spring Boot RESTful Microservices</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Production-ready API architecture with JWT token authentication, role-based access control, input validation, Swagger documentation, and Docker containers.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Spring Boot 3</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">JWT Auth</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">REST API</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm">
                05
              </div>
              <h3 className="text-base font-black text-slate-900">Concurrent Web Scraper & Task Scheduler</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Distributed job worker executing parallel HTTP requests, utilizing ExecutorService thread pools, CompletableFuture promises, and Java Virtual Threads.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Virtual Threads</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">ExecutorService</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Java 21</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-sm">
                06
              </div>
              <h3 className="text-base font-black text-slate-900">Student Placement & Exam Portal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                End-to-end full-stack software application with dynamic assessment timers, instant scoring engines, automated certificate rendering, and PDF reports.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Full Stack</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Hibernate ORM</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Spring MVC</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Lead Architect & Mentorship Spotlight */}
        <section aria-labelledby="mentor-heading" className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-indigo-400/50 shrink-0 shadow-lg bg-slate-800">
              <img
                src="/profile-clean.png"
                alt="Manish Kumar - Lead Software Architect and Java Mentor"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logo.png';
                }}
              />
            </div>

            <div className="space-y-2 text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lead Software Architect &amp; Mentor</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                  5,000+ Engineers Trained
                </span>
              </div>
              <h3 id="mentor-heading" className="text-2xl sm:text-3xl font-black tracking-tight">
                Mentored by Manish Kumar &amp; Senior Architects
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Learn directly from industry leaders who have architected mission-critical banking, cloud, and microservices backends. Get 1-on-1 code reviews, system design interview prep, and direct referral access to top IT companies across Noida, Gurgaon, and Bangalore.
              </p>
              <div className="pt-2">
                <Link
                  to="/manish-kumar"
                  className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 hover:underline"
                >
                  <span>View Instructor Portfolio &amp; Corporate Credentials</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Comprehensive Frequently Asked Questions (SEO FAQs) */}
        <section aria-labelledby="faqs-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <h2 id="faqs-heading" className="text-xl sm:text-2xl font-black text-slate-900">
              Frequently Asked Questions (FAQs)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Everything you need to know about our batch timings, fee structures, syllabus, lab facilities, and placement assistance.
          </p>

          <div className="space-y-3 pt-2">
            {(course.faqs || []).map((faq, idx) => (
              <details
                key={idx}
                className="group p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition hover:border-slate-300"
                open={idx === 0}
              >
                <summary className="flex items-center justify-between cursor-pointer list-none font-black text-sm sm:text-base text-slate-900">
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180 shrink-0" />
                </summary>
                <div className="pt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-3">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* 6. Areas & Engineering Colleges Served in Ghaziabad */}
        <section aria-labelledby="locations-heading" className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-600" />
            <h2 id="locations-heading" className="text-lg sm:text-xl font-black text-slate-900">
              Students &amp; Professionals From Across Ghaziabad &amp; NCR Attend Our Classes
            </h2>
          </div>
          <p className="text-xs text-slate-600">
            Our campus at C-60 R.K. Tower, 3rd Floor, RDC Raj Nagar is easily accessible via New Bus Adda (Shaheed Sthal) Metro Station &amp; Hindon River Metro. We regularly train students from:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {(course.nearbyLocations || [
              'RDC (Raj Nagar District Centre)', 'Raj Nagar Extension', 'Kavi Nagar', 'Shastri Nagar', 
              'Sanjay Nagar', 'Govindpuram', 'Crossing Republik', 'Vasundhara', 'Indirapuram', 
              'Vaishali', 'Mohan Nagar', 'Noida Sector 62', 'Ghaziabad Railway Station',
              'AKGEC College', 'ABES Engineering College', 'KIET Ghaziabad', 'IMS Ghaziabad', 'RKGIT Ghaziabad'
            ]).map((loc, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
              >
                📍 {loc}
              </span>
            ))}
          </div>
        </section>

        {/* 7. Google Map & Campus Address Embed */}
        <section aria-labelledby="campus-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-rose-600" />
              <h2 id="campus-heading" className="text-xl sm:text-2xl font-black text-slate-900">
                Attend Offline Classes at RDC Ghaziabad Campus
              </h2>
            </div>
            <a
              href="https://maps.google.com/?q=C-60+R.K.+Tower+RDC+Ghaziabad+Uttar+Pradesh+201001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-xl h-[340px]">
            <iframe
              title={"Google Map Location for " + course.courseName}
              src="https://maps.google.com/maps?q=C-60+R.K.+Tower+RDC+Ghaziabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* 8. Action CTA */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border border-pink-200/80 text-center space-y-4 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Book Free Demo Class in RDC Ghaziabad</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Experience our interactive coding lab, meet our faculty mentors, and inspect the project curriculum with no advance payment.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={"https://wa.me/917503962162?text=Hi%2C%20I%20want%20to%20book%20a%20free%20demo%20class%20for%20" + encodeURIComponent(course.courseName) + "%20at%20RDC%20Ghaziabad."}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-lg transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Book 2 Free Demo Classes (WhatsApp)</span>
            </a>

            <a
              href="tel:+917503962162"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call: +91 7503962162</span>
            </a>

            <a
              href="https://maps.google.com/?q=C-60+R.K.+Tower+RDC+Ghaziabad+Uttar+Pradesh+201001"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-900 font-black text-xs sm:text-sm border border-slate-200 shadow-md transition cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-cyan-600" />
              <span>Get Google Maps Directions</span>
            </a>
          </div>
        </div>

        {/* 9. Floating Sticky Quick Action Helper */}
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-lg mx-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="text-xs font-bold truncate">Batch Enrolling: C-60 RDC Ghaziabad</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:+917503962162"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 border border-slate-600"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Call</span>
            </a>
            <a
              href={"https://wa.me/917503962162?text=Hi%2C%20I%20want%20to%20enroll%20in%20" + encodeURIComponent(course.courseName) + "%20at%20RDC%20Ghaziabad."}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1 shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}