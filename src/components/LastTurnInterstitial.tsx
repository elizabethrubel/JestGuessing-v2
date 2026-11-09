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
      className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between py-2 sm:py-4 px-4 sm:px-8 text-center select-none min-h-[100dvh]"
    >
      <TopNavBar
        onGoHome={onGoHome}
        onOpenRules={onOpenRules}
        theme={theme}
        isLastTurnRound={true}
      />

      {/* Main Notification */}
      <div className="my-auto py-8 flex flex-col items-center justify-center w-full max-w-2xl mx-auto text-center space-y-5">
        <div className="pixel-ring-periwinkle text-xs font-bold text-[#b9bfff]">
          !
        </div>

        <span className="text-xs sm:text-[13px] font-semibold tracking-[0.25em] uppercase text-[#e03a28]">
          FINAL TURN TRIGGERED
        </span>

        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-jacquard text-[#f4efe4] leading-[0.9] text-center break-words max-w-full px-2">
          {winnerPlayer.name} Solved It
        </h1>

        <p className="font-serif-editorial italic text-xl sm:text-2xl text-[#f4efe4]/85 leading-snug max-w-md mx-auto pt-1">
          Every remaining player now receives one final turn to deduce their secret identity.
        </p>
      </div>

      {/* Bottom Sticky CTA */}
      <div className="w-full sticky bottom-0 z-30 pb-safe pb-4 pt-3 bg-gradient-to-t from-[#16090b] via-[#16090b]/95 to-transparent">
        <div className="max-w-md mx-auto w-full">
          <button
            id="continue-last-turn-btn"
            type="button"
            onClick={onContinue}
            className="w-full min-h-[50px] py-4 px-6 border border-[#f4efe4] bg-[#f4efe4] hover:bg-[#b9bfff] hover:border-[#b9bfff] active:scale-[0.99] text-[#09120e] font-semibold text-xs sm:text-[13px] uppercase tracking-[0.2em] transition-all cursor-pointer text-center"
          >
            PASS TO {nextPlayerName.toUpperCase()} →
          </button>
        </div>
      </div>
    </div>
  );
};
