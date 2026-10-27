import React, { useRef } from 'react';
import { X, Printer, Download, Share2, Check, ShieldCheck, ExternalLink } from 'lucide-react';
import CertificateDocument from './CertificateDocument.jsx';

export default function CertificateModal({ certificate, isOpen, onClose }) {
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef(null);

  if (!isOpen || !certificate) return null;

  const verifyUrl = `${window.location.origin}/verify-certificate/${encodeURIComponent(certificate.certificateNumber)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto print:border-none print:shadow-none print:bg-white print:rounded-none print:m-0 print:max-w-none">
        
        {/* Modal Top Bar (hidden during printing) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 text-white print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Internship Certificate Preview
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-normal border border-emerald-500/30">
                  {certificate.certificateNumber}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Official Apple Tree Infotech completion credential
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Verification Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
              title="Copy public verification link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-300" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            {/* Open Verification Page */}
            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-xs font-bold text-sky-400 border border-sky-500/30 transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Verify Page</span>
            </a>

            {/* Print / Save as PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-xs font-bold text-white shadow-lg shadow-emerald-900/30 transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Rendering Area */}
        <div className="p-4 sm:p-8 bg-slate-950/60 overflow-x-auto flex justify-center print:p-0 print:bg-white print:overflow-visible">
          <div ref={printRef} className="w-full max-w-[960px]">
            <CertificateDocument certificate={certificate} />
          </div>
        </div>

        {/* Bottom Helper Bar (hidden during printing) */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/60 text-slate-400 text-xs flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Publicly verifiable with dynamic QR code & serial number</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            Press Ctrl+P / Cmd+P to save as high-res landscape PDF
          </span>
        </div>

      </div>
    </div>
  );
}
