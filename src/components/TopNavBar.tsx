import React, { useState } from 'react';
import { ThemePack } from '../types';
import { ShepherdStar } from './ShepherdStar';

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
      <header
        className="w-full max-w-6xl mx-auto flex items-center justify-between py-3.5 sm:py-5 px-2 sm:px-4 shrink-0 z-30 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Home / Brand Link with spacious mobile sizing */}
        <div className="flex items-center justify-start flex-1 min-w-0">
          {onGoHome ? (
            <button
              id="top-nav-home-btn"
              type="button"
              onClick={onGoHome}
              title="Return home"
              aria-label="Return home"
              className="py-2 pr-3 text-xs sm:text-[13px] font-medium uppercase tracking-[0.16em] text-[#f4efe4]/85 hover:text-[#b9bfff] active:opacity-70 transition-colors cursor-pointer text-left"
            >
              <span className="sm:hidden">HOME</span>
              <span className="hidden sm:inline">JEST.GUESSING</span>
            </button>
          ) : (
            <span className="py-2 pr-3 text-xs sm:text-[13px] font-medium uppercase tracking-[0.16em] text-[#f4efe4]/85">
              JEST.GUESSING
            </span>
          )}
        </div>

        {/* Center: Shared 7-Pointed Shepherd Star Motif */}
        <div className="flex items-center justify-center px-3 shrink-0">
          {isLastTurnRound ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#e03a28] animate-pulse">
              <ShepherdStar size={14} className="text-[#e03a28]" />
              <span>FINAL TURN</span>
              <ShepherdStar size={14} variant="tilted" className="text-[#e03a28]" />
            </span>
          ) : centerContent ? (
            centerContent
          ) : (
            <button
              type="button"
              onClick={theme ? () => setShowThemeModal(true) : onGoHome}
              title={theme ? 'View round commonality' : 'Jest Guessing'}
              className={`p-1.5 text-[#b9bfff] transition-transform duration-300 flex items-center gap-1 ${
                theme || onGoHome
                  ? 'hover:text-[#f4efe4] hover:scale-110 cursor-pointer'
                  : 'cursor-default'
              }`}
            >
              <ShepherdStar size={12} variant="tilted" className="text-[#b9bfff]/65 hidden sm:inline-block" />
              <ShepherdStar size={24} className="text-[#b9bfff]" />
              <ShepherdStar size={12} variant="asymmetric" className="text-[#b9bfff]/65 hidden sm:inline-block" />
            </button>
          )}
        </div>

        {/* Right: Corner-Pinned Theme & Rules Links */}
        <div className="flex items-center justify-end space-x-5 sm:space-x-6 flex-1 min-w-0">
          {theme && (
            <button
              id="top-nav-theme-btn"
              type="button"
              onClick={() => setShowThemeModal(true)}
              title="View round theme"
              aria-label="View round theme"
              className="py-2 px-1 text-xs sm:text-[13px] font-medium uppercase tracking-[0.16em] text-[#b9bfff] hover:text-[#f4efe4] transition-colors cursor-pointer"
            >
              DECREE
            </button>
          )}

          {!hideHelp ? (
            <button
              id="top-nav-rules-btn"
              type="button"
              onClick={onOpenRules}
              title="How to play"
              aria-label="How to play"
              className="py-2 pl-1 text-xs sm:text-[13px] font-medium uppercase tracking-[0.16em] text-[#f4efe4]/85 hover:text-[#b9bfff] transition-colors cursor-pointer text-right"
            >
              RULES
            </button>
          ) : (
            <div className="w-12" />
          )}
        </div>
      </header>

      {/* Editorial Modal for Round Theme */}
      {showThemeModal && theme && (
        <div
          id="theme-disclosure-modal"
          className="fixed inset-0 z-50 bg-[#09120e]/90 backdrop-blur-xs flex items-center justify-center p-5 animate-in fade-in duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setShowThemeModal(false);
          }}
        >
          <div
            className="w-full max-w-md bg-[#09120e] border border-[#f4efe4]/50 p-7 sm:p-9 space-y-5 text-center shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#f4efe4]/20 pb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#b9bfff]">
                <ShepherdStar size={14} className="text-[#b9bfff]" />
                <span>ACTIVE DECREE</span>
              </span>
              <button
                type="button"
                onClick={() => setShowThemeModal(false)}
                className="p-2 text-[#f4efe4]/70 hover:text-[#f4efe4] transition-colors cursor-pointer text-xs uppercase tracking-widest"
                aria-label="Close theme modal"
              >
                ✕
              </button>
            </div>

            <div className="py-2 px-2 space-y-3 flex flex-col items-center">
              <img
                src="/assets/illus-owl-scholar.png"
                alt="Medieval woodblock owl scholar with spectacles holding a royal decree scroll surrounded by 7-pointed stars"
                className="w-28 sm:w-32 h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
              />
              <h2 className="text-4xl sm:text-5xl font-jacquard text-[#f4efe4] leading-snug">
                {theme.name}
              </h2>
              <p className="font-serif-editorial italic text-lg text-[#f4efe4]/75">
                Every player’s secret identity shares this bond.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowThemeModal(false)}
              className="w-full min-h-[48px] py-3.5 border border-[#f4efe4] bg-[#f4efe4] text-[#09120e] hover:bg-[#b9bfff] hover:border-[#b9bfff] font-semibold text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer"
            >
              RETURN TO COURT
            </button>
          </div>
        </div>
      )}
    </>
  );
};
