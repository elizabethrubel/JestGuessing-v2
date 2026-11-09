import React from 'react';
import { Player, ThemePack } from '../types';
import { TopNavBar } from './TopNavBar';
import { MedievalIcon } from './MedievalIcon';

interface ScoreboardScreenProps {
  players: Player[];
  theme: ThemePack;
  roundNumber: number;
  firstSolverId: string | null;
  onPlayAgain: () => void;
  onGoHome: () => void;
  onOpenRules: () => void;
}

export const ScoreboardScreen: React.FC<ScoreboardScreenProps> = ({
  players,
  theme,
  roundNumber,
  firstSolverId,
  onPlayAgain,
  onGoHome,
  onOpenRules,
}) => {
  // Sort players descending by score
  const rankedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div
      id="scoreboard-screen"
      className="w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto flex-1 flex flex-col justify-between py-4 px-4 select-none"
    >
      {/* Consistent Top Navigation */}
      <TopNavBar
        onGoHome={onGoHome}
        onOpenRules={onOpenRules}
        theme={theme}
        centerContent={
          <span className="text-xs font-mono text-zinc-400">
            Round {roundNumber} complete
          </span>
        }
      />

      {/* Screen Title */}
      <div className="flex flex-col items-center justify-center pt-3 pb-1 shrink-0">
        <h1 className="text-6xl sm:text-7xl font-jacquard text-[#f4f1ea] tracking-wider text-center">
          Scores
        </h1>
        <p className="text-xs text-[#a8a29e] font-sans -mt-1 tracking-wide">
          Manuscript standings
        </p>
      </div>

      {/* Ranked Players List styled as a medieval illuminated tournament ledger */}
      <div className="my-auto py-4 space-y-4 flex-1 overflow-y-auto no-scrollbar max-w-md mx-auto w-full">
        <div className="border-t border-b border-[#cbb279]/25 divide-y divide-[#cbb279]/15 bg-[#0a101b]/50 rounded-lg">
          {rankedPlayers.map((player, idx) => {
            const isLeader = idx === 0 && player.score > 0;
            const solvedThisRound = player.hasGuessedCorrectly;

            return (
              <div
                key={player.id}
                className="flex items-center justify-between py-4 px-3 hover:bg-[#142033]/30 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-6 text-center shrink-0">
                    {isLeader ? (
                      <MedievalIcon name="crown" className="text-sm text-[#cbb279] mx-auto drop-shadow-[0_0_6px_rgba(203,178,121,0.5)]" />
                    ) : (
                      <span className="text-xs font-mono text-[#8c827a]">
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-[#f4f1ea] truncate font-sans">
                        {player.name}
                      </span>
                      {player.id === firstSolverId && (
                        <span className="text-[10px] font-semibold text-[#cbb279] bg-[#2d1c15] border border-[#cbb279]/40 px-1.5 py-0.5 rounded-sm shrink-0 font-mono">
                          Solved first
                        </span>
                      )}
                    </div>
                    {/* Character revealed */}
                    {player.assignedCharacter && (
                      <p className="text-xs text-[#a8a29e] truncate mt-0.5 font-sans">
                        {player.assignedCharacter.name}
                        {player.assignedCharacter.origin ? ` (${player.assignedCharacter.origin})` : ''}
                        {solvedThisRound ? (
                          <span className="text-[#8cd69e] ml-1.5 font-medium">✓ Solved</span>
                        ) : (
                          <span className="text-[#78716c] ml-1.5">Unsolved</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right pl-3 shrink-0">
                  <span className="text-2xl font-bold text-[#f4f1ea] font-mono tabular-nums">
                    {player.score}
                  </span>
                  <span className="text-[10px] text-[#8c827a] uppercase tracking-wider block font-sans">
                    {player.score === 1 ? 'pt' : 'pts'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions (Sticky to bottom on mobile) */}
      <div className="pt-3 pb-safe pb-3 sticky bottom-0 z-20 bg-[#060910]/95 backdrop-blur-xs max-w-md md:max-w-lg mx-auto w-full">
        <button
          id="scoreboard-play-again-btn"
          type="button"
          onClick={onPlayAgain}
          className="w-full py-4 bg-gradient-to-b from-[#e5cf96] via-[#d4b76a] to-[#ba9848] hover:from-[#edd8a4] hover:to-[#c6a454] active:scale-[0.99] text-[#120e09] font-bold rounded-2xl text-base transition-all cursor-pointer flex items-center justify-center space-x-2.5 shadow-[0_4px_24px_rgba(212,183,106,0.25)] border border-[#fbf0cf]"
        >
          <MedievalIcon name="sword" className="text-base text-[#120e09]" />
          <span>Start Next Round</span>
        </button>
      </div>
    </div>
  );
};
