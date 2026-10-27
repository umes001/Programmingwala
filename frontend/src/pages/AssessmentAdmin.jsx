import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Briefcase, Users, Mail, PlusCircle, Trash2, ToggleLeft, ToggleRight,
  LogOut, CheckCircle, AlertCircle, ChevronUp, ChevronDown, MapPin, Clock, DollarSign,
  Edit, FileText, Bell, ClipboardList, UserCheck, Database, Copy, Check, UserPlus, Award,
  BookOpen, Search, Filter, CheckSquare, Square, Sparkles, Layers, ArrowRight, RefreshCw,
  Sliders, ArrowUpDown, Server
} from 'lucide-react';
import CertificateModal from '../components/CertificateModal.jsx';

const ADMIN_TOKEN = () => {
  return localStorage.getItem('adminToken') || 
         sessionStorage.getItem('adminToken') || 
         sessionStorage.getItem('adminPassword') || 
         'rancom@2026';
};

const api = (url, opts = {}) => fetch(url, {
  ...opts,
  headers: {
    'x-admin-token': ADMIN_TOKEN(),
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  },
});

const DIFF_COLORS  = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };
const TYPE_COLORS  = { mcq: '#0369a1', theory: '#b45309', sql: '#059669' };
const TYPE_ICONS   = { mcq: '🔘', theory: '📝', sql: '🗄️' };

