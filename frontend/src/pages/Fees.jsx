import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { 
  CreditCard, CheckCircle, HelpCircle, AlertCircle, 
  Coins, Wallet, Loader, Check, Search, User, FileText, 
  ArrowLeft, ShieldCheck, Download 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Fees() {
  const { isDark } = useTheme();

  // Core Lookup States
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchedStudent, setSearchedStudent] = useState(null);
  const [studentFees, setStudentFees] = useState([]);
  const [searchError, setSearchError] = useState('');

  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' | 'cash'
  
  // Checkout Stages
  const [checkoutStage, setCheckoutStage] = useState('lookup'); // 'lookup' | 'checkout' | 'success'
  const [loading, setLoading] = useState(false);
  const [txnId, setTxnId] = useState('');
  
  // Razorpay states
  const [rzpKey, setRzpKey] = useState(null);
  const [rzpReady, setRzpReady] = useState(false);
  
  // Receipt State
  const [receipt, setReceipt] = useState(null);
  const pollRef = useRef(null);

  // Load Razorpay config + script once on mount
  useEffect(() => {
    fetch('/api/razorpay/config')
      .then((r) => r.json())
      .then((d) => { if (d.success) setRzpKey(d.keyId); })
      .catch(() => {});

    if (!document.getElementById('razorpay-checkout-script')) {
      const s = document.createElement('script');
      s.id = 'razorpay-checkout-script';
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => setRzpReady(true);
      document.body.appendChild(s);
    } else {
      setRzpReady(true);
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Search for student fees
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchError('');
    setSearchedStudent(null);
    setStudentFees([]);

    try {
      const res = await fetch(`/api/public/student-fees/${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      setSearching(false);
      if (data.success) {
        setSearchedStudent(data.student);
        setStudentFees(data.fees);
      } else {
        setSearchError(data.message || 'Student not found.');
      }
    } catch (err) {
      console.error(err);
      setSearching(false);
      setSearchError('Network error. Could not query student database.');
    }
  };

  // Poll outstanding installment fee status
  const startPollingFee = (feeId) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/public/student-fees/${searchedStudent.studentId}`);
        const data = await res.json();
        if (data.success) {
          const updatedFee = data.fees.find(f => f._id === feeId);
          if (updatedFee && updatedFee.status === 'paid') {
            clearInterval(pollRef.current);
            pollRef.current = null;
            
            // Fetch the generated receipt
            const receiptRes = await fetch(`/api/public/receipt/${feeId}`);
            const receiptData = await receiptRes.json();
            if (receiptData.success) {
              setReceipt(receiptData.receipt);
            }
            setCheckoutStage('success');
            confetti({ particleCount: 120, spread: 85, origin: { y: 0.6 } });
          }
        }
      } catch (err) {
        console.error('Polling fee status error:', err);
      }
    }, 3000);
  };

  // Trigger Razorpay payment
  const handleProceedPayment = async () => {
    if (!selectedFee) return;

    // For CASH payment, trigger desk simulation
    if (paymentMethod === 'cash') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setTxnId(`TXN-CSH-${Math.floor(100000 + Math.random() * 900000)}`);
        setCheckoutStage('success');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }, 2000);
      return;
    }

    // For online payments via Razorpay (if enabled)
    if (rzpKey && window.Razorpay) {
      setLoading(true);
      try {
        const orderRes = await fetch('/api/razorpay/create-fee-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            feeId: selectedFee._id,
            studentId: searchedStudent._id,
            amount: selectedFee.amount
          })
        });
        const orderData = await orderRes.json();
        setLoading(false);

        if (orderData.success && orderData.order) {
          const options = {
            key: rzpKey,
            amount: orderData.order.amount,
            currency: 'INR',
            name: 'Appletree Infotech',
            description: selectedFee.term,
            order_id: orderData.order.id,
            prefill: {
              name: searchedStudent.name
            },
            theme: { color: '#FF7043' },
            handler: async (response) => {
              // Wait for webhook / trigger status check
              setLoading(true);
              startPollingFee(selectedFee._id);
            },
            modal: {
              ondismiss: () => {
                setLoading(false);
              }
            }
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          alert(orderData.message || 'Could not initiate Razorpay order.');
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
        alert('Network error. Failed to initiate payment.');
      }
    } else {
      alert('Razorpay is not configured. Please use Cash at Desk.');
      setPaymentMethod('cash');
    }
  };

  // Simulate incoming Razorpay Webhook callback
  const handleSimulateWebhook = async () => {
    if (!selectedFee) return;
    setLoading(true);
    try {
      const res = await fetch('/api/razorpay/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'payment.captured',
          payload: {
            payment: {
              entity: {
                id: `pay_mock_${Math.random().toString(36).substr(2, 9)}`,
                method: 'razorpay',
                notes: {
                  type: 'installment',
                  feeId: selectedFee._id,
                  studentId: searchedStudent._id
                }
              }
            }
          }
        })
      });

      if (res.ok) {
        // Poll status check once to fetch data
        setTimeout(async () => {
          try {
            const receiptRes = await fetch(`/api/public/receipt/${selectedFee._id}`);
            const receiptData = await receiptRes.json();
            setLoading(false);
            if (receiptData.success) {
              setReceipt(receiptData.receipt);
              setCheckoutStage('success');
              confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
            } else {
              setTxnId(`TXN-MOCK-${Date.now()}`);
              setCheckoutStage('success');
            }
          } catch (err) {
            console.error(err);
            setLoading(false);
            setCheckoutStage('success');
          }
        }, 1500);
      } else {
        setLoading(false);
        alert('Simulation failed.');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleBackToLookup = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setSelectedFee(null);
    setReceipt(null);
    setCheckoutStage('lookup');
    // Refresh student data
    if (searchedStudent) {
      fetch(`/api/public/student-fees/${searchedStudent.studentId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStudentFees(data.fees);
          }
        });
    }
  };

  const resetAll = () => {
    setSearchQuery('');
    setSearchedStudent(null);
    setStudentFees([]);
    setSelectedFee(null);
    setReceipt(null);
    setCheckoutStage('lookup');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8 select-none">
      
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className={`font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full border ${
          isDark 
            ? 'text-brandCoral bg-brandCoral/10 border-brandCoral/20' 
            : 'text-brandCoral bg-brandCoral/5 border-brandCoral/10'
        }`}>
          FINANCIAL HUB
        </span>
        <h1 className={`text-4xl font-quicksand font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
          Student Tuition & Course Dues
        </h1>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Search student registries to clear outstanding tuition installments, view payment ledgers, or retrieve billing receipts.
        </p>
      </div>

      <div className={`border rounded-[2.5rem] overflow-hidden shadow-xl ${
        isDark 
          ? 'bg-slate-900 border-white/10' 
          : 'bg-white border-orange-100/70 shadow-[0_15px_40px_rgba(255,112,67,0.06)]'
      }`}>
        {/* Banner header inside card */}
        <div className={`p-6 md:p-8 flex items-center justify-between border-b ${
          isDark ? 'bg-slate-800/40 border-white/15' : 'bg-brandCream/40 border-orange-50'
        }`}>
          <div>
            <h3 className={`font-quicksand font-bold text-xl ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              Dynamic Payment Portal
            </h3>
            <p className={`text-[11px] ${isDark ? 'text-slate-450' : 'text-slate-500'}`}>
              School Quick-Pay Gateway
            </p>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
            rzpKey
              ? (isDark ? 'bg-brandMint/10 text-brandMint border-brandMint/30' : 'bg-emerald-50 text-emerald-700 border-emerald-250')
              : (isDark ? 'bg-amber-500/10 text-amber-500 border-amber-500/25' : 'bg-amber-50 text-amber-700 border-amber-200')
          }`}>
            {rzpKey ? 'Razorpay Live Checkout Active' : 'Sandbox checkout active'}
          </span>
        </div>

        <div className="p-6 md:p-10">
          {/* LOOKUP STAGE */}
          {checkoutStage === 'lookup' && (
            <div className="space-y-6">
              {!searchedStudent ? (
                <form onSubmit={handleSearch} className="max-w-md mx-auto space-y-4">
                  <p className={`text-xs text-center font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Enter your Student ID (e.g. STD-2026-XXXX) or Name to lookup unpaid installments.
                  </p>
                  
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Student ID or Name..."
                        className={`w-full pl-10 pr-4 py-3 text-xs border outline-none transition-colors rounded-xl ${
                          isDark 
                            ? 'bg-slate-800/50 border-white/10 text-white focus:border-brandCoral' 
                            : 'bg-slate-50 border-orange-100 focus:border-brandCoral text-slate-750'
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={searching || !searchQuery.trim()}
                      className="px-5 py-3 rounded-xl bg-brandCoral hover:bg-brandCoral-dark text-white font-quicksand font-bold text-xs flex items-center gap-1.5 transition-all shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {searching && <Loader className="w-3.5 h-3.5 animate-spin" />}
                      <span>SEARCH</span>
                    </button>
                  </div>

                  {searchError && (
                    <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-700">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{searchError}</span>
                    </div>
                  )}
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Student Registry Info Card */}
                  <div className={`p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border ${
                    isDark ? 'bg-slate-850 border-white/10 text-white' : 'bg-slate-50 border-slate-150 text-slate-800'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brandCoral/10 text-brandCoral flex items-center justify-center font-bold">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-quicksand font-bold text-sm leading-none">{searchedStudent.name}</h4>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1">ID: {searchedStudent.studentId} • Course: {searchedStudent.class}</span>
                      </div>
                    </div>
                    <button
                      onClick={resetAll}
                      className={`font-quicksand font-bold text-[10px] px-3.5 py-1.5 rounded-xl border transition-all ${
                        isDark ? 'border-white/10 hover:bg-white/5 text-slate-350' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      CHANGE STUDENT
                    </button>
                  </div>

                  {/* Installments Ledger */}
                  <div className="space-y-3">
                    <h4 className={`font-quicksand font-bold text-xs uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                      Outstanding Fee Installments
                    </h4>
                    
                    {studentFees.length === 0 ? (
                      <p className="text-xs text-slate-450 italic">No installment fee records found for this student.</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {studentFees.map((fee) => (
                          <div
                            key={fee._id}
                            className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                              fee.status === 'paid'
                                ? (isDark ? 'bg-slate-800/20 border-white/5 text-slate-400' : 'bg-emerald-50/20 border-emerald-100/40 text-slate-500')
                                : (isDark ? 'bg-slate-800 border-white/15 hover:border-brandCoral text-white' : 'bg-white border-orange-100/60 hover:border-brandCoral shadow-sm text-slate-800')
                            }`}
                          >
                            <div className="space-y-1">
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border inline-block ${
                                fee.status === 'paid'
                                  ? (isDark ? 'bg-brandMint/10 text-brandMint/80 border-brandMint/30' : 'bg-emerald-50 text-emerald-700 border-emerald-250')
                                  : 'bg-red-50 text-red-600 border border-red-100'
                              }`}>
                                {fee.status}
                              </span>
                              <h5 className="font-quicksand font-bold text-sm leading-tight">{fee.term}</h5>
                              <p className="text-[10px] text-slate-400 font-medium">Due Date: {new Date(fee.dueDate).toLocaleDateString()}</p>
                              {fee.status === 'paid' && (
                                <p className="text-[9px] font-mono text-slate-400">Txn: {fee.transactionId} ({fee.paymentMethod})</p>
                              )}
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <p className="text-sm font-extrabold text-brandCoral">₹{fee.amount.toLocaleString('en-IN')}</p>
                              {fee.status !== 'paid' ? (
                                <button
                                  onClick={() => { setSelectedFee(fee); setCheckoutStage('checkout'); }}
                                  className="px-4 py-2 rounded-xl bg-brandCoral hover:bg-brandCoral-dark text-white font-quicksand font-bold text-xs transition-all shadow"
                                >
                                  PAY NOW
                                </button>
                              ) : (
                                <a
                                  href={`/api/public/receipt/${fee._id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                                    isDark ? 'border-white/10 hover:bg-white/5 text-slate-450 hover:text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-brandCoral'
                                  }`}
                                  title="View Receipt"
                                >
                                  <FileText className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CHECKOUT STAGE */}
          {checkoutStage === 'checkout' && selectedFee && (
            <div className="space-y-6 max-w-md mx-auto py-2">
              <button
                onClick={handleBackToLookup}
                className={`flex items-center gap-1 font-quicksand font-bold text-[10px] ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> BACK TO LEDGER
              </button>

              <h4 className={`font-quicksand font-bold text-lg text-center pb-2 border-b ${
                isDark ? 'text-slate-200 border-white/5' : 'text-slate-800 border-slate-100'
              }`}>
                Confirm & Pay Installment
              </h4>

              <div className={`p-4 rounded-2xl border space-y-3 ${
                isDark ? 'bg-slate-800 border-white/10 text-white' : 'bg-slate-50 border-slate-150 text-slate-800'
              }`}>
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>Student Registry:</span>
                  <span className={isDark ? 'text-slate-250' : 'text-slate-700'}>{searchedStudent.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>Payment Item:</span>
                  <span className={isDark ? 'text-slate-250' : 'text-slate-700'}>{selectedFee.term}</span>
                </div>
                <hr className={isDark ? 'border-white/5' : 'border-slate-200'} />
                <div className="flex justify-between items-center text-sm font-extrabold">
                  <span>Total Amount Due:</span>
                  <span className="text-brandCoral text-lg">₹{selectedFee.amount.toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-655'}`}>Select Payment Method</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${
                      paymentMethod === 'razorpay'
                        ? (isDark ? 'border-brandCoral bg-brandCoral/10 text-white' : 'border-brandCoral bg-brandCoral/5 text-brandCoral-dark')
                        : (isDark ? 'border-white/10 hover:bg-white/5 text-slate-300' : 'border-slate-150 hover:bg-slate-50 text-slate-600')
                    }`}
                  >
                    <CreditCard className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Razorpay</p>
                      <p className="text-[10px] opacity-70">Pay online via Razorpay</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${
                      paymentMethod === 'cash'
                        ? (isDark ? 'border-[#5B468C] bg-[#5B468C]/10 text-white' : 'border-[#5B468C] bg-[#5B468C]/5 text-[#5B468C]')
                        : (isDark ? 'border-white/10 hover:bg-white/5 text-slate-300' : 'border-slate-150 hover:bg-slate-50 text-slate-600')
                    }`}
                  >
                    <Coins className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Cash at Desk</p>
                      <p className="text-[10px] opacity-70">Pay directly at cash counter</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sandbox simulation controls (when no keys) */}
              {paymentMethod === 'razorpay' && !rzpKey && (
                <div className="space-y-4 pt-2 text-center border-t border-dashed border-slate-200/50">
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Razorpay keys not configured. Click below to simulate payment.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleSimulateWebhook}
                      disabled={loading}
                      className="w-full py-2.5 rounded-xl bg-brandCoral hover:bg-brandCoral-dark text-white font-quicksand font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                    >
                      {loading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                      <span>SIMULATE RAZORPAY WEBHOOK CAPTURE</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Submit pay button */}
              {paymentMethod === 'cash' && (
                <button
                  onClick={handleProceedPayment}
                  disabled={loading}
                  className="w-full font-quicksand font-bold text-sm bg-brandCoral hover:bg-brandCoral-dark text-white py-4 rounded-xl shadow transition-all hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loading && <Loader className="w-4 h-4 animate-spin" />}
                  <span>{loading ? 'Processing...' : `PROCEED TO PAY ₹${selectedFee.amount}`}</span>
                </button>
              )}
            </div>
          )}

          {/* SUCCESS SCREEN WITH RECEIPT */}
          {checkoutStage === 'success' && (
            <div className="text-center py-6 space-y-6 max-w-md mx-auto animate-fade-in">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                isDark ? 'bg-brandMint/10 text-brandMint' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}>
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className={`font-quicksand font-bold text-2xl ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Payment Confirmed!
                </h4>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} leading-relaxed`}>
                  Your payment of <span className="font-bold text-brandCoral">₹{selectedFee?.amount}</span> has been processed successfully.
                </p>
              </div>

              {receipt ? (
                /* GORGEOUS OFFICIAL RECEIPT DISPLAY */
                <div className="bg-white border-[5px] border-slate-50 rounded-[2.5rem] w-full p-6 shadow-md relative text-slate-800 text-left space-y-4">
                  <div className="border-b-2 border-slate-100 pb-3 text-center space-y-1">
                    <span className="text-[8px] font-extrabold tracking-widest text-[#7C3AED] bg-[#EAE8FC] px-2.5 py-0.5 rounded-full">OFFICIAL RECEIPT</span>
                    <h4 className="font-quicksand font-bold text-[#5B468C] text-sm mt-2">Appletree Infotech</h4>
                    <p className="text-[10px] text-slate-400 font-semibold font-mono">Receipt No: {receipt.receiptNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-xs border-b pb-3 text-slate-500 font-semibold">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Student Name</span>
                      <span className="text-slate-800 font-bold">{searchedStudent?.name}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Class</span>
                      <span className="text-slate-800 font-bold">{searchedStudent?.class}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Payment Item</span>
                      <span className="text-slate-800 font-bold">{selectedFee?.term}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Date Paid</span>
                      <span className="text-slate-800 font-bold">{new Date(receipt.paymentDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="bg-[#FAF9F5] border border-[#E9E5D9]/40 p-3.5 rounded-xl flex justify-between items-center text-xs">
                    <span className="text-slate-650 font-bold">Amount Paid (Rupees)</span>
                    <span className="text-lg font-extrabold text-emerald-600">₹{receipt.amountPaid.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="bg-slate-50 border p-3 rounded-xl text-[9px] font-semibold text-slate-500 font-mono space-y-0.5">
                    <p>Transaction ID: <span className="text-slate-800">{receipt.transactionId || txnId}</span></p>
                    <p>Payment Method: <span className="text-slate-800">{receipt.paymentMethod || 'Online Wallet'}</span></p>
                    <p>Status: <span className="text-emerald-600 uppercase font-bold">Cleared</span></p>
                  </div>
                </div>
              ) : (
                /* Fallback display */
                <div className={`p-5 rounded-2xl text-left text-xs space-y-2.5 font-semibold ${
                  isDark ? 'bg-slate-800/60 border border-white/5 text-slate-300' : 'bg-slate-50 border border-slate-100 text-slate-600'
                }`}>
                  <div className="flex justify-between">
                    <span>Student Name:</span>
                    <span className={isDark ? 'text-slate-100' : 'text-slate-800'}>{searchedStudent?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dues Cleared:</span>
                    <span className={isDark ? 'text-slate-100' : 'text-slate-800'}>{selectedFee?.term}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="uppercase text-brandCoral-dark font-black">{paymentMethod}</span>
                  </div>
                  <hr className={isDark ? 'border-white/5' : 'border-slate-200'} />
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{txnId}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBackToLookup}
                className="font-quicksand font-bold text-xs bg-brandCoral hover:bg-brandCoral-dark text-white px-8 py-3.5 rounded-full transition-all cursor-pointer shadow hover:shadow-md active:scale-95"
              >
                RETURN TO LEDGER
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Help section */}
      <div className={`p-5 border rounded-2xl flex items-start gap-3 print:hidden ${
        isDark ? 'bg-slate-900/60 border-white/5' : 'bg-brandCream border-orange-100/50'
      }`}>
        <HelpCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? 'text-brandCoral' : 'text-brandCoral-dark'}`} />
        <div>
          <h4 className={`font-quicksand font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            Customized Installment Schedules
          </h4>
          <p className={`text-xs leading-relaxed mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            By default, dynamic installment plans are calculated as 1/3 of the published course price. If you require custom timeline modifications or experience payment processing issues, please email us at <code className="font-bold">hr@appletreeinfotech.in</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
