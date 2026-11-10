import React, { useState } from 'react';
import { ShepherdStar } from './ShepherdStar';

interface RulesOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'party' | 'solo';
}

export const RulesOverlay: React.FC<RulesOverlayProps> = ({
  isOpen,
  onClose,
  defaultTab = 'party',
}) => {
  const [modeTab, setModeTab] = useState<'party' | 'solo'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div
      id="rules-overlay-modal"
      className="fixed inset-0 z-50 bg-[#09120e]/92 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#09120e] border border-[#f4efe4]/55 p-6 sm:p-9 space-y-5 text-[#f4efe4] relative max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f4efe4]/20 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.22em] text-[#b9bfff] mb-1">
              <ShepherdStar size={14} className="text-[#b9bfff]" />
              <span>THE PARLOR CODEX</span>
            </span>
            <h2 className="text-4xl sm:text-5xl font-jacquard text-[#f4efe4] leading-none">
              How to Play
            </h2>
          </div>
          <button
            id="close-rules-btn"
            type="button"
            onClick={onClose}
            className="p-2 text-[#f4efe4]/65 hover:text-[#b9bfff] transition-colors cursor-pointer text-sm uppercase tracking-widest"
            aria-label="Close rules"
          >
            ✕
          </button>
        </div>

        {/* Mode Switcher Tabs: Party vs Solo */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id="rules-tab-party"
            type="button"
            onClick={() => setModeTab('party')}
            className={`py-2 px-3 border text-xs uppercase tracking-[0.18em] font-semibold transition-colors cursor-pointer ${
              modeTab === 'party'
                ? 'border-[#b9bfff] bg-[#b9bfff]/15 text-[#f4efe4]'
                : 'border-[#f4efe4]/25 text-[#f4efe4]/60 hover:text-[#f4efe4]'
            }`}
          >
            PARTY JEST (2+ PLAYERS)
          </button>

          <button
            id="rules-tab-solo"
            type="button"
            onClick={() => setModeTab('solo')}
            className={`py-2 px-3 border text-xs uppercase tracking-[0.18em] font-semibold transition-colors cursor-pointer ${
              modeTab === 'solo'
                ? 'border-[#b9bfff] bg-[#b9bfff]/15 text-[#f4efe4]'
                : 'border-[#f4efe4]/25 text-[#f4efe4]/60 hover:text-[#f4efe4]'
            }`}
          >
            SOLO JEST (1 PLAYER)
          </button>
        </div>

        {modeTab === 'party' ? (
          /* Party Rule Steps */
          <div className="space-y-5">
            <div className="flex items-start space-x-4">
              <div className="pixel-ring shrink-0 mt-0.5 text-xs font-semibold text-[#f4efe4]">
                1
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b9bfff]">
                  KEEP AWAY FROM THE GUESSER
                </h3>
                <p className="font-serif-editorial text-lg leading-snug text-[#f4efe4]/85">
                  When it is a player’s turn to guess, another player holds the device and shows the secret character to the rest of the table—keeping the screen hidden from the guesser.
                </p>
              </div>
            </div>

            <div className="h-px bg-[#f4efe4]/15" />

            <div className="flex items-start space-x-4">
              <div className="pixel-ring shrink-0 mt-0.5 text-xs font-semibold text-[#f4efe4]">
                2
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b9bfff]">
                  ONE QUESTION &amp; ONE GUESS
                </h3>
                <p className="font-serif-editorial text-lg leading-snug text-[#f4efe4]/85">
                  On your turn, ask the table a single Yes/No question—remembering that all characters share the round’s secret bond—then venture one guess.
                </p>
              </div>
            </div>

            <div className="h-px bg-[#f4efe4]/15" />

            <div className="flex items-start space-x-4">
              <div className="pixel-ring-periwinkle shrink-0 mt-0.5 text-xs font-bold text-[#b9bfff]">
                3
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e03a28]">
                  THE FINAL TURN
                </h3>
                <p className="font-serif-editorial text-lg leading-snug text-[#f4efe4]/85">
                  The first player to name their identity scores +1 point and triggers the Final Turn, granting everyone else one last chance to score.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Solo Jest Rule Steps */
          <div className="space-y-5">
            <div className="flex items-start space-x-4">
              <div className="pixel-ring shrink-0 mt-0.5 text-xs font-semibold text-[#f4efe4]">
                1
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b9bfff]">
                  THE OPENING COMMONALITY CLUE
                </h3>
                <p className="font-serif-editorial text-lg leading-snug text-[#f4efe4]/85">
                  You begin with a 100-point bounty and an automatic Opening Clue describing a trait your secret character possesses.
                </p>
              </div>
            </div>

            <div className="h-px bg-[#f4efe4]/15" />

            <div className="flex items-start space-x-4">
              <div className="pixel-ring shrink-0 mt-0.5 text-xs font-semibold text-[#f4efe4]">
                2
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b9bfff]">
                  QUESTION THE COURT ORACLE
                </h3>
                <p className="font-serif-editorial text-lg leading-snug text-[#f4efe4]/85">
                  Ask the Court Oracle Yes/No questions to narrow down your identity. Your first 3 questions are free; each extra question costs -5 points.
                </p>
              </div>
            </div>

            <div className="h-px bg-[#f4efe4]/15" />

            <div className="flex items-start space-x-4">
              <div className="pixel-ring-periwinkle shrink-0 mt-0.5 text-xs font-bold text-[#b9bfff]">
                3
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e03a28]">
                  EVERY GUESS COUNTS
                </h3>
                <p className="font-serif-editorial text-lg leading-snug text-[#f4efe4]/85">
                  Venture a character guess when ready! Guessing right on your first try preserves your bounty, while each wrong guess deducts -20 points from your score.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Close CTA */}
        <button
          id="got-it-rules-btn"
          type="button"
          onClick={onClose}
          className="w-full min-h-[48px] py-3.5 border border-[#f4efe4] bg-[#f4efe4] hover:bg-[#b9bfff] hover:border-[#b9bfff] text-[#09120e] font-semibold text-xs uppercase tracking-[0.2em] transition-all cursor-pointer text-center"
        >
          ENTER THE JEST →
        </button>
      </div>
    </div>
  );
};
