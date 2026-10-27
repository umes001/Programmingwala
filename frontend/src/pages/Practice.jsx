import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { BrainCircuit, Code2, FileText, Trophy, UserCircle, Sparkles, Download } from 'lucide-react';

const quizQuestions = [
  {
    id: 1,
    prompt: 'Which data structure gives O(1) average-time lookup for a key-value pair?',
    options: ['Array', 'Hash Map', 'Linked List', 'Stack'],
    answer: 'Hash Map'
  },
  {
    id: 2,
    prompt: 'In Java, which keyword is used to create a class that can be extended?',
    options: ['final', 'static', 'abstract', 'class'],
    answer: 'class'
  },
  {
    id: 3,
    prompt: 'What is the best-case time complexity for binary search on a sorted array?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    answer: 'O(1)'
  }
];

const leaderboard = [
  { name: 'Aarav', score: 98, rank: 'Platinum Developer', glow: 'from-amber-400 via-yellow-300 to-emerald-300' },
  { name: 'Sia', score: 91, rank: 'Gold Developer', glow: 'from-cyan-400 via-indigo-400 to-violet-400' },
  { name: 'Kunal', score: 84, rank: 'Silver Developer', glow: 'from-slate-300 via-slate-200 to-slate-100' },
  { name: 'Neha', score: 77, rank: 'Bronze Developer', glow: 'from-orange-300 via-amber-200 to-rose-200' }
];

const generateDsaQuestionBank = () => {
  const templates = [
    (index) => ({
      title: `Array Pairing ${index + 1}`,
      prompt: `Given an array of ${4 + (index % 5)} integers and target ${8 + (index % 11)}, write a Java function to count how many pairs sum to the target.`
    }),
    (index) => ({
      title: `Binary Search ${index + 1}`,
      prompt: `Given a sorted array of ${6 + (index % 7)} integers and target ${15 + (index % 13)}, write a Java function that returns the index of the target or -1.`
    }),
    (index) => ({
      title: `Palindrome Check ${index + 1}`,
      prompt: `Write a Java function to determine whether the string \"${'abccba'.slice(0, 3 + (index % 4))}${index % 2 ? 'a' : 'b'}\" is a palindrome.`
    }),
    (index) => ({
      title: `Fibonacci ${index + 1}`,
      prompt: `Write a Java function to return the ${index + 1}-th Fibonacci number using recursion or iteration.`
    }),
    (index) => ({
      title: `Balanced Brackets ${index + 1}`,
      prompt: `Given a string with ${index + 2} characters, write a Java function to check whether all parentheses are balanced.`
    }),
    (index) => ({
      title: `Maximum Subarray ${index + 1}`,
      prompt: `Given an integer array of ${5 + (index % 6)} values, write a Java function to return the maximum subarray sum.`
    }),
    (index) => ({
      title: `Tree Height ${index + 1}`,
      prompt: `Write a Java function to compute the height of a binary tree with ${index + 3} nodes using DFS or recursion.`
    }),
    (index) => ({
      title: `String Reverse ${index + 1}`,
      prompt: `Write a Java function to reverse the string \"${'coder'.slice(0, 3 + (index % 4))}${index % 3}\" and return the reversed version.`
    })
  ];

  return Array.from({ length: 1000 }, (_, index) => {
    const template = templates[index % templates.length];
    return {
      id: index + 1,
      ...template(index)
    };
  });
};

