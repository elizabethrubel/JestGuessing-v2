import React from 'react';
import { Player, ThemePack } from '../types';
import { triggerHaptic, playTurnActiveTone } from '../utils/audio';
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
  const handleReveal = () => {
    triggerHaptic([35, 25, 60]);
    playTurnActiveTone();
    onUnlock();
  };

  return (
    <div
      id="privacy-interstitial-screen"
      onClick={handleReveal}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleReveal();
        }
      }}
      className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between py-3 sm:py-6 px-5 sm:px-10 text-center select-none relative min-h-[100dvh] cursor-pointer"
    >
      <TopNavBar
        onGoHome={onGoHome}
        onOpenRules={onOpenRules}
        theme={theme}
        isLastTurnRound={isLastTurnRound}
      />

      {/* Main Focus: Tap Anywhere to Reveal */}
      <div className="my-auto py-8 flex flex-col items-center justify-center w-full max-w-3xl mx-auto space-y-6 sm:space-y-8 relative z-20">
        {/* 1-Bit Pixel Turn Ring */}
        <div className="pixel-ring-periwinkle text-xs sm:text-sm font-bold text-[#b9bfff] scale-110">
          {turnNumber}
        </div>

        {/* Player Name & Instruction with Generous Breathing Room */}
        <div className="space-y-4 flex flex-col items-center justify-center w-full">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-[#b9bfff]">
            PASS DEVICE TO
          </p>

          <h1
            className={`${
              activePlayer.name.length > 12
                ? 'text-6xl sm:text-8xl lg:text-9xl'
                : 'text-7xl sm:text-9xl lg:text-[9.5rem]'
            } font-jacquard text-[#f4efe4] leading-[0.95] text-center break-words max-w-full px-3`}
          >
            {activePlayer.name}
          </h1>

          <p className="font-serif-editorial italic text-xl sm:text-2xl lg:text-3xl text-[#f4efe4]/80 max-w-md mx-auto pt-2 leading-relaxed">
            Face the screen toward the table, then tap anywhere to reveal.
          </p>
        </div>
      </div>

      {/* Bottom Sticky Action Zone (Mobile thumb zone, no desktop gradient cutoff) */}
      <div className="w-full sticky bottom-0 z-30 pb-safe pb-4 pt-3 bg-[#09120e]/90 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none">
        <div className="max-w-md sm:max-w-xl mx-auto flex flex-col items-center space-y-3">
          <button
            id="tap-to-unlock-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleReveal();
            }}
            className="w-full min-h-[54px] py-4 px-6 border border-[#f4efe4] bg-[#f4efe4] hover:bg-[#b9bfff] hover:border-[#b9bfff] text-[#09120e] font-semibold text-xs sm:text-[13px] uppercase tracking-[0.2em] transition-all cursor-pointer select-none active:scale-[0.99]"
          >
            TAP ANYWHERE TO REVEAL →
          </button>

          <button
            id="skip-player-turn-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSkipPlayer();
            }}
            className="min-h-[40px] py-2 px-4 text-xs uppercase tracking-[0.18em] text-[#f4efe4]/60 hover:text-[#b9bfff] transition-colors cursor-pointer"
          >
            Skip {activePlayer.name}’s turn
          </button>
        </div>
      </div>
    </div>
  );
};
