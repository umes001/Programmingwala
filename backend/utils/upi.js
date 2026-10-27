// UPI deep-link + QR helpers for admission payments.
// No payment gateway required: we build a standard upi://pay URI and render
// a scannable QR. The admin/parent scans it, pays, then the payment is
// verified (manual confirm or auto-poll) before the student is saved.

import QRCode from 'qrcode';

// School UPI VPA + display name. Override via .env for production.
export const UPI_PAYEE_VPA = process.env.UPI_PAYEE_VPA || 'umeshchandra221-1@okaxis';
export const UPI_PAYEE_NAME = process.env.UPI_PAYEE_NAME || 'Appletree Coaching';

// Build a standard UPI deep link per the BHIM/UPI spec.
// upi://pay?pa=<vpa>&pn=<name>&am=<amount>&tn=<note>&tr=<ref>
export function buildUpiDeepLink({ amount, txnRef, note }) {
  const params = new URLSearchParams();
  params.set('pa', UPI_PAYEE_VPA);
  params.set('pn', UPI_PAYEE_NAME);
  if (amount && Number(amount) > 0) {
    params.set('am', String(Number(amount).toFixed(2)));
    params.set('cu', 'INR');
  }
  if (txnRef) params.set('tr', txnRef);
  params.set('tn', note || `Admission Fee ${txnRef || ''}`.trim());
  return `upi://pay?${params.toString()}`;
}

// Render a UPI deep link as a base64 PNG data URL (for <img src>).
export async function buildUpiQrDataUrl(deepLink) {
  try {
    return await QRCode.toDataURL(deepLink, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 260,
      color: { dark: '#0f172a', light: '#ffffff' }
    });
  } catch (err) {
    console.error('QR generation failed:', err.message);
    return '';
  }
}
