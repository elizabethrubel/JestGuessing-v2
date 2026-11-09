import React, { useState, useEffect } from 'react';
import { Player, ThemePack } from '../types';
import { triggerHaptic, playTurnActiveTone } from '../utils/audio';
import { TopNavBar } from './TopNavBar';

interface PrivacyInterstitialScreenProps {
  activePlayer: Player;
  players?: Player[];
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
  // Brief guard on mount so a stray double-tap from the previous screen's bottom button never triggers reveal
  const [isArmed, setIsArmed] = useState(false);

  useEffect(() => {
    setIsArmed(false);
    const timer = window.setTimeout(() => {
      setIsArmed(true);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [activePlayer.id, turnNumber]);

  const handleReveal = () => {
    if (!isArmed) return;
    triggerHaptic([35, 25, 60]);
    playTurnActiveTone();
    onUnlock();
  };

  return (
    <div
      id="privacy-interstitial-screen"
      className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between py-2.5 sm:py-6 px-5 sm:px-10 text-center select-none relative h-[100dvh] overflow-hidden"
    >
      <TopNavBar
        onGoHome={onGoHome}
        onOpenRules={onOpenRules}
        theme={theme}
        isLastTurnRound={isLastTurnRound}
      />

      {/* Main Focus: Shushing Masked Fox + Updated Privacy Copy */}
      <div className="my-auto py-2 sm:py-4 flex flex-col items-center justify-center w-full max-w-3xl mx-auto space-y-2.5 sm:space-y-4 relative z-20 min-h-0">
        {/* Shushing Masked Fox Woodblock Illustration */}
        <div className="relative flex items-center justify-center">
          <img
            src="/assets/illus-masked-fox.png"
            alt="Medieval folk woodblock of a masked fox in a harlequin tunic shushing between two candlesticks and 7-pointed periwinkle stars"
            className="w-36 xs:w-44 sm:w-52 lg:w-60 h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)] pointer-events-none"
          />
          {/* 1-Bit Pixel Turn Ring badge tucked at bottom-right of illustration */}
          <div className="pixel-ring-periwinkle absolute -bottom-1 right-2 text-xs sm:text-sm font-bold text-[#b9bfff] bg-[#09120e]/85">
            {turnNumber}
          </div>
        </div>

        {/* Player Name & Concise Instruction */}
        <div className="space-y-2 sm:space-y-3 flex flex-col items-center justify-center w-full pt-1">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-[#b9bfff]">
            UP NEXT TO GUESS
          </p>

          <h1
            className={`${
              activePlayer.name.length > 12
                ? 'text-5xl xs:text-6xl sm:text-7xl lg:text-8xl'
                : 'text-6xl xs:text-7xl sm:text-8xl lg:text-[8.5rem]'
            } font-jacquard text-[#f4efe4] leading-[0.92] text-center break-words max-w-full px-3`}
          >
            {activePlayer.name}
          </h1>

          <p className="font-serif-editorial italic text-lg sm:text-2xl text-[#f4efe4]/80 max-w-md mx-auto pt-0.5 leading-snug sm:leading-relaxed">
            Pass the phone to another player—anyone except {activePlayer.name} may look.
          </p>
        </div>
      </div>

      {/* Bottom Action Zone */}
      <div className="w-full shrink-0 z-30 pb-safe pb-3 sm:pb-4 pt-2">
        <div className="max-w-md sm:max-w-xl mx-auto flex flex-col items-center space-y-2.5">
          <button
            id="tap-to-unlock-btn"
            type="button"
            disabled={!isArmed}
            onClick={(e) => {
              e.stopPropagation();
              handleReveal();
            }}
            className="w-full min-h-[54px] py-4 px-6 border border-[#f4efe4] bg-[#f4efe4] hover:bg-[#b9bfff] hover:border-[#b9bfff] text-[#09120e] font-semibold text-xs sm:text-[13px] uppercase tracking-[0.2em] transition-all cursor-pointer select-none active:scale-[0.99] disabled:opacity-60"
          >
            I VOW I AM NOT {activePlayer.name.toUpperCase()} →
          </button>

          <button
            id="skip-player-turn-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSkipPlayer();
            }}
            className="min-h-[38px] py-1.5 px-4 text-xs uppercase tracking-[0.18em] text-[#f4efe4]/60 hover:text-[#b9bfff] transition-colors cursor-pointer"
          >
            Skip {activePlayer.name}’s turn
          </button>
        </div>
      </div>
    </div>
  );
};
