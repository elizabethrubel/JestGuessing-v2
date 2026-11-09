import React, { useState } from 'react';
import { ThemePack } from '../types';
import { Loader2 } from 'lucide-react';
import { TopNavBar } from './TopNavBar';

interface ThemeRevealScreenProps {
  theme: ThemePack;
  onContinue: () => void;
  onShuffleTheme?: () => Promise<void>;
  onGoHome: () => void;
  onOpenRules: () => void;
}

export const ThemeRevealScreen: React.FC<ThemeRevealScreenProps> = ({
  theme,
  onContinue,
  onShuffleTheme,
  onGoHome,
  onOpenRules,
}) => {
  const [isShuffling, setIsShuffling] = useState(false);

  const handleShuffle = async () => {
    if (!onShuffleTheme) return;
    setIsShuffling(true);
    await onShuffleTheme();
    setIsShuffling(false);
  };

  return (
    <div
      id="theme-reveal-screen"
      className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between py-2 sm:py-4 px-4 sm:px-8 min-h-[100dvh]"
    >
      <TopNavBar onGoHome={onGoHome} onOpenRules={onOpenRules} theme={theme} />

      <div className="flex-1 flex flex-col items-center justify-center px-3 max-w-2xl mx-auto w-full my-auto text-center space-y-5">
        <span className="text-xs sm:text-[13px] font-medium uppercase tracking-[0.25em] text-[#b9bfff]">
          ROUND COMMONALITY
        </span>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-jacquard text-[#f4efe4] text-center leading-[0.95] break-words max-w-full px-2">
          {theme.name}
        </h1>

        <p className="font-serif-editorial italic text-lg sm:text-2xl text-[#f4efe4]/80 max-w-md mx-auto pt-1">
          Every player’s secret identity shares this bond.
        </p>
      </div>

      <div className="w-full sticky bottom-0 z-30 pb-safe pb-4 pt-3 bg-gradient-to-t from-[#09120e] via-[#09120e]/95 to-transparent">
        <div className="max-w-md sm:max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {onShuffleTheme && (
            <button
              type="button"
              onClick={handleShuffle}
              disabled={isShuffling}
              className="w-full sm:w-auto min-h-[48px] py-3.5 px-5 border border-[#f4efe4]/50 hover:border-[#b9bfff] text-[#f4efe4] hover:text-[#b9bfff] text-xs uppercase tracking-[0.18em] transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isShuffling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#b9bfff]" />
                  <span>SHUFFLING...</span>
                </>
              ) : (
                <span>↻ SHUFFLE DECREE</span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onContinue}
            className="w-full sm:flex-1 min-h-[48px] py-3.5 px-6 border border-[#f4efe4] bg-[#f4efe4] hover:bg-[#b9bfff] hover:border-[#b9bfff] text-[#09120e] font-semibold text-xs uppercase tracking-[0.2em] transition-all cursor-pointer text-center"
          >
            START ROUND →
          </button>
        </div>
      </div>
    </div>
  );
};
