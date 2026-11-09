import React, { useEffect } from 'react';
import { Player, CandidateCommonality } from '../types';
import { TopNavBar } from './TopNavBar';
import { Loader2 } from 'lucide-react';

interface CommonalitySelectionScreenProps {
  players: Player[];
  candidateCommonalities: CandidateCommonality[];
  selectedCommonality: CandidateCommonality | null;
  onSelectCommonality: (c: CandidateCommonality | null) => void;
  onRefreshCandidates: () => void;
  onConfirmAndStart: (chosen: CandidateCommonality | null) => void;
  onBackToSetup: () => void;
  onGoHome: () => void;
  onOpenRules: () => void;
  isLoading?: boolean;
}

export const CommonalitySelectionScreen: React.FC<CommonalitySelectionScreenProps> = ({
  players,
  candidateCommonalities,
  selectedCommonality,
  onSelectCommonality,
  onRefreshCandidates,
  onConfirmAndStart,
  onBackToSetup,
  onGoHome,
  onOpenRules,
  isLoading = false,
}) => {
  useEffect(() => {
    if (!selectedCommonality && candidateCommonalities.length > 0) {
      onSelectCommonality(candidateCommonalities[0]);
    }
  }, [candidateCommonalities, selectedCommonality, onSelectCommonality]);

  return (
    <div
      id="commonality-selection-screen"
      className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between py-2 sm:py-4 px-4 sm:px-8 select-none min-h-[100dvh]"
    >
      <TopNavBar onGoHome={onGoHome} onOpenRules={onOpenRules} />

      {/* Main Content: Editorial Decree Selection (Stacks on mobile, 3-column horizontal spread on desktop) */}
      <div className="my-auto py-4 sm:py-6 flex-1 flex flex-col justify-center space-y-6 w-full">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#f4efe4]/25 pb-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#b9bfff] block mb-1">
              ACT II // SECRET BOND FOR {players.length} PLAYERS
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-jacquard text-[#f4efe4] leading-[0.9]">
              Choose Commonality
            </h1>
          </div>

          <button
            type="button"
            onClick={onRefreshCandidates}
            className="self-center sm:self-auto min-h-[42px] px-4 py-2 border border-[#f4efe4]/50 hover:border-[#b9bfff] text-[#f4efe4] hover:text-[#b9bfff] text-xs font-medium uppercase tracking-[0.16em] transition-colors cursor-pointer shrink-0"
            title="Draw new candidate decrees"
          >
            ↻ REROLL DECREES
          </button>
        </div>

        {/* 3 Candidate Decrees: Vertical stack on mobile, 3 equal horizontal columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {candidateCommonalities.map((cand, idx) => {
            const isSelected = selectedCommonality?.id === cand.id;

            return (
              <button
                key={cand.id}
                type="button"
                onClick={() => onSelectCommonality(cand)}
                className={`w-full text-left p-4 sm:p-6 lg:p-7 border transition-all cursor-pointer flex lg:flex-col items-start justify-between gap-4 relative group ${
                  isSelected
                    ? 'bg-[#b9bfff]/[0.09] border-[#b9bfff] shadow-[0_0_30px_rgba(185,191,255,0.12)]'
                    : 'bg-[#09120e]/70 border-[#f4efe4]/25 hover:border-[#f4efe4]/60'
                }`}
              >
                {/* Top/Left: 1-Bit Pixelated Ring Number ( 1 / 2 / 3 ) */}
                <div className="flex items-center justify-between w-auto lg:w-full shrink-0">
                  <div
                    className={
                      isSelected
                        ? 'pixel-ring-periwinkle text-xs sm:text-sm font-bold text-[#b9bfff]'
                        : 'pixel-ring text-xs sm:text-sm font-semibold text-[#f4efe4]/80'
                    }
                  >
                    {idx + 1}
                  </div>

                  <span
                    className={`hidden lg:inline-block text-xs uppercase tracking-[0.2em] ${
                      isSelected ? 'text-[#e03a28] font-semibold' : 'text-[#f4efe4]/35'
                    }`}
                  >
                    {isSelected ? 'SELECTED' : `DECREE 0${idx + 1}`}
                  </span>
                </div>

                {/* Trait Text in Classical Editorial Serif */}
                <div className="flex-1 min-w-0 lg:my-4">
                  <p
                    className={`font-serif-editorial text-xl sm:text-2xl lg:text-[26px] leading-[1.18] break-words ${
                      isSelected ? 'italic text-[#f4efe4] font-semibold' : 'text-[#f4efe4]/85'
                    }`}
                  >
                    “{cand.formattedName}.”
                  </p>
                </div>

                {/* Mobile Selection Indicator */}
                <div className="lg:w-full flex items-center justify-end lg:justify-between shrink-0 self-center lg:self-auto lg:pt-3 lg:border-t lg:border-[#f4efe4]/15">
                  <span className="hidden lg:inline text-xs font-serif-editorial italic text-[#f4efe4]/60">
                    Secret binding trait
                  </span>
                  <span
                    className={`text-xs uppercase tracking-[0.18em] px-2.5 py-1 border ${
                      isSelected
                        ? 'border-[#e03a28] bg-[#e03a28] text-[#f4efe4] font-semibold'
                        : 'border-[#f4efe4]/25 text-[#f4efe4]/50 group-hover:text-[#f4efe4]'
                    }`}
                  >
                    {isSelected ? 'ACTIVE' : 'SELECT'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="w-full sticky bottom-0 z-30 pb-safe pb-4 pt-3 bg-gradient-to-t from-[#09120e] via-[#09120e]/95 to-transparent">
        <div className="max-w-lg lg:max-w-6xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          <button
            type="button"
            onClick={onBackToSetup}
            className="min-h-[48px] py-3.5 px-5 border border-[#f4efe4]/45 hover:border-[#f4efe4] text-[#f4efe4]/80 hover:text-[#f4efe4] text-xs sm:text-[13px] font-medium uppercase tracking-[0.16em] transition-all cursor-pointer shrink-0"
          >
            ← PLAYERS
          </button>

          <button
            id="confirm-commonality-btn"
            type="button"
            disabled={isLoading || !selectedCommonality}
            onClick={() => onConfirmAndStart(selectedCommonality)}
            className="flex-1 sm:flex-initial sm:min-w-[260px] min-h-[48px] py-3.5 px-6 border border-[#f4efe4] bg-[#f4efe4] text-[#09120e] hover:bg-[#b9bfff] hover:border-[#b9bfff] active:scale-[0.99] disabled:opacity-40 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.16em] transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#09120e]" />
                <span>DIVINING IDENTITIES...</span>
              </>
            ) : (
              <span>START ROUND →</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
