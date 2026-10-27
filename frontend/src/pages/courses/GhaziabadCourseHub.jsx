import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Star, Phone, Mail, Clock, CheckCircle2, Navigation, 
  Sparkles, Award, ArrowRight, ShieldCheck, HelpCircle, Code2, 
  Server, Cloud, Terminal, Compass, MessageCircle, ExternalLink, Search
} from 'lucide-react';
import { GHAZIABAD_COURSES } from '../../data/ghaziabadCoursesData.js';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function GhaziabadCourseHub() {
  const { isDark } = useTheme();
  const courses = Object.values(GHAZIABAD_COURSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  useEffect(() => {
    document.title = 'Best Tech & Coding Coaching in RDC Ghaziabad | Top Placement Institute (2026)';

    const setOrCreateMeta = (nameOrProp, attrValue, content) => {
      let element = document.querySelector("meta[" + nameOrProp + "='" + attrValue + "']");
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameOrProp, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setOrCreateMeta('name', 'description', 'Join the #1 Tech Coaching in RDC Ghaziabad. Java Full Stack, AWS DevOps, Python AI & MERN courses with live lab practice, ISO certificates, and 100% placement support in RDC Raj Nagar Ghaziabad.');
    setOrCreateMeta('name', 'keywords', 'Best Tech Coaching in RDC Ghaziabad, Coding Institute RDC Ghaziabad, Java Classes Ghaziabad, DevOps Institute Raj Nagar, Computer Center Near Me Ghaziabad, AppleTree Infotech RDC');
    setOrCreateMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large');
    setOrCreateMeta('property', 'og:title', 'Best Tech & Coding Coaching in RDC Ghaziabad | AppleTree Infotech');
    setOrCreateMeta('property', 'og:description', 'Leading tech education institute in RDC Ghaziabad offering Java, AWS DevOps, Python AI, and Web Development.');
    setOrCreateMeta('property', 'og:url', window.location.href);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://programmingwala.com/courses-in-ghaziabad';

    // LocalBusiness + EducationalOrganization Schema.org JSON-LD
    const localSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'EducationalOrganization',
          '@id': 'https://programmingwala.com/#localInstitute',
          'name': 'AppleTree Infotech & ProgrammingWala - Best Tech Coaching in RDC Ghaziabad',
          'description': 'Premier software engineering and tech coaching institute in RDC Raj Nagar, Ghaziabad. Offering offline classroom labs and live online training in Java Full Stack, AWS DevOps, Python AI, and MERN Stack.',
          'url': 'https://programmingwala.com/courses-in-ghaziabad',
          'logo': 'https://programmingwala.com/logo.png',
          'image': 'https://programmingwala.com/manish/manish_3.jpg',
          'telephone': '+91-7503962162',
          'email': 'info@appletreeinfotech.in',
          'priceRange': '₹₹',
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': 'C-60, R.K. Tower, 3rd Floor, RDC (Raj Nagar District Centre)',
            'addressLocality': 'Ghaziabad',
            'addressRegion': 'Uttar Pradesh',
            'postalCode': '201001',
            'addressCountry': 'IN'
          },
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': 28.6750,
            'longitude': 77.4410
          },
          'openingHoursSpecification': [
            {
              '@type': 'OpeningHoursSpecification',
              'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              'opens': '08:00',
              'closes': '20:00'
            },
            {
              '@type': 'OpeningHoursSpecification',
              'dayOfWeek': ['Sunday'],
              'opens': '09:00',
              'closes': '18:00'
            }
          ],
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.9',
            'reviewCount': '520',
            'bestRating': '5',
            'worstRating': '1'
          }
        },
        {
          '@type': 'FAQPage',
          'mainEntity': GHAZIABAD_COURSES['best-tech-coaching-rdc-ghaziabad'].faqs.map(f => ({
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

    let script = document.getElementById('ghz-local-schema');
    if (!script) {
      script = document.createElement('script');
      script.id = 'ghz-local-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(localSchema);

    return () => {
      const el = document.getElementById('ghz-local-schema');
      if (el) el.remove();
    };
  }, []);

  const mainData = GHAZIABAD_COURSES['best-tech-coaching-rdc-ghaziabad'];

  return (
    <div className={"min-h-screen py-10 px-4 sm:px-6 lg:px-8 " + (isDark ? "bg-[#0b0f19] text-white" : "bg-brandCream text-slate-900")}>
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Hero Section */}
        <header className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>RDC Raj Nagar, Ghaziabad Campus</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9 / 5 Rating (520+ Reviews)</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold">
              100% Placement Record
            </span>
          </div>

          <div className="space-y-3 max-w-4xl">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Best Tech & Software Development Coaching in <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 bg-clip-text text-transparent">RDC Ghaziabad</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-medium">
              Offline AC Classroom Labs & Live Online Training • Java Full Stack • AWS DevOps • Python AI • MERN Stack
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-3xl">
            {mainData.overview}
          </p>

          {/* Key Location Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-white block font-bold">Prime Location in RDC</strong>
                <span className="text-slate-400">C-60, R.K. Tower, 3rd Floor, RDC Raj Nagar</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <Navigation className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-white block font-bold">Metro & Bus Connectivity</strong>
                <span className="text-slate-400">5 Mins from Shaheed Sthal (New Bus Adda) Metro</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-white block font-bold">Government Certified</strong>
                <span className="text-slate-400">ISO 9001:2015 & MSME Verifiable Certificates</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
            <a
              href="https://wa.me/917503962162?text=Hi%2C%20I%20want%20to%20visit%20AppleTree%20Infotech%20RDC%20Ghaziabad%20campus%20and%20book%20a%20free%20trial%20class."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs shadow-lg transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Book 2 Free Demo Classes in RDC</span>
            </a>

            <a
              href="https://maps.google.com/?q=C-60+R.K.+Tower+RDC+Ghaziabad+Uttar+Pradesh+201001"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-black text-xs border border-slate-700 transition"
            >
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>Get Google Maps Directions</span>
            </a>

            <a
              href="tel:+917503962162"
              className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 font-black text-xs border border-emerald-500/30 transition"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call Campus: +91 7503962162</span>
            </a>
          </div>
        </header>

        {/* COURSES OFFERED AT RDC GHAZIABAD */}
        <section aria-labelledby="courses-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-pink-400" />
                <h2 id="courses-heading" className="text-2xl sm:text-3xl font-black text-white">
                  100 Verified Tech &amp; Coding Courses in Ghaziabad
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Practical, classroom-led courses with live labs, ISO certificates &amp; 100% placement support in RDC Raj Nagar.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Python, Java, C++..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'All', label: 'All (100)' },
              { id: 'Java', label: '☕ Java (5)' },
              { id: 'Python', label: '🐍 Python (10)' },
              { id: 'Data Science', label: '📊 Data Science & AI (14)' },
              { id: 'C++', label: '⚙️ C & C++ (6)' },
              { id: 'Web', label: '⚛️ Web & Full Stack (24)' },
              { id: 'DevOps', label: '🚀 Cloud & DevOps (15)' },
              { id: 'Security', label: '🛡️ Cyber Security (8)' },
              { id: 'Mobile', label: '📱 Mobile & QA (10)' },
              { id: 'Locality', label: '📍 Ghaziabad Hubs (8)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCat(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCat === tab.id
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filtered Courses Grid */}
          {(() => {
            const filtered = courses.filter(course => {
              if (course.slug === 'best-tech-coaching-rdc-ghaziabad' && selectedCat !== 'All' && selectedCat !== 'Locality') return false;
              const matchesCat = selectedCat === 'All' || 
                (selectedCat === 'Mobile' ? (course.category === 'Mobile' || course.category === 'Testing' || course.category === 'Design') : course.category === selectedCat);
              const matchesSearch = !searchTerm || 
                course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                course.keywords.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.slug.toLowerCase().includes(searchTerm.toLowerCase());
              return matchesCat && matchesSearch;
            });

            return (
              <>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Showing <strong>{filtered.length}</strong> of <strong>100</strong> Courses in Ghaziabad</span>
                  {selectedCat !== 'All' && (
                    <button 
                      onClick={() => { setSelectedCat('All'); setSearchTerm(''); }}
                      className="text-pink-400 hover:underline font-bold"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((course) => (
                    <motion.div
                      key={course.slug}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col justify-between p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-pink-500/40 shadow-xl space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Course Thumbnail Image */}
                        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[4/3] flex items-center justify-center">
                          <img 
                            src={`/assets/images/courses/${course.slug}.png`}
                            alt={`${course.courseName} Ghaziabad`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/logo.png';
                            }}
                          />
                          <span className="absolute top-2.5 right-2.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-900/90 text-pink-400 border border-pink-500/30 backdrop-blur-sm">
                            {course.category || 'Tech'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Practical Lab
                          </span>
                          <span className="text-[11px] font-bold text-amber-300 font-mono">
                            {course.duration}
                          </span>
                        </div>

                        <h3 className="text-base font-black text-white line-clamp-2">
                          {course.courseName}
                        </h3>

                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                          {course.overview}
                        </p>

                        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                          <div className="flex items-center justify-between text-slate-300">
                            <span>Fee:</span>
                            <strong className="text-emerald-400 font-bold">{course.fees.split(' ')[0]} /mo</strong>
                          </div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Batches:</span>
                            <span className="text-white font-semibold">Morning &amp; Evening</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link
                          to={"/courses/" + course.slug}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 text-white text-xs font-black transition-all shadow-md"
                        >
                          <span>View Course &amp; Syllabus</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            );
          })()}
        </section>

        {/* GOOGLE MAP EMBED & CAMPUS LOCATION IN RDC GHAZIABAD */}
        <section aria-labelledby="map-heading" className="space-y-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-400" />
            <h2 id="map-heading" className="text-2xl sm:text-3xl font-black text-white">
              Campus Location & Google Map — RDC Ghaziabad
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Interactive Embedded Google Map */}
            <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl h-[380px] sm:h-[450px]">
              <iframe
                title="AppleTree Infotech RDC Ghaziabad Google Map Location"
                src="https://maps.google.com/maps?q=C-60+R.K.+Tower+RDC+Ghaziabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[25%] contrast-[1.1] hover:grayscale-0 transition duration-500"
              />
            </div>

            {/* Address & Connectivity Card */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-pink-400">
                  Walk-in Campus Visits Open Daily
                </span>
                <h3 className="text-xl font-black text-white">
                  AppleTree Infotech & ProgrammingWala
                </h3>
                <p className="text-xs text-slate-400">
                  C-60, R.K. Tower, 3rd Floor, RDC (Raj Nagar District Centre), Ghaziabad, Uttar Pradesh 201001
                </p>
              </div>

              <div className="space-y-3 text-xs border-t border-b border-slate-800 py-4">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Campus Operating Hours:</strong>
                    <span className="text-slate-400">Monday – Saturday: 8:00 AM – 8:00 PM</span>
                    <span className="text-slate-400 block">Sunday: 9:00 AM – 6:00 PM (Doubt Sessions)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Navigation className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Metro & Bus Connectivity:</strong>
                    <span className="text-slate-400">Red Line Metro: Shaheed Sthal (New Bus Adda) & Hindon River Metro.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Direct Admissions Desk:</strong>
                    <span className="text-slate-400">+91 7503962162 / +91 9355343070</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href="https://maps.google.com/?q=C-60+R.K.+Tower+RDC+Ghaziabad+Uttar+Pradesh+201001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs shadow-lg transition"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open in Google Maps Application</span>
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* SURROUNDING GHAZIABAD & NOIDA LOCALITIES SERVED */}
        <section aria-labelledby="localities-heading" className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 id="localities-heading" className="text-lg sm:text-xl font-black text-white">
              Areas & College Campuses Catered in Ghaziabad & Delhi NCR
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Students and working professionals travel daily from across Ghaziabad and East NCR to attend our classroom labs:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {mainData.nearbyLocations.map((loc) => (
              <span 
                key={loc}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 shadow-sm"
              >
                📍 {loc}
              </span>
            ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section aria-labelledby="faq-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <h2 id="faq-heading" className="text-xl sm:text-2xl font-black text-white">
              Frequently Asked Questions — Tech Coaching in RDC Ghaziabad
            </h2>
          </div>

          <div className="space-y-3">
            {mainData.faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-2">
                <h3 className="text-sm sm:text-base font-black text-white flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    Q
                  </span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8.5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
