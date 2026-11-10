import React from 'react';
import { TopNavBar } from './TopNavBar';
import { ShepherdStar } from './ShepherdStar';

interface LandingScreenProps {
  onStartSetup: () => void;
  onStartSolo: () => void;
  onOpenRules: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartSetup,
  onStartSolo,
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
      <div className="my-auto py-1 sm:py-6 flex-1 flex flex-col items-center justify-center relative w-full max-w-2xl mx-auto space-y-3 sm:space-y-5 min-h-0">
        <div className="relative w-full flex flex-col items-center justify-center">
          {/* Top Monumental Word: "Jest" in Jacquard 24 */}
          <h1
            aria-label="Jest Guessing"
            className="text-[6.8rem] xs:text-[7.8rem] sm:text-[9.5rem] lg:text-[11rem] font-jacquard text-[#f4efe4] leading-[0.84] tracking-normal select-none z-10 pointer-events-none"
          >
            Jest
          </h1>

          {/* Central Woodblock Folk Print: Crowned Goose + Lute-Playing Raccoon Jester with 7-Pointed Stars */}
          <div className="relative w-[265px] xs:w-[300px] sm:w-[345px] lg:w-[385px] -mt-5 sm:-mt-7 -mb-4 sm:-mb-5 z-20 flex items-center justify-center">
            <img
              src="/assets/jester-goose.png"
              alt="Medieval folk woodblock print of a crowned goose honking beside a silly raccoon jester playing a lute surrounded by 7-pointed periwinkle stars"
              className="w-full h-auto object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.55)] pointer-events-none"
            />

            {/* 1-Bit Pixelated Ring ( 1 ) Floating Left of the Goose */}
            <div
              className="pixel-ring absolute left-0 sm:left-1 top-[44%] -translate-y-1/2 text-xs sm:text-sm font-semibold text-[#f4efe4]"
              aria-hidden="true"
            >
              1
            </div>

            {/* 1-Bit Pixelated Ring ( 2 ) Floating Bottom-Right of the Raccoon Jester */}
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
            className="block text-[4.75rem] xs:text-[5.4rem] sm:text-[6.6rem] lg:text-[7.8rem] font-jacquard text-[#f4efe4] leading-[0.88] tracking-normal select-none z-10 pointer-events-none"
          >
            Guessing
          </span>
        </div>

        {/* Classical Editorial Serif Epigraph flanked by Shepherd Stars */}
        <div className="flex items-center justify-center gap-2.5 pt-1">
          <ShepherdStar size={16} variant="tilted" className="text-[#b9bfff]/75" />
          <p className="font-serif-editorial italic text-xl sm:text-2xl lg:text-3xl text-[#f4efe4]/85 max-w-xs sm:max-w-md mx-auto leading-snug sm:leading-relaxed">
            Who is the best in jest?
          </p>
          <ShepherdStar size={16} variant="asymmetric" className="text-[#b9bfff]/75" />
        </div>
      </div>

      {/* Bottom Action Zone: Transparent background */}
      <div className="w-full shrink-0 z-30 pb-safe pb-3 sm:pb-4 pt-2">
        <div className="max-w-sm sm:max-w-md mx-auto flex flex-col items-center space-y-2.5">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              id="landing-start-btn"
              type="button"
              onClick={onStartSetup}
              className="w-full min-h-[50px] py-3.5 px-5 border border-[#f4efe4] bg-[#f4efe4] text-[#09120e] hover:bg-[#b9bfff] hover:border-[#b9bfff] active:scale-[0.99] text-xs sm:text-[12px] font-semibold uppercase tracking-[0.18em] transition-all cursor-pointer text-center"
            >
              PARTY JEST (2+ PLAYERS) →
            </button>

            <button
              id="landing-solo-btn"
              type="button"
              onClick={onStartSolo}
              className="w-full min-h-[50px] py-3.5 px-5 border border-[#b9bfff] bg-[#b9bfff]/10 text-[#f4efe4] hover:bg-[#b9bfff] hover:text-[#09120e] active:scale-[0.99] text-xs sm:text-[12px] font-semibold uppercase tracking-[0.18em] transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <ShepherdStar size={13} className="text-current" />
              <span>SOLO JEST (1 PLAYER) →</span>
            </button>
          </div>

          <button
            id="landing-see-rules-btn"
            type="button"
            onClick={onOpenRules}
            className="min-h-[36px] py-1 px-4 text-xs font-medium uppercase tracking-[0.18em] text-[#f4efe4]/60 hover:text-[#b9bfff] transition-colors cursor-pointer text-center"
          >
            How to play
          </button>
        </div>
      </div>
    </div>
  );
};
