import React, { useState } from 'react';
import { ThemePack } from '../types';
import { MedievalIcon } from './MedievalIcon';

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
      <header className="w-full flex items-center justify-between pt-2 pb-2 px-1 shrink-0 z-30 select-none border-b border-[#cbb279]/15">
        {/* Left: Home navigation */}
        <div className="flex items-center justify-start">
          {onGoHome ? (
            <button
              id="top-nav-home-btn"
              type="button"
              onClick={onGoHome}
              title="Return home"
              aria-label="Return home"
              className="px-2.5 py-1 text-xs font-medium text-[#cbb279] hover:text-[#f4f1ea] hover:bg-[#142033]/70 active:scale-95 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 border border-[#cbb279]/20 hover:border-[#cbb279]/50"
            >
              <MedievalIcon name="castle" className="text-sm" />
              <span className="font-sans">Home</span>
            </button>
          ) : (
            <div className="w-12 h-6" />
          )}
        </div>

        {/* Center: Optional notice or state (e.g. Last Turn Round) */}
        <div className="flex-1 flex items-center justify-center min-w-0 px-2">
          {centerContent ? (
            centerContent
          ) : isLastTurnRound ? (
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#e87063] animate-pulse truncate font-mono">
              LAST TURN ROUND
            </span>
          ) : null}
        </div>

        {/* Right: Progressive disclosure controls for Theme and Rules */}
        <div className="flex items-center justify-end space-x-1.5">
          {/* Theme Disclosure Button */}
          {theme && (
            <button
              id="top-nav-theme-btn"
              type="button"
              onClick={() => setShowThemeModal(true)}
              title="View round theme"
              aria-label="View round theme"
              className="px-2.5 py-1 text-xs font-medium text-[#e4dfd3] hover:text-[#ffffff] bg-[#101929]/90 hover:bg-[#16243b] border border-[#cbb279]/30 rounded-md flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <MedievalIcon name="scroll" className="text-xs text-[#cbb279]" />
              <span className="font-sans">Theme</span>
            </button>
          )}

          {/* Rules / Help Button */}
          {!hideHelp && (
            <button
              id="top-nav-rules-btn"
              type="button"
              onClick={onOpenRules}
              title="How to play help"
              aria-label="How to play help"
              className="px-2.5 py-1 text-xs font-medium text-[#a8a29e] hover:text-[#f4f1ea] hover:bg-[#142033]/70 active:scale-95 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 border border-[#cbb279]/20 hover:border-[#cbb279]/50"
            >
              <MedievalIcon name="help" className="text-sm text-[#cbb279]" />
              <span className="font-sans">Help</span>
            </button>
          )}
        </div>
      </header>

      {/* Progressive Disclosure Popover for Theme with Clean Medieval Modal */}
      {showThemeModal && theme && (
        <div
          id="theme-disclosure-modal"
          className="fixed inset-0 z-50 bg-[#060910]/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowThemeModal(false)}
        >
          <div
            className="w-full max-w-sm bg-[#0e1626] border border-[#cbb279]/30 rounded-2xl p-6 space-y-5 text-center shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#cbb279]/20 pb-3">
              <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-widest text-[#cbb279]">
                <MedievalIcon name="star" className="text-xs text-[#cbb279]" />
                <span className="font-sans">Round Theme</span>
              </div>
              <button
                type="button"
                onClick={() => setShowThemeModal(false)}
                className="p-1 text-[#a8a29e] hover:text-[#f4f1ea] rounded-full hover:bg-[#19263e] transition-colors cursor-pointer"
                aria-label="Close theme modal"
              >
                <MedievalIcon name="close" className="text-xs" />
              </button>
            </div>

            <div className="py-3 px-1">
              <h2 className="text-3xl sm:text-4xl font-jacquard text-[#f4f1ea] tracking-wider leading-snug">
                {theme.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowThemeModal(false)}
              className="w-full py-2.5 bg-[#2d1c15] hover:bg-[#3d261d] text-[#e8e2d5] border border-[#8a5a44]/50 font-semibold text-xs rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
