import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, Search, Printer, CheckCircle2, ArrowLeft, Building2, Calendar, User, Award, Sparkles, Smartphone, ZoomIn } from 'lucide-react';
import CertificateDocument from '../components/CertificateDocument.jsx';

// Scalable & Responsive Certificate Container
function ResponsiveCertificateViewer({ certificate, onPrint }) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [viewMode, setViewMode] = useState('fit'); // 'fit' | 'full'

  const BASE_WIDTH = 860;
  const BASE_HEIGHT = 608; // 860 / 1.414 (standard landscape certificate ratio)

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const isSmallScreen = containerWidth > 0 && containerWidth < BASE_WIDTH;
  const scale = isSmallScreen && viewMode === 'fit' ? Math.max(0.28, containerWidth / BASE_WIDTH) : 1;
  const scaledHeight = Math.round(BASE_HEIGHT * scale);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Toolbar (Controls for Mobile & Desktop) */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 px-1 print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            Certificate Preview
          </span>
          {isSmallScreen && viewMode === 'fit' && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold border border-sky-300 dark:border-sky-800">
              Scaled to fit ({Math.round(scale * 100)}%)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Screen Toggle */}
          {isSmallScreen && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('fit')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition font-semibold ${
                  viewMode === 'fit'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Fit Screen</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('full')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition font-semibold ${
                  viewMode === 'full'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>100% Size</span>
              </button>
            </div>
          )}

          {/* Print / Save PDF Button */}
          <button
            type="button"
            onClick={onPrint}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Responsive Viewport Frame */}
      <div
        ref={containerRef}
        className="w-full flex justify-center bg-slate-100 dark:bg-slate-900/60 p-2 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 print:p-0 print:border-none print:bg-white"
        style={{
          minHeight: isSmallScreen && viewMode === 'fit' ? `${scaledHeight + 16}px` : undefined
        }}
      >
        <div
          className={`w-full ${viewMode === 'full' ? 'overflow-x-auto pb-4' : 'overflow-hidden flex justify-center'} print:overflow-visible`}
          style={{
            height: isSmallScreen && viewMode === 'fit' ? `${scaledHeight}px` : 'auto'
          }}
        >
          <div
            style={{
              width: `${BASE_WIDTH}px`,
              minWidth: `${BASE_WIDTH}px`,
              transform: isSmallScreen && viewMode === 'fit' ? `scale(${scale})` : 'none',
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out'
            }}
            className="print:transform-none"
          >
            <CertificateDocument certificate={certificate} />
          </div>
        </div>
      </div>

      {/* Helpful Zoom / Rotate Tip on Mobile */}
      {isSmallScreen && (
        <div className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 print:hidden">
          <span>💡</span>
          <span>
            {viewMode === 'fit'
              ? 'Tap "100% Size" to zoom in or rotate phone landscape for full width.'
              : 'Scroll horizontally to inspect details, or tap "Fit Screen" to view all at once.'}
          </span>
        </div>
      )}
    </div>
  );
}

