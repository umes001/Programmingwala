import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen, Printer, Download, Sparkles, School, Phone, Mail, Globe,
  CheckCircle, Star, Shield, AlertCircle, ChevronDown
} from 'lucide-react';

// Classes in order
const CLASS_ORDER = [
  'Java developer', 'Frontend developer', 'Backend developer', 'Fullstack developer', 'DevOps engineer', 'Data scientist',
  // Also support the other naming convention from existing student data
  'Java developer', 'Frontend developer', 'Backend developer', 'Fullstack developer', 'DevOps engineer', 'Data scientist'
];

function getStructureTotals(fs) {
  const monthlySum =
    (fs.tuitionFee || 0) +
    (fs.computerFee || 0) +
    (fs.activityFee || 0) +
    (fs.smartClassFee || 0) +
    (fs.transportFee || 0) +
    (fs.libraryFee || 0) +
    (fs.customFees || [])
      .filter(c => c.period === 'Monthly')
      .reduce((sum, item) => sum + (item.amount || 0), 0);

  const annualOnetime =
    (fs.admissionFee || 0) +
    (fs.developmentFee || 0) +
    (fs.examinationFee || 0) +
    (fs.annualCharges || 0) +
    (fs.customFees || [])
      .filter(c => c.period === 'Annual')
      .reduce((sum, item) => sum + (item.amount || 0), 0);

  const annualTotal = annualOnetime + (monthlySum * 12);

  return { monthlySum, annualOnetime, annualTotal };
}

const FEE_COLORS = [
  { bg: '#EEF2FF', accent: '#4F46E5', light: '#C7D2FE', badge: '#3730A3' },
  { bg: '#FFF7ED', accent: '#EA580C', light: '#FED7AA', badge: '#C2410C' },
  { bg: '#F0FDF4', accent: '#16A34A', light: '#BBF7D0', badge: '#15803D' },
  { bg: '#FFF1F2', accent: '#E11D48', light: '#FECDD3', badge: '#BE123C' },
  { bg: '#F0F9FF', accent: '#0284C7', light: '#BAE6FD', badge: '#0369A1' },
  { bg: '#FAF5FF', accent: '#9333EA', light: '#DDD6FE', badge: '#7C3AED' },
  { bg: '#FFFBEB', accent: '#D97706', light: '#FDE68A', badge: '#B45309' },
  { bg: '#F0FDFA', accent: '#0D9488', light: '#CCFBF1', badge: '#0F766E' },
];

