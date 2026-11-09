import React, { useState } from 'react';
import { ThemePack } from '../types';

interface TopNavBarProps {
  onGoHome?: () => void;
  onOpenRules: () => void;
  theme?: ThemePack | null;
  isLastTurnRound?: boolean;
  centerContent?: React.ReactNode;
  hideHelp?: boolean;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  onGoHome,
  onOpenRules,
  theme,
  isLastTurnRound,
  centerContent,
  hideHelp = false,
}) => {
  const [showThemeModal, setShowThemeModal] = useState(false);

  return (
    <>
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between pt-3 pb-2 px-1 sm:px-2 shrink-0 z-30 select-none">
        {/* Left: Corner-Pinned Brand / Home Link */}
        <div className="flex items-center justify-start min-w-[110px]">
          {onGoHome ? (
            <button
              id="top-nav-home-btn"
              type="button"
              onClick={onGoHome}
              title="Return home"
              aria-label="Return home"
              className="py-2 pr-3 text-xs sm:text-[13px] font-medium uppercase tracking-[0.14em] text-[#f4efe4] hover:text-[#b9bfff] active:opacity-70 transition-colors cursor-pointer text-left"
            >
              JEST.GUESSING
            </button>
          ) : (
            <span className="py-2 pr-3 text-xs sm:text-[13px] font-medium uppercase tracking-[0.14em] text-[#f4efe4]">
              JEST.GUESSING
            </span>
          )}
        </div>

        {/* Center: Symmetrical 4-Loop Heraldic Clover Knot (or active notice) */}
        <div className="flex items-center justify-center px-2">
          {isLastTurnRound ? (
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e03a28] animate-pulse">
              FINAL TURN
            </span>
          ) : centerContent ? (
            centerContent
          ) : (
            <button
              type="button"
              onClick={theme ? () => setShowThemeModal(true) : onGoHome}
              title={theme ? 'View round commonality' : 'Jest Guessing'}
              className={`p-1.5 text-[#f4efe4] transition-transform duration-300 ${
                theme || onGoHome ? 'hover:text-[#b9bfff] hover:scale-105 cursor-pointer' : 'cursor-default'
              }`}
            >
              {/* Authentic 4-Loop Heraldic Clover Knot from the Folk design */}
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 16c-4.5-4.5-9.5-4.5-9.5 0s5 4.5 9.5 0z" />
                <path d="M16 16c4.5-4.5 9.5-4.5 9.5 0s-5 4.5-9.5 0z" />
                <path d="M16 16c-4.5-4.5-4.5-9.5 0-9.5s4.5 5 0 9.5z" />
                <path d="M16 16c-4.5 4.5-4.5 9.5 0 9.5s4.5-5 0-9.5z" />
                <circle cx="16" cy="4" r="1" fill="currentColor" stroke="none" />
                <circle cx="16" cy="28" r="1" fill="currentColor" stroke="none" />
                <circle cx="4" cy="16" r="1" fill="currentColor" stroke="none" />
                <circle cx="28" cy="16" r="1" fill="currentColor" stroke="none" />
              </svg>
            </button>
          )}
        </div>

        {/* Right: Corner-Pinned Theme & Rules Links */}
        <div className="flex items-center justify-end space-x-4 min-w-[110px]">
          {theme && (
            <button
              id="top-nav-theme-btn"
              type="button"
              onClick={() => setShowThemeModal(true)}
              title="View round theme"
              aria-label="View round theme"
              className="py-2 px-2 text-xs sm:text-[13px] font-medium uppercase tracking-[0.14em] text-[#b9bfff] hover:text-[#f4efe4] transition-colors cursor-pointer"
            >
              DECREE
            </button>
          )}

          {!hideHelp && (
            <button
              id="top-nav-rules-btn"
              type="button"
              onClick={onOpenRules}
              title="How to play"
              aria-label="How to play"
              className="py-2 pl-2 text-xs sm:text-[13px] font-medium uppercase tracking-[0.14em] text-[#f4efe4] hover:text-[#b9bfff] transition-colors cursor-pointer text-right"
            >
              RULES
            </button>
          )}
        </div>
      </header>

      {/* Editorial Modal for Round Theme */}
      {showThemeModal && theme && (
        <div
          id="theme-disclosure-modal"
          className="fixed inset-0 z-50 bg-[#09120e]/90 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowThemeModal(false)}
        >
          <div
            className="w-full max-w-md bg-[#09120e] border border-[#f4efe4]/50 p-7 sm:p-9 space-y-6 text-center shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#f4efe4]/20 pb-3">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#b9bfff]">
                ACTIVE DECREE
              </span>
              <button
                type="button"
                onClick={() => setShowThemeModal(false)}
                className="p-1.5 text-[#f4efe4]/70 hover:text-[#f4efe4] transition-colors cursor-pointer text-xs uppercase tracking-widest"
                aria-label="Close theme modal"
              >
                ✕
              </button>
            </div>

            <div className="py-4 px-2 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-jacquard text-[#f4efe4] leading-snug">
                {theme.name}
              </h2>
              <p className="font-serif-editorial italic text-base text-[#f4efe4]/75">
                Every player’s secret identity shares this bond.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowThemeModal(false)}
              className="w-full py-3.5 border border-[#f4efe4]/70 hover:bg-[#f4efe4] hover:text-[#09120e] text-[#f4efe4] font-medium text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer"
            >
              RETURN TO COURT
            </button>
          </div>
        </div>
      )}
    </>
  );
};
