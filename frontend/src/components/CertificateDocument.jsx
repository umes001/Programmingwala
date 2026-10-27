import React from 'react';

// Apple Tree Infotech Logo Component (Crisp Scalable Vector & Typography matching official brandmark)
export const AppleTreeLogo = ({ className = '' }) => (
  <div className={`flex flex-col items-start select-none ${className}`}>
    <div className="flex flex-col items-center">
      {/* 1. Apple Top Arches + Stalk & Green Leaf SVG */}
      <svg
        viewBox="0 0 160 40"
        className="w-28 h-7 -mb-0.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Apple Stalk / Stem */}
        <path
          d="M 76 20 Q 79 5 87 2"
          stroke="#18181b"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Green Leaf pointing to top-right */}
        <path
          d="M 86 4 Q 104 2 108 14 Q 96 22 84 14 Q 85 8 86 4 Z"
          fill="#48a23f"
        />
        {/* Apple Left Shoulder Curved Arch */}
        <path
          d="M 12 28 C 32 16 64 14 77 24"
          stroke="#18181b"
          strokeWidth="3.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Apple Right Shoulder Curved Arch */}
        <path
          d="M 83 24 C 96 14 128 16 148 28"
          stroke="#18181b"
          strokeWidth="3.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* 2. Main Brand Typography: "apple" (Crimson Red) + "tree" (Leaf Green) */}
      <div className="flex items-baseline leading-none tracking-tight -mt-0.5">
        <span
          className="text-[22px] font-black text-[#c5221f] lowercase"
          style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.03em' }}
        >
          apple
        </span>
        <span
          className="text-[22px] font-black text-[#48a23f] lowercase"
          style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.03em' }}
        >
          tree
        </span>
      </div>

      {/* 3. Sub-wordmark: "INFOTECH" in bold italic black */}
      <div className="w-full flex justify-end -mt-0.5 pr-0.5">
        <span
          className="text-[8px] font-black tracking-[0.24em] text-[#18181b] italic uppercase"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          INFOTECH
        </span>
      </div>
    </div>

    {/* 4. ISO Certification */}
    <span className="text-[7.5px] font-bold tracking-wider text-[#1e88e5] mt-0.5 pl-0.5">
      ISO 9001:2015 CERTIFIED
    </span>
  </div>
);

// Government of India & MSME Emblem Component
export const GovtMsmeLogo = ({ className = '' }) => (
  <div className={`flex flex-col items-center select-none text-slate-800 ${className}`}>
    {/* Ashoka Emblem */}
    <div className="flex flex-col items-center">
      <svg className="w-6 h-6 text-slate-700" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L9 7h6l-3-5zm-5 6l-2 5h14l-2-5H7zm-2 6l-1 5h16l-1-5H5zm7 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
      </svg>
      <span className="text-[6px] font-bold tracking-wider uppercase text-slate-600">सत्यमेव जयते</span>
    </div>
    {/* MSME Banner */}
    <div className="flex flex-col items-center mt-1 border-t border-slate-300 pt-0.5">
      <span className="text-[8px] font-black tracking-widest text-[#1e3a8a] border-b border-slate-700 px-1">
        MSME
      </span>
      <span className="text-[5.5px] font-semibold text-slate-600 tracking-tight text-center leading-[7px] mt-0.5">
        MICRO, SMALL & MEDIUM ENTERPRISES<br />सूक्ष्म, लघु एवं मध्यम उद्यम
      </span>
    </div>
  </div>
);

// Kalinga University Logo Component
export const KalingaUniversityLogo = ({ className = '' }) => (
  <div className={`flex items-center gap-2 select-none ${className}`}>
    {/* Emblem */}
    <div className="w-10 h-10 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-10 h-10 text-[#c2410c]" fill="currentColor">
        {/* Stylized wings and open book */}
        <path d="M50 20 C35 30 15 35 5 50 C15 65 35 60 50 80 C65 60 85 65 95 50 C85 35 65 30 50 20 Z" opacity="0.85" />
        <circle cx="50" cy="45" r="14" fill="#fb923c" />
        <path d="M42 58 L50 48 L58 58 Z" fill="#9a3412" />
      </svg>
    </div>
    <div className="flex flex-col leading-tight">
      <span className="text-sm font-black tracking-wider text-[#1e3a8a] font-serif uppercase">
        KALINGA
      </span>
      <span className="text-xs font-extrabold tracking-widest text-[#1e3a8a] font-serif uppercase">
        UNIVERSITY
      </span>
    </div>
  </div>
);

