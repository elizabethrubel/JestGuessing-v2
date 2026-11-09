import React from 'react';
import { Player, ThemePack } from '../types';
import { TopNavBar } from './TopNavBar';

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
  const rankedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div
      id="scoreboard-screen"
      className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between py-3 sm:py-6 px-5 sm:px-10 select-none min-h-[100dvh]"
    >
      <TopNavBar
        onGoHome={onGoHome}
        onOpenRules={onOpenRules}
        theme={theme}
        centerContent={
          <span className="text-xs uppercase tracking-[0.2em] text-[#b9bfff]">
            ROUND {roundNumber} COMPLETE
          </span>
        }
      />

      {/* Main Content: 2-Column Editorial Spread on Desktop, Clean Vertical Ledger on Mobile */}
      <div className="my-auto py-4 sm:py-8 flex-1 flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center w-full">
        {/* Left Header */}
        <div className="lg:col-span-5 text-center lg:text-left space-y-3 sm:space-y-4 mb-6 lg:mb-0">
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#b9bfff] block">
            THE COURT STANDINGS
          </span>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-jacquard text-[#f4efe4] leading-[0.92]">
            Scores
          </h1>
          <p className="font-serif-editorial italic text-xl sm:text-2xl text-[#f4efe4]/80 max-w-sm mx-auto lg:mx-0 leading-relaxed">
            “{theme.name}.”
          </p>
        </div>

        {/* Right Ranked Ledger */}
        <div className="lg:col-span-7 w-full max-w-xl lg:max-w-none mx-auto">
          <div className="border-t border-b border-[#f4efe4]/35 divide-y divide-[#f4efe4]/20 bg-[#09120e]/60">
            {rankedPlayers.map((player, idx) => {
              const isLeader = idx === 0 && player.score > 0;
              const solvedThisRound = player.hasGuessedCorrectly;

              return (
                <div
                  key={player.id}
                  className="flex items-center justify-between py-4 px-2.5 sm:px-4 hover:bg-[#f4efe4]/[0.03] transition-colors"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div
                      className={
                        isLeader
                          ? 'pixel-ring-periwinkle text-xs font-bold text-[#b9bfff] shrink-0'
                          : 'pixel-ring text-xs font-semibold text-[#f4efe4]/75 shrink-0'
                      }
                    >
                      {idx + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2.5">
                        <span className="font-serif-editorial text-xl sm:text-2xl font-semibold text-[#f4efe4] truncate">
                          {player.name}
                        </span>
                        {player.id === firstSolverId && (
                          <span className="text-[11px] font-medium uppercase tracking-widest text-[#f4efe4] bg-[#e03a28] px-2 py-0.5 shrink-0">
                            GUESSED FIRST
                          </span>
                        )}
                      </div>

                      {player.assignedCharacter && (
                        <p className="font-serif-editorial italic text-base sm:text-lg text-[#f4efe4]/75 truncate mt-0.5">
                          {player.assignedCharacter.name}
                          {player.assignedCharacter.origin ? ` — ${player.assignedCharacter.origin}` : ''}
                          {solvedThisRound ? (
                            <span className="not-italic text-xs uppercase tracking-widest text-[#b9bfff] ml-2">
                              ✓ GOT IT
                            </span>
                          ) : (
                            <span className="not-italic text-xs uppercase tracking-widest text-[#f4efe4]/40 ml-2">
                              MISSED
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right pl-4 shrink-0">
                    <span className="text-4xl sm:text-5xl font-jacquard text-[#f4efe4] tabular-nums">
                      {player.score}
                    </span>
                    <span className="text-[11px] text-[#b9bfff] uppercase tracking-[0.2em] block">
                      {player.score === 1 ? 'PT' : 'PTS'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar (No desktop gradient cutoff) */}
      <div className="w-full sticky bottom-0 z-30 pb-safe pb-4 pt-3 bg-[#09120e]/90 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none">
        <div className="max-w-md sm:max-w-xl lg:max-w-6xl mx-auto flex justify-end">
          <button
            id="scoreboard-play-again-btn"
            type="button"
            onClick={onPlayAgain}
            className="w-full sm:w-auto sm:min-w-[280px] min-h-[52px] py-4 px-6 border border-[#f4efe4] bg-[#f4efe4] hover:bg-[#b9bfff] hover:border-[#b9bfff] active:scale-[0.99] text-[#09120e] font-semibold text-xs sm:text-[13px] uppercase tracking-[0.2em] transition-all cursor-pointer text-center"
          >
            START NEXT ROUND →
          </button>
        </div>
      </div>
    </div>
  );
};
