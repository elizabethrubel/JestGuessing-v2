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
      className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between py-2.5 sm:py-6 px-5 sm:px-10 select-none h-[100dvh] overflow-hidden"
    >
      <TopNavBar onGoHome={onGoHome} onOpenRules={onOpenRules} />

      {/* Main Content: Editorial Decree Selection with Zero Scrolling */}
      <div className="my-auto py-2 sm:py-6 flex-1 flex flex-col justify-center space-y-3.5 sm:space-y-7 w-full min-h-0">
        {/* Header */}
        <div className="text-center sm:text-left space-y-1 sm:space-y-2 border-b border-[#f4efe4]/20 pb-2.5 sm:pb-4 shrink-0">
          <span className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.22em] text-[#b9bfff] block">
            ACT II // SECRET BOND FOR {players.length} PLAYERS
          </span>
          <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-jacquard text-[#f4efe4] leading-[0.95]">
            Choose Commonality
          </h1>
        </div>

        {/* 3 Candidate Decrees: Compact vertical stack on mobile, 3 equal horizontal columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 sm:gap-5">
          {candidateCommonalities.map((cand, idx) => {
            const isSelected = selectedCommonality?.id === cand.id;

            return (
              <button
                key={cand.id}
                type="button"
                onClick={() => onSelectCommonality(cand)}
                className={`w-full text-left p-3.5 sm:p-5 lg:p-6 border transition-all cursor-pointer flex lg:flex-col items-center lg:items-start justify-start gap-3.5 sm:gap-4 relative group ${
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
                </div>

                {/* Trait Text in Classical Editorial Serif */}
                <div className="flex-1 min-w-0 lg:mt-2">
                  <p
                    className={`font-serif-editorial text-lg xs:text-xl sm:text-2xl lg:text-[26px] leading-snug sm:leading-relaxed break-words ${
                      isSelected ? 'italic text-[#f4efe4] font-semibold' : 'text-[#f4efe4]/85'
                    }`}
                  >
                    “{cand.formattedName}.”
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Zone: Transparent background, all actions in the mobile thumb zone */}
      <div className="w-full shrink-0 z-30 pb-safe pb-3 sm:pb-4 pt-2">
        <div className="max-w-lg lg:max-w-6xl mx-auto flex flex-col space-y-2.5">
          {/* Primary CTA: Start Round */}
          <button
            id="confirm-commonality-btn"
            type="button"
            disabled={isLoading || !selectedCommonality}
            onClick={() => onConfirmAndStart(selectedCommonality)}
            className="w-full min-h-[50px] sm:min-h-[52px] py-3.5 sm:py-4 px-6 border border-[#f4efe4] bg-[#f4efe4] text-[#09120e] hover:bg-[#b9bfff] hover:border-[#b9bfff] active:scale-[0.99] disabled:opacity-40 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.2em] transition-all cursor-pointer flex items-center justify-center space-x-2"
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

          {/* Secondary Thumb-Zone Row: Back to Players & Reroll Decrees */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onBackToSetup}
              className="min-h-[42px] py-2 px-4 border border-[#f4efe4]/40 hover:border-[#f4efe4] text-[#f4efe4]/75 hover:text-[#f4efe4] text-xs font-medium uppercase tracking-[0.16em] transition-all cursor-pointer text-center"
            >
              ← PLAYERS
            </button>

            <button
              type="button"
              onClick={onRefreshCandidates}
              className="min-h-[42px] py-2 px-4 border border-[#f4efe4]/40 hover:border-[#b9bfff] text-[#f4efe4]/85 hover:text-[#b9bfff] text-xs font-medium uppercase tracking-[0.16em] transition-all cursor-pointer text-center"
              title="Draw new candidate decrees"
            >
              ↻ REROLL DECREES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