export default function FeeStructurePage() {
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const printRef = useRef(null);

  useEffect(() => {
    fetch('/api/public/fee-structures')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFeeStructures(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const academicYears = [...new Set(feeStructures.map(f => f.academicYear).filter(Boolean))].sort().reverse();
  const classes = [...new Set(feeStructures.map(f => f.class).filter(Boolean))].sort((a, b) => {
    const ai = CLASS_ORDER.indexOf(a);
    const bi = CLASS_ORDER.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  const filtered = feeStructures.filter(fs => {
    const classMatch = selectedClass === 'all' || fs.class === selectedClass;
    const yearMatch = selectedYear === 'all' || fs.academicYear === selectedYear;
    return classMatch && yearMatch;
  });

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden !important; }
          #fee-booklet-print, #fee-booklet-print * { visibility: visible !important; }
          #fee-booklet-print {
            position: absolute !important; left: 0 !important; top: 0 !important;
            width: 100% !important; max-width: 100% !important;
            padding: 1cm !important; margin: 0 !important;
            background: white !important; box-shadow: none !important;
          }
          .booklet-card { page-break-inside: avoid !important; break-inside: avoid !important; margin-bottom: 1.5cm !important; border: 1px solid #ccc !important; }
          .print-hidden { display: none !important; }
          @page { size: A4 portrait; margin: 1.5cm; }
        }
      `}} />

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1E1060] via-[#3B1FA8] to-[#5B468C] text-white print-hidden">
        {/* Decorative circles */}
        <div className="absolute rounded-full -top-24 -right-24 w-72 h-72 bg-white/5 blur-3xl" />
        <div className="absolute w-56 h-56 rounded-full -bottom-16 -left-16 bg-purple-400/10 blur-2xl" />

        <div className="relative px-6 mx-auto text-center max-w-7xl py-14">
          {/* School emblem */}
          <div className="flex justify-center mb-5">
            <div className="flex items-center justify-center w-20 h-20 border-2 rounded-full shadow-2xl bg-white/10 border-white/30 backdrop-blur-sm">
              <img src="/logo.png" alt="Pranidha" className="w-auto h-12" onError={e => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }} />
              <div style={{ display: 'none' }} className="flex items-center justify-center w-full h-full">
                <School className="w-10 h-10 text-white/90" />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            Official Fee Structure Booklet
          </div>

          <h1 className="mb-3 font-serif text-4xl font-black tracking-tight md:text-5xl">
            PRANIDHA INTERNATIONAL SCHOOL
          </h1>
          <p className="mb-1 text-sm font-medium text-white/70">Montessori &amp; Kindergarten to Senior Secondary</p>
          <p className="flex flex-wrap items-center justify-center gap-3 text-xs text-white/50">
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +91 98765 43210</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> billing@pranidhainternational.in</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> pranidhainternational.in</span>
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              { label: 'Classes', value: classes.length || '—' },
              { label: 'Active Structures', value: feeStructures.filter(f => f.isActive !== false).length || '—' },
              { label: 'Academic Year', value: academicYears[0] || '2026-27' },
            ].map((s, i) => (
              <div key={i} className="px-6 py-3 text-center border bg-white/10 border-white/20 backdrop-blur-sm rounded-2xl">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="sticky top-0 z-20 border-b shadow-sm bg-white/90 backdrop-blur-md border-slate-200 print-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-3">
            {/* Class Filter */}
            <div className="relative">
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="py-2 pl-3 pr-8 text-xs font-bold border outline-none appearance-none cursor-pointer bg-slate-50 border-slate-200 rounded-xl text-slate-700 focus:border-indigo-400"
              >
                <option value="all">All Classes</option>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Year Filter */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className="py-2 pl-3 pr-8 text-xs font-bold border outline-none appearance-none cursor-pointer bg-slate-50 border-slate-200 rounded-xl text-slate-700 focus:border-indigo-400"
              >
                <option value="all">All Years</option>
                {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            <span className="text-xs font-medium text-slate-500">
              Showing <strong>{filtered.length}</strong> structure{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all bg-white border shadow-sm cursor-pointer text-slate-700 border-slate-200 rounded-xl hover:bg-slate-50"
            >
              <Download className="w-4 h-4 text-slate-500" />
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#3730A3] rounded-xl transition-all shadow-md cursor-pointer active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" />
              Print Booklet
            </button>
          </div>
        </div>
      </div>

      {/* Main Booklet Area */}
      <div className="px-4 py-10 mx-auto max-w-7xl md:px-8" id="fee-booklet-print" ref={printRef}>

        {/* Print-only school header */}
        <div className="hidden pb-6 mb-8 text-center border-b-2 print:block border-slate-300">
          <h1 className="text-3xl font-black font-serif text-[#1E1060]">APPLETREE INFOTECH</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">Coaching Centre</p>
          <p className="mt-1 text-xs text-slate-500">Phone: +91 7503962162 | hr@appletreeinfotech.in</p>
          <p className="mt-2 text-xs font-bold tracking-widest uppercase text-slate-700">Official Fee Structure Booklet — Session {academicYears[0] || '2026-2027'}</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <div className="w-12 h-12 mb-4 border-4 border-indigo-200 rounded-full border-t-indigo-500 animate-spin" />
            <p className="text-sm font-bold">Loading fee structures...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white border shadow-sm text-slate-400 rounded-3xl border-slate-100">
            <AlertCircle className="w-12 h-12 mb-4 text-slate-300" />
            <p className="text-base font-bold text-slate-500">No fee structures found</p>
            <p className="mt-1 text-sm text-slate-400">Configure fee structures in the Admin Dashboard to display them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            {filtered.map((fs, index) => {
              const { monthlySum, annualOnetime, annualTotal } = getStructureTotals(fs);
              const color = FEE_COLORS[index % FEE_COLORS.length];

              const monthlyItems = [
                { name: 'Tuition Fee', amount: fs.tuitionFee, icon: '📚' },
                { name: 'Computer Lab Fee', amount: fs.computerFee, icon: '💻' },
                { name: 'Activity Fee', amount: fs.activityFee, icon: '🎨' },
                { name: 'Smart Class Fee', amount: fs.smartClassFee, icon: '🖥️' },
                { name: 'Transport Fee', amount: fs.transportFee, icon: '🚌' },
                { name: 'Library Fee', amount: fs.libraryFee, icon: '📖' },
                ...(fs.customFees || []).filter(c => c.period === 'Monthly').map(c => ({ name: c.name, amount: c.amount, icon: '⭐' }))
              ].filter(i => (i.amount || 0) > 0);

              const annualItems = [
                { name: 'Admission Fee (One-time)', amount: fs.admissionFee, icon: '🎓' },
                { name: 'Development Fund', amount: fs.developmentFee, icon: '🏫' },
                { name: 'Examination Fee', amount: fs.examinationFee, icon: '📝' },
                { name: 'Annual Charges', amount: fs.annualCharges, icon: '📋' },
                ...(fs.customFees || []).filter(c => c.period === 'Annual').map(c => ({ name: c.name, amount: c.amount, icon: '⭐' }))
              ].filter(i => (i.amount || 0) > 0);

              return (
                <div
                  key={fs._id}
                  className="booklet-card bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden relative"
                  style={{ borderTop: `5px solid ${color.accent}` }}
                >
                  {/* Card Header */}
                  <div className="px-6 pt-6 pb-4" style={{ background: `linear-gradient(135deg, ${color.bg}, white)` }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Class Badge */}
                        <div
                          className="flex items-center justify-center text-lg font-black text-white shadow-lg w-14 h-14 rounded-2xl shrink-0"
                          style={{ background: `linear-gradient(135deg, ${color.accent}, ${color.badge})` }}
                        >
                          {fs.class?.replace('Class ', '')?.replace('Nursery', 'N')?.replace('LKG', 'L')?.replace('UKG', 'U')?.substring(0, 3)}
                        </div>
                        <div>
                          <h2 className="font-serif text-xl font-black text-slate-900">{fs.class}</h2>
                          <p className="text-xs font-bold text-slate-500 mt-0.5">Session: {fs.academicYear || '2026-2027'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {fs.isActive !== false ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Summary Amount Highlight */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div
                        className="p-3 text-center rounded-xl"
                        style={{ background: color.light + '60' }}
                      >
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Monthly Total</div>
                        <div className="text-lg font-black mt-0.5" style={{ color: color.accent }}>
                          ₹{monthlySum.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div
                        className="p-3 text-center rounded-xl"
                        style={{ background: color.light + '60' }}
                      >
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Annual Total</div>
                        <div className="text-lg font-black mt-0.5" style={{ color: color.badge }}>
                          ₹{annualTotal.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fee Tables */}
                  <div className="px-6 pb-6 space-y-4">

                    {/* Monthly Components */}
                    {monthlyItems.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: color.accent }} />
                          <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Monthly Components</h4>
                        </div>
                        <div className="overflow-hidden border border-slate-100 rounded-xl">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b bg-slate-50 border-slate-100">
                                <th className="text-left p-2.5 font-bold text-slate-500">Particular</th>
                                <th className="text-right p-2.5 font-bold text-slate-500">Amount / Month</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {monthlyItems.map((item, idx) => (
                                <tr key={idx} className="transition-colors hover:bg-slate-50/50">
                                  <td className="p-2.5 font-semibold text-slate-700">
                                    <span className="mr-1.5">{item.icon}</span>{item.name}
                                  </td>
                                  <td className="p-2.5 text-right font-mono font-bold text-slate-800">
                                    ₹{(item.amount || 0).toLocaleString('en-IN')}.00
                                  </td>
                                </tr>
                              ))}
                              <tr style={{ background: color.light + '30' }}>
                                <td className="p-2.5 font-bold text-slate-700">Monthly Sub-Total</td>
                                <td className="p-2.5 text-right font-mono font-black" style={{ color: color.accent }}>
                                  ₹{monthlySum.toLocaleString('en-IN')}.00
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Annual / One-time Components */}
                    {annualItems.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Annual / One-time Charges</h4>
                        </div>
                        <div className="overflow-hidden border border-slate-100 rounded-xl">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b bg-amber-50 border-amber-100">
                                <th className="text-left p-2.5 font-bold text-amber-600">Particular</th>
                                <th className="text-right p-2.5 font-bold text-amber-600">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {annualItems.map((item, idx) => (
                                <tr key={idx} className="transition-colors hover:bg-amber-50/30">
                                  <td className="p-2.5 font-semibold text-slate-700">
                                    <span className="mr-1.5">{item.icon}</span>{item.name}
                                  </td>
                                  <td className="p-2.5 text-right font-mono font-bold text-slate-800">
                                    ₹{(item.amount || 0).toLocaleString('en-IN')}.00
                                  </td>
                                </tr>
                              ))}
                              <tr className="bg-amber-50/50">
                                <td className="p-2.5 font-bold text-amber-700">Annual One-time Sub-Total</td>
                                <td className="p-2.5 text-right font-mono font-black text-amber-700">
                                  ₹{annualOnetime.toLocaleString('en-IN')}.00
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Grand Total */}
                    <div
                      className="flex items-center justify-between p-4 rounded-2xl"
                      style={{ background: `linear-gradient(135deg, ${color.bg}, ${color.light}40)`, border: `1.5px solid ${color.light}` }}
                    >
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Annual Expense</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">One-time + (Monthly × 12)</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black" style={{ color: color.accent }}>
                          ₹{annualTotal.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400">per year</div>
                      </div>
                    </div>

                    {/* Booklet Footer */}
                    <div className="flex justify-between items-center pt-1 text-[9px] text-slate-400 font-mono font-bold border-t border-slate-100">
                      <span>PRANIDHA ACCOUNTS DIVISION</span>
                      <span>VERIFIED & SEALED BY BOARD</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Notice */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-start gap-4 p-5 mt-10 bg-white border border-indigo-100 shadow-sm rounded-2xl print-hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 shrink-0">
              <Shield className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h4 className="mb-1 text-sm font-bold text-slate-800">Important Fee Policy Notes</h4>
              <ul className="text-xs text-slate-500 space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-2"><Star className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /> Fees are due by the 10th of each month. Late payment attracts automatic fine as per the fine schedule.</li>
                <li className="flex items-start gap-2"><Star className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /> Admission fee is a one-time non-refundable charge payable at the time of admission.</li>
                <li className="flex items-start gap-2"><Star className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /> Transport fee is applicable only for students availing school bus services.</li>
                <li className="flex items-start gap-2"><Star className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /> For fee waiver requests, contact the Accounts Office with valid documentation.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Print Footer */}
        <div className="hidden pt-4 mt-8 text-xs text-center border-t-2 print:block border-slate-300 text-slate-500">
          <p className="font-bold">This is an officially issued fee structure document by PRANIDHA INTERNATIONAL SCHOOL.</p>
          <p className="mt-1">For queries: +91 98765 43210 | billing@pranidhainternational.in | pranidhainternational.in</p>
          <p className="mt-1 font-mono">Printed on: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
}
