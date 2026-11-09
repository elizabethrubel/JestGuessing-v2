import React, { useState, useEffect, useMemo } from 'react';

interface TipItem {
  id: string;
  text: string;
  subtext?: string;
}

const ALL_YES_NO_QUESTIONS: TipItem[] = [
  {
    id: 'q1',
    text: '“Is my character a human?”',
    subtext: 'Rules out mythical beasts, aliens, automatons, and deities.',
  },
  {
    id: 's1',
    text: 'Every player shares the secret trait.',
    subtext: 'Pay attention to the answers your rivals receive—they hold the clue to your own identity.',
  },
  {
    id: 'q2',
    text: '“Is my character from sci-fi or fantasy?”',
    subtext: 'Separates magical and futuristic realms from real-world or historical settings.',
  },
  {
    id: 'q3',
    text: '“Is my character animated?”',
    subtext: 'Quickly narrows down hand-drawn, cartoon, and CGI creations.',
  },
  {
    id: 's2',
    text: 'Ask broad category questions first.',
    subtext: 'Eliminate half the possibilities before narrowing in on specific names.',
  },
  {
    id: 'q4',
    text: '“Was my character created after the year 2000?”',
    subtext: 'Pinpoints modern pop-culture vs. classical and nostalgic icons.',
  },
  {
    id: 'q5',
    text: '“Is my character an antagonist or villain?”',
    subtext: 'Distinguishes righteous protagonists from iconic rogues and tyrants.',
  },
  {
    id: 's3',
    text: 'A “No” is as valuable as a “Yes”.',
    subtext: 'A single negative answer eliminates whole franchises and archetypes.',
  },
  {
    id: 'q6',
    text: '“Does my character wear armor, a cape, or a mask?”',
    subtext: 'Isolates knights, vigilantes, warriors, and cloaked figures.',
  },
  {
    id: 'q7',
    text: '“Does my character possess magical or supernatural powers?”',
    subtext: 'Separates ordinary mortals from sorcerers, superheroes, and mythical beings.',
  },
  {
    id: 'q8',
    text: '“Is my character a real historical person?”',
    subtext: 'Separates legendary fiction from actual human history.',
  },
  {
    id: 'q9',
    text: '“Does my character fight with a blade or archaic weapon?”',
    subtext: 'Identifies swordsmen, rangers, duelists, and ancient champions.',
  },
];

interface LatencyTipsOverlayProps {
  title?: string;
  subtitle?: string;
}

