import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Wallet, CheckCircle, Loader, ShieldCheck, Banknote, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Admission payment modal: choose Cash or Razorpay.
 * - Cash: instantly collected → student auto-saved by the backend.
 * - Razorpay: opens Razorpay checkout → auto-registers on webhook verification.
 */
export default function AdmissionPaymentModal({ admissionData, onClose, onSuccess }) {
  const [method, setMethod] = useState('');        // 'cash' | 'razorpay'
  const [stage, setStage] = useState('choose');    // choose | processing | verifying | success | error
  const [payment, setPayment] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [rzpKey, setRzpKey] = useState(null);
  const [rzpReady, setRzpReady] = useState(false);
  const pollRef = useRef(null);

  const token = localStorage.getItem('token');

  const [customAmount, setCustomAmount] = useState(admissionData?.amount !== undefined ? String(admissionData.amount) : '0');
  const finalAmount = Number(customAmount) || 0;

  const studentName = admissionData?.studentDetails?.name || 'student';
  const photoFile = admissionData?.photo || null;

  const buildPaymentFormData = (method) => {
    const fd = new FormData();
    fd.append('studentDetails', JSON.stringify(admissionData.studentDetails));
    fd.append('parentDetails', JSON.stringify(admissionData.parentDetails));
    fd.append('amount', String(finalAmount));
    fd.append('method', method);
    if (admissionData.paymentPlan) {
      fd.append('paymentPlan', admissionData.paymentPlan);
    }
    if (admissionData.tuitionFee) {
      fd.append('tuitionFee', String(admissionData.tuitionFee));
    }
    if (photoFile) fd.append('photo', photoFile);
    return fd;
  };
  const fireSuccess = useCallback((result) => {
    setStage('success');
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => onSuccess?.(result), 900);
  }, [onSuccess]);

  const startPolling = useCallback((paymentId) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/admission-payment/status/${paymentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data?.status === 'verified') {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setPayment(data.data);
          fireSuccess({
            applicationNumber: data.data.applicationNumber,
            studentId: data.data.studentDbId,
            receipt: null
          });
        }
      } catch (err) {
        console.error('Payment status poll failed:', err);
      }
    }, 3000);
  }, [token, fireSuccess]);

  // Load Razorpay config & script on mount
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

  // ---- CASH: collect instantly, student auto-saved by backend ----
  const handleCash = async () => {
    if (finalAmount <= 0) {
      alert('Please enter a valid admission fee amount greater than 0.');
      return;
    }
    setStage('verifying');
    setErrorMsg('');
    try {
      const res = await fetch('/api/admission-payment/create', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: buildPaymentFormData('cash')
      });
      const data = await res.json();
      if (data.success) {
        setPayment(data.data);
        fireSuccess({ applicationNumber: data.applicationNumber, studentId: data.studentId, receipt: data.receipt });
      } else {
        setStage('error');
        setErrorMsg(data.message || 'Cash collection failed.');
      }
    } catch (err) {
      console.error(err);
      setStage('error');
      setErrorMsg('Network error. Could not record cash payment.');
    }
  };

  // ---- UPI: collect instantly via Desk UPI QR, student auto-saved by backend ----
  const handleUpiDirect = async () => {
    if (finalAmount <= 0) {
      alert('Please enter a valid admission fee amount greater than 0.');
      return;
    }
    setStage('verifying');
    setErrorMsg('');
    try {
      const fd = buildPaymentFormData('upi');
      fd.append('isInstantDeskUpi', 'true');

      const res = await fetch('/api/admission-payment/create', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (data.success) {
        setPayment(data.data);
        fireSuccess({ applicationNumber: data.applicationNumber, studentId: data.studentId, receipt: data.receipt });
      } else {
        setStage('error');
        setErrorMsg(data.message || 'UPI collection failed.');
      }
    } catch (err) {
      console.error(err);
      setStage('error');
      setErrorMsg('Network error. Could not record UPI payment.');
    }
  };

  // ---- RAZORPAY: create payment record, open Razorpay checkout, then poll ----
  const handleRazorpay = async () => {
    if (finalAmount <= 0) {
      alert('Please enter a valid admission fee amount greater than 0.');
      return;
    }
    setStage('processing');
    setErrorMsg('');
    try {
      const res = await fetch('/api/admission-payment/create', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: buildPaymentFormData('razorpay')
      });
      const data = await res.json();
      if (data.success) {
        const paymentRecord = data.data;
        setPayment(paymentRecord);

        if (rzpKey && window.Razorpay) {
          const orderRes = await fetch('/api/razorpay/create-admission-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              admissionPaymentId: paymentRecord._id,
              amount: finalAmount
            })
          });
          const orderData = await orderRes.json();
          if (orderData.success && orderData.order) {
            const options = {
              key: rzpKey,
              amount: orderData.order.amount,
              currency: 'INR',
              name: 'Appletree Infotech',
              description: `Admission Fee - ${studentName}`,
              order_id: orderData.order.id,
              prefill: {
                name: studentName,
                email: admissionData.parentDetails.email,
                contact: admissionData.parentDetails.phone
              },
              theme: { color: '#FF7043' },
              handler: async () => {
                startPolling(paymentRecord._id);
              },
              modal: {
                ondismiss: () => {
                  startPolling(paymentRecord._id);
                }
              }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
          } else {
            setStage('error');
            setErrorMsg(orderData.message || 'Could not create Razorpay order.');
            return;
          }
        }
        startPolling(paymentRecord._id);
      } else {
        setStage('error');
        setErrorMsg(data.message || 'Could not start payment.');
      }
    } catch (err) {
      console.error(err);
      setStage('error');
      setErrorMsg(err.message || 'Network error. Could not start payment.');
    }
  };

  const handleSimulateWebhook = async () => {
    if (!payment) return;
    setStage('verifying');
    setErrorMsg('');
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
                  type: 'admission',
                  admissionPaymentId: payment._id
                }
              }
            }
          }
        })
      });
      if (res.ok) {
        const statusRes = await fetch(`/api/admission-payment/status/${payment._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const statusData = await statusRes.json();
        if (statusData.success && statusData.data?.status === 'verified') {
          if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
          setPayment(statusData.data);
          fireSuccess({
            applicationNumber: statusData.data.applicationNumber,
            studentId: statusData.data.studentDbId,
            receipt: null
          });
        } else {
          setStage('error');
          setErrorMsg('Payment not yet verified.');
        }
      } else {
        setStage('error');
        setErrorMsg('Failed to trigger simulated webhook.');
      }
    } catch (err) {
      console.error(err);
      setStage('error');
      setErrorMsg('Network error trying to simulate webhook.');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border-[6px] border-white rounded-[2.5rem] w-full max-w-md p-6 shadow-2xl relative text-slate-800 max-h-[92vh] overflow-y-auto">

        <button
          onClick={() => { if (pollRef.current) clearInterval(pollRef.current); onClose?.(); }}
          className="absolute flex items-center justify-center w-8 h-8 font-bold transition-colors rounded-full top-4 right-4 bg-slate-50 hover:bg-slate-100 text-slate-500"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="pb-3 space-y-1 text-center border-b-2 border-slate-100">
          <div className="w-12 h-12 rounded-full bg-brandMint/10 text-brandMint flex items-center justify-center mx-auto shadow-[inset_1px_1px_2px_white] mb-1">
            <Wallet className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-extrabold tracking-widest text-brandCoral bg-brandCoral/10 px-2.5 py-0.5 rounded-full uppercase">Admission Payment</span>
          <h4 className="font-quicksand font-bold text-slate-800 text-base mt-1">{studentName}</h4>
          <p className="text-[11px] text-slate-500">Amount to collect</p>
          {stage === 'choose' ? (
            <div className="flex items-center justify-center gap-1 max-w-[200px] mx-auto mt-1 border-2 border-slate-150 focus-within:border-brandCoral rounded-2xl px-3 py-1 bg-slate-50">
              <span className="text-lg font-bold text-slate-550 font-mono">₹</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full text-center text-xl font-extrabold text-brandCoral bg-transparent outline-none"
                placeholder="0"
              />
            </div>
          ) : (
            <p className="text-3xl font-extrabold text-brandCoral font-quicksand">₹{finalAmount.toLocaleString('en-IN')}</p>
          )}
        </div>

        {/* CHOOSE METHOD */}
        {stage === 'choose' && (
          <div className="py-5 space-y-3">
            <p className="text-xs font-semibold text-center text-slate-500">Select a payment method to confirm the admission.</p>
            <button
              onClick={() => setMethod('cash')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${method === 'cash' ? 'border-brandMint bg-brandMint/5' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <div className="w-10 h-10 rounded-full bg-brandMint/10 text-brandMint flex items-center justify-center"><Banknote className="w-5 h-5" /></div>
              <div className="text-left">
                <p className="font-quicksand font-bold text-sm text-slate-800">Cash</p>
                <p className="text-[10px] text-slate-500">Collect at the admission desk. Student saved instantly.</p>
              </div>
            </button>

            <button
              onClick={() => setMethod('razorpay')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${method === 'razorpay' ? 'border-brandSky bg-brandSky/5' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <div className="w-10 h-10 rounded-full bg-brandSky/10 text-brandSky flex items-center justify-center"><CreditCard className="w-5 h-5" /></div>
              <div className="text-left">
                <p className="font-quicksand font-bold text-sm text-slate-800">Razorpay</p>
                <p className="text-[10px] text-slate-500">Pay online via Razorpay. Student saved automatically once verified.</p>
              </div>
            </button>

            <button
              onClick={() => setMethod('upi')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${method === 'upi' ? 'border-brandCoral bg-brandCoral/5' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <div className="w-10 h-10 rounded-full bg-brandCoral/10 text-brandCoral flex items-center justify-center"><Wallet className="w-5 h-5" /></div>
              <div className="text-left">
                <p className="font-quicksand font-bold text-sm text-slate-800">Desk UPI</p>
                <p className="text-[10px] text-slate-500">Collect via desk UPI QR code. Student saved instantly.</p>
              </div>
            </button>

            <button
              disabled={!method}
              onClick={
                method === 'cash'
                  ? handleCash
                  : method === 'upi'
                    ? () => setStage('upiScanner')
                    : handleRazorpay
              }
              className={`w-full py-3 rounded-2xl font-quicksand font-bold text-xs transition-all ${method ? 'bg-brandCoral hover:bg-brandCoral-dark text-white shadow' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            >
              {method === 'cash'
                ? 'COLLECT CASH & CONFIRM'
                : method === 'upi'
                  ? 'COLLECT UPI & CONFIRM'
                  : 'PAY VIA RAZORPAY'}
            </button>
          </div>
        )}

        {/* UPI SCANNER DISPLAY */}
        {stage === 'upiScanner' && (
          <div className="py-4 space-y-4 text-center">
            <style>{`
              @keyframes scan {
                0%, 100% { top: 5%; }
                50% { top: 95%; }
              }
            `}</style>
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-3xl space-y-3">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-extrabold tracking-widest text-[#7C3AED] bg-[#EAE8FC] px-2.5 py-0.5 rounded-full uppercase">Scan to Pay</span>
                <h5 className="font-quicksand font-bold text-slate-800 text-sm mt-1">Appletree Infotech</h5>
                <p className="text-[10px] text-slate-400 font-mono">UPI ID: umeshchandra221-1@okaxis</p>
              </div>

              {/* QR Image display */}
              <div className="w-[200px] h-[200px] mx-auto bg-white border border-slate-150 rounded-2xl p-2.5 flex items-center justify-center shadow-sm relative overflow-hidden">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(
                    `upi://pay?pa=umeshchandra221-1@okaxis&pn=Appletree%20Infotech&am=${finalAmount}&cu=INR&tn=${encodeURIComponent(`Admission - ${studentName}`)}`
                  )}`}
                  alt="UPI QR Code Scanner"
                  className="w-full h-full object-contain"
                />
                {/* Scanner visual laser line */}
                <div className="absolute left-0 right-0 h-0.5 bg-brandCoral/75 shadow-[0_0_8px_#FF7043] animate-[scan_2.2s_ease-in-out_infinite]" />
              </div>

              <div className="text-center">
                <p className="text-xl font-extrabold text-brandCoral font-quicksand">
                  ₹{finalAmount.toLocaleString('en-IN')}
                </p>
                <p className="text-[9px] text-slate-400 font-medium mt-1 leading-normal max-w-[280px] mx-auto">
                  Scan this QR code using any UPI app (GPay, PhonePe, Paytm, BHIM, etc.) to pay.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleUpiDirect}
                className="w-full py-3 rounded-2xl bg-brandMint hover:bg-brandMint-dark text-white font-quicksand font-bold text-xs shadow-md transition-all active:scale-[0.98]"
              >
                CONFIRM PAYMENT RECEIVED
              </button>
              <button
                onClick={() => setStage('choose')}
                className="w-full py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-quicksand font-bold text-xs border border-slate-200 transition-all"
              >
                CANCEL / BACK
              </button>
            </div>
          </div>
        )}

        {/* PROCESSING / AUTO-POLLING */}
        {stage === 'processing' && (
          <div className="py-10 space-y-4 text-center">
            <Loader className="w-8 h-8 mx-auto animate-spin text-brandSky" />
            <p className="text-xs font-semibold text-slate-500">Opening Razorpay checkout…</p>
            <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-brandSky">
              <Loader className="w-3.5 h-3.5 animate-spin" />
              <span>Auto-detecting payment… waiting for confirmation</span>
            </div>
            {!rzpKey && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sandbox Controls</p>
                <button
                  onClick={handleSimulateWebhook}
                  className="w-full py-2.5 rounded-xl bg-brandCoral hover:bg-brandCoral-dark text-white font-quicksand font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" /> SIMULATE WEBHOOK SUCCESS (MOCK)
                </button>
              </div>
            )}
          </div>
        )}

        {/* VERIFYING */}
        {stage === 'verifying' && (
          <div className="py-10 text-center">
            <Loader className="w-8 h-8 mx-auto animate-spin text-brandCoral" />
            <p className="mt-3 text-xs font-semibold text-slate-500">Processing payment & registering student…</p>
          </div>
        )}

        {/* SUCCESS */}
        {stage === 'success' && (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-brandMint/10 text-brandMint flex items-center justify-center mx-auto shadow-[inset_1px_1px_2px_white]">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-quicksand font-bold text-slate-800">Admission Confirmed!</h4>
            <p className="text-xs text-slate-500">Payment received and the student has been saved automatically.</p>
            {payment?.applicationNumber && (
              <div className="bg-brandCream border border-orange-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Application No.</span>
                <p className="font-mono text-lg font-bold text-brandCoral">{payment.applicationNumber}</p>
              </div>
            )}
          </div>
        )}

        {/* ERROR */}
        {stage === 'error' && (
          <div className="py-8 text-center space-y-3">
            <p className="text-xs text-red-600">{errorMsg}</p>
            <button onClick={() => setStage('choose')} className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-quicksand font-bold text-xs">BACK</button>
          </div>
        )}

      </div>
    </div>
  );
}
