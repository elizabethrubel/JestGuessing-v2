import React, { useEffect } from 'react';
import { Player, CandidateCommonality } from '../types';
import { TopNavBar } from './TopNavBar';
import { MedievalIcon, MedievalGlyphName } from './MedievalIcon';
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

const MEDIEVAL_DECREE_ICONS: MedievalGlyphName[] = [
  'crossed-swords',
  'shield',
  'wax-seal',
  'fleur',
  'chalice',
  'scroll',
];

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
  // If no candidate is selected yet and candidates exist, auto-select the first one
  useEffect(() => {
    if (!selectedCommonality && candidateCommonalities.length > 0) {
      onSelectCommonality(candidateCommonalities[0]);
    }
  }, [candidateCommonalities, selectedCommonality, onSelectCommonality]);

  return (
    <div
      id="commonality-selection-screen"
      className="w-full h-full max-h-[100dvh] flex flex-col justify-between py-2 sm:py-3 px-3.5 sm:px-6 max-w-md md:max-w-xl lg:max-w-2xl mx-auto select-none overflow-hidden"
    >
      {/* Top Navigation */}
      <TopNavBar
        onGoHome={onGoHome}
        onOpenRules={onOpenRules}
      />

      {/* Main Content: Decree Selection (Zero-scroll compact layout) */}
      <div className="flex-1 flex flex-col justify-center py-2 min-h-0 space-y-3">
        {/* Header without archives tag */}
        <div className="text-center space-y-0.5 shrink-0">
          <h1 className="text-3xl sm:text-4xl font-jacquard text-[#f4f1ea] tracking-wider leading-none drop-shadow-sm">
            Choose Commonality
          </h1>
          <p className="text-xs text-[#a8a29e] font-sans tracking-wide">
            Select the secret trait that binds all {players.length} players
          </p>
        </div>

        {/* Reroll Action Row */}
        <div className="flex items-center justify-end px-1 shrink-0">
          <button
            type="button"
            onClick={onRefreshCandidates}
            className="text-xs text-[#cbb279] hover:text-[#f4f1ea] transition-colors flex items-center space-x-1.5 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-[#142033] border border-[#cbb279]/20 hover:border-[#cbb279]/40 active:scale-95"
            title="Draw new candidate decrees"
          >
            <MedievalIcon name="refresh" className="text-xs text-[#cbb279]" />
            <span className="font-sans font-medium text-[11px]">Reroll Decrees</span>
          </button>
        </div>

        {/* Candidate Decrees List - FULL TEXT VISIBLE, No Subtext, Impressive Medieval Icons */}
        <div className="space-y-2 overflow-y-auto no-scrollbar max-h-[46vh] sm:max-h-[50vh] pr-0.5">
          {candidateCommonalities.map((cand, idx) => {
            const isSelected = selectedCommonality?.id === cand.id;
            const iconName = MEDIEVAL_DECREE_ICONS[idx % MEDIEVAL_DECREE_ICONS.length];

            return (
              <button
                key={cand.id}
                type="button"
                onClick={() => onSelectCommonality(cand)}
                className={`w-full text-left py-3 px-3.5 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3 relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#18253b] border-[#d4b76a] shadow-[0_0_18px_rgba(212,183,106,0.22)]'
                    : 'bg-[#0e1626]/85 border-[#cbb279]/20 hover:border-[#cbb279]/50 hover:bg-[#131e33] text-[#a8a29e]'
                }`}
              >
                {/* Impressive Medieval Heraldic Icon Badge */}
                <div
                  className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#d4b76a]/25 to-[#ba9848]/15 text-[#fbf0cf] border border-[#d4b76a]/40'
                      : 'bg-[#142033] text-[#cbb279]/70 border border-[#cbb279]/15'
                  }`}
                >
                  <MedievalIcon name={iconName} className="text-lg" />
                </div>

                {/* Complete Full Trait Text - Beautifully wrapped and never truncated */}
                <div className="flex-1 min-w-0 pr-4">
                  <p
                    className={`text-sm sm:text-[15px] font-semibold tracking-wide font-sans leading-snug break-words whitespace-normal ${
                      isSelected ? 'text-[#fbf0cf]' : 'text-[#e4dfd3]'
                    }`}
                  >
                    {cand.formattedName}
                  </p>
                </div>

                {/* Selected Checkmark Indicator */}
                {isSelected && (
                  <div className="shrink-0 w-6 h-6 rounded-full bg-[#d4b76a] text-[#120e09] flex items-center justify-center text-xs shadow-sm">
                    <MedievalIcon name="check" className="text-xs text-[#120e09]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Row: Start Round & Back to Players (Sticky to bottom on mobile) */}
      <div className="shrink-0 space-y-2 pt-2 pb-safe pb-2 sticky bottom-0 bg-[#060910]/95 backdrop-blur-xs w-full z-20">
        <button
          id="confirm-commonality-btn"
          type="button"
          disabled={isLoading || !selectedCommonality}
          onClick={() => onConfirmAndStart(selectedCommonality)}
          className="w-full py-3.5 bg-gradient-to-b from-[#e5cf96] via-[#d4b76a] to-[#ba9848] hover:from-[#edd8a4] hover:to-[#c6a454] active:scale-[0.99] disabled:opacity-50 text-[#120e09] font-bold rounded-2xl text-base transition-all cursor-pointer flex items-center justify-center space-x-2.5 shadow-[0_4px_24px_rgba(212,183,106,0.25)] border border-[#fbf0cf]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-[#1a120c]" />
              <span>Divining identities...</span>
            </>
          ) : (
            <>
              <MedievalIcon name="sword" className="text-lg text-[#120e09]" />
              <span>Start round</span>
              <MedievalIcon name="arrow-right" className="text-sm text-[#120e09]" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBackToSetup}
          className="w-full py-1 text-xs text-[#8c827a] hover:text-[#f4f1ea] transition-colors cursor-pointer text-center font-medium font-sans flex items-center justify-center space-x-1"
        >
          <MedievalIcon name="arrow-left" className="text-[11px] text-[#8c827a]" />
          <span>Back to players</span>
        </button>
      </div>
    </div>
  );
};
