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

  // Maximize character text size for across-the-table legibility
  const maxWordLength = Math.max(...character.name.split(/\s+/).map((w) => w.length));
  const totalLength = character.name.length;

  const characterSizeClass =
    maxWordLength >= 13 || totalLength > 24
      ? 'text-[3.75rem] xs:text-[4.5rem] sm:text-7xl md:text-8xl lg:text-9xl'
      : maxWordLength >= 10 || totalLength > 15
      ? 'text-[4.5rem] xs:text-[5.25rem] sm:text-8xl md:text-9xl lg:text-[9.5rem]'
      : 'text-[5.5rem] xs:text-[6.5rem] sm:text-9xl md:text-[9.5rem] lg:text-[11.5rem]';

  return (
    <div
      id="active-turn-screen"
      className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between py-3 sm:py-6 px-4 sm:px-10 text-center select-none min-h-[100dvh]"
    >
      <TopNavBar
        onGoHome={onGoHome}
        onOpenRules={onOpenRules}
        theme={theme}
        isLastTurnRound={isLastTurnRound}
      />

      {/* Main Focus: Huge Across-the-Table Character Name with Generous Breathing Room */}
      <div className="my-auto py-6 sm:py-10 flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-5 sm:space-y-7">
        <span className="text-xs sm:text-sm font-medium tracking-[0.26em] text-[#b9bfff] uppercase">
          {player.name}’S SECRET IDENTITY
        </span>

        {/* Character Name in Jacquard 24 — Scaled as large as possible for party viewing */}
        <h1
          className={`${characterSizeClass} font-jacquard text-[#f4efe4] leading-[0.94] text-center w-full px-1 sm:px-4 break-words`}
        >
          {character.name}
        </h1>

        {/* Origin / Universe — Enlarged for table legibility */}
        {character.origin && (
          <p className="font-serif-editorial italic text-2xl sm:text-3xl lg:text-4xl text-[#f4efe4]/85 tracking-wide pt-1">
            {character.origin}
          </p>
        )}
      </div>

      {/* Bottom Sticky Action Zone: All user actions (including Shuffle Character) in the mobile thumb zone */}
      <div className="w-full sticky bottom-0 z-30 pb-safe pb-4 pt-3 bg-[#09120e]/90 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none">
        <div className="max-w-md sm:max-w-xl lg:max-w-2xl mx-auto space-y-3">
          {roundNumber === 1 && (
            <div className="flex justify-center">
              <button
                id="reroll-character-btn"
                type="button"
                disabled={isRerolling}
                onClick={onRerollCharacter}
                className="min-h-[42px] py-2 px-5 border border-[#f4efe4]/35 hover:border-[#b9bfff] text-[#f4efe4]/75 hover:text-[#b9bfff] inline-flex items-center space-x-2 text-xs uppercase tracking-[0.18em] transition-colors cursor-pointer disabled:opacity-50"
              >
                {isRerolling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#b9bfff]" />
                    <span>SHUFFLING CHARACTER...</span>
                  </>
                ) : (
                  <span>↻ SHUFFLE CHARACTER</span>
                )}
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
            <button
              id="missed-turn-btn"
              type="button"
              onClick={handleMissed}
              className="min-h-[54px] py-4 px-5 border border-[#e03a28]/85 bg-[#09120e]/95 hover:bg-[#e03a28] text-[#f4efe4] font-medium text-xs sm:text-[13px] uppercase tracking-[0.2em] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center"
            >
              ✕ MISSED
            </button>

            <button
              id="got-it-turn-btn"
              type="button"
              onClick={handleCorrect}
              className="min-h-[54px] py-4 px-5 border border-[#f4efe4] bg-[#f4efe4] hover:bg-[#b9bfff] hover:border-[#b9bfff] text-[#09120e] font-semibold text-xs sm:text-[13px] uppercase tracking-[0.2em] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center"
            >
              GOT IT! →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
