import React, { useState, useRef, useEffect } from 'react';
import { Player, ThemePack } from '../types';
import { triggerHaptic, playTurnActiveTone, playHoldTick } from '../utils/audio';
import { TopNavBar } from './TopNavBar';

interface PrivacyInterstitialScreenProps {
  activePlayer: Player;
  theme: ThemePack;
  turnNumber: number;
  totalPlayers: number;
  isLastTurnRound?: boolean;
  onUnlock: () => void;
  onSkipPlayer: () => void;
  onOpenRules: () => void;
  onGoHome: () => void;
}

export const PrivacyInterstitialScreen: React.FC<PrivacyInterstitialScreenProps> = ({
  activePlayer,
  theme,
  turnNumber,
  isLastTurnRound,
  onUnlock,
  onSkipPlayer,
  onOpenRules,
  onGoHome,
}) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  const HOLD_DURATION = 900;
  const CIRCLE_RADIUS = 46;
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

  const startHold = () => {
    setHolding(true);
    setProgress(0);
    lastTickRef.current = 0;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / HOLD_DURATION) * 100);
      setProgress(pct);

      const tickInterval = 180;
      if (elapsed - lastTickRef.current >= tickInterval) {
        lastTickRef.current = elapsed;
        const pitchFactor = 0.85 + (pct / 100) * 0.55;
        playHoldTick(pitchFactor);
      }

      if (pct >= 100) {
        triggerHaptic([40, 30, 80]);
        playTurnActiveTone();
        onUnlock();
      } else {
        timerRef.current = requestAnimationFrame(tick);
      }
    };
    timerRef.current = requestAnimationFrame(tick);
  };

  const cancelHold = () => {
    setHolding(false);
    setProgress(0);
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, []);

  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - progress / 100);

  return (
    <div
      id="privacy-interstitial-screen"
      className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between py-2 sm:py-4 px-4 sm:px-8 text-center select-none relative min-h-[100dvh]"
    >
      {/* Ambient Periwinkle & Vermilion Vignette When Holding */}
      {holding && (
        <div
          className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-150"
          style={{
            opacity: 0.25 + (progress / 100) * 0.55,
            background:
              'radial-gradient(circle at center, rgba(185, 191, 255, 0.16) 0%, rgba(224, 58, 40, 0.12) 55%, rgba(9, 18, 14, 0.75) 100%)',
          }}
        />
      )}

      <TopNavBar
        onGoHome={onGoHome}
        onOpenRules={onOpenRules}
        theme={theme}
        isLastTurnRound={isLastTurnRound}
      />

      {/* Main Focus: Heraldic Seal & Monumental Player Name */}
      <div className="my-auto py-6 flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-6 relative z-20">
        {/* Progress Ring with 1-Bit Pixel Turn Badge */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="#f4efe4"
              strokeOpacity="0.18"
              strokeWidth="1.5"
            />
            <circle
              cx="50"
              cy="50"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="#b9bfff"
              strokeWidth="2.5"
              strokeDasharray={CIRCLE_CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="butt"
              className="transition-[stroke-dashoffset] duration-75 ease-linear"
            />
          </svg>

          <div
            className={`absolute inset-4 rounded-full flex items-center justify-center transition-all duration-200 border ${
              holding
                ? 'bg-[#b9bfff]/15 border-[#b9bfff] text-[#f4efe4]'
                : 'bg-[#09120e] border-[#f4efe4]/30 text-[#f4efe4]'
            }`}
          >
            <div className="pixel-ring text-xs sm:text-sm font-semibold text-[#f4efe4]">
              {turnNumber}
            </div>
          </div>
        </div>

        {/* Player Name & Classical Serif Instruction */}
        <div className="space-y-3 flex flex-col items-center justify-center">
          <p className="text-xs sm:text-[13px] font-medium uppercase tracking-[0.25em] text-[#b9bfff]">
            PASS DEVICE TO
          </p>
          <h1
            className={`${
              activePlayer.name.length > 12
                ? 'text-5xl sm:text-7xl lg:text-8xl'
                : 'text-7xl sm:text-8xl lg:text-9xl'
            } font-jacquard text-[#f4efe4] leading-[0.9] text-center break-words max-w-full px-2`}
          >
            {activePlayer.name}
          </h1>
          <p className="font-serif-editorial italic text-lg sm:text-2xl text-[#f4efe4]/80 max-w-md mx-auto pt-1">
            Face the screen toward the table before unsealing the identity.
          </p>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="w-full sticky bottom-0 z-30 pb-safe pb-4 pt-3 bg-gradient-to-t from-[#09120e] via-[#09120e]/95 to-transparent">
        <div className="max-w-md sm:max-w-xl mx-auto flex flex-col items-center space-y-3">
          <button
            id="hold-to-unlock-btn"
            type="button"
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={startHold}
            onTouchEnd={cancelHold}
            className={`w-full min-h-[52px] py-4 px-6 border transition-all duration-150 flex items-center justify-center relative overflow-hidden cursor-pointer select-none ${
              holding
                ? 'border-[#b9bfff] shadow-[0_0_28px_rgba(185,191,255,0.25)]'
                : 'border-[#f4efe4]/80 hover:border-[#b9bfff] bg-[#09120e]/90'
            }`}
          >
            <div
              className="absolute inset-y-0 left-0 bg-[#f4efe4] transition-all duration-75 ease-linear pointer-events-none"
              style={{ width: `${progress}%` }}
            />

            <span
              className={`text-xs sm:text-[13px] font-semibold uppercase tracking-[0.2em] relative z-10 transition-colors ${
                progress > 48 ? 'text-[#09120e]' : 'text-[#f4efe4]'
              }`}
            >
              {holding
                ? progress > 80
                  ? 'REVEALING IDENTITY...'
                  : 'UNSEALING...'
                : 'PRESS & HOLD TO REVEAL'}
            </span>
          </button>

          <button
            id="skip-player-turn-btn"
            type="button"
            onClick={onSkipPlayer}
            className="py-1.5 px-3 text-xs uppercase tracking-[0.18em] text-[#f4efe4]/55 hover:text-[#b9bfff] transition-colors cursor-pointer"
          >
            SKIP {activePlayer.name.toUpperCase()}’S TURN →
          </button>
        </div>
      </div>
    </div>
  );
};