export default function AssessmentAdmin() {
  const navigate = useNavigate();

  /* ── tabs ── */
  const [tab, setTab] = useState('tests');

  /* ── data ── */
  const [tests, setTests] = useState(() => {
    try {
      const cached = localStorage.getItem('appletree_cached_assessments');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });
  const [stats,        setStats]       = useState({});
  const [selTest,      setSelTest]     = useState(null);
  const [attempts,     setAttempts]    = useState([]);
  const [candidatePool, setCandidatePool] = useState([]);
  const [loading,      setLoading]     = useState(false);

  /* ── Hostinger MySQL Database State ── */
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);
  const [dbStatus, setDbStatus]                   = useState(null);
  const [testingDb, setTestingDb]                 = useState(false);
  const [connectingDb, setConnectingDb]           = useState(false);
  const [syncingDb, setSyncingDb]                 = useState(false);
  const [dbMessage, setDbMessage]                 = useState({ type: '', text: '' });
  const [dbForm, setDbForm]                       = useState({
    host: 'localhost',
    port: 3306,
    database: 'pranidha_school',
    user: 'root',
    password: ''
  });

  /* ── certificate preview & issuance ── */
  const [selectedCert, setSelectedCert] = useState(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [sendingCertId, setSendingCertId] = useState(null);
  const [regrading, setRegrading] = useState(false);

  /* ── Java Ready-Made Question Bank State ── */
  const [qbQuestions, setQbQuestions] = useState([]);
  const [qbTotal, setQbTotal] = useState(0);
  const [qbPage, setQbPage] = useState(1);
  const [qbLimit, setQbLimit] = useState(15);
  const [qbTopic, setQbTopic] = useState('');
  const [qbDifficulty, setQbDifficulty] = useState('');
  const [qbSearch, setQbSearch] = useState('');
  const [qbStats, setQbStats] = useState(null);
  const [qbTopics, setQbTopics] = useState([]);
  const [qbLoading, setQbLoading] = useState(false);
  const [qbSelected, setQbSelected] = useState({}); // { [qid]: questionObj }
  const [qbTargetTestId, setQbTargetTestId] = useState('');
  const [qbSubTab, setQbSubTab] = useState('bank'); // 'bank' | 'manager'
  const [expandedExplanations, setExpandedExplanations] = useState({});
  const [quickAddCount, setQuickAddCount] = useState(10);
  const [quickAddTopic, setQuickAddTopic] = useState('');
  const [quickAddDiff, setQuickAddDiff] = useState('');
  const [quickAddBusy, setQuickAddBusy] = useState(false);
  const [newTestPrepopulate, setNewTestPrepopulate] = useState('none');
  const [testQuestionMode, setTestQuestionMode] = useState('manual'); // 'manual' | 'bank'

  /* ── UI toggles ── */
  const [showNewTest, setShowNewTest] = useState(false);
  const [manualName, setManualName]   = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualDob, setManualDob]     = useState('');

  /* ── new test form ── */
  const [tf, setTf] = useState({
    title: '', description: '', jobTitle: 'General', duration: 30,
    passingScore: 50, maxAttempts: 1, shuffleQuestions: true,
    shuffleOptions: true, showResult: true, scheduledAt: '', expiresAt: '',
    accessPassword: ''
  });

  /* ── new question form ── */
  const [qf, setQf] = useState({
    text: '', type: 'mcq', options: ['', '', '', ''], correct: '',
    marks: 1, difficulty: 'medium', topic: '', modelAnswer: '',
    sqlSchema: '', sqlExpected: '', sqlHint: '', explanation: '',
  });

  /* ── SQL Runner ── */
  const [sqlRunnerSchema, setSqlRunnerSchema] = useState(
    "CREATE TABLE employees (\n  id INT,\n  name VARCHAR(50),\n  dept VARCHAR(50),\n  salary INT\n);\nINSERT INTO employees VALUES (1,'Alice','Engineering',90000);\nINSERT INTO employees VALUES (2,'Bob','Marketing',75000);\nINSERT INTO employees VALUES (3,'Carol','Engineering',95000);"
  );
  const [sqlRunnerQuery,  setSqlRunnerQuery]  = useState("SELECT * FROM employees WHERE dept = 'Engineering';");
  const [sqlRunnerResult, setSqlRunnerResult] = useState(null);
  const [sqlRunnerBusy,   setSqlRunnerBusy]   = useState(false);

  const adminRunSql = async () => {
    setSqlRunnerBusy(true);
    setSqlRunnerResult(null);
    try {
      const r = await api('/api/assessment/admin/run-sql', {
        method: 'POST',
        body: JSON.stringify({ schema: sqlRunnerSchema, query: sqlRunnerQuery }),
      });
      setSqlRunnerResult(await r.json());
    } catch (e) {
      setSqlRunnerResult({ error: e.message });
    } finally {
      setSqlRunnerBusy(false);
    }
  };

  /* ── fetch question bank ── */
  const fetchQuestionBank = async (page = qbPage, topic = qbTopic, diff = qbDifficulty, search = qbSearch) => {
    setQbLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(qbLimit)
      });
      if (topic) params.append('topic', topic);
      if (diff) params.append('difficulty', diff);
      if (search && search.trim()) params.append('search', search.trim());

      const r = await api(`/api/assessment/question-bank?${params.toString()}`);
      const data = await r.json();
      setQbQuestions(Array.isArray(data.questions) ? data.questions : []);
      setQbTotal(data.total || 0);
      setQbPage(data.page || 1);
      if (data.stats) setQbStats(data.stats);
      if (data.topics) setQbTopics(data.topics);
    } catch (err) {
      console.error('Fetch Question Bank Error:', err);
    } finally {
      setQbLoading(false);
    }
  };

  /* ── Database Health & Settings Handlers ── */
  const fetchDbStatus = async () => {
    try {
      const r = await api('/api/assessment/admin/database/status');
      const data = await r.json();
      if (data.success && data.status) {
        setDbStatus(data.status);
        setDbForm(prev => ({
          ...prev,
          host: data.status.host || 'localhost',
          port: data.status.port || 3306,
          database: data.status.database || 'pranidha_school',
          user: data.status.user || 'root'
        }));
      }
    } catch (err) {
      console.warn('Error fetching DB status:', err);
    }
  };

  const testDbConnection = async () => {
    setTestingDb(true);
    setDbMessage({ type: '', text: '' });
    try {
      const r = await api('/api/assessment/admin/database/test', {
        method: 'POST',
        body: JSON.stringify(dbForm)
      });
      const data = await r.json();
      if (data.success) {
        setDbMessage({ type: 'success', text: data.message });
      } else {
        setDbMessage({ type: 'error', text: data.message || 'Connection test failed.' });
      }
    } catch (err) {
      setDbMessage({ type: 'error', text: 'Network error: ' + err.message });
    } finally {
      setTestingDb(false);
    }
  };

  const connectDatabase = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setConnectingDb(true);
    setDbMessage({ type: '', text: '' });
    try {
      const r = await api('/api/assessment/admin/database/connect', {
        method: 'POST',
        body: JSON.stringify(dbForm)
      });
      const data = await r.json();
      if (data.success) {
        setDbMessage({ type: 'success', text: data.message });
        if (data.status) setDbStatus(data.status);
        Swal.fire({
          icon: 'success',
          title: 'Connected to Hostinger MySQL!',
          text: data.message,
          timer: 2500,
          showConfirmButton: false
        });
        fetchAll();
      } else {
        setDbMessage({ type: 'error', text: data.message || 'Failed to connect.' });
      }
    } catch (err) {
      setDbMessage({ type: 'error', text: 'Connection error: ' + err.message });
    } finally {
      setConnectingDb(false);
    }
  };

  const syncAllAssessmentsToDb = async () => {
    setSyncingDb(true);
    setDbMessage({ type: '', text: '' });
    try {
      const r = await api('/api/assessment/admin/database/sync', { method: 'POST' });
      const data = await r.json();
      if (data.success) {
        setDbMessage({ type: 'success', text: data.message });
        Swal.fire({
          icon: 'success',
          title: 'Sync Complete!',
          text: data.message,
          timer: 2000,
          showConfirmButton: false
        });
        fetchAll();
      } else {
        setDbMessage({ type: 'error', text: data.message || 'Sync failed.' });
      }
    } catch (err) {
      setDbMessage({ type: 'error', text: 'Sync error: ' + err.message });
    } finally {
      setSyncingDb(false);
    }
  };

  /* ── fetch everything ── */
  const fetchAll = async () => {
    setLoading(true);
    fetchDbStatus();
    try {
      const [tRes, sRes, cRes] = await Promise.all([
        api('/api/assessment/admin/list'),
        api('/api/assessment/admin/stats'),
        api('/api/assessment/admin/candidates-pool'),
      ]);
      const testsData = await tRes.json();
      const statsData = await sRes.json();
      const poolData  = await cRes.json();
      const loadedTests = Array.isArray(testsData) ? testsData : [];
      setTests(loadedTests);
      try { localStorage.setItem('appletree_cached_assessments', JSON.stringify(loadedTests)); } catch (e) {}
      setStats(statsData || {});
      setCandidatePool(Array.isArray(poolData) ? poolData : []);

      if (loadedTests.length > 0 && !qbTargetTestId) {
        setQbTargetTestId(loadedTests[0]._id);
      }

      // If a test is selected, refresh its details
      if (selTest) {
        const refreshed = loadedTests.find(t => t._id === selTest._id);
        if (refreshed) setSelTest(refreshed);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    fetchQuestionBank(1);
    fetchDbStatus();
  }, []);

  useEffect(() => {
    if (selTest?._id) {
      setQbTargetTestId(selTest._id);
    }
  }, [selTest]);

  /* ── question bank selection helpers ── */
  const toggleSelectQuestion = (q) => {
    const qid = q._id || q.id;
    setQbSelected(prev => {
      const next = { ...prev };
      if (next[qid]) {
        delete next[qid];
      } else {
        next[qid] = q;
      }
      return next;
    });
  };

  const toggleSelectAllCurrentPage = () => {
    const allSelected = qbQuestions.length > 0 && qbQuestions.every(q => !!qbSelected[q._id || q.id]);
    if (allSelected) {
      setQbSelected(prev => {
        const next = { ...prev };
        qbQuestions.forEach(q => delete next[q._id || q.id]);
        return next;
      });
    } else {
      setQbSelected(prev => {
        const next = { ...prev };
        qbQuestions.forEach(q => { next[q._id || q.id] = q; });
        return next;
      });
    }
  };

  /* ── batch add questions to assessment ── */
  const handleBatchAddToTest = async (targetId, specificQuestions) => {
    const list = specificQuestions || Object.values(qbSelected);
    if (!targetId) {
      Swal.fire({
        icon: 'warning',
        title: 'Select Assessment Test',
        text: 'Please choose which assessment exam to add these questions into.'
      });
      return;
    }
    if (!list || list.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Questions Selected',
        text: 'Please select one or more questions using the checkboxes.'
      });
      return;
    }

    try {
      const r = await api(`/api/assessment/admin/${targetId}/questions/batch`, {
        method: 'POST',
        body: JSON.stringify({ questions: list })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Failed to add questions');

      const targetTestObj = tests.find(t => t._id === targetId);
      const testName = targetTestObj ? targetTestObj.title : 'Assessment';

      Swal.fire({
        icon: 'success',
        title: 'Questions Added Successfully!',
        text: `Added ${data.addedCount} ready-made question(s) to "${testName}". Total test questions: ${data.total}`,
        timer: 2500,
        showConfirmButton: true,
        confirmButtonColor: '#10b981',
        confirmButtonText: 'View Exam Questions'
      }).then((result) => {
        if (result.isConfirmed && targetTestObj) {
          setSelTest(targetTestObj);
          setTab('questions');
          setQbSubTab('manager');
        }
      });

      // Clear selection
      setQbSelected({});

      // Refresh tests
      const tRes = await api('/api/assessment/admin/list');
      const testsData = await tRes.json();
      if (Array.isArray(testsData)) {
        setTests(testsData);
        if (selTest && selTest._id === targetId) {
          const refreshed = testsData.find(t => t._id === targetId);
          if (refreshed) setSelTest(refreshed);
        }
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error Adding Questions', text: err.message });
    }
  };

  /* ── quick add random sample ── */
  const handleQuickAddSample = async (targetId, count, topic, diff) => {
    if (!targetId) {
      Swal.fire({
        icon: 'warning',
        title: 'Select Assessment Test',
        text: 'Please choose which assessment exam to add questions into.'
      });
      return;
    }
    setQuickAddBusy(true);
    try {
      const r = await api('/api/assessment/question-bank/sample', {
        method: 'POST',
        body: JSON.stringify({ count: Number(count) || 10, topic, difficulty: diff })
      });
      const data = await r.json();
      if (!data.questions || data.questions.length === 0) {
        Swal.fire({ icon: 'info', title: 'No Questions Found', text: 'No questions matched your filter criteria.' });
        return;
      }
      await handleBatchAddToTest(targetId, data.questions);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Quick Pick Error', text: err.message });
    } finally {
      setQuickAddBusy(false);
    }
  };

  /* ── create test ── */
  const createTest = async (e) => {
    e.preventDefault();
    let initialQuestions = [];
    if (newTestPrepopulate !== 'none') {
      try {
        let sampleReq = { count: 10 };
        if (newTestPrepopulate === '10-mixed') sampleReq = { count: 10 };
        else if (newTestPrepopulate === '20-mixed') sampleReq = { count: 20 };
        else if (newTestPrepopulate === '10-easy') sampleReq = { count: 10, difficulty: 'easy' };
        else if (newTestPrepopulate === '10-medium') sampleReq = { count: 10, difficulty: 'medium' };
        else if (newTestPrepopulate === '10-hard') sampleReq = { count: 10, difficulty: 'hard' };
        else if (newTestPrepopulate === '15-oop') sampleReq = { count: 15, topic: 'OOP Concepts' };
        else if (newTestPrepopulate === '15-collections') sampleReq = { count: 15, topic: 'Collections Framework' };

        const rSample = await api('/api/assessment/question-bank/sample', {
          method: 'POST',
          body: JSON.stringify(sampleReq)
        });
        const dSample = await rSample.json();
        if (Array.isArray(dSample.questions)) {
          initialQuestions = dSample.questions;
        }
      } catch (err) {
        console.warn('Failed to pre-sample questions:', err);
      }
    }

    const payload = { ...tf, questions: initialQuestions };
    const r = await api('/api/assessment/admin/create', { method: 'POST', body: JSON.stringify(payload) });
    const d = await r.json();
    if (!r.ok) { Swal.fire({ icon: 'error', title: 'Error', text: d.error }); return; }

    // Instant optimistic update so the test NEVER disappears even for a frame
    if (d.assessment) {
      setTests(prev => {
        const next = [d.assessment, ...prev.filter(t => t._id !== d.assessment._id)];
        try { localStorage.setItem('appletree_cached_assessments', JSON.stringify(next)); } catch (e) {}
        return next;
      });
      if (!qbTargetTestId) {
        setQbTargetTestId(d.assessment._id);
      }
    }

    Swal.fire({
      icon: 'success',
      title: 'Assessment Created & Saved to Database!',
      text: initialQuestions.length > 0 
        ? `Created assessment with ${initialQuestions.length} ready-made Java questions loaded!` 
        : 'Assessment saved to Hostinger MySQL database successfully.',
      timer: 2000,
      showConfirmButton: false
    });
    setShowNewTest(false);
    setNewTestPrepopulate('none');
    setTf({
      title: '', description: '', jobTitle: 'General', duration: 30,
      passingScore: 50, maxAttempts: 1, shuffleQuestions: true,
      shuffleOptions: true, showResult: true, scheduledAt: '', expiresAt: '',
      accessPassword: ''
    });
    fetchAll();
  };

  /* ── delete test ── */
  const deleteTest = async (id) => {
    const r = await Swal.fire({
      icon: 'warning',
      title: 'Delete Test?',
      text: 'All questions, student registrations, and attempts for this test will also be deleted.',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
    });
    if (!r.isConfirmed) return;

    // Immediately remove from state and cache so it never flickers back
    setTests(prev => {
      const next = (prev || []).filter(t => String(t._id || t.id) !== String(id));
      try { localStorage.setItem('appletree_cached_assessments', JSON.stringify(next)); } catch (e) {}
      return next;
    });
    if (selTest?._id === id || selTest?.id === id) setSelTest(null);

    try {
      const res = await api(`/api/assessment/admin/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Failed to delete test');
      }
      Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Delete Failed', text: err.message });
    } finally {
      fetchAll();
    }
  };

  /* ── add question ── */
  const addQuestion = async (e) => {
    e.preventDefault();
    if (!selTest) return;
    const payload = {
      ...qf,
      options: qf.type === 'mcq' ? qf.options.filter(Boolean) : [],
    };
    if (qf.type === 'mcq' && !payload.correct) {
      Swal.fire({ icon: 'warning', title: 'Correct Option Required', text: 'Please enter the exact correct answer.', confirmButtonColor: '#0ea5e9' });
      return;
    }
    if (!payload.correct) payload.correct = '';
    const r = await api(`/api/assessment/admin/${selTest._id}/question`, { method: 'POST', body: JSON.stringify(payload) });
    const d = await r.json();
    if (!r.ok) { Swal.fire({ icon: 'error', title: 'Error', text: d.error }); return; }
    Swal.fire({ icon: 'success', title: 'Question Added!', timer: 1500, showConfirmButton: false });
    setQf({ text: '', type: 'mcq', options: ['', '', '', ''], correct: '', marks: 1, difficulty: 'medium', topic: '', modelAnswer: '', sqlSchema: '', sqlExpected: '', sqlHint: '', explanation: '' });
    
    // Refresh selected test
    const updated = await api(`/api/assessment/admin/${selTest._id}`).then(r2 => r2.json());
    setSelTest(updated);
    fetchAll();
  };

  /* ── delete question ── */
  const deleteQuestion = async (qid) => {
    await api(`/api/assessment/admin/${selTest._id}/question/${qid}`, { method: 'DELETE' });
    const updated = await api(`/api/assessment/admin/${selTest._id}`).then(r => r.json());
    setSelTest(updated);
    fetchAll();
  };

  /* ── invite candidates (NO EMAIL) ── */
  const inviteCandidateById = async (candidateId, name) => {
    const r = await api(`/api/assessment/admin/${selTest._id}/invite`, {
      method: 'POST',
      body: JSON.stringify({ candidateIds: [candidateId] }),
    });
    const d = await r.json();
    if (!r.ok) { Swal.fire({ icon: 'error', title: 'Error', text: d.error }); return; }
    Swal.fire({ icon: 'success', title: 'Candidate Invited!', text: `Access code generated for ${name}. No email sent.`, timer: 2000, showConfirmButton: false });
    const updated = await api(`/api/assessment/admin/${selTest._id}`).then(r2 => r2.json());
    setSelTest(updated);
    fetchAll();
  };

  const inviteCandidateManual = async (e) => {
    e.preventDefault();
    if (!manualEmail.trim()) return;
    const r = await api(`/api/assessment/admin/${selTest._id}/invite`, {
      method: 'POST',
      body: JSON.stringify({
        candidates: [{
          name: manualName.trim() || 'Candidate',
          email: manualEmail.trim(),
          dob: manualDob.trim()
        }]
      }),
    });
    const d = await r.json();
    if (!r.ok) { Swal.fire({ icon: 'error', title: 'Error', text: d.error }); return; }
    Swal.fire({ icon: 'success', title: 'Candidate Added!', text: `Access code generated. No email sent.`, timer: 2000, showConfirmButton: false });
    setManualName('');
    setManualEmail('');
    setManualDob('');
    const updated = await api(`/api/assessment/admin/${selTest._id}`).then(r2 => r2.json());
    setSelTest(updated);
    fetchAll();
  };

  const removeInvite = async (email) => {
    await api(`/api/assessment/admin/${selTest._id}/invite/${encodeURIComponent(email)}`, { method: 'DELETE' });
    const updated = await api(`/api/assessment/admin/${selTest._id}`).then(r => r.json());
    setSelTest(updated);
    fetchAll();
  };

  /* ── reports ── */
  const loadAttempts = async (testId) => {
    const r = await api(`/api/assessment/admin/${testId}/attempts`);
    const data = await r.json();
    setAttempts(Array.isArray(data) ? data : []);
    setTab('reports');
  };

  const handleRegrade = async (testId) => {
    setRegrading(true);
    try {
      const r = await api(`/api/assessment/admin/${testId}/regrade`, { method: 'POST' });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Failed to regrade attempts');
      Swal.fire({
        icon: 'success',
        title: 'Scores Re-Graded & Synchronized!',
        text: data.message || 'All student scores recalculated and updated in Hostinger MySQL.',
        timer: 2500,
        showConfirmButton: false
      });
      if (Array.isArray(data.attempts)) {
        setAttempts(data.attempts);
      } else {
        await loadAttempts(testId);
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Re-Grading Error', text: err.message });
    } finally {
      setRegrading(false);
    }
  };

  /* ── certificate actions ── */
  const handleSendCertificate = async (attempt) => {
    setSendingCertId(attempt._id);
    try {
      const studentName = attempt.candidate?.name || attempt.candidateName || 'Student';
      const r = await api('/api/assessment/admin/send-certificate', {
        method: 'POST',
        body: JSON.stringify({
          attemptId: attempt._id,
          assessmentId: selTest?._id || attempt.assessment,
          customStudentName: studentName
        })
      });
      const data = await r.json();
      if (!r.ok) {
        throw new Error(data.error || 'Failed to issue certificate');
      }

      // Update attempt in local state
      setAttempts(prev => prev.map(a => 
        a._id === attempt._id 
          ? { ...a, certificateNumber: data.certificate.certificateNumber, certificateIssued: true } 
          : a
      ));

      setSelectedCert(data.certificate);
      setShowCertModal(true);

      Swal.fire({
        icon: 'success',
        title: '🎓 Certificate Issued!',
        html: `
          <div style="text-align:left; font-size:14px; line-height:1.6;">
            <p><strong>Candidate:</strong> ${studentName}</p>
            <p><strong>Certificate No:</strong> <span style="font-family:monospace; color:#1e3a8a;">${data.certificate.certificateNumber}</span></p>
            <p><strong>Grade:</strong> <span style="color:#10b981; font-weight:bold;">${data.certificate.grade}</span> (${data.certificate.percentage}%)</p>
            <p style="margin-top:10px; font-size:12.5px; color:#64748b;">${data.emailSent ? '✉️ Email sent to candidate inbox successfully.' : 'Online credential ready for live verification & download.'}</p>
          </div>
        `,
        confirmButtonColor: '#10b981',
        confirmButtonText: 'View Certificate'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Issuance Failed',
        text: err.message
      });
    } finally {
      setSendingCertId(null);
    }
  };

  const handleViewCertificate = async (attempt) => {
    try {
      const r = await api(`/api/assessment/admin/certificate/${attempt._id}`);
      const data = await r.json();
      if (r.ok && data.certificate) {
        setSelectedCert(data.certificate);
        setShowCertModal(true);
      } else {
        handleSendCertificate(attempt);
      }
    } catch (err) {
      handleSendCertificate(attempt);
    }
  };

  /* ── copy link & credentials ── */
  const copyRegistrationLink = (testId) => {
    const url = `${window.location.origin}/test/${testId}/register`;
    navigator.clipboard.writeText(url).then(() =>
      Swal.fire({
        icon: 'success',
        title: '📋 Student Registration Link Copied!',
        text: `Share this form link with your students:\n${url}\n\nStudents will fill their details (Name, Email, Phone, College) to register before entering the exam.`,
        confirmButtonColor: '#059669',
        confirmButtonText: 'Great!'
      })
    );
  };

  const copyTestLink = (id) => {
    const url = `${window.location.origin}/test/${id}`;
    navigator.clipboard.writeText(url).then(() =>
      Swal.fire({ icon: 'success', title: '🔗 Direct Exam Gate Link Copied!', text: url, timer: 2000, showConfirmButton: false })
    );
  };

  const copyPassword = (pwd) => {
    if (!pwd) return;
    navigator.clipboard.writeText(pwd).then(() =>
      Swal.fire({ icon: 'success', title: '🔑 Exam Password Copied!', text: `Password: ${pwd}`, timer: 1500, showConfirmButton: false })
    );
  };

  const copyCode = (code, email) => {
    navigator.clipboard.writeText(code).then(() =>
      Swal.fire({ icon: 'success', title: 'Access Code Copied!', text: `Code ${code} for ${email} copied to clipboard`, timer: 1500, showConfirmButton: false })
    );
  };

  const copyInvitationDetails = (testId, code, email) => {
    const url = `${window.location.origin}/test/${testId}`;
    const text = `Online Examination Details:\nExam Link: ${url}\nCandidate Email: ${email}\nAccess Code: ${code}`;
    navigator.clipboard.writeText(text).then(() =>
      Swal.fire({ icon: 'success', title: 'Invitation Copied!', text: 'Link and access code copied to clipboard ready to share.', timer: 2000, showConfirmButton: false })
    );
  };

  /* ══════════════════════════════════════════
     CSS
  ══════════════════════════════════════════ */
  const CSS = `
    .aa-shell{min-height:100vh;background:#f1f5f9;font-family:inherit;}
    .aa-nav{background:linear-gradient(135deg,#0f172a,#1e3a5f);padding:0.85rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;}
    .aa-nav-title{color:white;font-weight:800;font-size:1.15rem;display:flex;align-items:center;gap:0.5rem;}
    .aa-tabs{display:flex;gap:0.5rem;flex-wrap:wrap;}
    .aa-tab{padding:0.55rem 1.1rem;border-radius:8px;border:none;cursor:pointer;font-weight:700;font-size:0.85rem;font-family:inherit;transition:all 0.18s;background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);}
    .aa-tab.active{background:white;color:#0f172a;box-shadow:0 2px 8px rgba(0,0,0,0.15);}
    .aa-body{max-width:1200px;margin:0 auto;padding:1.5rem;}
    .aa-stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:1.5rem;}
    .aa-stat{background:white;border-radius:14px;padding:1.25rem;border-left:4px solid;box-shadow:0 2px 12px rgba(0,0,0,0.05);}
    .aa-card{background:white;border-radius:16px;padding:1.5rem;box-shadow:0 2px 12px rgba(0,0,0,0.05);margin-bottom:1.25rem;border:1px solid #e2e8f0;}
    .aa-test-item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem 1.25rem;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:0.65rem;flex-wrap:wrap;}
    .aa-badge{display:inline-block;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.72rem;font-weight:700;}
    .aa-input{border:1.5px solid #e2e8f0;border-radius:10px;padding:0.65rem 0.9rem;font-family:inherit;font-size:0.9rem;width:100%;outline:none;background:#f8fafc;transition:border-color 0.18s;box-sizing:border-box;}
    .aa-input:focus{border-color:#0ea5e9;background:white;}
    .aa-label{font-size:0.78rem;font-weight:700;color:#374151;margin-bottom:0.3rem;display:block;}
    .aa-grid2{display:grid;grid-template-columns:1fr 1fr;gap:0.85rem;}
    .aa-grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.85rem;}
    .aa-btn{padding:0.6rem 1.2rem;border-radius:9px;border:none;cursor:pointer;font-weight:700;font-size:0.85rem;font-family:inherit;transition:all 0.18s;display:inline-flex;align-items:center;justify-content:center;gap:0.35rem;}
    .aa-btn-primary{background:linear-gradient(135deg,#0ea5e9,#0369a1);color:white;box-shadow:0 3px 12px rgba(14,165,233,0.3);}
    .aa-btn-danger{background:rgba(239,68,68,0.1);color:#dc2626;border:1px solid rgba(239,68,68,0.25);}
    .aa-btn-success{background:linear-gradient(135deg,#10b981,#059669);color:white;}
    .aa-btn-outline{background:white;border:1.5px solid #e2e8f0;color:#475569;}
    .aa-btn-outline:hover{border-color:#0ea5e9;color:#0ea5e9;}
    .aa-section-title{font-size:0.75rem;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:1rem;padding-bottom:0.5rem;border-bottom:2px solid #f1f5f9;}
    .aa-q-item{display:flex;align-items:flex-start;gap:0.85rem;padding:0.85rem;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:0.5rem;}
    .aa-violation{display:inline-flex;align-items:center;gap:0.3rem;padding:0.2rem 0.5rem;border-radius:6px;background:#fef3c7;color:#92400e;font-size:0.75rem;font-weight:700;}
    .aa-sql-runner{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;}
    .aa-sql-textarea{width:100%;box-sizing:border-box;border:1.5px solid #334155;border-radius:10px;padding:0.85rem;font-family:monospace;font-size:0.84rem;line-height:1.65;background:#0f172a;color:#e2e8f0;resize:vertical;outline:none;min-height:200px;}
    .aa-sql-textarea:focus{border-color:#0ea5e9;}
    .aa-sql-table{width:100%;border-collapse:collapse;font-size:0.85rem;}
    .aa-sql-table th{background:#f1f5f9;padding:0.55rem 0.85rem;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0;white-space:nowrap;}
    .aa-sql-table td{padding:0.55rem 0.85rem;border-bottom:1px solid #f1f5f9;color:#0f172a;}
    .aa-sql-table tr:hover td{background:#f8fafc;}
    @media(max-width:640px){
      .aa-grid2,.aa-grid3,.aa-sql-runner{grid-template-columns:1fr;}
      .aa-test-item{flex-direction:column;align-items:flex-start;}
    }
  `;

  return (
    <div className="aa-shell">
      <style>{CSS}</style>

      {/* ── Nav ── */}
      <div className="aa-nav">
        <div className="aa-nav-title">
          <span>🧪</span> Assessment Management System
        </div>
        <div className="aa-tabs">
          {[
            ['tests',      '📋 Tests'],
            ['questions',  '📝 Question Bank'],
            ['candidates', '👥 Candidates'],
            ['reports',    '📊 Reports'],
            ['sql-runner', '🗄️ SQL Runner'],
          ].map(([id, label]) => (
            <button key={id} className={`aa-tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button 
            type="button"
            className="aa-btn" 
            style={{ background: 'linear-gradient(135deg, #f59e0b, #eab308)', color: '#0f172a', fontWeight: 'bold' }} 
            onClick={() => navigate('/dashboard/admin/kbc')}
          >
            🏆 KBC Live Host
          </button>
          <button className="aa-btn aa-btn-outline" onClick={() => navigate('/portal/admin')}>
            <LogOut size={14} /> Back to Portal
          </button>
        </div>
      </div>

      <div className="aa-body">

        {/* ── Stats ── */}
        <div className="aa-stat-grid">
          {[
            { label: 'Total Tests',    value: tests.length,               color: '#0ea5e9' },
            { label: 'Total Attempts', value: stats.totalAttempts ?? 0,   color: '#f59e0b' },
            { label: 'Passed',         value: stats.passedAttempts ?? 0,  color: '#10b981' },
            { label: 'Candidate Pool', value: candidatePool.length,       color: '#8b5cf6' },
          ].map(s => (
            <div key={s.label} className="aa-stat" style={{ borderLeftColor: s.color }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>{s.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════
            TESTS TAB
        ══════════════════════════════════════ */}
        {tab === 'tests' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.25rem', margin: 0 }}>📋 All Assessments</h2>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="aa-btn aa-btn-primary" onClick={() => setShowNewTest(v => !v)}>
                  {showNewTest ? <ChevronUp size={16} /> : <PlusCircle size={16} />}
                  {showNewTest ? 'Hide Form' : 'Create New Test'}
                </button>
              </div>
            </div>

            {/* Create test form */}
            {showNewTest && (
              <div className="aa-card" style={{ marginBottom: '1.25rem' }}>
                <div className="aa-section-title">➕ New Assessment</div>
                <form onSubmit={createTest}>
                  <div className="aa-grid2" style={{ marginBottom: '0.85rem' }}>
                    <div>
                      <label className="aa-label">Title *</label>
                      <input className="aa-input" required value={tf.title} onChange={e => setTf(f => ({ ...f, title: e.target.value }))} placeholder="e.g. MERN Full Stack Assessment" />
                    </div>
                    <div>
                      <label className="aa-label">Category / Subject</label>
                      <input className="aa-input" value={tf.jobTitle} onChange={e => setTf(f => ({ ...f, jobTitle: e.target.value }))} placeholder="e.g. Computer Science / Class 10" />
                    </div>
                  </div>

                  {/* Exam Access Password */}
                  <div style={{ marginBottom: '0.85rem', background: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <label className="aa-label" style={{ color: '#0f172a' }}>
                      🔑 Exam Access Password * <span style={{ fontWeight: 400, color: '#64748b' }}>(Students enter their registered email & this password to take the test)</span>
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                      <input
                        className="aa-input"
                        required
                        value={tf.accessPassword}
                        onChange={e => setTf(f => ({ ...f, accessPassword: e.target.value.toUpperCase() }))}
                        placeholder="e.g. JAVA@PASS2026"
                        style={{ fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}
                      />
                      <button
                        type="button"
                        className="aa-btn aa-btn-outline"
                        style={{ padding: '0 1rem', flexShrink: 0, fontWeight: 700, fontSize: '0.82rem' }}
                        onClick={() => setTf(f => ({ ...f, accessPassword: `EXAM${Math.floor(1000 + Math.random() * 9000)}` }))}
                      >
                        🎲 Auto-Generate
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <label className="aa-label">Description</label>
                    <textarea className="aa-input" style={{ minHeight: '70px' }} value={tf.description} onChange={e => setTf(f => ({ ...f, description: e.target.value }))} placeholder="Assessment syllabus, instructions, or candidate guidelines..." />
                  </div>
                  <div className="aa-grid3" style={{ marginBottom: '0.85rem' }}>
                    <div>
                      <label className="aa-label">Duration (minutes)</label>
                      <input type="number" className="aa-input" value={tf.duration} min={5} max={180} onChange={e => setTf(f => ({ ...f, duration: +e.target.value }))} />
                    </div>
                    <div>
                      <label className="aa-label">Passing Score (%)</label>
                      <input type="number" className="aa-input" value={tf.passingScore} min={1} max={100} onChange={e => setTf(f => ({ ...f, passingScore: +e.target.value }))} />
                    </div>
                    <div>
                      <label className="aa-label">Max Attempts Allowed</label>
                      <input type="number" className="aa-input" value={tf.maxAttempts} min={1} max={5} onChange={e => setTf(f => ({ ...f, maxAttempts: +e.target.value }))} />
                    </div>
                  </div>
                  <div className="aa-grid2" style={{ marginBottom: '0.85rem' }}>
                    <div>
                      <label className="aa-label">Scheduled Start (Optional)</label>
                      <input type="datetime-local" className="aa-input" value={tf.scheduledAt} onChange={e => setTf(f => ({ ...f, scheduledAt: e.target.value }))} />
                    </div>
                    <div>
                      <label className="aa-label">Expires At (Optional)</label>
                      <input type="datetime-local" className="aa-input" value={tf.expiresAt} onChange={e => setTf(f => ({ ...f, expiresAt: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {[['shuffleQuestions', 'Shuffle Questions'], ['shuffleOptions', 'Shuffle Options'], ['showResult', 'Show Result to Candidate Immediately']].map(([k, l]) => (
                      <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>
                        <input type="checkbox" checked={tf[k]} onChange={e => setTf(f => ({ ...f, [k]: e.target.checked }))} /> {l}
                      </label>
                    ))}
                  </div>

                  {/* ── Ready-Made Questions Quick Pre-Population ── */}
                  <div style={{ marginBottom: '1.25rem', background: '#f0fdf4', padding: '1rem 1.25rem', borderRadius: '12px', border: '1.5px solid #86efac' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <Sparkles size={16} color="#16a34a" />
                      <label className="aa-label" style={{ color: '#166534', margin: 0, fontSize: '0.86rem' }}>
                        Ready-Made Questions (Auto-populate from 1,000+ Java Question Bank)
                      </label>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#15803d', margin: '0 0 0.6rem 0', lineHeight: 1.4 }}>
                      Choose whether you want this exam to start with ready-made Java questions automatically, or start empty so you can manually add custom questions / pick questions from the question bank later.
                    </p>
                    <select
                      className="aa-input"
                      value={newTestPrepopulate}
                      onChange={e => setNewTestPrepopulate(e.target.value)}
                      style={{ background: 'white', borderColor: '#86efac', fontWeight: 600, color: '#0f172a' }}
                    >
                      <option value="none">✍️ Start with empty test (I will add questions manually or pick from bank later)</option>
                      <option value="10-mixed">⚡ Auto-Add 10 Random Java MCQs (Mixed Topics & Difficulty)</option>
                      <option value="20-mixed">⚡ Auto-Add 20 Random Java MCQs (Mixed Topics & Difficulty)</option>
                      <option value="10-easy">⚡ Auto-Add 10 Easy Java MCQs (Core Java, Basics, OOP)</option>
                      <option value="10-medium">⚡ Auto-Add 10 Medium Java MCQs (Exceptions, Collections, Streams)</option>
                      <option value="10-hard">⚡ Auto-Add 10 Hard Java MCQs (Concurrency, Multithreading, JVM Memory)</option>
                      <option value="15-oop">⚡ Auto-Add 15 Questions on OOP Concepts (Inheritance, Polymorphism, etc.)</option>
                      <option value="15-collections">⚡ Auto-Add 15 Questions on Java Collections Framework (List, Map, Set)</option>
                    </select>
                  </div>

                  <button type="submit" className="aa-btn aa-btn-primary">
                    <CheckCircle size={16} /> Save & Create Assessment
                  </button>
                </form>
              </div>
            )}

            {/* Tests list */}
            {loading
              ? <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>⏳ Loading assessments...</div>
              : tests.length === 0
                ? <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No assessments created yet. Click "Create New Test" above.</div>
                : tests.map(t => (
                  <div key={t._id} className="aa-test-item">
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                        <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>{t.title}</span>
                        <span className="aa-badge" style={{ background: t.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: t.isActive ? '#10b981' : '#ef4444' }}>
                          {t.isActive ? '● Active' : '● Inactive'}
                        </span>
                        <span className="aa-badge" style={{ background: 'rgba(14,165,233,0.1)', color: '#0369a1' }}>{t.questions?.length ?? 0} Questions</span>
                        <span className="aa-badge" style={{ background: 'rgba(139,92,246,0.1)', color: '#7c3aed' }}>{t.invitedCandidates?.length ?? 0} Registered</span>

                        {/* Password Badge with Copy */}
                        <span
                          onClick={() => copyPassword(t.accessPassword || 'RANCOM@2026')}
                          title="Click to copy exam password"
                          style={{ cursor: 'pointer', background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          🔑 Pwd: <strong style={{ letterSpacing: '0.05em' }}>{t.accessPassword || 'RANCOM@2026'}</strong> 📋
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        {t.jobTitle || 'General'} · ⏱️ {t.duration} min · 🎯 Pass: {t.passingScore}% · Max attempts: {t.maxAttempts}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {/* 1. Share Form Link (Sends to Students to Fill Info) */}
                      <button
                        className="aa-btn"
                        style={{ background: '#059669', color: 'white', fontWeight: 800 }}
                        onClick={() => copyRegistrationLink(t._id)}
                        title="Copy student registration form link to share on WhatsApp/Telegram"
                      >
                        <ClipboardList size={13} /> Share Form
                      </button>

                      {/* 2. Copy Direct Exam Gate Link */}
                      <button
                        className="aa-btn aa-btn-outline"
                        style={{ borderColor: '#0284c7', color: '#0284c7', fontWeight: 700 }}
                        onClick={() => copyTestLink(t._id)}
                        title="Copy direct exam gate link"
                      >
                        <Copy size={13} /> Exam Link
                      </button>

                      <button className="aa-btn aa-btn-outline" onClick={() => { setSelTest(t); setTab('questions'); }}>
                        <Edit size={13} /> Questions
                      </button>
                      <button className="aa-btn aa-btn-outline" onClick={() => { setSelTest(t); setTab('candidates'); }}>
                        <Users size={13} /> Candidates ({t.invitedCandidates?.length ?? 0})
                      </button>
                      <button className="aa-btn aa-btn-success" onClick={() => { loadAttempts(t._id); setSelTest(t); }}>
                        <FileText size={13} /> Reports
                      </button>
                      <button className="aa-btn aa-btn-danger" onClick={() => deleteTest(t._id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
            }
          </div>
        )}

        {/* ══════════════════════════════════════
            QUESTION BANK TAB
        ══════════════════════════════════════ */}
        {/* ══════════════════════════════════════
            QUESTION BANK TAB
        ══════════════════════════════════════ */}
        {tab === 'questions' && (
          <div>
            {/* ── Sub-navigation: Question Bank vs Test Question Manager ── */}
            <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  className="aa-btn"
                  style={{
                    background: qbSubTab === 'bank' ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : '#f8fafc',
                    color: qbSubTab === 'bank' ? '#ffffff' : '#334155',
                    border: '1.5px solid',
                    borderColor: qbSubTab === 'bank' ? '#0284c7' : '#cbd5e1',
                    fontWeight: 800,
                    boxShadow: qbSubTab === 'bank' ? '0 2px 8px rgba(14,165,233,0.3)' : 'none',
                    padding: '0.55rem 1.1rem'
                  }}
                  onClick={() => setQbSubTab('bank')}
                >
                  <BookOpen size={16} /> 📚 Java Ready-Made Bank ({qbTotal || '1,090+'} Questions)
                </button>

                <button
                  className="aa-btn"
                  style={{
                    background: qbSubTab === 'manager' ? 'linear-gradient(135deg, #0f172a, #334155)' : '#f8fafc',
                    color: qbSubTab === 'manager' ? '#ffffff' : '#334155',
                    border: '1.5px solid',
                    borderColor: qbSubTab === 'manager' ? '#0f172a' : '#cbd5e1',
                    fontWeight: 800,
                    boxShadow: qbSubTab === 'manager' ? '0 2px 8px rgba(15,23,42,0.2)' : 'none',
                    padding: '0.55rem 1.1rem'
                  }}
                  onClick={() => setQbSubTab('manager')}
                >
                  <ClipboardList size={16} /> ⚙️ Exam Questions Manager {selTest ? `(${selTest.title})` : ''}
                </button>
              </div>

              {selTest && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#eff6ff', padding: '0.35rem 0.85rem', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                  <span style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: 700 }}>
                    Active Exam: <strong>{selTest.title}</strong> ({selTest.questions?.length ?? 0} Qs)
                  </span>
                  <button
                    onClick={() => { setSelTest(null); setQbSubTab('bank'); }}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800 }}
                  >
                    ✕ Clear
                  </button>
                </div>
              )}
            </div>

            {/* ══════════════════════════════════════════════════════════════
                SUB-TAB 1: JAVA READY-MADE QUESTION BANK EXPLORER
            ══════════════════════════════════════════════════════════════ */}
            {qbSubTab === 'bank' && (
              <div>
                {/* ── Banner & Overview ── */}
                <div className="aa-card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', border: 'none', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(14,165,233,0.2)', color: '#38bdf8', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.6rem' }}>
                        <Sparkles size={13} /> 1,090+ CURATED JAVA MCQs REPOSITORY
                      </div>
                      <h2 style={{ fontSize: '1.45rem', fontWeight: 900, margin: '0 0 0.4rem 0', letterSpacing: '-0.02em', color: '#f8fafc' }}>
                        ☕ Java Ready-Made MCQ Question Bank
                      </h2>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, maxWidth: '720px' }}>
                        Browse, search, and filter from hundreds of ready-to-use MCQs across Core Java, OOP, Collections, Concurrency, Streams, Exception Handling, JVM, and Spring Boot. Select individual questions or auto-pick random sets to add directly into your assessment tests.
                      </p>
                    </div>

                    {/* Stats pills */}
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.65rem 1rem', borderRadius: '10px', textAlign: 'center', minWidth: '75px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#38bdf8' }}>{qbStats?.total || 1090}</div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Total MCQs</div>
                      </div>
                      <div style={{ background: 'rgba(16,185,129,0.12)', padding: '0.65rem 1rem', borderRadius: '10px', textAlign: 'center', minWidth: '75px', border: '1px solid rgba(16,185,129,0.3)' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34d399' }}>{qbStats?.difficulties?.easy || 363}</div>
                        <div style={{ fontSize: '0.68rem', color: '#a7f3d0', fontWeight: 700, textTransform: 'uppercase' }}>Easy</div>
                      </div>
                      <div style={{ background: 'rgba(245,158,11,0.12)', padding: '0.65rem 1rem', borderRadius: '10px', textAlign: 'center', minWidth: '75px', border: '1px solid rgba(245,158,11,0.3)' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fbbf24' }}>{qbStats?.difficulties?.medium || 470}</div>
                        <div style={{ fontSize: '0.68rem', color: '#fde68a', fontWeight: 700, textTransform: 'uppercase' }}>Medium</div>
                      </div>
                      <div style={{ background: 'rgba(239,68,68,0.12)', padding: '0.65rem 1rem', borderRadius: '10px', textAlign: 'center', minWidth: '75px', border: '1px solid rgba(239,68,68,0.3)' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f87171' }}>{qbStats?.difficulties?.hard || 261}</div>
                        <div style={{ fontSize: '0.68rem', color: '#fecaca', fontWeight: 700, textTransform: 'uppercase' }}>Hard</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Target Assessment & Batch Action Control Panel ── */}
                <div className="aa-card" style={{ background: '#f8fafc', border: '2px solid #0ea5e9', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: '260px' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>
                        🎯 Target Assessment Exam:
                      </span>
                      <select
                        className="aa-input"
                        value={qbTargetTestId}
                        onChange={e => setQbTargetTestId(e.target.value)}
                        style={{ maxWidth: '380px', fontWeight: 700, borderColor: '#0ea5e9', background: 'white' }}
                      >
                        <option value="">-- Choose destination assessment --</option>
                        {tests.map(t => (
                          <option key={t._id} value={t._id}>
                            {t.title} ({t.questions?.length ?? 0} questions)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Batch Add Button for Checked Questions */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {Object.keys(qbSelected).length > 0 && (
                        <>
                          <button
                            className="aa-btn aa-btn-success"
                            onClick={() => handleBatchAddToTest(qbTargetTestId)}
                            style={{ padding: '0.65rem 1.25rem', fontWeight: 800, boxShadow: '0 3px 10px rgba(16,185,129,0.35)' }}
                          >
                            <CheckCircle size={15} /> Add {Object.keys(qbSelected).length} Selected to Exam
                          </button>
                          <button
                            className="aa-btn aa-btn-outline"
                            onClick={() => setQbSelected({})}
                            style={{ fontSize: '0.78rem' }}
                          >
                            Clear Selection ({Object.keys(qbSelected).length})
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quick Auto-Pick Generator */}
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Sparkles size={14} /> Quick Random Generator:
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Pick</span>
                      <select
                        className="aa-input"
                        value={quickAddCount}
                        onChange={e => setQuickAddCount(Number(e.target.value))}
                        style={{ width: '80px', padding: '0.35rem 0.5rem', height: '34px', fontSize: '0.8rem' }}
                      >
                        <option value={5}>5 Qs</option>
                        <option value={10}>10 Qs</option>
                        <option value={15}>15 Qs</option>
                        <option value={20}>20 Qs</option>
                        <option value={25}>25 Qs</option>
                        <option value={30}>30 Qs</option>
                      </select>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>from</span>
                      <span className="aa-badge" style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: 700 }}>
                        {qbTopic || 'All Topics'}
                      </span>
                      <span className="aa-badge" style={{ background: '#fef3c7', color: '#92400e', fontWeight: 700 }}>
                        {qbDifficulty ? qbDifficulty.toUpperCase() : 'ALL DIFFICULTIES'}
                      </span>
                    </div>

                    <button
                      className="aa-btn aa-btn-primary"
                      disabled={quickAddBusy || !qbTargetTestId}
                      onClick={() => handleQuickAddSample(qbTargetTestId, quickAddCount, qbTopic, qbDifficulty)}
                      style={{ padding: '0.55rem 1.1rem', fontWeight: 800 }}
                      title={!qbTargetTestId ? 'Please select a target exam first' : 'Auto pick random questions and insert into target exam'}
                    >
                      {quickAddBusy ? '⏳ Generating...' : `⚡ Auto-Add ${quickAddCount} Random Qs to Exam`}
                    </button>
                  </div>
                </div>

                {/* ── Search & Filter Controls ── */}
                <div className="aa-card" style={{ marginBottom: '1.25rem', padding: '1.1rem' }}>
                  {/* Search bar + Difficulty filters */}
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ flex: '1 1 300px', position: 'relative' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        className="aa-input"
                        placeholder="Search Java questions, concepts, code keywords (e.g. synchronized, stream, lambda, override)..."
                        value={qbSearch}
                        onChange={e => {
                          setQbSearch(e.target.value);
                          fetchQuestionBank(1, qbTopic, qbDifficulty, e.target.value);
                        }}
                        style={{ paddingLeft: '2.4rem' }}
                      />
                      {qbSearch && (
                        <button
                          onClick={() => {
                            setQbSearch('');
                            fetchQuestionBank(1, qbTopic, qbDifficulty, '');
                          }}
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontWeight: 800 }}
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Difficulty selector pills */}
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {[
                        { id: '', label: 'All Levels', count: qbStats?.total },
                        { id: 'easy', label: '🟢 Easy', count: qbStats?.difficulties?.easy },
                        { id: 'medium', label: '🟠 Medium', count: qbStats?.difficulties?.medium },
                        { id: 'hard', label: '🔴 Hard', count: qbStats?.difficulties?.hard },
                      ].map(d => {
                        const active = qbDifficulty === d.id;
                        return (
                          <button
                            key={d.id}
                            className="aa-btn"
                            onClick={() => {
                              setQbDifficulty(d.id);
                              fetchQuestionBank(1, qbTopic, d.id, qbSearch);
                            }}
                            style={{
                              padding: '0.45rem 0.8rem',
                              fontSize: '0.8rem',
                              background: active ? '#0f172a' : '#f1f5f9',
                              color: active ? '#ffffff' : '#334155',
                              border: active ? '1px solid #0f172a' : '1px solid #e2e8f0',
                              fontWeight: active ? 800 : 600
                            }}
                          >
                            {d.label} {d.count ? `(${d.count})` : ''}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Topic Chips */}
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Filter size={12} /> Filter by Java Topic:
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <button
                        className="aa-btn"
                        onClick={() => {
                          setQbTopic('');
                          fetchQuestionBank(1, '', qbDifficulty, qbSearch);
                        }}
                        style={{
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.78rem',
                          borderRadius: '20px',
                          background: qbTopic === '' ? '#0ea5e9' : '#f8fafc',
                          color: qbTopic === '' ? '#ffffff' : '#475569',
                          border: '1px solid',
                          borderColor: qbTopic === '' ? '#0284c7' : '#cbd5e1',
                          fontWeight: qbTopic === '' ? 800 : 600
                        }}
                      >
                        All Topics ({qbStats?.total || 1090})
                      </button>
                      {(qbTopics.length > 0 ? qbTopics : [
                        'Core Java & Basics',
                        'OOP Concepts',
                        'Exception Handling',
                        'Collections Framework',
                        'Multithreading & Concurrency',
                        'Java 8+ Streams & Lambdas',
                        'JVM Architecture & Memory',
                        'Strings & Immutability',
                        'Generics & I/O',
                        'Spring Boot & Microservices'
                      ]).map(t => {
                        const active = qbTopic === t;
                        const count = qbStats?.topics?.[t] ?? '';
                        return (
                          <button
                            key={t}
                            className="aa-btn"
                            onClick={() => {
                              const newTopic = active ? '' : t;
                              setQbTopic(newTopic);
                              fetchQuestionBank(1, newTopic, qbDifficulty, qbSearch);
                            }}
                            style={{
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.78rem',
                              borderRadius: '20px',
                              background: active ? '#0284c7' : '#ffffff',
                              color: active ? '#ffffff' : '#334155',
                              border: '1px solid',
                              borderColor: active ? '#0369a1' : '#e2e8f0',
                              fontWeight: active ? 800 : 600,
                              boxShadow: active ? '0 2px 6px rgba(2,132,199,0.25)' : 'none'
                            }}
                          >
                            {t} {count ? `(${count})` : ''}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ── Question Results Header & Page Info ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                    Showing <strong>{qbQuestions.length === 0 ? 0 : (qbPage - 1) * qbLimit + 1}</strong> – <strong>{Math.min(qbPage * qbLimit, qbTotal)}</strong> of <strong>{qbTotal}</strong> questions
                    {qbTopic && <span> in <span style={{ color: '#0284c7', fontWeight: 800 }}>"{qbTopic}"</span></span>}
                    {qbDifficulty && <span> ({qbDifficulty.toUpperCase()})</span>}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      className="aa-btn aa-btn-outline"
                      onClick={toggleSelectAllCurrentPage}
                      style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
                    >
                      {qbQuestions.length > 0 && qbQuestions.every(q => !!qbSelected[q._id || q.id]) ? (
                        <><Square size={13} /> Deselect All on Page</>
                      ) : (
                        <><CheckSquare size={13} /> Select All on Page ({qbQuestions.length})</>
                      )}
                    </button>
                  </div>
                </div>

                {/* ── Question Cards ── */}
                {qbLoading ? (
                  <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
                    <div style={{ fontWeight: 700 }}>Loading Java questions...</div>
                  </div>
                ) : qbQuestions.length === 0 ? (
                  <div className="aa-card" style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                    <BookOpen size={44} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>No Questions Found</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>Try clearing your search query or choosing a different topic or difficulty filter.</p>
                    <button
                      className="aa-btn aa-btn-primary"
                      onClick={() => {
                        setQbSearch('');
                        setQbTopic('');
                        setQbDifficulty('');
                        fetchQuestionBank(1, '', '', '');
                      }}
                      style={{ marginTop: '1rem' }}
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  qbQuestions.map((q, idx) => {
                    const qid = q._id || q.id || `q-${idx}`;
                    const isChecked = !!qbSelected[qid];
                    const isExplanationOpen = !!expandedExplanations[qid];
                    const globalIdx = (qbPage - 1) * qbLimit + idx + 1;

                    return (
                      <div
                        key={qid}
                        className="aa-card"
                        style={{
                          marginBottom: '0.85rem',
                          padding: '1.1rem 1.25rem',
                          border: isChecked ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                          background: isChecked ? '#f0f9ff' : 'white',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                          {/* Checkbox */}
                          <div style={{ paddingTop: '2px' }}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSelectQuestion(q)}
                              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0ea5e9' }}
                            />
                          </div>

                          {/* Content */}
                          <div style={{ flex: 1 }}>
                            {/* Badges Bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.78rem', color: '#64748b' }}>
                                #{globalIdx}
                              </span>
                              <span className="aa-badge" style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd' }}>
                                {q.topic || 'Core Java'}
                              </span>
                              <span
                                className="aa-badge"
                                style={{
                                  background: q.difficulty === 'easy' ? 'rgba(16,185,129,0.1)' : q.difficulty === 'hard' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                                  color: DIFF_COLORS[q.difficulty] || '#6b7280',
                                  fontWeight: 800,
                                  textTransform: 'uppercase'
                                }}
                              >
                                {q.difficulty || 'medium'}
                              </span>
                              <span className="aa-badge" style={{ background: '#f8fafc', color: '#475569' }}>
                                {q.marks || 1} Mark
                              </span>
                            </div>

                            {/* Question text */}
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.96rem', lineHeight: 1.5, marginBottom: '0.75rem', whiteSpace: 'pre-wrap' }}>
                              {q.text}
                            </div>

                            {/* Options A, B, C, D */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.45rem', marginBottom: '0.75rem' }}>
                              {(q.options || []).map((opt, oIdx) => {
                                const letter = String.fromCharCode(65 + oIdx);
                                const isCorrect = q.correct === opt || q.correct === letter || String(q.correct).toLowerCase() === String(opt).toLowerCase();

                                return (
                                  <div
                                    key={oIdx}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.5rem',
                                      padding: '0.5rem 0.75rem',
                                      borderRadius: '8px',
                                      border: isCorrect ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                                      background: isCorrect ? '#ecfdf5' : '#f8fafc',
                                      fontSize: '0.84rem'
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '6px',
                                        background: isCorrect ? '#10b981' : '#e2e8f0',
                                        color: isCorrect ? '#ffffff' : '#334155',
                                        fontWeight: 800,
                                        fontSize: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                      }}
                                    >
                                      {letter}
                                    </span>
                                    <span style={{ color: isCorrect ? '#065f46' : '#1e293b', fontWeight: isCorrect ? 700 : 500, flex: 1 }}>
                                      {opt}
                                    </span>
                                    {isCorrect && (
                                      <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 800, background: '#d1fae5', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                                        ✓ Correct
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Collapsible Explanation */}
                            {q.explanation && (
                              <div style={{ marginTop: '0.4rem' }}>
                                <button
                                  type="button"
                                  onClick={() => setExpandedExplanations(p => ({ ...p, [qid]: !p[qid] }))}
                                  style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: 0 }}
                                >
                                  {isExplanationOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                  {isExplanationOpen ? 'Hide Explanation' : '💡 View Detailed Explanation & Code Logic'}
                                </button>
                                {isExplanationOpen && (
                                  <div style={{ background: '#f8fafc', borderLeft: '3px solid #0ea5e9', padding: '0.65rem 0.85rem', borderRadius: '0 8px 8px 0', marginTop: '0.4rem', fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                                    <strong>Explanation:</strong> {q.explanation}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Quick Add Single Question Button */}
                          <div style={{ flexShrink: 0 }}>
                            <button
                              className="aa-btn aa-btn-outline"
                              onClick={() => handleBatchAddToTest(qbTargetTestId, [q])}
                              style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, borderColor: '#0ea5e9', color: '#0369a1', background: 'white' }}
                              title="Add this single question directly to the target assessment"
                            >
                              <PlusCircle size={13} /> Add to Exam
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* ── Pagination Controls ── */}
                {qbTotal > qbLimit && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <button
                      className="aa-btn aa-btn-outline"
                      disabled={qbPage <= 1}
                      onClick={() => {
                        const newP = Math.max(1, qbPage - 1);
                        fetchQuestionBank(newP, qbTopic, qbDifficulty, qbSearch);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      style={{ opacity: qbPage <= 1 ? 0.5 : 1 }}
                    >
                      ← Previous
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                      Page {qbPage} of {Math.ceil(qbTotal / qbLimit)}
                    </span>
                    <button
                      className="aa-btn aa-btn-outline"
                      disabled={qbPage >= Math.ceil(qbTotal / qbLimit)}
                      onClick={() => {
                        const newP = qbPage + 1;
                        fetchQuestionBank(newP, qbTopic, qbDifficulty, qbSearch);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      style={{ opacity: qbPage >= Math.ceil(qbTotal / qbLimit) ? 0.5 : 1 }}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                SUB-TAB 2: EXAM QUESTIONS MANAGER (CUSTOM / PER-TEST)
            ══════════════════════════════════════════════════════════════ */}
            {qbSubTab === 'manager' && (
              <div>
                {!selTest ? (
                  <div className="aa-card" style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                    <ClipboardList size={48} style={{ opacity: 0.3, marginBottom: '1rem', margin: '0 auto' }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>Select an Assessment Exam</h3>
                    <p style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                      Choose an existing assessment to manage its questions or add questions manually.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', justifyContent: 'center' }}>
                      {tests.map(t => (
                        <button
                          key={t._id}
                          className="aa-btn aa-btn-outline"
                          onClick={() => {
                            setSelTest(t);
                            setQbTargetTestId(t._id);
                          }}
                          style={{ padding: '0.6rem 1.1rem', fontWeight: 700 }}
                        >
                          📋 {t.title} ({t.questions?.length ?? 0} Qs)
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Header bar for selected exam */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.65rem' }}>
                      <div>
                        <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.25rem', margin: 0 }}>
                          📝 {selTest.title} — Questions
                        </h2>
                        <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
                          {selTest.jobTitle || 'General'} · ⏱️ {selTest.duration} mins · Total Questions: <strong>{selTest.questions?.length ?? 0}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          className="aa-btn aa-btn-primary"
                          onClick={() => {
                            setQbTargetTestId(selTest._id);
                            setQbSubTab('bank');
                          }}
                        >
                          <BookOpen size={14} /> 📚 Pick from Ready-Made Java Bank
                        </button>
                        <button className="aa-btn aa-btn-outline" onClick={() => setSelTest(null)}>
                          Change Assessment
                        </button>
                      </div>
                    </div>

                    {/* ── Mode selector: Manual Question vs Quick Pick ── */}
                    <div className="aa-card" style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                        <div className="aa-section-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                          ➕ Add Questions to {selTest.title}
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            className="aa-btn"
                            onClick={() => setTestQuestionMode('manual')}
                            style={{
                              padding: '0.4rem 0.8rem',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              background: testQuestionMode === 'manual' ? '#0f172a' : '#f8fafc',
                              color: testQuestionMode === 'manual' ? 'white' : '#475569'
                            }}
                          >
                            ✍️ Manual Question Form
                          </button>
                          <button
                            type="button"
                            className="aa-btn"
                            onClick={() => {
                              setQbTargetTestId(selTest._id);
                              setQbSubTab('bank');
                            }}
                            style={{
                              padding: '0.4rem 0.8rem',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              background: '#ecfdf5',
                              color: '#059669',
                              border: '1px solid #a7f3d0'
                            }}
                          >
                            📚 Browse Ready-Made Bank →
                          </button>
                        </div>
                      </div>

                      {/* Manual Form */}
                      {testQuestionMode === 'manual' && (
                        <div>
                          {/* Type selector */}
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                            {[
                              { id: 'mcq',    label: '🔘 Multiple Choice (MCQ)', desc: 'Auto-graded choice question' },
                              { id: 'theory', label: '📝 Theory (Written)',       desc: 'Written long text answer' },
                              { id: 'sql',    label: '🗄️ SQL Execution',         desc: 'In-memory SQL query validator' },
                            ].map(t => (
                              <button key={t.id} type="button"
                                onClick={() => setQf(f => ({ ...f, type: t.id }))}
                                style={{
                                  padding: '0.55rem 1rem', borderRadius: '9px', border: '1.5px solid',
                                  borderColor: qf.type === t.id ? '#0ea5e9' : '#e2e8f0',
                                  background: qf.type === t.id ? '#eff6ff' : '#f8fafc',
                                  color: qf.type === t.id ? '#0369a1' : '#64748b',
                                  fontWeight: qf.type === t.id ? 800 : 600, fontSize: '0.85rem',
                                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s',
                                  textAlign: 'left'
                                }}>
                                {t.label}
                                <div style={{ fontSize: '0.7rem', fontWeight: 500, marginTop: '2px', opacity: 0.75 }}>{t.desc}</div>
                              </button>
                            ))}
                          </div>

                          <form onSubmit={addQuestion}>
                            {/* Question text */}
                            <div style={{ marginBottom: '0.85rem' }}>
                              <label className="aa-label">Question Text *</label>
                              <textarea className="aa-input" required style={{ minHeight: '75px' }}
                                value={qf.text} onChange={e => setQf(f => ({ ...f, text: e.target.value }))}
                                placeholder={
                                  qf.type === 'theory' ? 'e.g. Explain the difference between method overloading and overriding in Java.' :
                                  qf.type === 'sql'    ? 'e.g. Write a SQL query to fetch all employees working in the Engineering department.' :
                                  'Enter the question text...'
                                } />
                            </div>

                            {/* MCQ options */}
                            {qf.type === 'mcq' && (
                              <div style={{ marginBottom: '0.85rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                  <label className="aa-label" style={{ margin: 0 }}>Answer Options</label>
                                  <span style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 600 }}>
                                    💡 Click any letter badge or "Set as Correct" button
                                  </span>
                                </div>
                                {qf.options.map((opt, i) => {
                                  const letter = String.fromCharCode(65 + i);
                                  const isSelected = qf.correct && (
                                    qf.correct.trim().toLowerCase() === opt.trim().toLowerCase() ||
                                    qf.correct.trim().toUpperCase() === letter
                                  );
                                  return (
                                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                                      <button
                                        type="button"
                                        onClick={() => setQf(f => ({ ...f, correct: opt || letter }))}
                                        title={`Click to set Option ${letter} as correct answer`}
                                        style={{
                                          width: '32px',
                                          height: '32px',
                                          borderRadius: '8px',
                                          border: isSelected ? '2px solid #10b981' : '1.5px solid #cbd5e1',
                                          background: isSelected ? '#10b981' : '#f8fafc',
                                          color: isSelected ? '#ffffff' : '#0369a1',
                                          fontWeight: 900,
                                          fontSize: '0.82rem',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          flexShrink: 0,
                                          cursor: 'pointer',
                                          transition: 'all 0.15s'
                                        }}
                                      >
                                        {isSelected ? '✓' : letter}
                                      </button>
                                      <input
                                        className="aa-input"
                                        placeholder={`Option ${i + 1} (${letter})`}
                                        value={opt}
                                        onChange={e => {
                                          const o = [...qf.options];
                                          const oldVal = o[i];
                                          o[i] = e.target.value;
                                          setQf(f => ({
                                            ...f,
                                            options: o,
                                            correct: (f.correct === oldVal || f.correct === letter) ? e.target.value : f.correct
                                          }));
                                        }}
                                        style={{
                                          borderColor: isSelected ? '#10b981' : undefined,
                                          background: isSelected ? '#f0fdf4' : undefined
                                        }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setQf(f => ({ ...f, correct: opt || letter }))}
                                        style={{
                                          padding: '0.35rem 0.65rem',
                                          borderRadius: '6px',
                                          border: isSelected ? '1px solid #10b981' : '1px solid #e2e8f0',
                                          background: isSelected ? '#dcfce7' : '#ffffff',
                                          color: isSelected ? '#15803d' : '#64748b',
                                          fontSize: '0.72rem',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          whiteSpace: 'nowrap'
                                        }}
                                      >
                                        {isSelected ? '✓ Correct Choice' : 'Set as Correct'}
                                      </button>
                                    </div>
                                  );
                                })}
                                <button type="button" onClick={() => setQf(f => ({ ...f, options: [...f.options, ''] }))}
                                  style={{ fontSize: '0.78rem', color: '#0ea5e9', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', padding: '0.2rem 0' }}>
                                  + Add Option
                                </button>
                              </div>
                            )}

                            {/* MCQ correct answer */}
                            {qf.type === 'mcq' && (
                              <div style={{ marginBottom: '0.85rem' }}>
                                <label className="aa-label">
                                  Correct Answer Option <span style={{ color: '#10b981', fontWeight: 700 }}>({qf.correct ? `Selected: ${qf.correct}` : 'None selected yet'})</span>
                                </label>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                  <input
                                    className="aa-input"
                                    required
                                    style={{ flex: '1 1 200px' }}
                                    value={qf.correct}
                                    onChange={e => setQf(f => ({ ...f, correct: e.target.value }))}
                                    placeholder="Type or select the correct answer..."
                                  />
                                  {qf.options.filter(Boolean).map((opt, i) => {
                                    const letter = String.fromCharCode(65 + i);
                                    const isMatch = qf.correct === opt || qf.correct === letter;
                                    return (
                                      <button
                                        key={i}
                                        type="button"
                                        className="aa-btn aa-btn-outline"
                                        style={{
                                          padding: '0.4rem 0.75rem',
                                          fontSize: '0.75rem',
                                          background: isMatch ? '#dcfce7' : undefined,
                                          borderColor: isMatch ? '#10b981' : undefined,
                                          color: isMatch ? '#15803d' : undefined,
                                          fontWeight: 700
                                        }}
                                        onClick={() => setQf(f => ({ ...f, correct: opt }))}
                                      >
                                        Option {letter}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Theory model answer */}
                            {qf.type === 'theory' && (
                              <div style={{ marginBottom: '0.85rem', background: 'rgba(180,83,9,0.06)', border: '1px solid rgba(180,83,9,0.2)', borderRadius: '10px', padding: '0.85rem' }}>
                                <label className="aa-label" style={{ color: '#92400e' }}>Model Answer Reference <span style={{ fontWeight: 400, color: '#b45309' }}>(Admin view only)</span></label>
                                <textarea className="aa-input" style={{ minHeight: '80px', background: '#fffbeb' }}
                                  value={qf.modelAnswer} onChange={e => setQf(f => ({ ...f, modelAnswer: e.target.value }))}
                                  placeholder="Write the reference key points and answer rubric..." />
                              </div>
                            )}

                            {/* SQL fields */}
                            {qf.type === 'sql' && (
                              <div style={{ marginBottom: '0.85rem', border: '1.5px solid rgba(5,150,105,0.25)', borderRadius: '12px', padding: '1.25rem', background: 'rgba(5,150,105,0.03)' }}>
                                <div className="aa-section-title" style={{ color: '#065f46' }}>🗄️ SQL Question Specification</div>
                                <div style={{ marginBottom: '0.85rem' }}>
                                  <label className="aa-label">Database Schema</label>
                                  <textarea
                                    style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #334155', borderRadius: '10px', padding: '0.85rem', fontFamily: 'monospace', fontSize: '0.83rem', lineHeight: 1.65, background: '#0f172a', color: '#e2e8f0', resize: 'vertical', outline: 'none', minHeight: '110px' }}
                                    value={qf.sqlSchema} onChange={e => setQf(f => ({ ...f, sqlSchema: e.target.value }))}
                                    placeholder={"CREATE TABLE employees (\n  id INT,\n  name VARCHAR(50)\n);"} />
                                </div>
                                <div style={{ marginBottom: '0.85rem' }}>
                                  <label className="aa-label">Expected Output (JSON array)</label>
                                  <textarea
                                    style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #334155', borderRadius: '10px', padding: '0.85rem', fontFamily: 'monospace', fontSize: '0.83rem', lineHeight: 1.65, background: '#0f172a', color: '#86efac', resize: 'vertical', outline: 'none', minHeight: '70px' }}
                                    value={qf.sqlExpected} onChange={e => setQf(f => ({ ...f, sqlExpected: e.target.value }))}
                                    placeholder={'[{"id":1,"name":"Alice"}]'} />
                                </div>
                                <div>
                                  <label className="aa-label">Hint (Optional)</label>
                                  <input className="aa-input" value={qf.sqlHint} onChange={e => setQf(f => ({ ...f, sqlHint: e.target.value }))} placeholder="e.g. Filter by salary > 50000" />
                                </div>
                              </div>
                            )}

                            {/* Marks / Difficulty / Topic */}
                            <div className="aa-grid3" style={{ marginBottom: '0.85rem' }}>
                              <div>
                                <label className="aa-label">Marks</label>
                                <input type="number" className="aa-input" min={1} max={20} value={qf.marks} onChange={e => setQf(f => ({ ...f, marks: +e.target.value }))} />
                              </div>
                              <div>
                                <label className="aa-label">Difficulty</label>
                                <select className="aa-input" value={qf.difficulty} onChange={e => setQf(f => ({ ...f, difficulty: e.target.value }))}>
                                  <option value="easy">Easy</option>
                                  <option value="medium">Medium</option>
                                  <option value="hard">Hard</option>
                                </select>
                              </div>
                              <div>
                                <label className="aa-label">Topic / Subject</label>
                                <input className="aa-input" value={qf.topic} onChange={e => setQf(f => ({ ...f, topic: e.target.value }))} placeholder="e.g. Java, OOP, SQL" />
                              </div>
                            </div>

                            {/* Explanation */}
                            <div style={{ marginBottom: '1rem' }}>
                              <label className="aa-label">Explanation <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional solution explanation)</span></label>
                              <textarea className="aa-input" style={{ minHeight: '55px' }} value={qf.explanation}
                                onChange={e => setQf(f => ({ ...f, explanation: e.target.value }))}
                                placeholder="Explain why this answer is correct..." />
                            </div>

                            <button type="submit" className="aa-btn aa-btn-primary" style={{ padding: '0.75rem 2rem' }}>
                              <CheckCircle size={16} /> Add Question
                            </button>
                          </form>
                        </div>
                      )}
                    </div>

                    {/* ── Test's Questions list ── */}
                    <div className="aa-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>📋 Current Questions in this Assessment ({selTest.questions?.length ?? 0})</span>
                      {selTest.questions?.length > 0 && (
                        <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'none', fontWeight: 600 }}>
                          Total Marks: {selTest.questions.reduce((acc, q) => acc + Number(q.marks || 1), 0)}
                        </span>
                      )}
                    </div>

                    {(selTest.questions || []).length === 0 && (
                      <div className="aa-card" style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                        No questions in this assessment yet. Fill out the form above or click <strong>"Pick from Ready-Made Java Bank"</strong> to add questions in seconds.
                      </div>
                    )}
                    {(selTest.questions || []).map((q, i) => (
                      <div key={q._id || i} className="aa-q-item" style={{ flexDirection: 'column', gap: '0.65rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', width: '100%' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(14,165,233,0.1)', color: '#0369a1', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem', marginBottom: '0.35rem' }}>{q.text}</div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span className="aa-badge" style={{ background: `${TYPE_COLORS[q.type] || '#6b7280'}18`, color: TYPE_COLORS[q.type] || '#6b7280' }}>
                                {TYPE_ICONS[q.type] || '❓'} {q.type?.toUpperCase()}
                              </span>
                              <span className="aa-badge" style={{ background: 'rgba(0,0,0,0.04)', color: DIFF_COLORS[q.difficulty] || '#6b7280' }}>{q.difficulty}</span>
                              <span className="aa-badge" style={{ background: '#f1f5f9', color: '#475569' }}>{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
                              {q.topic && <span className="aa-badge" style={{ background: '#f0f9ff', color: '#0369a1' }}>{q.topic}</span>}
                              {q.type === 'mcq'    && <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>✓ Correct: {q.correct}</span>}
                              {q.type === 'theory' && <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700, background: '#fef3c7', padding: '0.15rem 0.5rem', borderRadius: '5px' }}>✋ Manual</span>}
                              {q.type === 'sql'    && <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, background: '#d1fae5', padding: '0.15rem 0.5rem', borderRadius: '5px' }}>🗄️ In-Memory SQL</span>}
                            </div>
                          </div>
                          <button className="aa-btn aa-btn-danger" style={{ padding: '0.4rem 0.7rem', flexShrink: 0 }} onClick={() => deleteQuestion(q._id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {q.sqlSchema && (
                          <pre style={{ background: '#0f172a', color: '#94a3b8', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.78rem', lineHeight: 1.5, overflowX: 'auto', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {q.sqlSchema.substring(0, 100)}{q.sqlSchema.length > 100 ? '…' : ''}
                          </pre>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            CANDIDATES TAB (NO EMAIL SENDING)
        ══════════════════════════════════════ */}
        {tab === 'candidates' && (
          <div>
            <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.2rem', marginBottom: '1.25rem' }}>👥 Candidate Access & Assignments</h2>
            {!selTest ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                <UserCheck size={48} style={{ opacity: 0.3, marginBottom: '1rem', margin: '0 auto' }} />
                <p style={{ fontWeight: 600 }}>Select a test below to assign candidates and generate access codes.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                  {tests.map(t => (
                    <button key={t._id} className="aa-btn aa-btn-outline" onClick={() => setSelTest(t)}>{t.title}</button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="aa-card" style={{ marginBottom: '1.25rem', background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(5,150,105,0.08))', border: '1.5px solid rgba(14,165,233,0.25)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ fontWeight: 800, color: '#0369a1', fontSize: '1.05rem' }}>Selected Assessment: {selTest.title}</div>
                    {selTest.accessPassword && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fef3c7', padding: '0.3rem 0.75rem', borderRadius: '8px', border: '1px solid #fde68a' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#92400e' }}>🔑 Exam Password:</span>
                        <code style={{ fontWeight: 800, color: '#b45309', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{selTest.accessPassword}</code>
                        <button className="aa-btn aa-btn-outline" style={{ padding: '0.2rem 0.45rem', fontSize: '0.72rem', height: 'auto', background: 'white' }} onClick={() => copyPassword(selTest.accessPassword)}>
                          <Copy size={11} /> Copy
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Shareable registration form link */}
                  <div style={{ background: 'white', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>📝 Student Self-Registration Form Link</span>
                          <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '5px', fontWeight: 800 }}>Share With Students</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                          Students open this link, enter their details (Name, Email, Phone, College, Roll No), and register.
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="aa-btn aa-btn-success" style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }} onClick={() => copyRegistrationLink(selTest._id)}>
                          <Copy size={14} /> Copy Registration Link
                        </button>
                        <button className="aa-btn aa-btn-outline" style={{ padding: '0.45rem 0.8rem', fontSize: '0.82rem' }} onClick={() => copyTestLink(selTest._id)}>
                          <Copy size={14} /> Copy Exam Gate Link
                        </button>
                      </div>
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                      <code style={{ background: '#f8fafc', padding: '0.35rem 0.7rem', borderRadius: '6px', color: '#0369a1', fontWeight: 700, fontSize: '0.84rem', wordBreak: 'break-all', display: 'block', border: '1px dashed #cbd5e1' }}>
                        {window.location.origin}/test/{selTest._id}/register
                      </code>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>✅ No email sending required. Simply share the form link via WhatsApp, Chat, or Classroom.</span>
                  </div>
                </div>

                {/* Direct Manual Candidate Add Form */}
                <div className="aa-card" style={{ marginBottom: '1.25rem' }}>
                  <div className="aa-section-title">➕ Or Manually Assign Candidate (Generates Instant Access Code)</div>
                  <form onSubmit={inviteCandidateManual} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: '1 1 180px' }}>
                      <label className="aa-label">Candidate Name</label>
                      <input className="aa-input" value={manualName} onChange={e => setManualName(e.target.value)} placeholder="e.g. John Doe" />
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                      <label className="aa-label">Candidate Email *</label>
                      <input type="email" required className="aa-input" value={manualEmail} onChange={e => setManualEmail(e.target.value)} placeholder="student@example.com" />
                    </div>
                    <div style={{ flex: '1 1 160px' }}>
                      <label className="aa-label">Date of Birth (DOB)</label>
                      <input type="date" className="aa-input" value={manualDob} onChange={e => setManualDob(e.target.value)} />
                    </div>
                    <button type="submit" className="aa-btn aa-btn-primary" style={{ padding: '0.65rem 1.4rem' }}>
                      <UserPlus size={16} /> Assign Candidate
                    </button>
                  </form>
                </div>

                {/* Already registered / invited candidates */}
                {(selTest.invitedCandidates || []).length > 0 && (
                  <div className="aa-card" style={{ marginBottom: '1.25rem' }}>
                    <div className="aa-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>👥 Registered / Assigned Candidates ({selTest.invitedCandidates.length})</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'none', fontWeight: 600 }}>Email is unique primary key</span>
                    </div>
                    {selTest.invitedCandidates.map(ic => (
                      <div key={ic.email} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', marginBottom: '0.65rem', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.94rem' }}>{ic.name || 'Candidate'}</span>
                            {ic.registeredAt ? (
                              <span className="aa-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Self-Registered</span>
                            ) : (
                              <span className="aa-badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>Admin-Assigned</span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.84rem', color: '#334155', marginTop: '0.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                            <span><strong>Email:</strong> {ic.email}</span>
                            {(ic.dob || ic.dateOfBirth) && <span>· <strong>DOB:</strong> {ic.dob || ic.dateOfBirth}</span>}
                            {ic.phone && <span>· <strong>Phone:</strong> {ic.phone}</span>}
                            {ic.college && <span>· <strong>College:</strong> {ic.college}</span>}
                            {ic.rollNo && <span>· <strong>Roll No:</strong> {ic.rollNo}</span>}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                            Access Code: <strong style={{ fontFamily: 'monospace', color: '#0369a1', background: '#eff6ff', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{ic.accessCode}</strong>
                            {' · '}
                            {ic.registeredAt 
                              ? `Registered on ${new Date(ic.registeredAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}`
                              : `Assigned on ${new Date(ic.invitedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button className="aa-btn aa-btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                            onClick={() => copyCode(ic.accessCode, ic.email)}>
                            <Copy size={13} /> Code
                          </button>
                          <button className="aa-btn aa-btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                            onClick={() => copyInvitationDetails(selTest._id, ic.accessCode, ic.email)}>
                            📋 Details
                          </button>
                          <button className="aa-btn aa-btn-danger" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }} onClick={() => removeInvite(ic.email)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Candidate Pool from Registered Users / Students */}
                <div className="aa-card">
                  <div className="aa-section-title">📥 Quick-Assign from Registered Users & Students</div>
                  {candidatePool.filter(p => !selTest.invitedCandidates?.some(ic => ic.email?.toLowerCase() === p.email?.toLowerCase())).map(p => (
                    <div key={p._id || p.email} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.85rem', background: '#f8fafc', borderRadius: '9px', marginBottom: '0.4rem', border: '1px solid #e2e8f0' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>{p.first_name} {p.last_name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{p.email} · {p.job_title || 'Student / Applicant'}</div>
                      </div>
                      <button className="aa-btn aa-btn-success" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                        onClick={() => inviteCandidateById(p._id, `${p.first_name} ${p.last_name}`)}>
                        <UserPlus size={13} /> Assign Test
                      </button>
                    </div>
                  ))}
                  {candidatePool.length === 0 && (
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No pool candidates available. Use the manual assign form above.</div>
                  )}
                  {candidatePool.length > 0 && candidatePool.filter(p => !selTest.invitedCandidates?.some(ic => ic.email?.toLowerCase() === p.email?.toLowerCase())).length === 0 && (
                    <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>✓ All registered students from the pool have been assigned to this test.</div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            REPORTS TAB
        ══════════════════════════════════════ */}
        {tab === 'reports' && (
          <div>
            <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.2rem', marginBottom: '1.25rem' }}>📊 Examination Reports & Results</h2>
            {tests.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {tests.map(t => (
                  <button key={t._id}
                    className={`aa-btn ${selTest?._id === t._id ? 'aa-btn-primary' : 'aa-btn-outline'}`}
                    onClick={() => { loadAttempts(t._id); setSelTest(t); }}>
                    {t.title}
                  </button>
                ))}
              </div>
            )}

            {!selTest
              ? <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Select an assessment above to view student attempts and scores.</div>
              : (
                <div className="aa-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div className="aa-section-title" style={{ margin: 0 }}>Attempts — {selTest.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                        Connected with Hostinger MySQL Database. Re-grade recalculates scores against current question keys.
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        className="aa-btn aa-btn-primary"
                        style={{
                          padding: '0.45rem 1rem',
                          fontSize: '0.82rem',
                          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)'
                        }}
                        disabled={regrading}
                        onClick={() => handleRegrade(selTest._id)}
                        title="Recalculate all submitted student scores against correct answer options and sync with MySQL"
                      >
                        {regrading ? '⏳ Re-Grading...' : '🔄 Re-Grade & Fix Scores'}
                      </button>
                      <button
                        className="aa-btn aa-btn-outline"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                        onClick={() => loadAttempts(selTest._id)}
                        title="Reload attempts from database"
                      >
                        🔃 Refresh
                      </button>
                    </div>
                  </div>

                  {attempts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                      No examination attempts recorded yet for this assessment.
                    </div>
                  ) : (
                    <>
                      <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc' }}>
                            {['#', 'Candidate', 'Email', 'Score', 'Percentage', 'Status', 'Anti-Cheat Violations', 'Time Taken', 'Submitted Date', 'Certificate & Actions'].map(h => (
                              <th key={h} style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {attempts.map((a, i) => (
                            <tr key={a._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '0.75rem 0.85rem', color: '#94a3b8', fontWeight: 700 }}>{i + 1}</td>
                              <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#0f172a' }}>{a.candidate?.name || a.candidateName || 'Candidate'}</td>
                              <td style={{ padding: '0.75rem 0.85rem', color: '#64748b' }}>{a.candidate?.email || a.candidateEmail}</td>
                              <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700 }}>{a.score}/{a.totalMarks}</td>
                              <td style={{ padding: '0.75rem 0.85rem' }}>
                                <span style={{ fontWeight: 800, color: a.passed ? '#10b981' : '#ef4444' }}>{a.percentage}%</span>
                              </td>
                              <td style={{ padding: '0.75rem 0.85rem' }}>
                                <span className="aa-badge" style={{
                                  background: a.status === 'submitted' ? 'rgba(16,185,129,0.1)' : a.status === 'terminated' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                                  color: a.status === 'submitted' ? '#10b981' : a.status === 'terminated' ? '#ef4444' : '#f59e0b',
                                }}>{a.status}</span>
                              </td>
                              <td style={{ padding: '0.75rem 0.85rem' }}>
                                {(a.violations || []).length > 0 ? (
                                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                    {a.violations.map(v => (
                                      <span key={v.type} className="aa-violation">{v.type} ×{v.count}</span>
                                    ))}
                                  </div>
                                ) : (
                                  <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>✓ Clean (0 violations)</span>
                                )}
                              </td>
                              <td style={{ padding: '0.75rem 0.85rem', color: '#64748b' }}>
                                {Math.floor((a.timeTaken || 0) / 60)}m {(a.timeTaken || 0) % 60}s
                              </td>
                              <td style={{ padding: '0.75rem 0.85rem', color: '#64748b', fontSize: '0.8rem' }}>
                                {a.submittedAt ? new Date(a.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                              </td>
                              <td style={{ padding: '0.75rem 0.85rem', whiteSpace: 'nowrap' }}>
                                {a.passed || a.percentage >= (selTest?.passingScore || 50) ? (
                                  a.certificateNumber || a.certificate_number ? (
                                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                      <button
                                        className="aa-btn aa-btn-success"
                                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                                        onClick={() => handleViewCertificate(a)}
                                        title="Preview & Print Certificate"
                                      >
                                        🎓 View Cert
                                      </button>
                                      <button
                                        className="aa-btn aa-btn-outline"
                                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                                        disabled={sendingCertId === a._id}
                                        onClick={() => handleSendCertificate(a)}
                                        title="Re-send certificate email to student"
                                      >
                                        {sendingCertId === a._id ? '⏳' : '✉️ Re-send'}
                                      </button>
                                      <button
                                        className="aa-btn aa-btn-outline"
                                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                                        onClick={() => {
                                          const certNum = a.certificateNumber || a.certificate_number;
                                          const link = `${window.location.origin}/verify-certificate/${certNum}`;
                                          navigator.clipboard.writeText(link);
                                          Swal.fire({
                                            icon: 'success',
                                            title: 'Verification Link Copied!',
                                            text: link,
                                            timer: 2000,
                                            showConfirmButton: false
                                          });
                                        }}
                                        title="Copy direct verification link"
                                      >
                                        🔗 Link
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      className="aa-btn aa-btn-primary"
                                      style={{
                                        padding: '0.4rem 0.85rem',
                                        fontSize: '0.78rem',
                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                        boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
                                      }}
                                      disabled={sendingCertId === a._id}
                                      onClick={() => handleSendCertificate(a)}
                                    >
                                      {sendingCertId === a._id ? '⏳ Issuing…' : '🎓 Send Certificate'}
                                    </button>
                                  )
                                ) : (
                                  <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                                    Not Qualified (&lt;{selTest?.passingScore || 50}%)
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#64748b' }}>
                      <span>Total Attempts: <strong>{attempts.length}</strong></span>
                      <span>Passed: <strong style={{ color: '#10b981' }}>{attempts.filter(a => a.passed).length}</strong></span>
                      <span>Failed: <strong style={{ color: '#ef4444' }}>{attempts.filter(a => !a.passed && a.status === 'submitted').length}</strong></span>
                      <span>Terminated: <strong style={{ color: '#f59e0b' }}>{attempts.filter(a => a.status === 'terminated').length}</strong></span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            SQL RUNNER TAB
        ══════════════════════════════════════ */}
        {tab === 'sql-runner' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Database size={22} style={{ color: '#059669' }} />
              <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.2rem', margin: 0 }}>SQL Runner & Testing Studio</h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem', marginTop: '0.25rem' }}>
              Write and execute SQL queries against a temporary in-memory database using <strong>alasql</strong>. Test your question schema and queries before assigning them to students.
            </p>

            <div className="aa-card" style={{ marginBottom: '1.25rem' }}>
              <div className="aa-sql-runner">
                {/* Schema panel */}
                <div>
                  <label className="aa-label" style={{ marginBottom: '0.5rem', color: '#0f172a', fontSize: '0.82rem' }}>
                    🗃️ Database Schema (CREATE TABLE + INSERT)
                  </label>
                  <textarea
                    className="aa-sql-textarea"
                    value={sqlRunnerSchema}
                    onChange={e => setSqlRunnerSchema(e.target.value)}
                    placeholder={"CREATE TABLE employees (\n  id INT,\n  name VARCHAR(50),\n  dept VARCHAR(50),\n  salary INT\n);\nINSERT INTO employees VALUES (1,'Alice','Engineering',90000);"}
                  />
                </div>

                {/* Query panel */}
                <div>
                  <label className="aa-label" style={{ marginBottom: '0.5rem', color: '#0f172a', fontSize: '0.82rem' }}>
                    ⌨️ Candidate Query to Test
                  </label>
                  <textarea
                    className="aa-sql-textarea"
                    value={sqlRunnerQuery}
                    onChange={e => setSqlRunnerQuery(e.target.value)}
                    placeholder={"SELECT * FROM employees\nWHERE dept = 'Engineering'\nORDER BY salary DESC;"}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <button className="aa-btn aa-btn-primary" onClick={adminRunSql} disabled={sqlRunnerBusy}
                  style={{ padding: '0.7rem 2rem', fontSize: '0.92rem', opacity: sqlRunnerBusy ? 0.7 : 1 }}>
                  {sqlRunnerBusy ? '⏳ Running…' : '▶ Run SQL Test'}
                </button>
              </div>
            </div>

            {/* Output */}
            {sqlRunnerResult && (
              <div className="aa-card">
                <div className="aa-section-title">Query Execution Output</div>

                {sqlRunnerResult.error ? (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#dc2626', marginBottom: '0.4rem' }}>⚠️ Query Error</div>
                    <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.85rem', color: '#dc2626', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{sqlRunnerResult.error}</pre>
                  </div>
                ) : Array.isArray(sqlRunnerResult.rows) ? (
                  sqlRunnerResult.rows.length === 0 ? (
                    <div style={{ color: '#94a3b8', fontStyle: 'italic', padding: '0.75rem' }}>Query returned 0 rows.</div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="aa-sql-table">
                        <thead>
                          <tr>
                            {Object.keys(sqlRunnerResult.rows[0]).map(col => (
                              <th key={col}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sqlRunnerResult.rows.map((row, ri) => (
                            <tr key={ri}>
                              {Object.values(row).map((val, vi) => (
                                <td key={vi}>{val === null ? <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>NULL</span> : String(val)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                        {sqlRunnerResult.rows.length} row{sqlRunnerResult.rows.length !== 1 ? 's' : ''} returned
                      </div>
                    </div>
                  )
                ) : (
                  <pre style={{ background: '#0f172a', color: '#86efac', borderRadius: '8px', padding: '1rem', fontSize: '0.85rem', whiteSpace: 'pre-wrap', margin: 0 }}>
                    {JSON.stringify(sqlRunnerResult, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}

      </div>



      {/* Official Certificate Document Modal with Print & Verification Links */}
      <CertificateModal
        certificate={selectedCert}
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
      />
    </div>
  );
}