// Scanned Signature & Stamp Graphic
export const SignatureStamp = ({ className = '' }) => (
  <div className={`relative flex flex-col items-start select-none ${className}`}>
    <div className="relative h-14 w-36 flex items-center">
      {/* Uploaded Handwritten Signature Image */}
      <img
        src="/signature.png"
        alt="Authorized Signature"
        className="h-14 w-auto max-w-[130px] object-contain select-none mix-blend-multiply relative z-10 -ml-1"
      />
      {/* Circular Partner Stamp in Red */}
      <div className="absolute left-10 -top-1 w-14 h-14 rounded-full border-2 border-red-600/75 border-dashed flex items-center justify-center rotate-[-12deg] pointer-events-none opacity-80">
        <span className="text-[6px] font-black text-red-700 text-center uppercase leading-none">
          Apple Tree<br />★ VERIFIED ★<br />Infotech
        </span>
      </div>
    </div>
    <div className="text-[11px] font-bold text-slate-800 tracking-tight leading-tight mt-0.5">
      For APPLE TREE INFOTECH
    </div>
    <div className="text-[10px] font-medium text-slate-600 pl-16">
      (Partner)
    </div>
    <div className="flex items-center text-xs font-bold mt-0.5">
      <span className="text-[#d32f2f]">AppleTree</span>
      <span className="text-slate-800">Infotech</span>
    </div>
  </div>
);

