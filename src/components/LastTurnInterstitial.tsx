import React from 'react';
import { Player, ThemePack } from '../types';
import { TopNavBar } from './TopNavBar';
import { MedievalIcon } from './MedievalIcon';

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
      className="w-full max-w-lg mx-auto flex-1 flex flex-col justify-between py-4 px-4 text-center select-none bg-gradient-to-b from-[#47120f]/85 via-[#2b0a08]/90 to-[#140404] transition-colors duration-500 rounded-3xl"
    >
      {/* Consistent Top Navigation */}
      <TopNavBar
        onGoHome={onGoHome}
        onOpenRules={onOpenRules}
        theme={theme}
        isLastTurnRound={true}
      />

      {/* Main Notification unconstrained by window arch */}
      <div className="my-auto py-8 flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center space-y-4">
        <span className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-[#e5cf96]">
          Last Turn Triggered
        </span>

        {/* Hero heading in Jacquard 24 */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-jacquard text-[#f4f1ea] tracking-normal leading-tight text-center drop-shadow-md break-words max-w-full px-2">
          {winnerPlayer.name} got it right!
        </h1>

        {/* Clear instruction */}
        <p className="text-sm sm:text-base text-[#f1d8d5]/90 leading-relaxed max-w-sm mx-auto pt-2 font-sans">
          Everyone else receives <strong>one final turn</strong> to deduce their secret identity and score.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="pt-4 shrink-0 pb-2 max-w-sm mx-auto w-full">
        <button
          id="continue-last-turn-btn"
          type="button"
          onClick={onContinue}
          className="w-full py-4 bg-gradient-to-b from-[#e5cf96] via-[#d4b76a] to-[#ba9848] hover:from-[#edd8a4] hover:to-[#c6a454] active:scale-[0.99] text-[#120e09] font-bold rounded-2xl text-base transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-[0_4px_24px_rgba(212,183,106,0.25)] border border-[#fbf0cf]"
        >
          <span>Pass to {nextPlayerName}</span>
          <MedievalIcon name="arrow-right" className="text-sm text-[#120e09]" />
        </button>
      </div>
    </div>
  );
};
