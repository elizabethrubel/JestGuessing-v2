import React, { useState } from 'react';
import { ThemePack } from '../types';
import { Loader2 } from 'lucide-react';
import { TopNavBar } from './TopNavBar';
import { MedievalIcon } from './MedievalIcon';

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

  const getHeadingSizeClass = (text: string) => {
    const len = text.length;
    if (len < 25) {
      return 'text-5xl sm:text-6xl md:text-7xl';
    } else if (len < 50) {
      return 'text-4xl sm:text-5xl md:text-6xl';
    } else if (len < 80) {
      return 'text-3xl sm:text-4xl md:text-5xl';
    } else {
      return 'text-2xl sm:text-3xl md:text-4xl';
    }
  };

  return (
    <div
      id="theme-reveal-screen"
      className="w-full flex-1 flex flex-col justify-between py-4 px-4 sm:px-6"
    >
      {/* Consistent Top Navigation */}
      <TopNavBar
        onGoHome={onGoHome}
        onOpenRules={onOpenRules}
        theme={theme}
      />

      {/* Main Focus: Commonality Heading unconstrained by window arches */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 max-w-lg mx-auto w-full my-auto text-center space-y-4">
        <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-[#cbb279]">
          Round Commonality
        </span>

        <h1 className={`${getHeadingSizeClass(theme.name)} font-jacquard text-[#f4f1ea] tracking-normal text-center leading-[1.08] drop-shadow-md break-words max-w-full px-2`}>
          {theme.name}
        </h1>

        <p className="text-xs sm:text-sm text-[#a8a29e] font-sans max-w-sm mx-auto tracking-wide pt-1">
          Every player's secret identity shares this attribute
        </p>
      </div>
      
      <div className="pt-4 shrink-0 space-y-3 pb-2 max-w-md mx-auto w-full">
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-4 bg-gradient-to-b from-[#e5cf96] via-[#d4b76a] to-[#ba9848] hover:from-[#edd8a4] hover:to-[#c6a454] active:scale-[0.99] text-[#120e09] font-bold rounded-2xl text-base transition-all cursor-pointer flex items-center justify-center space-x-2.5 shadow-[0_4px_24px_rgba(212,183,106,0.25)] border border-[#fbf0cf]"
        >
          <MedievalIcon name="sword" className="text-base text-[#120e09]" />
          <span>Start round</span>
          <MedievalIcon name="arrow-right" className="text-sm text-[#120e09]" />
        </button>

        {onShuffleTheme && (
          <button
            type="button"
            onClick={handleShuffle}
            disabled={isShuffling}
            className="w-full py-3.5 bg-[#101929]/90 hover:bg-[#16243b] active:scale-[0.99] text-[#e4dfd3] font-semibold rounded-2xl text-sm transition-all cursor-pointer flex items-center justify-center space-x-2 border border-[#cbb279]/30 disabled:opacity-50"
          >
            {isShuffling ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#cbb279]" />
            ) : (
              <MedievalIcon name="refresh" className="text-sm text-[#cbb279]" />
            )}
            <span>{isShuffling ? 'Shuffling...' : 'Shuffle theme'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
