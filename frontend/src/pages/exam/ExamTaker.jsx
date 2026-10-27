import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Code2,
  Check,
  Maximize2,
  Minimize2,
  Star
} from 'lucide-react';

export default function ExamTaker() {
  const { examId } = useParams();
  const navigate = useNavigate();

  // Core Exam State
  const [attemptId, setAttemptId] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: { selectedOptionId, textAnswer, codeAnswer } }
  const [reviewMarked, setReviewMarked] = useState(new Set()); // Set of questionIds
  const [visited, setVisited] = useState(new Set([0]));

  // Palette Pagination (36 questions per page: 6 columns x 6 rows)
  const [palettePage, setPalettePage] = useState(0);
  const PAGE_SIZE = 36;

  // Server-synchronized Timer State
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingAnswer, setSavingAnswer] = useState(false);

  // Anti-Cheat Proctoring State
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showCheatWarning, setShowCheatWarning] = useState(false);
  const [cheatWarningMsg, setCheatWarningMsg] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const token = localStorage.getItem('exam_token');
  const timerRef = useRef(null);

  // 1. Initialize Exam on Mount
  useEffect(() => {
    if (!token) {
      navigate('/test/login');
      return;
    }

    const startExamSession = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/test/exam/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ exam_id: examId })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          alert(data.message || 'Unable to start examination.');
          navigate('/test/dashboard');
          return;
        }

        setAttemptId(data.attemptId);
        setExam(data.exam);
        setQuestions(data.questions || []);
        setRemainingSeconds(data.remainingSeconds);
        setTabSwitchCount(data.tabSwitchCount || 0);

        // Preload existing answers if resuming session
        if (data.existingAnswers && Array.isArray(data.existingAnswers)) {
          const answerMap = {};
          const reviewSet = new Set();
          data.existingAnswers.forEach(ans => {
            answerMap[ans.question_id] = {
              selectedOptionId: ans.selected_option_id,
              textAnswer: ans.answer_text || '',
              codeAnswer: ans.code_answer || ''
            };
            if (ans.is_marked_for_review) {
              reviewSet.add(ans.question_id);
            }
          });
          setAnswers(answerMap);
          setReviewMarked(reviewSet);
        }

        // Try requesting fullscreen
        try {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        } catch (e) {}

      } catch (err) {
        console.error('Failed to initialize exam session:', err);
        alert('Communication error. Redirecting to dashboard.');
        navigate('/test/dashboard');
      } finally {
        setLoading(false);
      }
    };

    startExamSession();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examId, token, navigate]);

  // Keep palette page in sync with current question index
  useEffect(() => {
    const targetPage = Math.floor(currentIndex / PAGE_SIZE);
    if (targetPage !== palettePage) {
      setPalettePage(targetPage);
    }
  }, [currentIndex]);

  // 2. Countdown Timer Loop
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleFinalSubmit(true, 'TIME_EXPIRED');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [remainingSeconds]);

  // 3. Anti-Cheating Event Handler
  const reportCheatEvent = useCallback(async (eventType, details) => {
    if (!attemptId || !token) return;

    try {
      const res = await fetch('/api/test/exam/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          attempt_id: attemptId,
          event_type: eventType,
          details
        })
      });

      const data = await res.json();
      if (data.success) {
        const newCount = data.tabSwitchCount || (tabSwitchCount + 1);
        setTabSwitchCount(newCount);

        setCheatWarningMsg(
          `Security Notice: Window focus lost or tab switched! This event has been recorded on the server. (Warning count: ${newCount} of 3).`
        );
        setShowCheatWarning(true);

        if (newCount >= 3) {
          setTimeout(() => {
            handleFinalSubmit(true, 'EXCESSIVE_TAB_SWITCHING');
          }, 3500);
        }
      }
    } catch (err) {
      console.error('Error logging proctor event:', err);
    }
  }, [attemptId, token, tabSwitchCount]);

  // 4. Visibility & Blur Event Listeners
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportCheatEvent('TAB_SWITCH', 'User switched browser tab or minimized window');
      }
    };

    const handleWindowBlur = () => {
      reportCheatEvent('WINDOW_BLUR', 'Browser window lost focus');
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        reportCheatEvent('FULLSCREEN_EXIT', 'User exited fullscreen mode');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [reportCheatEvent]);

  // Save current answer to backend
  const saveCurrentAnswerToBackend = async (qId, answerObj) => {
    if (!attemptId || !token || !qId) return;

    setSavingAnswer(true);
    try {
      await fetch('/api/test/exam/save-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          attempt_id: attemptId,
          question_id: qId,
          selected_option_id: answerObj?.selectedOptionId || null,
          answer_text: answerObj?.textAnswer || '',
          code_answer: answerObj?.codeAnswer || '',
          is_marked_for_review: reviewMarked.has(qId)
        })
      });
    } catch (err) {
      console.error('Auto-save answer error:', err);
    } finally {
      setSavingAnswer(false);
    }
  };

  // Answer selection handler
  const handleSelectOption = (optionId) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const newAns = {
      ...(answers[currentQ.id] || {}),
      selectedOptionId: optionId
    };

    setAnswers(prev => ({ ...prev, [currentQ.id]: newAns }));
    setVisited(prev => new Set(prev).add(currentIndex));
    saveCurrentAnswerToBackend(currentQ.id, newAns);
  };

  const handleTextAnswerChange = (text) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const newAns = {
      ...(answers[currentQ.id] || {}),
      textAnswer: text
    };
    setAnswers(prev => ({ ...prev, [currentQ.id]: newAns }));
    setVisited(prev => new Set(prev).add(currentIndex));
  };

  const toggleReviewMark = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setReviewMarked(prev => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) {
        next.delete(currentQ.id);
      } else {
        next.add(currentQ.id);
      }
      return next;
    });
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      const currentQ = questions[currentIndex];
      if (currentQ && answers[currentQ.id]) {
        saveCurrentAnswerToBackend(currentQ.id, answers[currentQ.id]);
      }
      setCurrentIndex(index);
      setVisited(prev => new Set(prev).add(index));
    }
  };

  const handleNext = () => {
    const currentQ = questions[currentIndex];
    if (currentQ && answers[currentQ.id]) {
      saveCurrentAnswerToBackend(currentQ.id, answers[currentQ.id]);
    }
    setVisited(prev => new Set(prev).add(currentIndex));
    if (currentIndex < questions.length - 1) {
      goToQuestion(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      goToQuestion(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    setVisited(prev => new Set(prev).add(currentIndex));
    if (currentIndex < questions.length - 1) {
      goToQuestion(currentIndex + 1);
    }
  };

  // Submit Exam
  const handleFinalSubmit = async (isAuto = false, reason = null) => {
    if (!attemptId || !token) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/test/exam/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          attempt_id: attemptId,
          auto_submitted: isAuto,
          submission_reason: reason
        })
      });

      const data = await res.json();
      if (data.success) {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        navigate(`/test/result/${attemptId}`);
      } else {
        alert(data.message || 'Error completing submission.');
      }
    } catch (err) {
      console.error('Final submission error:', err);
      alert('Error submitting examination. Please contact administrator.');
    } finally {
      setSubmitting(false);
      setShowSubmitConfirm(false);
    }
  };

  // Format seconds to HH:MM:SS exactly as shown in reference image
  const formatTime = (totalSeconds) => {
    if (totalSeconds === null || totalSeconds < 0) return '00:00:00';
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg font-bold">Connecting to Examination Server...</h2>
        <p className="text-xs text-slate-400 mt-1">Synchronizing security protocols and question paper.</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex] || {};
  const currentAnswer = answers[currentQ.id] || {};
  const isMarked = reviewMarked.has(currentQ.id);

  // Status helper for question palette:
  // Decoupled from correct/incorrect — only colors attempted questions green,
  // leaving unattempted questions uncolored/neutral with green border (matching reference image).
  const isQuestionAttempted = (index) => {
    const q = questions[index];
    if (!q) return false;
    const ans = answers[q.id];
    return !!(
      ans && (
        (ans.selectedOptionId !== null && ans.selectedOptionId !== undefined) || 
        (ans.textAnswer && ans.textAnswer.trim() !== '') || 
        (ans.codeAnswer && ans.codeAnswer.trim() !== '')
      )
    );
  };

  // Calculate live counts
  let answeredCount = 0;
  let markedCount = 0;
  questions.forEach((q, idx) => {
    if (isQuestionAttempted(idx)) answeredCount++;
    if (reviewMarked.has(q.id)) markedCount++;
  });
  const unansweredCount = questions.length - answeredCount;

  // Question palette pagination slice
  const totalPalettePages = Math.ceil(questions.length / PAGE_SIZE) || 1;
  const currentPaletteQuestions = questions.slice(
    palettePage * PAGE_SIZE,
    (palettePage + 1) * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-slate-200/90 text-slate-800 p-2 sm:p-4 md:p-6 flex flex-col justify-between font-sans select-none overflow-x-hidden">
      
      {/* ══════════ MAIN DESKTOP CBT CONTAINER (MATCHING IMAGE) ══════════ */}
      <div className="max-w-7xl w-full mx-auto bg-white border-2 border-slate-700/80 rounded-2xl shadow-2xl p-4 sm:p-6 flex-1 flex flex-col justify-between min-h-[620px]">
        
        {/* ── 1. TOP HEADER BAR ── */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          {/* Exam Title: "TEST 03 - CIVICS,POLITICAL SCIENCE" */}
          <div className="flex items-center space-x-3">
            <h1 className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-wide uppercase">
              {exam?.code ? `TEST ${exam.code} - ${exam.title || exam.name}` : (exam?.title || 'EXAMINATION')}
            </h1>
          </div>

          {/* Right Action Controls: Mark for Review & Blue Timer */}
          <div className="flex items-center space-x-2.5 sm:space-x-4">
            {/* Mark for Review Button */}
            <button
              type="button"
              onClick={toggleReviewMark}
              className={`inline-flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
                isMarked
                  ? 'bg-amber-100 text-amber-900 border-amber-400 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              <span className={`text-sm leading-none ${isMarked ? 'text-amber-500 font-black' : 'text-slate-400'}`}>★</span>
              <span>Mark for Review</span>
            </button>

            {/* Timer Badge: Royal Blue Digital Countdown (01:28:10) */}
            <div className={`px-4 sm:px-5 py-1.5 rounded-xl font-mono font-black text-sm sm:text-base tracking-widest shadow-md transition-all ${
              remainingSeconds < 300 
                ? 'bg-rose-600 text-white animate-pulse' 
                : 'bg-[#1e6fbe] text-white'
            }`}>
              {formatTime(remainingSeconds)}
            </div>

            {/* Fullscreen icon */}
            <button
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen().catch(() => {});
                }
              }}
              className="hidden sm:inline-flex p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ── 2. INNER EXAMINATION WORKSPACE ── */}
        <div className="flex-1 my-4 border border-slate-300/80 rounded-xl p-4 sm:p-6 bg-slate-50/40 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start overflow-y-auto">
          
          {/* ──── LEFT AREA: QUESTION & CHOICES (8 COLS) ──── */}
          <div className="lg:col-span-8 flex flex-col justify-between min-h-[400px]">
            <div>
              {/* Question Statement */}
              <div className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 leading-relaxed mb-6">
                <span className="font-black text-slate-950 mr-2 text-base sm:text-lg">
                  {currentIndex + 1} .
                </span>
                <span>{currentQ.question_text || currentQ.statement}</span>
              </div>

              {/* Code Snippet Box (if question contains code) */}
              {(currentQ.code || currentQ.code_snippet) && (
                <div className="mb-6 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner font-mono text-xs">
                  <div className="bg-slate-900 px-4 py-1.5 border-b border-slate-800 flex items-center justify-between text-slate-400">
                    <div className="flex items-center space-x-2">
                      <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{currentQ.programming_language || 'Code Snippet'}</span>
                    </div>
                  </div>
                  <pre className="p-4 text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
                    <code>{currentQ.code || currentQ.code_snippet}</code>
                  </pre>
                </div>
              )}

              {/* Multiple Choice (MCQ) & TRUE/FALSE Radio Options */}
              {(currentQ.type === 'MCQ' || currentQ.question_type === 'MCQ' || currentQ.type === 'TRUE_FALSE' || currentQ.question_type === 'TRUE_FALSE' || (!currentQ.type && currentQ.options?.length > 0)) && (
                <div className="space-y-3.5 sm:space-y-4 my-6">
                  {(currentQ.options || (currentQ.type === 'TRUE_FALSE' ? [{ id: 'opt_true', option_text: 'True' }, { id: 'opt_false', option_text: 'False' }] : [])).map((opt, idx) => {
                    const isSelected = currentAnswer.selectedOptionId === opt.id;
                    const keyLetter = opt.option_key || String.fromCharCode(65 + idx);

                    return (
                      <div
                        key={opt.id || idx}
                        onClick={() => handleSelectOption(opt.id)}
                        className="flex items-center space-x-3 cursor-pointer select-none py-1 group"
                      >
                        {/* Teal / Green Circular Radio (matching image) */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition flex-shrink-0 ${
                          isSelected
                            ? 'border-[#00a884] bg-[#00a884]'
                            : 'border-[#00a884] bg-white group-hover:border-[#008f6f]'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>

                        {/* Option Letter: A., B., C., D. */}
                        <span className="font-bold text-sm sm:text-base text-slate-900">
                          {keyLetter}.
                        </span>

                        {/* Option Statement */}
                        <span className="text-sm sm:text-base text-slate-800 font-medium">
                          {opt.option_text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Descriptive / Q&A Input */}
              {(currentQ.type === 'DESCRIPTIVE' || currentQ.question_type === 'DESCRIPTIVE') && (
                <div className="my-6 space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Your Response / Academic Answer:
                  </label>
                  <textarea
                    rows={6}
                    value={currentAnswer.textAnswer || ''}
                    onChange={(e) => handleTextAnswerChange(e.target.value)}
                    onBlur={() => saveCurrentAnswerToBackend(currentQ.id, currentAnswer)}
                    placeholder="Type your detailed answer here..."
                    className="w-full p-4 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ──── RIGHT AREA: ANSWER STATUS CARD (4 COLS) ──── */}
          <div className="lg:col-span-4 flex justify-end">
            <div className="bg-white border border-slate-300/80 rounded-2xl p-4 sm:p-5 shadow-md w-full max-w-[320px] flex flex-col justify-between">
              
              <div>
                {/* Header: ANSWER STATUS */}
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                  ANSWER STATUS
                </h3>

                {/* 6-Column Circular Grid of Number Badges (matching reference image) */}
                <div className="grid grid-cols-6 gap-2 sm:gap-2.5 my-2">
                  {currentPaletteQuestions.map((q, localIdx) => {
                    const globalIdx = palettePage * PAGE_SIZE + localIdx;
                    const attempted = isQuestionAttempted(globalIdx);
                    const isCurrent = currentIndex === globalIdx;

                    // Reference image styling:
                    // - Attempted: Solid green circle with crisp white text
                    // - Unattempted: Clean white circle with light green/emerald outline & dark text
                    // - Active Current: Dark slate circle with ring indicator
                    // Strictly NO right/wrong colors
                    let bubbleStyle = 'bg-white border-2 border-emerald-400/50 text-slate-800 font-bold hover:border-emerald-500'; // unattempted
                    if (isCurrent) {
                      bubbleStyle = 'bg-[#4a5568] text-white font-black ring-2 ring-slate-400 shadow-sm'; // active dark grey
                    } else if (attempted) {
                      bubbleStyle = 'bg-[#48bb78] text-white font-bold shadow-sm'; // green attempted
                    }

                    return (
                      <button
                        key={q.id || globalIdx}
                        type="button"
                        onClick={() => goToQuestion(globalIdx)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-bold flex items-center justify-center transition cursor-pointer shadow-sm ${bubbleStyle}`}
                        title={`Question ${globalIdx + 1}: ${attempted ? 'Attempted' : 'Not Attempted'}`}
                      >
                        {globalIdx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Palette Pagination Bar: 1, 2, 3, >> */}
              <div className="flex items-center justify-center space-x-1.5 pt-4 border-t border-slate-100 mt-4">
                {Array.from({ length: totalPalettePages }).map((_, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => setPalettePage(pIdx)}
                    className={`w-7 h-7 rounded text-xs font-bold transition cursor-pointer ${
                      palettePage === pIdx
                        ? 'bg-[#48bb78] text-white shadow-sm'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {pIdx + 1}
                  </button>
                ))}
                {totalPalettePages > 1 && palettePage < totalPalettePages - 1 && (
                  <button
                    type="button"
                    onClick={() => setPalettePage(prev => Math.min(totalPalettePages - 1, prev + 1))}
                    className="px-2 h-7 rounded text-xs font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 transition cursor-pointer"
                  >
                    &gt;&gt;
                  </button>
                )}
              </div>

              {/* Status Legend (Only Attempted vs Not Attempted - No right/wrong) */}
              <div className="flex items-center justify-center gap-4 text-[11px] font-semibold text-slate-600 pt-3 border-t border-slate-100 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#48bb78]" />
                  <span>Attempted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-400/50" />
                  <span>Not Attempted</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ── 3. BOTTOM NAVIGATION & ACTION BAR ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200">
          
          {/* Left: Answered Counter (Answered : 9) */}
          <div className="font-extrabold text-sm sm:text-base text-slate-900 tracking-wide">
            Answered : {answeredCount}
          </div>

          {/* Right Action Buttons: SKIP, PREVIOUS, NEXT, FINISH */}
          <div className="flex items-center space-x-2.5 sm:space-x-4">
            {/* SKIP (Teal Pill) */}
            <button
              type="button"
              onClick={handleSkip}
              className="px-5 sm:px-7 py-2 bg-[#00b4d8] hover:bg-[#0096c7] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow transition cursor-pointer"
            >
              SKIP
            </button>

            {/* PREVIOUS (Blue Pill) */}
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className="px-5 sm:px-7 py-2 bg-[#3182ce] hover:bg-[#2b6cb0] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-full shadow transition cursor-pointer"
            >
              PREVIOUS
            </button>

            {/* NEXT (Green Pill) */}
            <button
              type="button"
              onClick={handleNext}
              className="px-5 sm:px-7 py-2 bg-[#38a169] hover:bg-[#2f855a] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow transition cursor-pointer"
            >
              NEXT
            </button>

            {/* FINISH (Red Pill) */}
            <button
              type="button"
              onClick={() => setShowSubmitConfirm(true)}
              className="px-5 sm:px-7 py-2 bg-[#e53e3e] hover:bg-[#c53030] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow transition cursor-pointer"
            >
              FINISH
            </button>
          </div>

        </div>

      </div>

      {/* ── 4. PROCTORING WARNING MODAL ── */}
      {showCheatWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-rose-950 border-2 border-rose-600 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 bg-rose-900 text-rose-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8 text-rose-300 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Proctoring Violation Warning</h3>
            <p className="text-xs text-rose-200 mb-6 leading-relaxed">
              {cheatWarningMsg}
            </p>
            <button
              onClick={() => {
                setShowCheatWarning(false);
                if (document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen().catch(() => {});
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-colors cursor-pointer"
            >
              I Understand - Return to Examination
            </button>
          </div>
        </div>
      )}

      {/* ── 5. FINISH SUBMISSION MODAL ── */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl text-slate-900">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Finish & Submit Examination?</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Please review your question status before finalizing. Your answers will be saved and evaluated automatically.
            </p>

            {/* Summary Grid */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs mb-6">
              <div className="text-center p-1">
                <span className="text-slate-500 block text-[10px] font-semibold">Answered</span>
                <span className="text-emerald-600 font-black text-lg">{answeredCount}</span>
              </div>
              <div className="text-center p-1">
                <span className="text-slate-500 block text-[10px] font-semibold">Unanswered</span>
                <span className="text-rose-600 font-black text-lg">{unansweredCount}</span>
              </div>
              <div className="text-center p-1">
                <span className="text-slate-500 block text-[10px] font-semibold">Review</span>
                <span className="text-amber-500 font-black text-lg">{markedCount}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Back to Test
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleFinalSubmit(false, 'CANDIDATE_CONFIRMED')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#e53e3e] hover:bg-[#c53030] text-white text-xs font-bold transition shadow-md shadow-rose-600/30 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {submitting ? <span>Evaluating...</span> : <span>Confirm Finish</span>}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
