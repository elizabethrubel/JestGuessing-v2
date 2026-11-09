import React from 'react';
import { TopNavBar } from './TopNavBar';
import { MedievalIcon } from './MedievalIcon';

interface LandingScreenProps {
  onStartSetup: () => void;
  onOpenRules: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartSetup,
  onOpenRules,
}) => {
  return (
    <div
      id="landing-screen"
      className="w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto flex-1 flex flex-col justify-between py-4 px-4 text-center select-none"
    >
      {/* Consistent Top Navigation with Help hidden since How to play is below the CTA */}
      <TopNavBar
        onOpenRules={onOpenRules}
        hideHelp={true}
      />

      {/* Hero Typography - Clean, Open, Uncluttered */}
      <div className="my-auto py-8 flex-1 flex flex-col items-center justify-center relative w-full max-w-md mx-auto space-y-6">
        <div className="space-y-3 text-center">
          <h1 className="text-8xl sm:text-9xl font-jacquard tracking-wider text-[#f4f1ea] leading-[0.92] drop-shadow-md">
            Jest
            <br />
            Guessing
          </h1>
          <p className="text-xs text-[#a8a29e] font-sans max-w-xs mx-auto pt-1">
            Deduce your secret identity through single-device party play
          </p>
        </div>
      </div>

      {/* Primary Action Button - Regal Medieval Gold Foil Style + How to Play Below without outline (Sticky to bottom on mobile) */}
      <div className="w-full pb-safe pb-3 pt-2 shrink-0 max-w-md md:max-w-lg mx-auto space-y-3 sticky bottom-0 z-20 bg-[#060910]/90 backdrop-blur-xs">
        <button
          id="landing-start-btn"
          type="button"
          onClick={onStartSetup}
          className="w-full py-4.5 bg-gradient-to-b from-[#e5cf96] via-[#d4b76a] to-[#ba9848] hover:from-[#edd8a4] hover:to-[#c6a454] active:scale-[0.99] text-[#120e09] font-bold rounded-2xl text-base transition-all cursor-pointer flex items-center justify-between px-6 shadow-[0_4px_24px_rgba(212,183,106,0.25)] border border-[#fbf0cf] group"
        >
          <div className="flex items-center space-x-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-[#1a120c]/15 flex items-center justify-center text-[#120e09]">
              <MedievalIcon name="sword" className="text-base text-[#120e09]" />
            </div>
            <span className="font-extrabold text-base tracking-wide text-[#120e09]">
              Commence the Jest
            </span>
          </div>
          <MedievalIcon name="arrow-right" className="text-sm text-[#120e09] group-hover:translate-x-1 transition-transform" />
        </button>

        {/* How to play placed below Commence the Jest without badge outline */}
        <button
          id="landing-see-rules-btn"
          type="button"
          onClick={onOpenRules}
          className="w-full py-2 text-xs font-medium text-[#cbb279] hover:text-[#f4f1ea] transition-colors cursor-pointer flex items-center justify-center space-x-2"
        >
          <MedievalIcon name="help" className="text-sm text-[#dfc282]" />
          <span className="font-sans">How to play</span>
        </button>
      </div>
    </div>
  );
};
