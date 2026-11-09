import React from 'react';
import { Player, ThemePack } from '../types';
import { TopNavBar } from './TopNavBar';

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
      className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between py-3 sm:py-6 px-5 sm:px-10 text-center select-none min-h-[100dvh]"
    >
      <TopNavBar
        onGoHome={onGoHome}
        onOpenRules={onOpenRules}
        theme={theme}
        isLastTurnRound={true}
      />

      {/* Main Notification with clear "got it right!" wording */}
      <div className="my-auto py-8 flex flex-col items-center justify-center w-full max-w-3xl mx-auto text-center space-y-6">
        <div className="pixel-ring-periwinkle text-xs font-bold text-[#b9bfff]">
          !
        </div>

        <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#e03a28]">
          FINAL TURN TRIGGERED
        </span>

        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-jacquard text-[#f4efe4] leading-[0.95] text-center break-words max-w-full px-3">
          {winnerPlayer.name} got it right!
        </h1>

        <p className="font-serif-editorial italic text-xl sm:text-2xl lg:text-3xl text-[#f4efe4]/85 leading-relaxed max-w-lg mx-auto pt-2">
          Everyone else now receives one final turn to deduce their secret identity and score.
        </p>
      </div>

      {/* Bottom Sticky CTA (No desktop gradient cutoff) */}
      <div className="w-full sticky bottom-0 z-30 pb-safe pb-4 pt-3 bg-[#16090b]/90 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none">
        <div className="max-w-md mx-auto w-full">
          <button
            id="continue-last-turn-btn"
            type="button"
            onClick={onContinue}
            className="w-full min-h-[54px] py-4 px-6 border border-[#f4efe4] bg-[#f4efe4] hover:bg-[#b9bfff] hover:border-[#b9bfff] active:scale-[0.99] text-[#09120e] font-semibold text-xs sm:text-[13px] uppercase tracking-[0.2em] transition-all cursor-pointer text-center"
          >
            PASS TO {nextPlayerName.toUpperCase()} →
          </button>
        </div>
      </div>
    </div>
  );
};