export default function VerifyCertificate() {
  const { certNumber } = useParams();
  const navigate = useNavigate();
  const [inputNumber, setInputNumber] = useState(certNumber || '');
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchCertificate = async (num) => {
    if (!num || !num.trim()) return;
    setLoading(true);
    setError('');
    setCertificate(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/public/verify-certificate/${encodeURIComponent(num.trim())}`);
      const data = await res.json();

      if (data.success && data.data) {
        setCertificate(data.data);
      } else {
        setError(data.message || 'No certificate found with this Certificate Number.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Unable to reach the verification server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certNumber) {
      setInputNumber(certNumber);
      fetchCertificate(certNumber);
    }
  }, [certNumber]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!inputNumber.trim()) return;
    navigate(`/verify-certificate/${encodeURIComponent(inputNumber.trim())}`, { replace: true });
    fetchCertificate(inputNumber.trim());
  };

  const handlePrint = () => {
    window.print();
  };

  // Safe Fallback Display Variables to Guarantee Visibility
  const candidateName = certificate?.studentName || certificate?.candidateName || certificate?.name || 'Candidate';
  const courseName = certificate?.internshipName || certificate?.courseName || certificate?.title || 'Certification Program';
  const durationText = (certificate?.startDate && certificate?.endDate)
    ? `${certificate.startDate} to ${certificate.endDate}`
    : (certificate?.duration || certificate?.issueDate || 'Completed');
  const authorityText = certificate?.companyName ? `${certificate.companyName} (ISO 9001:2015)` : 'Apple Tree Infotech (ISO 9001:2015)';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pb-36 sm:pb-24 print:bg-white print:p-0 print:text-black">
      
      {/* Top Header / Navigation (hidden when printing) */}
      <div className="max-w-5xl mx-auto mb-8 print:hidden">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Credential Verification Portal</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apple Tree Infotech Verification System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-serif">
            Verify Internship Certificate
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Instantly authenticate student completion credentials, internship durations, and university-partnered certifications.
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-lg sm:shadow-xl">
            <div className="absolute left-4 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              placeholder="Enter Certificate Number (e.g. ATI-06-02-ST1002)"
              className="w-full pl-12 pr-32 py-4 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 focus:border-sky-500 dark:focus:border-sky-400 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm font-mono tracking-wide outline-none transition shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !inputNumber.trim()}
              className="absolute right-2 px-5 sm:px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2"
            >
              {loading ? (
                <span>Checking...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Now</span>
                </>
              )}
            </button>
          </form>
          <p className="text-center text-xs text-slate-500 mt-2 font-mono">
            Sample ID: <button type="button" onClick={() => { setInputNumber('ATI-06-02-ST1002'); fetchCertificate('ATI-06-02-ST1002'); }} className="text-sky-600 dark:text-sky-400 font-semibold hover:underline">ATI-06-02-ST1002</button>
          </p>
        </div>
      </div>

      {/* Verification Result Container */}
      <div className="max-w-5xl mx-auto">
        {loading && (
          <div className="p-12 text-center bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Verifying credential on blockchain / database...</p>
            <p className="text-xs text-slate-500 mt-1">Checking serial number: {inputNumber}</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-8 text-center bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-3xl shadow-sm max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-800 dark:text-red-300">Certificate Not Verified</h3>
              <p className="text-xs text-red-600 dark:text-slate-400 mt-1">{error}</p>
            </div>
            <p className="text-xs text-slate-500">
              Please ensure you have typed the exact Certificate Number printed on the document.
            </p>
          </div>
        )}

        {certificate && !loading && (
          <div className="space-y-6">
            
            {/* Authenticity Verified Card Banner (Crisp Contrast in Light & Dark Mode) */}
            <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border-2 border-emerald-500/60 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-5 print:hidden">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-md">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[11px] uppercase tracking-wider">
                      Verified & Authentic
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-bold">
                      {certificate.certificateNumber}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 break-words">
                    Issued to {candidateName}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 break-words">
                    {courseName}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end shrink-0">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>

            {/* Detailed Candidate Information Grid (Fixed High-Contrast Text) */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${certificate.grade ? 'md:grid-cols-5' : 'md:grid-cols-4'} gap-3 sm:gap-4 print:hidden`}>
              
              {/* 1. Candidate Name */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                  <User className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>Candidate Name</span>
                </div>
                <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white break-words">
                  {candidateName}
                </div>
              </div>

              {/* 2. Certification Course */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                  <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Certification Course</span>
                </div>
                <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white break-words" title={courseName}>
                  {courseName}
                </div>
              </div>

              {/* 3. Grade Achieved (if available) */}
              {certificate.grade && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                    <span>Grade Achieved</span>
                  </div>
                  <div className="font-extrabold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 flex-wrap">
                    <span>Grade {certificate.grade}</span>
                    {certificate.percentage !== undefined && certificate.percentage !== null && (
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">({certificate.percentage}%)</span>
                    )}
                  </div>
                </div>
              )}

              {/* 4. Duration */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Duration</span>
                </div>
                <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white break-words">
                  {durationText}
                </div>
              </div>

              {/* 5. Issuing Authority */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                  <Building2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>Issuing Authority</span>
                </div>
                <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white break-words">
                  {authorityText}
                </div>
              </div>

            </div>

            {/* Interactive & Responsive Certificate Viewer */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-4 sm:p-6 print:border-none print:p-0 print:bg-white print:shadow-none">
              <ResponsiveCertificateViewer certificate={certificate} onPrint={handlePrint} />
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