export default function Practice() {
  const [answers, setAnswers] = useState({ 1: '', 2: '', 3: '' });
  const [developerName, setDeveloperName] = useState('Developer');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('Greater Noida West, India');
  const [skills, setSkills] = useState('Java, DSA, React, Node.js');
  const [tools, setTools] = useState('GitHub, VS Code, Figma');
  const [frameworks, setFrameworks] = useState('React, Tailwind, Express');
  const [projects, setProjects] = useState('Online compiler, quiz platform, resume builder');
  const [role, setRole] = useState('Java + DSA Learner');
  const [focus, setFocus] = useState('Build clean solutions and ship real projects.');
  const [avatarTone, setAvatarTone] = useState('midnight');
  const [resumeReady, setResumeReady] = useState(false);
  const [aiResume, setAiResume] = useState(null);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [aiMessage, setAiMessage] = useState('Use the AI polish button for a more professional resume tone.');
  const dsaQuestionBank = useMemo(() => generateDsaQuestionBank(), []);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [solutionDraft, setSolutionDraft] = useState(`public class Solution {
  public static int solve(int[] nums, int target) {
    // Write your Java solution here
    return 0;
  }
}`);
  const [feedback, setFeedback] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('Paste your Java solution and ask AI for targeted DSA guidance.');

  const score = useMemo(() => {
    return quizQuestions.reduce((total, item) => total + (answers[item.id] === item.answer ? 1 : 0), 0);
  }, [answers]);

  const rankLabel = score >= 3 ? 'Platinum Developer' : score === 2 ? 'Gold Developer' : score === 1 ? 'Silver Developer' : 'Bronze Developer';

  const avatarStyles = {
    midnight: 'from-slate-950 via-indigo-900 to-slate-800 text-cyan-100',
    sunrise: 'from-amber-500 via-rose-400 to-fuchsia-500 text-white',
    aurora: 'from-emerald-500 via-cyan-400 to-indigo-500 text-slate-950'
  };

  const normalizeList = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    return String(value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const mergeResumeSkills = (resumeSkills = skills, resumeTools = tools, resumeFrameworks = frameworks) => {
    return [...new Set([
      ...normalizeList(resumeSkills),
      ...normalizeList(resumeTools),
      ...normalizeList(resumeFrameworks)
    ])];
  };

  const handleAiPolish = async () => {
    setIsPolishing(true);
    setAiMessage('Polishing your resume with Gemini AI...');

    try {
      const response = await fetch('/api/public/resume/ai-polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: developerName, role, focus, skills, projects, phone, address, tools, frameworks })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'AI polishing failed.');
      }

      setAiResume(result.data);
      setDeveloperName(developerName || 'Developer');
      setRole(result.data.headline || role);
      setFocus(result.data.summary || focus);
      setSkills((result.data.skills || mergeResumeSkills()).join(', '));
      setTools((result.data.tools || normalizeList(tools)).join(', '));
      setFrameworks((result.data.frameworks || normalizeList(frameworks)).join(', '));
      setProjects((result.data.projects || normalizeList(projects)).join(' • '));
      setResumeReady(false);
      setAiMessage('AI-enhanced resume tone is ready. Your PDF will now use the polished content and cleaner formatting.');
    } catch (error) {
      setAiMessage(error.message || 'AI polishing is unavailable right now.');
    } finally {
      setIsPolishing(false);
    }
  };

  const handleAiFeedback = async () => {
    setIsChecking(true);
    setFeedbackMessage('AI mentor is reviewing your DSA attempt...');

    try {
      const response = await fetch('/api/public/dsa-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `${dsaQuestionBank[selectedQuestion].title} — ${dsaQuestionBank[selectedQuestion].prompt}`,
          code: solutionDraft
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'AI feedback failed.');
      }

      setFeedback(result.data);
      setFeedbackMessage('AI feedback is ready. Review the suggestions and iterate on your solution.');
    } catch (error) {
      setFeedbackMessage(error.message || 'AI feedback is unavailable right now.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleGenerateResume = () => {
    setIsGeneratingPdf(true);
    setAiMessage('Preparing a polished PDF resume with a cleaner layout...');

    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 36;
      const headline = aiResume?.headline || role || 'Java + DSA Learner';
      const summaryText = aiResume?.summary || focus || 'Build clean solutions and ship real projects.';
      const skillList = mergeResumeSkills(aiResume?.skills || skills, aiResume?.tools || tools, aiResume?.frameworks || frameworks);
      const projectList = normalizeList(aiResume?.projects || projects);
      const highlights = aiResume?.highlights || [
        'Strong problem-solving mindset',
        'Modern frontend and backend development experience',
        'Ready for internships, interviews, and real-world engineering roles'
      ];

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 110, 'F');
      doc.setDrawColor(56, 189, 248);
      doc.setLineWidth(1);
      doc.line(margin, 118, pageWidth - margin, 118);

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text(developerName || 'Developer Name', margin, 42);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(headline, margin, 66);
      doc.setTextColor(191, 219, 254);
      doc.text(`Phone: ${phone || 'Not provided'}   •   Address: ${address || 'Not provided'}`, margin, 88);

      doc.setFillColor(236, 244, 255);
      doc.roundedRect(margin, 132, pageWidth - margin * 2, 70, 10, 10, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Professional Summary', margin + 12, 154);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const summaryLines = doc.splitTextToSize(summaryText, pageWidth - margin * 2 - 24);
      doc.text(summaryLines, margin + 12, 172);

      let y = 224;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('Core Skills', margin, y);
      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      skillList.forEach((item) => {
        if (y > pageHeight - 80) {
          doc.addPage();
          y = 50;
        }
        doc.text(`• ${item}`, margin + 6, y);
        y += 18;
      });

      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('Projects & Achievements', margin, y);
      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      projectList.forEach((item) => {
        if (y > pageHeight - 80) {
          doc.addPage();
          y = 50;
        }
        doc.text(`• ${item}`, margin + 6, y);
        y += 18;
      });

      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('Highlights', margin, y);
      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      highlights.forEach((item) => {
        if (y > pageHeight - 80) {
          doc.addPage();
          y = 50;
        }
        doc.text(`• ${item}`, margin + 6, y);
        y += 18;
      });

      const pdfBlobUrl = doc.output('bloburl');
      const fileName = `${(developerName || 'developer').trim().replace(/\s+/g, '-').toLowerCase()}-resume.pdf`;

      window.open(pdfBlobUrl, '_blank', 'noopener,noreferrer');

      const downloadLink = document.createElement('a');
      downloadLink.href = pdfBlobUrl;
      downloadLink.download = fileName;
      downloadLink.click();

      setResumeReady(true);
      setAiMessage('Resume PDF generated with a polished, professional layout.');
    } catch (error) {
      setAiMessage(error.message || 'Resume generation is unavailable right now.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleResumeSubmit = (event) => {
    event.preventDefault();
    handleGenerateResume();
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:py-12 md:px-8 select-none">
      
      {/* ── MASTER CANVAS CONTAINER (Crextio Golden-Butter Theme) ── */}
      <div className="bg-gradient-to-br from-[#faf8f2] via-[#fbf7eb] to-[#fdf2d2] rounded-[38px] border border-white/90 shadow-[0_25px_80px_rgba(0,0,0,0.08)] p-6 sm:p-10 space-y-8">
        
        {/* Header Banner */}
        <section className="rounded-[32px] bg-[#1c1d21] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border border-white/10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-white/10 text-amber-300 text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>DEVELOPER PRACTICE & DSA LAB</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Interactive Quiz • DSA Challenge Bank • AI Resume Builder
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Sharpen your core coding problem-solving skills, test algorithms directly in the live browser compiler, and get AI-assisted feedback.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-5 text-center min-w-[200px] shadow-lg">
            <p className="text-[10px] uppercase tracking-widest font-extrabold text-amber-300">YOUR PRACTICE RANK</p>
            <p className="mt-1 text-2xl font-black text-white">{rankLabel}</p>
            <span className="inline-block mt-2 text-[11px] font-bold text-slate-200 bg-white/10 px-3 py-1 rounded-full">
              Score: {score} / {quizQuestions.length}
            </span>
          </div>
        </section>

        {/* Kaun Banega Crorepati Hotseat Banner */}
        <section className="rounded-[32px] bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950 p-6 sm:p-7 border-2 border-amber-400/50 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl p-1 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 shadow-lg shadow-amber-500/20 shrink-0">
              <img
                src="/kbc-host.jpg"
                alt="KBC Hotseat"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-1">
                <Trophy className="w-3 h-3 text-amber-400" /> LIVE HOTSEAT ARENA
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Kaun Banega Crorepati — MERN & SQL Edition
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                16 levels ladder to ₹7 Crore, 4 lifelines (50:50, Audience Poll, Expert Advice, Flip Question), and Tik-Tiki Ji timer!
              </p>
            </div>
          </div>
          <Link
            to="/kbc"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm tracking-wider uppercase shadow-xl shadow-amber-500/30 transition transform hover:scale-105 inline-flex items-center gap-2"
          >
            Play Real KBC →
          </Link>
        </section>

        {/* ── 2-COLUMN SECTION: QUIZ & LEADERBOARD ── */}
        <section className="grid gap-6 lg:grid-cols-12">
          
          {/* Left: Java & DSA Mini Quiz */}
          <article className="lg:col-span-7 rounded-[32px] border border-white bg-white/90 p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Java & DSA Assessment Quiz</h2>
                <p className="text-xs text-slate-500 font-medium">Select the best answer to update your developer rank in real-time.</p>
              </div>
            </div>

            <div className="space-y-4">
              {quizQuestions.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 space-y-3">
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{item.id}. {item.prompt}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {item.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, [item.id]: option }))}
                        className={`rounded-xl border px-3.5 py-2.5 text-left text-xs font-bold transition-all cursor-pointer ${
                          answers[item.id] === option 
                            ? 'border-[#1c1d21] bg-[#1c1d21] text-white shadow-sm' 
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Right: Leaderboard */}
          <article className="lg:col-span-5 rounded-[32px] border border-white bg-white/90 p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Weekly Top Developers</h2>
                <p className="text-xs text-slate-500 font-medium">Leaderboard rankings for solved problems and streaks.</p>
              </div>
            </div>

            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div key={entry.name} className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${entry.glow} flex items-center justify-center text-xs font-black text-slate-900 shadow-sm`}>
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{entry.name}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">{entry.rank}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                    {entry.score} pts
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-center">
              <span className="text-xs font-bold text-amber-900">Top 3 candidates get direct interviews with Appletree Infotech 🚀</span>
            </div>
          </article>
        </section>

        {/* ── 2-COLUMN SECTION: DSA COMPILER & RESUME BUILDER ── */}
        <section className="grid gap-6 lg:grid-cols-12">
          
          {/* Left: 1000 DSA Challenges & Compiler */}
          <article className="lg:col-span-6 rounded-[32px] border border-white bg-white/90 p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">1000 DSA Challenge Bank</h2>
                <p className="text-xs text-slate-500 font-medium">Solve interactive algorithm problems in the browser.</p>
              </div>
            </div>

            {/* Current Challenge Card */}
            <div className="p-4 rounded-2xl bg-[#1c1d21] text-white space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full">
                  Challenge #{selectedQuestion + 1} of {dsaQuestionBank.length}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedQuestion((prev) => (prev === 0 ? dsaQuestionBank.length - 1 : prev - 1))}
                    className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedQuestion((prev) => (prev + 1) % dsaQuestionBank.length)}
                    className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">{dsaQuestionBank[selectedQuestion]?.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{dsaQuestionBank[selectedQuestion]?.prompt}</p>
            </div>

            {/* Compiler Iframe */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-black">
              <iframe
                title="Online Java Compiler"
                src="https://www.jdoodle.com/iembed/v0/"
                className="h-[360px] w-full border-0"
                allow="clipboard-write"
                loading="lazy"
              />
            </div>

            {/* AI Code Reviewer Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">AI Code Suggestions</span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">Gemini AI</span>
              </div>
              <textarea
                value={solutionDraft}
                onChange={(e) => setSolutionDraft(e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 font-mono outline-none focus:border-slate-800"
                placeholder="Paste your solution for AI guidance..."
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAiFeedback}
                  disabled={isChecking}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-[#1c1d21] hover:bg-black shadow-sm transition-all cursor-pointer"
                >
                  {isChecking ? 'Analyzing...' : 'Get AI Code Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setSolutionDraft(`public class Solution {\n  public static int solve(int[] nums, int target) {\n    return 0;\n  }\n}`)}
                  className="py-2.5 px-3 rounded-xl font-bold text-xs text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Reset
                </button>
              </div>
              {feedback && (
                <div className="p-3 bg-white rounded-xl border border-purple-200 text-xs space-y-1.5 text-slate-800">
                  <p className="font-bold text-purple-900">Verdict: {feedback.verdict}</p>
                  <p className="text-[11px] text-slate-600">{feedback.suggestions?.[0]}</p>
                </div>
              )}
            </div>
          </article>

          {/* Right: Professional Resume Builder */}
          <article className="lg:col-span-6 rounded-[32px] border border-white bg-white/90 p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Developer Resume Builder</h2>
                <p className="text-xs text-slate-500 font-medium">Generate a verified ATS-friendly developer resume PDF.</p>
              </div>
            </div>

            <form onSubmit={handleResumeSubmit} className="space-y-3">
              <div className="grid gap-2.5 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Full Name</label>
                  <input 
                    value={developerName} 
                    onChange={(e) => setDeveloperName(e.target.value)} 
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 font-semibold outline-none focus:border-slate-800" 
                    placeholder="Your name" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Target Role</label>
                  <input 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 font-semibold outline-none focus:border-slate-800" 
                    placeholder="e.g. Java Full Stack Developer" 
                  />
                </div>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Phone Number</label>
                  <input 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 font-semibold outline-none focus:border-slate-800" 
                    placeholder="+91 98765 43210" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Location / City</label>
                  <input 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 font-semibold outline-none focus:border-slate-800" 
                    placeholder="Jaipur, India" 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Technical Skills (Comma separated)</label>
                <input 
                  value={skills} 
                  onChange={(e) => setSkills(e.target.value)} 
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 font-semibold outline-none focus:border-slate-800" 
                  placeholder="Java, Spring Boot, React, SQL, DSA" 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Professional Focus / Summary</label>
                <textarea 
                  value={focus} 
                  onChange={(e) => setFocus(e.target.value)} 
                  rows={2} 
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:border-slate-800" 
                  placeholder="Passionate engineer building enterprise web apps..." 
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleAiPolish}
                  disabled={isPolishing}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs text-purple-900 bg-purple-100 hover:bg-purple-200 border border-purple-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isPolishing ? 'Polishing...' : 'AI Polish Resume'}</span>
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingPdf}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-[#1c1d21] hover:bg-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isGeneratingPdf ? 'Exporting...' : 'Download Resume PDF'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{developerName || 'Your Name'}</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">Ready to Export</span>
                </div>
                <p className="text-[11px] text-slate-500">{role} • {address}</p>
                <p className="text-[11px] text-slate-600 line-clamp-2">{focus}</p>
              </div>
            </form>
          </article>
        </section>

      </div>
    </div>
  );
}
