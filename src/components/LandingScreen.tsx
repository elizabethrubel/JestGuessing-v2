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
      className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between py-2 sm:py-4 px-4 sm:px-8 text-center select-none min-h-[100dvh]"
    >
      {/* Corner-Pinned Top Navigation: JEST.GUESSING — Heraldic Knot — RULES */}
      <TopNavBar onOpenRules={onOpenRules} />

      {/* Centerpiece: Monumental "Jest" + Overlapping Periwinkle Goose & Jester + "Guessing" */}
      <div className="my-auto py-2 sm:py-4 flex-1 flex flex-col items-center justify-center relative w-full max-w-2xl mx-auto">
        <div className="relative w-full flex flex-col items-center justify-center">
          {/* Top Monumental Word: "Jest" */}
          <h1
            aria-label="Jest Guessing"
            className="text-[6.2rem] xs:text-[7.2rem] sm:text-[9.5rem] lg:text-[11rem] font-jacquard text-[#f4efe4] leading-[0.78] tracking-tight select-none z-10 pointer-events-none"
          >
            Jest
          </h1>

          {/* Central Woodcut Engraving: Periwinkle-Lilac & Vermilion Crowned Goose + Lute Jester */}
          <div className="relative w-[260px] xs:w-[290px] sm:w-[360px] lg:w-[410px] -mt-7 sm:-mt-11 -mb-6 sm:-mb-9 z-20 flex items-center justify-center">
            <img
              src="/assets/jester-goose.png"
              alt="Renaissance woodcut of a Court Jester playing a lute beside a crowned goose in a ruffled collar"
              className="w-full h-auto object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.55)] pointer-events-none"
            />

            {/* 1-Bit Pixelated Ring ( 1 ) Floating Left of the Goose */}
            <div
              className="pixel-ring absolute left-1 sm:left-2 top-[43%] -translate-y-1/2 text-xs sm:text-sm font-semibold text-[#f4efe4]"
              aria-hidden="true"
            >
              1
            </div>

            {/* 1-Bit Pixelated Ring ( 2 ) Floating Bottom-Right of the Jester */}
            <div
              className="pixel-ring absolute right-2 sm:right-4 bottom-[8%] text-xs sm:text-sm font-semibold text-[#f4efe4]"
              aria-hidden="true"
            >
              2
            </div>
          </div>

          {/* Bottom Monumental Word: "Guessing" */}
          <span
            aria-hidden="true"
            className="block text-[4.1rem] xs:text-[4.75rem] sm:text-[6.4rem] lg:text-[7.6rem] font-jacquard text-[#f4efe4] leading-[0.86] tracking-tight select-none z-10 pointer-events-none"
          >
            Guessing
          </span>
        </div>

        {/* Classical Editorial Serif Epigraph */}
        <p className="font-serif-editorial italic text-base sm:text-xl lg:text-2xl text-[#f4efe4]/90 max-w-xs sm:max-w-md mx-auto leading-snug mt-3 sm:mt-5">
          Never shout your secret identity,
          <br />
          merely deduce the bond.
        </p>
      </div>

      {/* Bottom Action Bar: Sticky to bottom on mobile with generous tap zones, wide architectural alignment on desktop */}
      <div className="w-full sticky bottom-0 z-30 pb-safe pb-4 pt-3 bg-gradient-to-t from-[#09120e] via-[#09120e]/95 to-transparent">
        <div className="max-w-md sm:max-w-xl lg:max-w-3xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          <button
            id="landing-start-btn"
            type="button"
            onClick={onStartSetup}
            className="flex-1 sm:flex-initial sm:min-w-[230px] min-h-[48px] py-3.5 px-5 border border-[#f4efe4]/80 bg-[#09120e]/90 hover:bg-[#f4efe4] hover:text-[#09120e] active:scale-[0.99] text-[#f4efe4] text-xs sm:text-[13px] font-medium uppercase tracking-[0.16em] transition-all cursor-pointer text-center"
          >
            COMMENCE THE JEST
          </button>

          <button
            id="landing-see-rules-btn"
            type="button"
            onClick={onOpenRules}
            className="min-h-[48px] py-3.5 px-5 border border-[#f4efe4]/65 bg-[#09120e]/90 hover:border-[#b9bfff] hover:text-[#b9bfff] active:scale-[0.99] text-[#f4efe4] text-xs sm:text-[13px] font-medium uppercase tracking-[0.16em] transition-all cursor-pointer text-center shrink-0"
          >
            HOW TO PLAY
          </button>
        </div>
      </div>
    </div>
  );
};
