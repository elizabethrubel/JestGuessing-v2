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
    text: 'Every player shares the secret bond.',
    subtext: 'Pay close attention to the answers your companions receive—they hold the key to your own identity.',
  },
  {
    id: 'q2',
    text: '“Is my character from sci-fi or fantasy?”',
    subtext: 'Separates magical and futuristic realms from historical or contemporary worlds.',
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
    subtext: 'Pinpoints modern pop-culture icons versus classical legends.',
  },
  {
    id: 'q5',
    text: '“Is my character an antagonist or villain?”',
    subtext: 'Distinguishes righteous heroes from iconic rogues and tyrants.',
  },
];

interface LatencyTipsOverlayProps {
  title?: string;
  subtitle?: string;
}

export const LatencyTipsOverlay: React.FC<LatencyTipsOverlayProps> = ({
  title = 'Divining the Bond',
  subtitle = 'Summoning secret identities for the court...',
}) => {
  const shuffledQueue = useMemo(() => {
    const arr = [...ALL_YES_NO_QUESTIONS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 < shuffledQueue.length ? prev + 1 : 0));
    }, 5500);
    return () => clearInterval(timer);
  }, [shuffledQueue.length]);

  const currentTip = shuffledQueue[currentIndex];

  return (
    <div
      id="latency-tips-overlay"
      className="fixed inset-0 z-50 bg-[#09120e]/96 backdrop-blur-md flex flex-col items-center justify-between p-6 sm:p-10 text-center select-none animate-in fade-in duration-300"
    >
      {/* Top Heraldic Knot */}
      <div className="pt-4">
        <svg
          className="w-8 h-8 text-[#b9bfff] animate-spin"
          style={{ animationDuration: '12s' }}
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M16 16c-4.5-4.5-9.5-4.5-9.5 0s5 4.5 9.5 0z" />
          <path d="M16 16c4.5-4.5 9.5-4.5 9.5 0s-5 4.5-9.5 0z" />
          <path d="M16 16c-4.5-4.5-4.5-9.5 0-9.5s4.5 5 0 9.5z" />
          <path d="M16 16c-4.5 4.5-4.5 9.5 0 9.5s4.5-5 0-9.5z" />
        </svg>
      </div>

      {/* Center Jester & Goose + Title */}
      <div className="my-auto flex flex-col items-center space-y-4 max-w-lg mx-auto">
        <img
          src="/assets/jester-goose.png"
          alt=""
          className="w-40 sm:w-48 h-auto object-contain opacity-90 drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
        />
        <span className="text-xs uppercase tracking-[0.25em] text-[#b9bfff]">
          PREPARING THE COURT
        </span>
        <h2 className="text-4xl sm:text-5xl font-jacquard text-[#f4efe4] leading-tight">
          {title}
        </h2>
        <p className="font-serif-editorial italic text-lg text-[#f4efe4]/75 max-w-xs mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Bottom Parlor Tip */}
      <div className="w-full max-w-md mx-auto border-t border-[#f4efe4]/20 pt-5 pb-2 space-y-1.5">
        <span className="text-[11px] uppercase tracking-[0.22em] text-[#e03a28] block">
          COUNSEL FOR YOUR TURN
        </span>
        <p className="font-serif-editorial italic text-xl text-[#f4efe4]">
          {currentTip.text}
        </p>
        {currentTip.subtext && (
          <p className="text-xs text-[#f4efe4]/60 max-w-sm mx-auto">
            {currentTip.subtext}
          </p>
        )}
      </div>
    </div>
  );
};