export default function CertificateDocument({ certificate, qrCodeData }) {
  if (!certificate) return null;

  const {
    certificateNumber = 'ATI-06-02-ST1002',
    studentName = 'Miss. Sonam Tiwari',
    internshipName = '6-month Front-End Development Course (MERN Stack)',
    grade,
    percentage,
    startDate = 'June 2, 2025',
    endDate = 'December 22, 2025',
    issueDate = 'January 2, 2026',
    description = 'This certification is awarded in recognition of the successful completion of the curriculum and mastery of the course content.',
    companyAddress = 'C-60 3rd Floor R.K. Tower RDC, Raj Nagar, Ghaziabad, 201001',
    companyPhone = '7503962162, 9355343070',
    companyEmail = 'info@appletreeinfotech.in',
    companyWeb = 'appletreeinfotech.in'
  } = certificate;

  const verifyHost = typeof window !== 'undefined' ? window.location.origin : 'https://appletreeinfotech.in';
  const fallbackQr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${verifyHost}/verify-certificate/${certificateNumber}`)}`;
  const qr = qrCodeData || certificate.qrCodeData || fallbackQr;

  return (
    <div className="certificate-print-root bg-white text-slate-900 font-sans shadow-2xl rounded-sm mx-auto overflow-hidden relative"
      style={{
        width: '100%',
        maxWidth: '860px',
        minWidth: '780px',
        aspectRatio: '1.414 / 1', // standard landscape certificate ratio (A4 landscape)
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      {/* Outer Dark Navy Double Border */}
      <div className="w-full h-full border-[6px] border-[#162d59] relative p-5 flex flex-col justify-between box-border bg-gradient-to-b from-white via-[#fafcff] to-white">
        
        {/* Inner Thin Border */}
        <div className="absolute inset-1.5 border border-[#162d59]/40 pointer-events-none" />

        {/* 1. TOP HEADER ROW */}
        <div className="flex items-start justify-between relative z-10">
          {/* Top Left: Logo */}
          <div className="flex-1">
            <AppleTreeLogo />
          </div>

          {/* Top Center: Address & Contact */}
          <div className="text-center px-2 flex-1 flex flex-col items-center">
            <p className="text-[10px] font-semibold text-slate-800 leading-[1.35] max-w-[280px]">
              {companyAddress}
            </p>
            <p className="text-[9px] font-semibold text-slate-800 mt-0.5">
              Mob: <span className="font-normal text-slate-700">{companyPhone}</span>
            </p>
            <p className="text-[8.5px] font-medium text-slate-600">
              Email-id: <span className="text-[#0284c7]">{companyEmail}</span>
            </p>
            <p className="text-[8.5px] font-bold text-slate-700">
              Web: <span className="text-[#0284c7] underline">{companyWeb}</span>
            </p>
          </div>

          {/* Top Right: Govt / MSME */}
          <div className="flex-1 flex justify-end">
            <GovtMsmeLogo />
          </div>
        </div>

        {/* 2. SUB-HEADER METADATA ROW */}
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mt-2 px-1 relative z-10">
          <div>
            <span>Certificate Number: - </span>
            <span className="font-mono text-slate-900 tracking-wider bg-slate-100/80 px-1 py-0.5 rounded border border-slate-200">
              {certificateNumber}
            </span>
          </div>
          <div>
            <span>Date Issued: </span>
            <span className="font-semibold text-slate-900">{issueDate}</span>
          </div>
        </div>

        {/* 3. MAIN CERTIFICATE TITLE */}
        <div className="text-center my-2 relative z-10">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-wider text-[#d32f2f] uppercase inline-block pb-1 border-b-2 border-[#d32f2f] font-serif"
            style={{ letterSpacing: '0.08em' }}
          >
            CERTIFICATE OF COMPLETION
          </h1>
        </div>

        {/* 4. BODY CONTENT PARAGRAPH */}
        <div className="text-center space-y-2 px-6 relative z-10">
          <p className="text-xs md:text-sm font-serif italic text-slate-700">
            This is to certify that
          </p>

          <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-900 tracking-wide text-center">
            {studentName}
          </h2>

          <p className="text-xs md:text-sm text-slate-800 leading-relaxed max-w-2xl mx-auto">
            has successfully completed <span className="font-bold text-slate-950">{internshipName}</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs md:text-sm text-slate-800">
            <p className="font-semibold">
              Course Duration: <span className="font-bold text-slate-950">{startDate} to {endDate}</span>
            </p>
            {grade && (
              <p className="font-semibold flex items-center gap-1.5">
                <span>Grade:</span>
                <span className="font-black text-[#1e3a8a] text-sm bg-blue-50 border border-blue-300 px-2.5 py-0.5 rounded shadow-sm">
                  {grade}
                </span>
                {percentage !== undefined && percentage !== null && (
                  <span className="text-slate-600 font-medium text-xs">({percentage}%)</span>
                )}
              </p>
            )}
          </div>

          <p className="text-[10px] md:text-xs text-slate-600 max-w-xl mx-auto leading-relaxed italic pt-0.5">
            {description}
          </p>
        </div>

        {/* 5. FOOTER ROW */}
        <div className="flex items-end justify-between mt-3 px-2 pt-2 border-t border-slate-200/50 relative z-10">
          {/* Footer Left: Partner Signature & Stamp */}
          <div className="flex-1">
            <SignatureStamp />
          </div>

          {/* Footer Center: Verification QR Code */}
          <div className="flex flex-col items-center justify-center px-4">
            {qr ? (
              <div className="p-1 bg-white border border-slate-300 rounded shadow-sm flex flex-col items-center">
                <img src={qr} alt="Verify QR Code" className="w-14 h-14 object-contain" />
                <span className="text-[7.5px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">
                  Scan to Verify
                </span>
              </div>
            ) : (
              <div className="w-14 h-14 border border-dashed border-slate-300 rounded flex items-center justify-center text-[7px] text-slate-400">
                QR Code
              </div>
            )}
          </div>

          {/* Footer Right: Distance Learning Partner */}
          <div className="flex-1 flex flex-col items-end">
            <span className="text-[9.5px] font-bold text-slate-800 mb-1 tracking-tight">
              Distance Learning University Partner
            </span>
            <KalingaUniversityLogo />
          </div>
        </div>

      </div>
    </div>
  );
}
