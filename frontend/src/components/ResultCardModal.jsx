import React from 'react';
import { 
  Smile, User, Home, Calendar, Hash, Info, Award, BookOpen, Calculator, Atom, Palette, 
  CheckSquare, Percent, Star, Trophy, MessageSquare, Printer, X 
} from 'lucide-react';

export default function ResultCardModal({ activeResult, onClose }) {
  if (!activeResult) return null;

  const { student, report, parentName } = activeResult;

  // Calculate scores
  const scoreEnglish = Number(report.cognitive || 0);
  const scoreMath = Number(report.social || 0);
  const scoreScience = Number(report.creative || 0);
  const scoreArt = Number(report.motorSkills || 0);

  const totalObtained = scoreEnglish + scoreMath + scoreScience + scoreArt;
  const totalMarks = 400;
  const percentage = (totalObtained / totalMarks) * 100;

  const getGradeAndRemarks = (score) => {
    if (score >= 90) return { grade: 'A+', remarks: 'Outstanding', color: 'bg-emerald-600 text-white' };
    if (score >= 80) return { grade: 'A', remarks: 'Excellent', color: 'bg-green-600 text-white' };
    if (score >= 70) return { grade: 'B+', remarks: 'Very Good', color: 'bg-cyan-600 text-white' };
    if (score >= 60) return { grade: 'B', remarks: 'Good', color: 'bg-blue-600 text-white' };
    if (score >= 50) return { grade: 'C', remarks: 'Satisfactory', color: 'bg-amber-600 text-white' };
    return { grade: 'D', remarks: 'Needs Improvement', color: 'bg-rose-600 text-white' };
  };

  const overallGrade = getGradeAndRemarks(percentage).grade;

  // Mock class position based on performance for realistic display
  const getClassPosition = (pct) => {
    if (pct >= 95) return '1st';
    if (pct >= 90) return '2nd';
    if (pct >= 85) return '3rd';
    if (pct >= 75) return '4th';
    if (pct >= 60) return 'Passed';
    return 'Promoted';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:p-0 print:bg-white print:static print:inset-auto">
      {/* Scrollable Container for Modal only */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-6 md:p-8 max-h-[95vh] overflow-y-auto print:shadow-none print:p-0 print:max-h-none print:overflow-visible" id="result-card-modal-container">
        
        {/* Top Actions (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 print:hidden">
          <h3 className="font-quicksand font-bold text-[#5B468C] text-lg">Student Progress Report Card</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#5B468C] hover:bg-[#4A3970] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report Card</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-650 rounded-xl"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Outer Layout */}
        <div 
          className="w-full bg-[#FAF9F5] border-[6px] border-double border-[#D4AF37] rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden select-none"
          id="printable-result-card"
        >
          {/* Decorative Corner Borders */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]"></div>
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]"></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]"></div>

          {/* School Header Banner */}
          <div className="relative flex items-center justify-between bg-[#0A1D37] border-2 border-[#D4AF37] rounded-xl px-4 py-3 text-white overflow-hidden shadow-md">
            {/* Logo on Left */}
            <div className="flex-shrink-0 mr-4">
              <svg className="w-16 h-16 text-[#D4AF37]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="#D4AF37" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="38" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M50 20 L60 40 L82 43 L66 59 L70 81 L50 70 L30 81 L34 59 L18 43 L40 40 Z" fill="#D4AF37" fillOpacity="0.15" stroke="#D4AF37" strokeWidth="1.5" />
                <text x="50" y="55" textAnchor="middle" fill="#D4AF37" fontSize="10" fontWeight="bold" fontFamily="serif">ESTD</text>
                <text x="50" y="65" textAnchor="middle" fill="#D4AF37" fontSize="9" fontWeight="bold" fontFamily="serif">2022</text>
              </svg>
            </div>
            
            {/* School Name */}
            <div className="flex-grow pr-12 text-center md:pr-16">
              <h2 className="text-[22px] md:text-[26px] font-black text-[#D4AF37] uppercase tracking-wide font-serif leading-none drop-shadow-sm">
                Appletree Infotech
              </h2>
              <h3 className="mt-1 font-serif text-sm font-bold tracking-wider text-white uppercase md:text-base">
                Centre
              </h3>
            </div>
          </div>

          {/* Document Sub-title */}
          <div className="space-y-1 text-center">
            <h4 className="text-base font-extrabold text-[#0A1D37] uppercase tracking-widest font-serif">
              Progress Report / Result Card
            </h4>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Academic Session: 2025-2026
            </p>
          </div>

          {/* Student Profile Block */}
          <div className="relative flex flex-col items-center gap-5 p-4 bg-white border shadow-sm border-slate-200/80 rounded-2xl md:flex-row">
            {/* Book/Star Watermark on the right */}
            <div className="absolute pointer-events-none right-4 bottom-2 opacity-5">
              <BookOpen className="w-24 h-24 text-slate-800" />
            </div>

            {/* Student Photo */}
            <div className="w-[90px] h-[105px] bg-slate-100 border-2 border-[#D4AF37]/50 rounded-xl overflow-hidden shadow-inner flex-shrink-0 flex items-center justify-center">
              {student.photo ? (
                <img src={student.photo} alt={student.name} className="object-cover w-full h-full" />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <User className="w-10 h-10 stroke-[1.2]" />
                  <span className="text-[7px] uppercase font-bold mt-1">Photo</span>
                </div>
              )}
            </div>

            {/* Student Details Grid */}
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <User className="w-3.5 h-3.5 text-[#5B468C] flex-shrink-0" />
                <p className="font-medium">
                  Student's Name: <span className="font-bold uppercase text-slate-800">{student.name}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Home className="w-3.5 h-3.5 text-[#5B468C] flex-shrink-0" />
                <p className="font-medium">
                  Parent/Guardian: <span className="font-bold uppercase text-slate-800">{parentName || 'N/A'}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-[#5B468C] flex-shrink-0" />
                <p className="font-medium">
                  Class Program: <span className="font-bold text-slate-800">{student.class}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Hash className="w-3.5 h-3.5 text-[#5B468C] flex-shrink-0" />
                <p className="font-medium">
                  Roll No: <span className="font-mono font-bold text-slate-800">{student.studentId ? student.studentId.replace(/[^\d]/g, '') || '2026001' : '2026001'}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Info className="w-3.5 h-3.5 text-[#5B468C] flex-shrink-0" />
                <p className="font-medium">
                  Section: <span className="font-bold text-slate-800">A</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-3.5 h-3.5 text-[#5B468C] flex-shrink-0" />
                <p className="font-medium">
                  Adm. No: <span className="font-mono font-bold text-slate-800">{student.studentId || '1450'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Subjects and Marks Table */}
          <div className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <th className="w-12 p-3 text-center">S.No.</th>
                  <th className="p-3">Subject Name</th>
                  <th className="p-3 text-center w-28">Total Marks</th>
                  <th className="w-32 p-3 text-center">Marks Obtained</th>
                  <th className="w-20 p-3 text-center">Grade</th>
                  <th className="w-24 p-3 text-center">Percentage</th>
                  <th className="p-3 pl-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="font-medium divide-y divide-slate-100 text-slate-700">
                {/* English */}
                <tr>
                  <td className="p-3 text-center">1.</td>
                  <td className="flex items-center p-3 space-x-2">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>English (Language Arts)</span>
                  </td>
                  <td className="p-3 font-mono text-center">100</td>
                  <td className="p-3 font-mono font-bold text-center text-slate-800">{scoreEnglish}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center justify-center rounded-full w-6 h-6 text-[10px] font-black ${getGradeAndRemarks(scoreEnglish).color}`}>
                      {getGradeAndRemarks(scoreEnglish).grade}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-center">{scoreEnglish}%</td>
                  <td className="p-3 pl-4 text-[11px] text-slate-500 font-semibold">{getGradeAndRemarks(scoreEnglish).remarks}</td>
                </tr>

                {/* Math */}
                <tr>
                  <td className="p-3 text-center">2.</td>
                  <td className="flex items-center p-3 space-x-2">
                    <Calculator className="w-3.5 h-3.5 text-blue-600" />
                    <span>Mathematics (Numeracy)</span>
                  </td>
                  <td className="p-3 font-mono text-center">100</td>
                  <td className="p-3 font-mono font-bold text-center text-slate-800">{scoreMath}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center justify-center rounded-full w-6 h-6 text-[10px] font-black ${getGradeAndRemarks(scoreMath).color}`}>
                      {getGradeAndRemarks(scoreMath).grade}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-center">{scoreMath}%</td>
                  <td className="p-3 pl-4 text-[11px] text-slate-500 font-semibold">{getGradeAndRemarks(scoreMath).remarks}</td>
                </tr>

                {/* Science */}
                <tr>
                  <td className="p-3 text-center">3.</td>
                  <td className="flex items-center p-3 space-x-2">
                    <Atom className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Discovery Science</span>
                  </td>
                  <td className="p-3 font-mono text-center">100</td>
                  <td className="p-3 font-mono font-bold text-center text-slate-800">{scoreScience}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center justify-center rounded-full w-6 h-6 text-[10px] font-black ${getGradeAndRemarks(scoreScience).color}`}>
                      {getGradeAndRemarks(scoreScience).grade}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-center">{scoreScience}%</td>
                  <td className="p-3 pl-4 text-[11px] text-slate-500 font-semibold">{getGradeAndRemarks(scoreScience).remarks}</td>
                </tr>

                {/* Arts & Crafts */}
                <tr>
                  <td className="p-3 text-center">4.</td>
                  <td className="flex items-center p-3 space-x-2">
                    <Palette className="w-3.5 h-3.5 text-rose-600" />
                    <span>Arts & Crafts</span>
                  </td>
                  <td className="p-3 font-mono text-center">100</td>
                  <td className="p-3 font-mono font-bold text-center text-slate-800">{scoreArt}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center justify-center rounded-full w-6 h-6 text-[10px] font-black ${getGradeAndRemarks(scoreArt).color}`}>
                      {getGradeAndRemarks(scoreArt).grade}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-center">{scoreArt}%</td>
                  <td className="p-3 pl-4 text-[11px] text-slate-500 font-semibold">{getGradeAndRemarks(scoreArt).remarks}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Results Summary & Remarks side-by-side */}
          <div className="grid items-stretch grid-cols-1 gap-5 md:grid-cols-12">
            {/* Left: Results Summary */}
            <div className="flex flex-col justify-between p-4 space-y-3 bg-white border shadow-sm md:col-span-5 border-slate-200 rounded-2xl">
              <h5 className="text-xs font-extrabold text-[#0A1D37] uppercase tracking-wider pb-1.5 border-b flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Results Summary</span>
              </h5>
              <div className="space-y-2 text-xs font-semibold text-slate-650">
                <div className="flex items-center justify-between px-2 py-1 border rounded-lg bg-slate-50 border-slate-100">
                  <span className="flex items-center gap-1"><CheckSquare className="w-3 h-3 text-emerald-500" /> Grand Total:</span>
                  <span className="font-mono font-bold text-slate-800">{totalObtained} / {totalMarks}</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 border rounded-lg bg-slate-50 border-slate-100">
                  <span className="flex items-center gap-1"><Percent className="w-3 h-3 text-emerald-500" /> Total Percentage:</span>
                  <span className="font-mono font-bold text-slate-800">{percentage.toFixed(2)}%</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 border rounded-lg bg-slate-50 border-slate-100">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-emerald-500" /> Overall Grade:</span>
                  <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-black ${getGradeAndRemarks(percentage).color}`}>
                    {overallGrade}
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 border rounded-lg bg-slate-50 border-slate-100">
                  <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-emerald-500" /> Class Position:</span>
                  <span className="font-bold text-slate-800">{getClassPosition(percentage)}</span>
                </div>
              </div>
            </div>

            {/* Right: Remarks */}
            <div className="relative flex flex-col justify-between p-4 overflow-hidden bg-white border shadow-sm md:col-span-7 border-slate-200 rounded-2xl">
              <h5 className="text-xs font-extrabold text-[#0A1D37] uppercase tracking-wider pb-1.5 border-b flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <span>Remarks / Observations</span>
              </h5>
              <div className="flex items-center flex-grow py-4">
                <p className="text-xs italic font-medium leading-relaxed text-slate-600">
                  "{report.notes || 'Tommy is showing wonderful enthusiasm and progress this academic term. Keep up the great effort!'}"
                </p>
              </div>
              <div className="absolute pointer-events-none right-4 bottom-2 opacity-5">
                <MessageSquare className="w-16 h-16 text-slate-800" />
              </div>
            </div>
          </div>

          {/* Signatures & Seal section */}
          <div className="relative flex items-end justify-between pt-8">
            
            {/* Class Teacher */}
            <div className="text-center w-32 border-t border-slate-400 pt-1.5 relative">
              <span className="absolute font-serif text-base italic font-bold -translate-x-1/2 select-none -top-6 left-1/2 text-slate-705">
                Signed
              </span>
              <p className="font-extrabold text-[9px] text-[#0A1D37] uppercase tracking-wider">Class Teacher</p>
            </div>

            {/* Headmaster / Stamp */}
            <div className="text-center w-36 border-t border-slate-400 pt-1.5 relative flex flex-col items-center">
              {/* Cursive Signature */}
              <span className="absolute font-serif text-base italic font-bold select-none -top-7 text-slate-705">
                Signed
              </span>
              {/* Circular School Stamp */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-dashed border-emerald-600/40 flex flex-col items-center justify-center bg-emerald-50/10 pointer-events-none select-none -rotate-[8deg] z-0">
                <span className="text-[5px] font-black text-emerald-600/50 uppercase leading-none font-mono">PRANIDHA</span>
                <span className="text-[6px] font-black text-emerald-600/60 uppercase leading-none my-0.5 font-mono">ESTD. 2022</span>
                <span className="text-[5px] font-black text-emerald-600/50 uppercase leading-none font-mono">CAMPUS</span>
              </div>
              <p className="font-extrabold text-[9px] text-[#0A1D37] uppercase tracking-wider">Headmaster</p>
              <p className="text-[7px] text-slate-400 font-bold mt-0.5">Signed with Stamp</p>
              <p className="text-[6px] text-slate-400 font-mono font-bold">Date: {new Date(report.createdAt || report.date || Date.now()).toLocaleDateString('en-GB')}</p>
            </div>

            {/* Parent / Guardian */}
            <div className="text-center w-32 border-t border-slate-400 pt-1.5">
              <p className="font-extrabold text-[9px] text-[#0A1D37] uppercase tracking-wider">Parent/Guardian</p>
            </div>

          </div>

          {/* Affiliation Board Footer */}
          <div className="text-center border-t border-slate-200/80 pt-3 text-[9px] text-slate-400 font-bold">
            Affiliated to Central Board of Primary Education (Affiliation No: 987654) | Fazil Nagar, Punjab
          </div>
        </div>
      </div>
    </div>
  );
}