export const LatencyTipsOverlay: React.FC<LatencyTipsOverlayProps> = ({
  title = 'Divining the Commonality',
  subtitle = 'Consulting the royal archives to bind all players under one secret decree...',
}) => {
  // Shuffle list once on mount so hints/questions NEVER repeat during loading
  const shuffledQueue = useMemo(() => {
    const arr = [...ALL_YES_NO_QUESTIONS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const CYCLE_MS = 6000; // 6 seconds per tip

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 < shuffledQueue.length ? prev + 1 : 0));
    }, CYCLE_MS);

    return () => clearInterval(timer);
  }, [shuffledQueue.length]);

  const currentTip = shuffledQueue[currentIndex];

  return (
    <div
      id="latency-tips-overlay"
      className="fixed inset-0 z-50 bg-[#060910]/95 backdrop-blur-md flex flex-col items-center justify-between p-6 sm:p-10 text-center select-none animate-in fade-in duration-300"
    >
      {/* ============================================================ */}
      {/* PRIMARY HIERARCHY: Visually Striking Medieval Astrolabe & Status */}
      {/* ============================================================ */}
      <div className="pt-8 sm:pt-14 flex flex-col items-center space-y-5 max-w-md mx-auto">
        {/* Medieval Astrolabe / Celestial Armillary Loading Animation */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          {/* Outer Radiant Glow */}
          <div className="absolute inset-0 rounded-full bg-[#d4b76a]/15 blur-lg animate-pulse" />

          {/* Layer 1: Outer Astrolabe Ring with 12 Medieval Cardinal Notches (Slow Clockwise) */}
          <svg
            className="absolute inset-0 w-full h-full animate-[spin_24s_linear_infinite]"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#cbb279"
              strokeWidth="1.5"
              strokeOpacity="0.45"
            />
            {/* 12 Astrological Graduation Marks */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 50 + 44 * Math.cos(angle);
              const y1 = 50 + 44 * Math.sin(angle);
              const x2 = 50 + 48 * Math.cos(angle);
              const y2 = 50 + 48 * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#d4b76a"
                  strokeWidth={i % 3 === 0 ? "2" : "1"}
                  strokeOpacity="0.8"
                />
              );
            })}
          </svg>

          {/* Layer 2: Contra-Rotating Medieval Zodiac Band (Counter-Clockwise) */}
          <svg
            className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] animate-[spin_12s_linear_infinite_reverse]"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#d4b76a"
              strokeWidth="1"
              strokeDasharray="4 6"
              strokeOpacity="0.6"
            />
            {/* 4 Cardinal Diamond Bosses */}
            {[0, 90, 180, 270].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const cx = 50 + 44 * Math.cos(rad);
              const cy = 50 + 44 * Math.sin(rad);
              return (
                <circle
                  key={deg}
                  cx={cx}
                  cy={cy}
                  r="2.5"
                  fill="#fbf0cf"
                  stroke="#1a120c"
                  strokeWidth="0.8"
                />
              );
            })}
          </svg>

          {/* Layer 3: Inner Golden Sun-Compass Gear (Faster Clockwise) */}
          <svg
            className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)] animate-[spin_6s_linear_infinite]"
            viewBox="0 0 100 100"
          >
            {/* 8-Pointed Star / Sun Rays */}
            <polygon
              points="50,15 58,38 82,38 62,52 70,75 50,60 30,75 38,52 18,38 42,38"
              fill="none"
              stroke="#d4b76a"
              strokeWidth="1.5"
              strokeOpacity="0.75"
            />
          </svg>

          {/* Center: Radiant Illuminated Gemstone / Oculus */}
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#fbf0cf] via-[#d4b76a] to-[#7d5e1f] p-[1.5px] shadow-[0_0_16px_rgba(212,183,106,0.6)]">
            <div className="w-full h-full rounded-full bg-[#0c121e] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#fbf0cf] animate-ping opacity-75" />
              <div className="absolute w-2 h-2 rounded-full bg-[#d4b76a]" />
            </div>
          </div>
        </div>

        {/* Primary Headline: Dominant visual hierarchy in Jacquard 24 */}
        <div className="space-y-1.5 text-center">
          <h2 className="text-4xl sm:text-5xl font-jacquard text-[#fbf0cf] tracking-wider leading-tight drop-shadow-md">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#d4b76a]/90 font-sans tracking-wide max-w-sm mx-auto leading-relaxed font-medium">
            {subtitle}
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECONDARY HIERARCHY: Helpful Non-Repeating Tips & Inquiries */}
      {/* ============================================================ */}
      <div className="my-auto w-full max-w-md px-6 py-6 flex flex-col items-center">
        {/* Clean Medieval Section Divider */}
        <div className="w-full flex items-center justify-center space-x-3 mb-4 opacity-35">
          <div className="h-px bg-gradient-to-r from-transparent via-[#cbb279] to-transparent w-20" />
          <span className="text-[10px] text-[#cbb279]">✦</span>
          <div className="h-px bg-gradient-to-r from-transparent via-[#cbb279] to-transparent w-20" />
        </div>

        {/* The Help Text: Clearly secondary color, lighter weight */}
        <div
          key={currentTip.id}
          className="animate-in fade-in duration-700 ease-out flex flex-col items-center text-center space-y-2 min-h-[85px] justify-center"
        >
          {/* Main Question / Tip: Muted warm parchment */}
          <p className="text-base sm:text-lg font-normal text-[#c2baa8] tracking-wide leading-relaxed font-sans">
            {currentTip.text}
          </p>
          {/* Subtext: Faint sepia, supportive */}
          {currentTip.subtext && (
            <p className="text-xs sm:text-sm text-[#78716c] font-sans italic leading-normal max-w-xs">
              {currentTip.subtext}
            </p>
          )}
        </div>
      </div>

      {/* Clean bottom anchor spacing (badge and bottom text removed per instructions) */}
      <div className="pb-4" />
    </div>
  );
};
