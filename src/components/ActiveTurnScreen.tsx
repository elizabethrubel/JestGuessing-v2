import React from 'react';
import { Player, ThemePack } from '../types';
import { Loader2 } from 'lucide-react';
import { playSuccessTone, playPassTone, triggerHaptic } from '../utils/audio';
import { TopNavBar } from './TopNavBar';

interface ActiveTurnScreenProps {
  player: Player;
  theme: ThemePack;
  roundNumber?: number;
  isLastTurnRound: boolean;
  isRerolling?: boolean;
  onMissedGuess: () => void;
  onCorrectGuess: () => void;
  onRerollCharacter: () => void;
  onGoHome: () => void;
  onOpenRules: () => void;
}

export const ActiveTurnScreen: React.FC<ActiveTurnScreenProps> = ({
  player,
  theme,
  roundNumber = 1,
  isLastTurnRound,
  isRerolling = false,
  onMissedGuess,
  onCorrectGuess,
  onRerollCharacter,
  onGoHome,
  onOpenRules,
}) => {
  const character = player.assignedCharacter;

  const handleMissed = () => {
    triggerHaptic(30);
    playPassTone();
    onMissedGuess();
  };

  const handleCorrect = () => {
    triggerHaptic([60, 40, 80]);
    playSuccessTone();
    onCorrectGuess();
  };

  if (!character) return null;

  return (
    <div
      id="active-turn-screen"
      className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between py-2 sm:py-4 px-4 sm:px-8 text-center select-none min-h-[100dvh]"
    >
      <TopNavBar
        onGoHome={onGoHome}
        onOpenRules={onOpenRules}
        theme={theme}
        isLastTurnRound={isLastTurnRound}
      />

      {/* Main Focus: Monumental Secret Identity Display */}
      <div className="my-auto py-6 flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-center space-x-3">
          <div className="pixel-ring-periwinkle text-xs font-bold text-[#b9bfff] scale-90">
            1
          </div>
          <span className="text-xs sm:text-[13px] font-medium tracking-[0.25em] text-[#b9bfff] uppercase">
            {player.name}’S SECRET IDENTITY
          </span>
        </div>

        {/* Character Name in Smooth Calligraphic Gothic Blackletter */}
        <h1
          className={`${
            character.name.length > 20 || character.name.split(/\s+/).some((w) => w.length >= 13)
              ? 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl'
              : character.name.length > 13 || character.name.split(/\s+/).some((w) => w.length >= 10)
              ? 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
              : 'text-7xl sm:text-8xl md:text-9xl lg:text-[9.5rem]'
          } font-jacquard text-[#f4efe4] leading-[0.9] text-center max-w-full px-2 break-words`}
        >
          {character.name}
        </h1>

        {/* Origin / Universe in Classical Editorial Italic Serif */}
        {character.origin && (
          <p className="font-serif-editorial italic text-xl sm:text-2xl lg:text-3xl text-[#f4efe4]/85 tracking-wide">
            {character.origin}
          </p>
        )}

        {/* Shuffle character button (available on Round 1) */}
        {roundNumber === 1 && (
          <button
            id="reroll-character-btn"
            type="button"
            disabled={isRerolling}
            onClick={onRerollCharacter}
            className="min-h-[42px] py-2 px-4 border border-[#f4efe4]/35 hover:border-[#b9bfff] text-[#f4efe4]/70 hover:text-[#b9bfff] inline-flex items-center space-x-2 text-xs uppercase tracking-[0.18em] transition-colors cursor-pointer mt-2 disabled:opacity-50"
          >
            {isRerolling ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#b9bfff]" />
                <span>DRAWING FRESH SPIRIT...</span>
              </>
            ) : (
              <span>↻ SHUFFLE CHARACTER</span>
            )}
          </button>
        )}
      </div>

      {/* Bottom Sticky Action Bar: Generous mobile tap zones + architectural desktop width */}
      <div className="w-full sticky bottom-0 z-30 pb-safe pb-4 pt-3 bg-gradient-to-t from-[#09120e] via-[#09120e]/95 to-transparent">
        <div className="max-w-md sm:max-w-xl lg:max-w-2xl mx-auto grid grid-cols-2 gap-3.5 sm:gap-6">
          <button
            id="missed-turn-btn"
            type="button"
            onClick={handleMissed}
            className="min-h-[52px] py-4 px-5 border border-[#e03a28]/80 bg-[#09120e]/90 hover:bg-[#e03a28] text-[#f4efe4] font-medium text-xs sm:text-[13px] uppercase tracking-[0.2em] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center"
          >
            ✕ MISSED
          </button>

          <button
            id="got-it-turn-btn"
            type="button"
            onClick={handleCorrect}
            className="min-h-[52px] py-4 px-5 border border-[#f4efe4] bg-[#f4efe4] hover:bg-[#b9bfff] hover:border-[#b9bfff] text-[#09120e] font-semibold text-xs sm:text-[13px] uppercase tracking-[0.2em] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center"
          >
            GOT IT! →
          </button>
        </div>
      </div>
    </div>
  );
};
