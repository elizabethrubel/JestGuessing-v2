import React from 'react';
import { TopNavBar } from './TopNavBar';

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
      className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between py-2.5 sm:py-6 px-5 sm:px-10 text-center select-none h-[100dvh] overflow-hidden"
    >
      {/* Top Navigation with hideHelp=true so "How to play" isn't duplicated */}
      <TopNavBar onOpenRules={onOpenRules} hideHelp={true} />

      {/* Centerpiece with generous breathing room */}
      <div className="my-auto py-2 sm:py-6 flex-1 flex flex-col items-center justify-center relative w-full max-w-2xl mx-auto space-y-3 sm:space-y-5 min-h-0">
        <div className="relative w-full flex flex-col items-center justify-center">
          {/* Top Monumental Word: "Jest" in Jacquard 24 */}
          <h1
            aria-label="Jest Guessing"
            className="text-[5.5rem] xs:text-[6.8rem] sm:text-[9.5rem] lg:text-[11rem] font-jacquard text-[#f4efe4] leading-[0.84] tracking-normal select-none z-10 pointer-events-none"
          >
            Jest
          </h1>

          {/* Central Woodcut Engraving: Periwinkle-Lilac & Vermilion Crowned Goose + Lute Jester */}
          <div className="relative w-[220px] xs:w-[255px] sm:w-[340px] lg:w-[390px] -mt-4 sm:-mt-7 -mb-3 sm:-mb-5 z-20 flex items-center justify-center">
            <img
              src="/assets/jester-goose.png"
              alt="Renaissance woodcut of a Court Jester playing a lute beside a crowned goose in a ruffled collar"
              className="w-full h-auto object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.55)] pointer-events-none"
            />

            {/* 1-Bit Pixelated Ring ( 1 ) Floating Left of the Goose */}
            <div
              className="pixel-ring absolute left-0 sm:left-1 top-[44%] -translate-y-1/2 text-xs sm:text-sm font-semibold text-[#f4efe4]"
              aria-hidden="true"
            >
              1
            </div>

            {/* 1-Bit Pixelated Ring ( 2 ) Floating Bottom-Right of the Jester */}
            <div
              className="pixel-ring absolute right-1 sm:right-3 bottom-[8%] text-xs sm:text-sm font-semibold text-[#f4efe4]"
              aria-hidden="true"
            >
              2
            </div>
          </div>

          {/* Bottom Monumental Word: "Guessing" in Jacquard 24 */}
          <span
            aria-hidden="true"
            className="block text-[3.85rem] xs:text-[4.65rem] sm:text-[6.6rem] lg:text-[7.8rem] font-jacquard text-[#f4efe4] leading-[0.88] tracking-normal select-none z-10 pointer-events-none"
          >
            Guessing
          </span>
        </div>

        {/* Classical Editorial Serif Epigraph */}
        <p className="font-serif-editorial italic text-lg sm:text-xl lg:text-2xl text-[#f4efe4]/85 max-w-xs sm:max-w-md mx-auto leading-snug sm:leading-relaxed">
          Never shout your secret identity,
          <br />
          merely deduce the bond.
        </p>
      </div>

      {/* Bottom Action Zone: Transparent background */}
      <div className="w-full shrink-0 z-30 pb-safe pb-3 sm:pb-4 pt-2">
        <div className="max-w-sm sm:max-w-md mx-auto flex flex-col items-center space-y-2">
          <button
            id="landing-start-btn"
            type="button"
            onClick={onStartSetup}
            className="w-full min-h-[52px] py-4 px-6 border border-[#f4efe4] bg-[#f4efe4] text-[#09120e] hover:bg-[#b9bfff] hover:border-[#b9bfff] active:scale-[0.99] text-xs sm:text-[13px] font-semibold uppercase tracking-[0.2em] transition-all cursor-pointer text-center"
          >
            COMMENCE THE JEST →
          </button>

          <button
            id="landing-see-rules-btn"
            type="button"
            onClick={onOpenRules}
            className="min-h-[38px] py-1.5 px-4 text-xs font-medium uppercase tracking-[0.18em] text-[#f4efe4]/60 hover:text-[#b9bfff] transition-colors cursor-pointer text-center"
          >
            How to play
          </button>
        </div>
      </div>
    </div>
  );
};
