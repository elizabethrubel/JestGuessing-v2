import React from 'react';
import { Player, ThemePack } from '../types';
import { Loader2 } from 'lucide-react';
import { playSuccessTone, playPassTone, triggerHaptic } from '../utils/audio';
import { TopNavBar } from './TopNavBar';
import { MedievalIcon } from './MedievalIcon';

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
      className={`w-full max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto flex-1 flex flex-col justify-between py-4 px-4 text-center select-none transition-colors duration-500 ${
        isLastTurnRound ? 'bg-gradient-to-b from-[#3d1110]/80 via-[#260a09]/50 to-transparent' : ''
      }`}
    >
      {/* Consistent Top Navigation with progressive disclosure */}
      <TopNavBar
        onGoHome={onGoHome}
        onOpenRules={onOpenRules}
        theme={theme}
        isLastTurnRound={isLastTurnRound}
      />

      {/* Main Focus: Character Name unconstrained by arch boxes, enlarged for party viewing */}
      <div className="my-auto py-6 flex flex-col items-center justify-center w-full max-w-lg md:max-w-xl mx-auto space-y-4">
        {/* Active Player Identifier */}
        <span className="text-xs sm:text-sm font-mono tracking-[0.3em] text-[#cbb279] uppercase">
          {player.name}'s Identity
        </span>

        {/* Character Name in responsive medieval futurist Jacquard 24 that fits cleanly */}
        <h1
          className={`${
            character.name.length > 20 || character.name.split(/\s+/).some(w => w.length >= 13)
              ? 'text-4xl sm:text-5xl md:text-6xl'
              : character.name.length > 13 || character.name.split(/\s+/).some(w => w.length >= 10)
              ? 'text-5xl sm:text-6xl md:text-7xl'
              : character.name.length > 8 || character.name.split(/\s+/).some(w => w.length >= 7)
              ? 'text-6xl sm:text-7xl md:text-8xl'
              : 'text-7xl sm:text-8xl md:text-9xl'
          } font-jacquard text-[#f4f1ea] tracking-normal leading-[1.05] text-center drop-shadow-md max-w-full px-3 break-words`}
        >
          {character.name}
        </h1>

        {/* Origin / Universe */}
        {character.origin && (
          <p className="text-sm sm:text-base font-medium text-[#c5bcb1] tracking-wide pt-1">
            {character.origin}
          </p>
        )}

        {/* Shuffle character button: Only available in the very first round */}
        {roundNumber === 1 && (
          <button
            id="reroll-character-btn"
            type="button"
            disabled={isRerolling}
            onClick={onRerollCharacter}
            className="text-xs text-[#8c827a] hover:text-[#cbb279] inline-flex items-center space-x-1.5 transition-colors cursor-pointer py-2 px-3.5 rounded-xl hover:bg-[#16233a] border border-[#cbb279]/20 hover:border-[#cbb279]/50 mt-3 disabled:opacity-50"
          >
            {isRerolling ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#cbb279]" />
                <span>Divining fresh identity...</span>
              </>
            ) : (
              <>
                <MedievalIcon name="refresh" className="text-xs text-[#cbb279]" />
                <span>Shuffle character</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Two Action Buttons: Stuck to bottom for mobile, expanded width for desktop */}
      <div className="sticky bottom-0 z-20 pb-safe pb-3 pt-2 bg-gradient-to-t from-[#060910] via-[#060910]/95 to-transparent w-full max-w-sm md:max-w-md mx-auto grid grid-cols-2 gap-3.5">
        <button
          id="missed-turn-btn"
          type="button"
          onClick={handleMissed}
          className="py-4 rounded-2xl bg-gradient-to-b from-[#2a1310] to-[#1c0d0b] hover:from-[#351915] hover:to-[#24110e] text-[#f4dcd9] font-bold text-base border border-[#7d221c]/70 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md"
        >
          <MedievalIcon name="close" className="text-sm text-[#e87063]" />
          <span>Missed</span>
        </button>

        <button
          id="got-it-turn-btn"
          type="button"
          onClick={handleCorrect}
          className="py-4 rounded-2xl bg-gradient-to-b from-[#e5cf96] via-[#d4b76a] to-[#ba9848] hover:from-[#edd8a4] hover:to-[#c6a454] active:scale-[0.98] text-[#120e09] font-bold text-base transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-[0_4px_24px_rgba(212,183,106,0.25)] border border-[#fbf0cf]"
        >
          <MedievalIcon name="shield" className="text-base text-[#120e09]" />
          <span>Got it!</span>
        </button>
      </div>
    </div>
  );
};
