import React, { useEffect, useState, useRef } from 'react';

export default function KbcLaserLogoReveal({ onComplete }) {
  const [hasVideo, setHasVideo] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback to muted if browser blocks sound without direct gesture
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white overflow-hidden select-none">
      
      {/* ── HIGH-DEFINITION LASER SHOW VIDEO ONLY (NO OVERLAY / NO LOGO) ── */}
      {hasVideo && (
        <video
          ref={videoRef}
          src="/kbc-logo-reveal.mp4"
          autoPlay
          playsInline
          onEnded={() => {
            if (onComplete) onComplete();
          }}
          onError={() => {
            setHasVideo(false);
            if (onComplete) onComplete();
          }}
          className="w-full h-full object-cover"
        />
      )}

      {/* Subtle Skip Button */}
      <button
        onClick={onComplete}
        className="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-black/60 hover:bg-black/90 border border-white/20 text-white/80 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer z-50 backdrop-blur-md"
      >
        <span>Skip Intro</span>
        <span>⏩</span>
      </button>

    </div>
  );
}
