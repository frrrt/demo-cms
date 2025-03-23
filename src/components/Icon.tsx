import React from "react";

export default function Icon({ width = 18, height = 18 }: { width?: number; height?: number }) {
  return (
    <div style={{ width, height }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3498db" />
            <stop offset="100%" stopColor="#2980b9" />
          </linearGradient>
          <linearGradient id="secondaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2c3e50" />
            <stop offset="100%" stopColor="#1a2530" />
          </linearGradient>
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e74c3c" />
            <stop offset="100%" stopColor="#c0392b" />
          </linearGradient>
        </defs>

        <circle cx="60" cy="60" r="56" fill="white" stroke="#eaeaea" strokeWidth="2" />

        <g transform="translate(60, 60)">
          <rect
            x="-36"
            y="-10"
            width="50"
            height="38"
            rx="3"
            ry="3"
            fill="url(#secondaryGradient)"
            transform="rotate(-8)"
          />

          <rect
            x="-30"
            y="-18"
            width="50"
            height="38"
            rx="3"
            ry="3"
            fill="url(#primaryGradient)"
            transform="rotate(-4)"
          />

          <rect
            x="-26"
            y="-26"
            width="50"
            height="38"
            rx="3"
            ry="3"
            fill="white"
            stroke="#eaeaea"
            strokeWidth="1"
          />

          <line x1="-18" y1="-18" x2="12" y2="-18" stroke="#eaeaea" strokeWidth="2" />
          <line x1="-18" y1="-12" x2="12" y2="-12" stroke="#eaeaea" strokeWidth="2" />
          <line x1="-18" y1="-6" x2="5" y2="-6" stroke="#eaeaea" strokeWidth="2" />
        </g>

        {/* Module/Component Blocks representing CMS functionality */}
        <g transform="translate(60, 60)">
          {/* Modular block 1 */}
          <rect x="4" y="-32" width="22" height="22" rx="3" ry="3" fill="url(#primaryGradient)" />
          <rect x="8" y="-28" width="14" height="6" rx="1" ry="1" fill="white" opacity="0.6" />
          <rect x="8" y="-20" width="14" height="6" rx="1" ry="1" fill="white" opacity="0.4" />

          {/* Modular block 2 */}
          <rect x="12" y="-8" width="22" height="22" rx="3" ry="3" fill="url(#secondaryGradient)" />
          <rect x="16" y="-4" width="14" height="6" rx="1" ry="1" fill="white" opacity="0.6" />
          <rect x="16" y="4" width="14" height="6" rx="1" ry="1" fill="white" opacity="0.4" />

          {/* Accent element */}
          <circle cx="18" cy="21" r="12" fill="url(#accentGradient)" />
          <path
            d="M12,21 L16,25 L24,17"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}
