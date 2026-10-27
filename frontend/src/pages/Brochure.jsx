import React, { useState } from 'react';
import { Download, FileText, CheckSquare, Mail, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Brochure() {
  const [email, setEmail] = useState('');
  const [requested, setRequested] = useState(false);

  const downloadFile = (fileName) => {
    // Generate a simple simulated PDF text file download to verify download works!
    const element = document.createElement("a");
    const file = new Blob([`Appletree Infotech - ${fileName} document simulator.\nThis is a mock PDF for local development and testing.\nVisit pranidhainternational.in for live school brochures.`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${fileName.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Trigger confetti!
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
  };

  const handleRequestByEmail = (e) => {
    e.preventDefault();
    if (!email) return;
    setRequested(true);
    
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });
  };

  const materials = [
    { title: 'Courses Prospectus 2026', size: '2.4 MB', type: 'PDF Document', desc: 'Contains complete Courses values, safety specifications, and principal address.' },
    { title: 'Fee Schedule & Timelines', size: '1.1 MB', type: 'PDF Sheet', desc: 'Breakdown of tuition installment fees, security policies, and discounts.' },
    { title: 'Student Handbook & Guidelines', size: '3.8 MB', type: 'PDF Booklet', desc: 'Dress code rules, mandatory snacks suggestions, and check-in timelines.' }
  ];

  return (
    <div className="max-w-4xl px-4 py-12 mx-auto space-y-12 md:px-8">
      
      {/* Title */}
      <div className="max-w-2xl mx-auto space-y-4 text-center">
        <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase border rounded-full text-brandCoral bg-brandCoral/10 border-brandCoral/20">DOCUMENTATION</span>
        <h1 className="text-4xl font-bold font-quicksand text-slate-800">Courses Prospectus & Brochures</h1>
        <p className="text-sm text-slate-500">
          Download digital copies of our guidelines, checklists, pricing boards, and curriculum materials.
        </p>
      </div>

      {/* Brochure Cards */}
      <section className="space-y-4">
        {materials.map((mat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-start justify-between gap-4 p-6 transition-shadow bg-white border shadow-sm border-orange-50 rounded-2xl hover:shadow-md sm:flex-row sm:items-center"
          >
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brandCoral/10 text-brandCoral shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold font-quicksand text-slate-800">{mat.title}</h3>
                <p className="text-xs text-slate-500">{mat.desc}</p>
                <div className="flex gap-2 text-[10px] font-semibold text-slate-400">
                  <span>{mat.type}</span>
                  <span>•</span>
                  <span>{mat.size}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => downloadFile(mat.title)}
              className="inline-flex items-center space-x-1 font-quicksand font-bold text-xs bg-brandYellow hover:bg-brandYellow-dark text-slate-800 px-5 py-2.5 rounded-full shadow-sm shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD NOW</span>
            </button>
          </div>
        ))}
      </section>

      {/* Details Box */}
      <section className="grid items-center grid-cols-1 gap-8 p-6 border bg-brandCream border-orange-100/50 rounded-3xl md:p-8 md:grid-cols-12">
        
        {/* Left Column */}
        <div className="space-y-4 md:col-span-7">
          <h3 className="flex items-center space-x-2 text-xl font-bold font-quicksand text-slate-800">
            <Award className="w-5 h-5 text-brandSky" />
            <span>What's Included in the Pack?</span>
          </h3>
          <div className="grid grid-cols-1 gap-2 text-xs font-medium sm:grid-cols-2 text-slate-600">
            <div className="flex items-center space-x-1.5">
              <CheckSquare className="w-4 h-4 text-brandMint shrink-0" />
              <span>Complete Montessori guide</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckSquare className="w-4 h-4 text-brandMint shrink-0" />
              <span>Detailed uniform guidelines</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckSquare className="w-4 h-4 text-brandMint shrink-0" />
              <span>PTM calendar schedules</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckSquare className="w-4 h-4 text-brandMint shrink-0" />
              <span>Bus routes & timing map</span>
            </div>
          </div>
        </div>

        {/* Right Request Form */}
        <div className="p-5 space-y-3 bg-white border shadow-sm md:col-span-5 border-orange-50 rounded-2xl">
          <h4 className="text-sm font-bold font-quicksand text-slate-800">Request via Email</h4>
          {requested ? (
            <p className="text-xs font-medium text-brandMint">
              ✓ Prospectus requested! Check your inbox soon.
            </p>
          ) : (
            <form onSubmit={handleRequestByEmail} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full bg-slate-50 border border-orange-100 focus:border-brandCoral rounded-xl p-2.5 text-xs outline-none"
              />
              <button
                type="submit"
                className="w-full font-quicksand font-bold text-xs bg-brandCoral hover:bg-brandCoral-dark text-white py-2.5 rounded-xl transition-all"
              >
                REQUEST PAPER COPY
              </button>
            </form>
          )}
        </div>

      </section>

    </div>
  );
}
