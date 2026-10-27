import React from 'react';

/**
 * Appletree logo — a green tree with red apples.
 * Props:
 *  - size: pixel size (default 36)
 *  - className: extra classes for the wrapper
 */
export default function Logo({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Appletree Coaching Centre logo"
    >
      {/* Brown trunk */}
      <rect x="28" y="38" width="8" height="18" rx="2" fill="#8B5E34" />

      {/* Foliage layers (green tree) */}
      <circle cx="32" cy="22" r="14" fill="#2E7D32" />
      <circle cx="22" cy="28" r="11" fill="#388E3C" />
      <circle cx="43" cy="28" r="11" fill="#43A047" />
      <circle cx="32" cy="14" r="10" fill="#43A047" />

      {/* Red apples */}
      <circle cx="24" cy="24" r="4" fill="#E53935" />
      <circle cx="40" cy="24" r="4" fill="#E53935" />
      <circle cx="32" cy="32" r="4" fill="#EF5350" />

      {/* Apple highlights */}
      <circle cx="23" cy="23" r="1.2" fill="#FFCDD2" />
      <circle cx="39" cy="23" r="1.2" fill="#FFCDD2" />

      {/* Apple stems / leaves */}
      <path d="M24 19.5c0-1.5.6-2.2 1.4-2.5" stroke="#5D4037" strokeWidth="1" strokeLinecap="round" />
      <path d="M40 19.5c0-1.5-.6-2.2-1.4-2.5" stroke="#5D4037" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
