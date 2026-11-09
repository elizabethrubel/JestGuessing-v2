import React, { useState, useRef, useEffect } from 'react';
import { Player, ThemePack } from '../types';
import { triggerHaptic, playTurnActiveTone, playHoldTick } from '../utils/audio';
import { TopNavBar } from './TopNavBar';
import { MedievalIcon } from './MedievalIcon';

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

  // Hold duration: 900ms for deliberate confirmation
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

      // Rhythmic subtle haptic and audio ticks as progress builds up
      const tickInterval = 180; // ms
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
      className="w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto flex-1 flex flex-col justify-between py-4 px-4 text-center select-none relative"
    >
      {/* Ambient medieval vignette when holding - deep burgundy & gold atmosphere without cartoon sparkles */}
      {holding && (
        <div
          className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-150"
          style={{
            opacity: 0.2 + (progress / 100) * 0.6,
            background: 'radial-gradient(circle at center, rgba(212, 183, 106, 0.12) 0%, rgba(42, 19, 16, 0.3) 60%, rgba(6, 9, 16, 0.7) 100%)',
          }}
        />
      )}

      {/* Consistent Top Navigation with Home, Theme, and Rules */}
      <TopNavBar
        onGoHome={onGoHome}
        onOpenRules={onOpenRules}
        theme={theme}
        isLastTurnRound={isLastTurnRound}
      />

      {/* Main Focus: Majestic Player Name and Astrolabe Royal Seal */}
      <div className="my-auto py-6 flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-6">
        {/* Astrolabe / Royal Seal with animated circular gold progress track */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="medievalGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbf0cf" />
                <stop offset="50%" stopColor="#d4b76a" />
                <stop offset="100%" stopColor="#ba9848" />
              </linearGradient>
            </defs>

            {/* Static background track */}
            <circle
              cx="50"
              cy="50"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="#cbb279"
              strokeOpacity="0.2"
              strokeWidth="2.5"
            />

            {/* Dynamic illuminated gold leaf progress ring */}
            <circle
              cx="50"
              cy="50"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="url(#medievalGold)"
              strokeWidth="3.5"
              strokeDasharray={CIRCLE_CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-75 ease-linear"
            />
          </svg>

          {/* Central Medallion */}
          <div
            className={`absolute inset-3 rounded-full flex items-center justify-center transition-all duration-200 border ${
              holding
                ? 'bg-[#1e110c] border-[#d4b76a] text-[#fbf0cf] shadow-[0_0_24px_rgba(212,183,106,0.4)]'
                : 'bg-[#0d1422] border-[#cbb279]/35 text-[#cbb279] shadow-inner'
            }`}
          >
            {holding ? (
              <MedievalIcon name="star" className="text-xl text-[#d4b76a] animate-pulse" />
            ) : (
              <MedievalIcon name="shield" className="text-xl text-[#cbb279]" />
            )}
          </div>
        </div>

        {/* Player Name unconstrained by arch boxes */}
        <div className="space-y-2 flex flex-col items-center justify-center">
          <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-[#cbb279]">
            Pass device to
          </p>
          <h1 className={`${activePlayer.name.length > 12 ? 'text-5xl sm:text-6xl md:text-7xl' : activePlayer.name.length > 8 ? 'text-6xl sm:text-7xl md:text-8xl' : 'text-7xl sm:text-8xl md:text-9xl'} font-jacquard text-[#f4f1ea] tracking-normal leading-tight text-center drop-shadow-md break-words max-w-full px-2`}>
            {activePlayer.name}
          </h1>
          <p className="text-xs text-[#a8a29e] font-sans tracking-wide pt-1">
            Keep your secret identity hidden from your own eyes
          </p>
        </div>
      </div>

      {/* Bottom Actions (Sticky to bottom on mobile) */}
      <div className="pt-4 flex flex-col items-center space-y-4 shrink-0 pb-safe pb-3 max-w-sm md:max-w-md mx-auto w-full z-20 sticky bottom-0 bg-[#060910]/90 backdrop-blur-xs">
        {/* Hold Button with Integrated Illuminated Gold Sweep */}
        <div className="w-full flex justify-center">
          <button
            id="hold-to-unlock-btn"
            type="button"
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={startHold}
            onTouchEnd={cancelHold}
            className={`w-full py-4 px-6 rounded-2xl border transition-all duration-150 flex items-center justify-center relative overflow-hidden cursor-pointer select-none active:scale-98 ${
              holding
                ? 'border-[#fbf0cf] shadow-[0_4px_28px_rgba(212,183,106,0.35)]'
                : 'border-[#cbb279]/40 hover:border-[#cbb279]/70 bg-[#101929]/90'
            }`}
          >
            {/* Smooth gold illumination progress fill */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#ba9848] via-[#d4b76a] to-[#fbf0cf] transition-all duration-75 ease-linear pointer-events-none"
              style={{ width: `${progress}%` }}
            />

            {/* Button label with contrast-aware styling */}
            <span
              className={`text-sm font-bold tracking-wider relative z-10 font-sans transition-colors ${
                progress > 50
                  ? 'text-[#120e09]'
                  : holding
                  ? 'text-[#f4f1ea]'
                  : 'text-[#f4f1ea]'
              }`}
            >
              {holding
                ? progress > 80
                  ? 'Revealing...'
                  : 'Unsealing identity...'
                : 'Press & hold to reveal'}
            </span>
          </button>
        </div>

        {/* Skip player link */}
        <button
          id="skip-player-turn-btn"
          type="button"
          onClick={onSkipPlayer}
          className="text-xs text-[#8c827a] hover:text-[#cbb279] flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <MedievalIcon name="arrow-right" className="text-xs" />
          <span>Skip {activePlayer.name}'s turn</span>
        </button>
      </div>
    </div>
  );
};
