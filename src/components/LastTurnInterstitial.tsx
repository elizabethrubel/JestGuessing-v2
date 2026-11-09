import React from 'react';
import { Player, ThemePack } from '../types';
import { TopNavBar } from './TopNavBar';
import { ShepherdStar } from './ShepherdStar';

interface LastTurnInterstitialProps {
  winnerPlayer: Player;
  theme: ThemePack;
  remainingCount: number;
  nextPlayerName: string;
  onContinue: () => void;
  onGoHome: () => void;
  onOpenRules: () => void;
}

export const LastTurnInterstitial: React.FC<LastTurnInterstitialProps> = ({
  winnerPlayer,
  theme,
  nextPlayerName,
  onContinue,
  onGoHome,
  onOpenRules,
}) => {
  return (
    <div
      id="last-turn-interstitial-screen"
      className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between py-2.5 sm:py-6 px-5 sm:px-10 text-center select-none h-[100dvh] overflow-hidden"
    >
      <TopNavBar
        onGoHome={onGoHome}
        onOpenRules={onOpenRules}
        theme={theme}
        isLastTurnRound={true}
      />

      {/* Main Notification with Herald Frog on Crescent Moon & "got it right!" wording */}
      <div className="my-auto py-2 sm:py-4 flex flex-col items-center justify-center w-full max-w-3xl mx-auto text-center space-y-2.5 sm:space-y-4 min-h-0">
        {/* Herald Frog on Crescent Moon Woodblock Illustration */}
        <div className="relative flex items-center justify-center">
          <img
            src="/assets/illus-moon-frog.png"
            alt="Medieval folk woodblock of a silly frog jester perched on a crescent moon blowing a fanfare trumpet with a crown, goblet, and 7-pointed periwinkle stars"
            className="w-40 xs:w-48 sm:w-56 lg:w-64 h-auto object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.6)] pointer-events-none"
          />
          <div className="pixel-ring-periwinkle absolute -bottom-1 right-2 text-xs font-bold text-[#b9bfff] bg-[#16090b]/90">
            !
          </div>
        </div>

        <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#e03a28] pt-1">
          <ShepherdStar size={14} variant="tilted" className="text-[#b9bfff]" />
          <span>FINAL TURN TRIGGERED</span>
          <ShepherdStar size={14} variant="asymmetric" className="text-[#b9bfff]" />
        </span>

        <h1 className="text-5xl xs:text-6xl sm:text-7xl lg:text-8xl font-jacquard text-[#f4efe4] leading-[0.94] text-center break-words max-w-full px-3">
          {winnerPlayer.name} got it right!
        </h1>

        <p className="font-serif-editorial italic text-lg sm:text-2xl lg:text-3xl text-[#f4efe4]/85 leading-snug sm:leading-relaxed max-w-lg mx-auto pt-0.5">
          Everyone else now receives one final turn to deduce their secret identity and score.
        </p>
      </div>

      {/* Bottom CTA: Transparent background */}
      <div className="w-full shrink-0 z-30 pb-safe pb-3 sm:pb-4 pt-2">
        <div className="max-w-md mx-auto w-full">
          <button
            id="continue-last-turn-btn"
            type="button"
            onClick={onContinue}
            className="w-full min-h-[54px] py-4 px-6 border border-[#f4efe4] bg-[#f4efe4] hover:bg-[#b9bfff] hover:border-[#b9bfff] active:scale-[0.99] text-[#09120e] font-semibold text-xs sm:text-[13px] uppercase tracking-[0.2em] transition-all cursor-pointer text-center"
          >
            NEXT UP: {nextPlayerName.toUpperCase()}’S FINAL TURN →
          </button>
        </div>
      </div>
    </div>
  );
};
