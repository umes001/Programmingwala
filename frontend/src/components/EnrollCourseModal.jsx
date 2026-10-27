import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle, CreditCard, Loader } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Admission-like enrollment form for buying a course.
 * The course name is auto-selected from the card the user clicked.
 *
 * Props:
 *  - course: the course object { _id, title, ... } (auto-selected)
 *  - onClose: () => void
 */
export default function EnrollCourseModal({ course, onClose }) {
  const [step, setStep] = useState(1);
  const [studentName, setStudentName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(course.price ? String(course.price) : '');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rzpKey, setRzpKey] = useState(null);
  const [rzpReady, setRzpReady] = useState(false);

  // Load Razorpay key id + inject the checkout script once on mount.
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
  }, []);

  const startRazorpayCheckout = (orderData, userContact) => {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error('Razorpay checkout failed to load. Check your connection.'));
        return;
      }
      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency || 'INR',
        name: 'Appletree Coaching Centre',
        description: `Enrollment: ${course.title}`,
        order_id: orderData.order.id,
        prefill: {
          name: userContact.name,
          email: userContact.email,
          contact: userContact.phone
        },
        theme: { color: '#FF7043' },
        notes: {
          type: 'course',
          courseId: String(course._id),
          courseTitle: course.title,
          studentName: userContact.name,
          email: userContact.email
        },
        handler: async (response) => {
          // Verify the payment signature on the server.
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                paymentMeta: {
                  courseTitle: course.title,
                  studentName: userContact.name,
                  email: userContact.email
                }
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) resolve(verifyData);
            else reject(new Error(verifyData.message || 'Payment verification failed.'));
          } catch (err) {
            reject(err);
          }
        },
        modal: { ondismiss: () => reject(new Error('Payment cancelled.')) }
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => reject(new Error(resp?.error?.description || 'Payment failed.')));
      rzp.open();
    });
  };

  const handlePay = async () => {
    if (!amount || Number(amount) <= 0) return alert('Please enter a valid fee amount.');
    setSubmitting(true);
    try {
      // 1. Create a Razorpay order (requires the user to be logged in).
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId: course._id,
          courseTitle: course.title,
          amount: Number(amount),
          studentDetails: {
            name: studentName,
            dateOfBirth: dob,
            gender
          },
          parentDetails: {
            fatherName,
            motherName,
            email,
            phone,
            address
          }
        })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Could not start payment.');
      }

      // Open the Razorpay checkout (UPI / cards / wallets). The webhook confirms
      // payment on the backend; the client handler verifies the signature too.
      await startRazorpayCheckout(orderData, { name: studentName, email, phone });
      setSubmitting(false);
      setSuccess(true);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      alert(err.message || 'Payment could not be completed.');
    }
  };

  const inputCls = 'w-full p-3 text-xs border border-orange-100 outline-none bg-slate-50 focus:border-brandCoral rounded-xl';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-orange-100">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-orange-100">
          <div>
            <h3 className="text-lg font-bold font-quicksand text-slate-800">Enroll in Course</h3>
            <p className="text-[11px] text-slate-500">Course: <span className="font-bold text-brandCoral">{course.title}</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="py-10 space-y-4 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-brandMint/10 text-brandMint">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold font-quicksand text-slate-800">Enrollment Confirmed!</h3>
              <p className="max-w-md mx-auto text-xs leading-relaxed text-slate-500">
                Your enrollment for <span className="font-bold text-brandCoral">{course.title}</span> has been recorded successfully. Our team will reach out with next steps.
              </p>
              <button onClick={onClose} className="font-quicksand font-bold text-xs bg-brandCoral text-white px-6 py-2.5 rounded-full">
                DONE
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Step indicator */}
              <div className="flex items-center justify-between max-w-md pb-3 mx-auto text-xs font-bold border-b border-slate-100 text-slate-400 font-quicksand">
                <span className={step >= 1 ? 'text-brandCoral' : ''}>1. Student Details</span>
                <span>→</span>
                <span className={step >= 2 ? 'text-brandCoral' : ''}>2. Parent Details</span>
                <span>→</span>
                <span className={step >= 3 ? 'text-brandCoral' : ''}>3. Payment</span>
              </div>

              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="pb-2 text-base font-bold border-b font-quicksand text-slate-800 border-orange-50">Student Information</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">Student's Full Name</label>
                    <input type="text" required value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="e.g. Aiden Jenkins" className={inputCls} />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Date of Birth</label>
                      <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)} className={inputCls} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Gender</label>
                      <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputCls}>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Course (auto-selected)</label>
                      <input type="text" value={course.title} readOnly className={`${inputCls} font-bold text-brandCoral-dark bg-brandCoral/5`} />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="button" onClick={() => { if (!studentName.trim() || !dob) return alert('Please fill in student details'); setStep(2); }} className="flex items-center px-6 py-3 space-x-1 text-xs font-bold text-white rounded-full shadow font-quicksand bg-brandCoral hover:bg-brandCoral-dark">
                      <span>NEXT: PARENT DETAILS</span><ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="pb-2 text-base font-bold border-b font-quicksand text-slate-800 border-orange-50">Parent Information</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Father's Full Name</label>
                      <input type="text" required value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="John Jenkins" className={inputCls} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Mother's Full Name</label>
                      <input type="text" required value={motherName} onChange={(e) => setMotherName(e.target.value)} placeholder="Sarah Jenkins" className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Email Address</label>
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="parent@example.com" className={inputCls} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Contact Number</label>
                      <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className={inputCls} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">Home Address</label>
                    <textarea required rows={2} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, Area, City" className={`${inputCls} resize-none`} />
                  </div>
                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => setStep(1)} className="flex items-center px-6 py-3 space-x-1 text-xs font-bold rounded-full font-quicksand bg-slate-100 hover:bg-slate-200 text-slate-600">
                      <ArrowLeft className="w-4 h-4" /><span>BACK</span>
                    </button>
                    <button type="button" onClick={() => { if (!fatherName.trim() || !email || !phone) return alert('Please fill in parent details'); setStep(3); }} className="flex items-center px-6 py-3 space-x-1 text-xs font-bold text-white rounded-full shadow font-quicksand bg-brandCoral hover:bg-brandCoral-dark">
                      <span>NEXT: PAYMENT</span><ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment */}
              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="pb-2 text-base font-bold border-b font-quicksand text-slate-800 border-orange-50">Payment</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">Course Fee (INR)</label>
                    <input type="number" readOnly value={amount} className={`${inputCls} bg-slate-100/80 cursor-not-allowed font-bold text-slate-700`} />
                    <p className="text-[11px] text-slate-500">Course fee is auto-assigned from course program settings.</p>
                  </div>

                  {!rzpKey ? (
                    <div className="p-3 text-[11px] rounded-xl bg-red-50 border border-red-200 text-red-700">
                      Razorpay is not configured. Payments are disabled until <code className="font-bold">RAZORPAY_KEY_ID</code> and <code className="font-bold">RAZORPAY_KEY_SECRET</code> are added to the backend <code>.env</code>.
                    </div>
                  ) : (
                    <div className="p-3 text-[11px] rounded-xl bg-brandMint/10 border border-brandMint/30 text-brandMint-dark">
                      Pay securely via <span className="font-bold">UPI (GPay / PhonePe)</span>, card, or wallet through Razorpay. A receipt is generated automatically on success.
                    </div>
                  )}

                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => setStep(2)} className="flex items-center px-6 py-3 space-x-1 text-xs font-bold rounded-full font-quicksand bg-slate-100 hover:bg-slate-200 text-slate-600">
                      <ArrowLeft className="w-4 h-4" /><span>BACK</span>
                    </button>
                    <button type="button" onClick={handlePay} disabled={submitting || !rzpKey || !rzpReady} className="flex items-center px-6 py-3 space-x-2 text-xs font-bold text-white rounded-full shadow font-quicksand bg-brandCoral hover:bg-brandCoral-dark disabled:opacity-50 disabled:cursor-not-allowed">
                      {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                      <span>{submitting ? 'Processing...' : !rzpReady && rzpKey ? 'LOADING CHECKOUT...' : 'PAY & ENROLL'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
