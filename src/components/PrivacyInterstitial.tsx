import React from 'react';
import { Player } from '../types';
import { ShieldCheck, EyeOff, Hand, Volume2, Sparkles } from 'lucide-react';
import { playTurnActiveTone, playPassTone } from '../utils/audio';

interface PrivacyInterstitialProps {
  nextPlayer: Player;
  isFinalOrbit: boolean;
  onActivateTurn: () => void;
  onHoldStart: () => void;
  onHoldEnd: () => void;
}

export const PrivacyInterstitial: React.FC<PrivacyInterstitialProps> = ({
  nextPlayer,
  isFinalOrbit,
  onActivateTurn,
  onHoldStart,
  onHoldEnd,
}) => {
  const handleTapActivate = () => {
    playTurnActiveTone();
    onActivateTurn();
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    playTurnActiveTone();
    onHoldStart();
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    playPassTone();
    onHoldEnd();
  };

  return (
    <div id="privacy-interstitial" className="w-full max-w-lg mx-auto flex-1 flex flex-col justify-between py-6 px-2 text-center select-none">
      {/* Status & Final Orbit Pill */}
      <div className="space-y-2">
        {isFinalOrbit ? (
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500 text-stone-950 rounded-full text-xs font-black tracking-wider uppercase animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Final Orbit • Last Turn!</span>
          </div>
        ) : (
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-stone-200/80 rounded-full text-xs font-semibold text-stone-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Privacy Shield Active • Card Hidden</span>
          </div>
        )}
      </div>

      {/* Main Pass Prompt */}
      <div className="space-y-4 my-auto py-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-stone-900 text-white flex items-center justify-center shadow-lg">
          <EyeOff className="w-10 h-10 text-stone-300" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-stone-600">Next Turn</span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 mt-1">
            Pass to {nextPlayer.name}
          </h2>
        </div>

        <div className="bg-stone-100/90 rounded-2xl p-4 max-w-sm mx-auto border border-stone-200 text-xs text-stone-600 leading-relaxed">
          <p className="font-semibold text-stone-800 mb-1">
            Hold screen against forehead or place upright facing your friends.
          </p>
          <p>
            Do not look at the screen! A gentle chime will notify you when the card is live.
          </p>
        </div>
      </div>

      {/* Dual Interaction Controls (Stress-Free: Hold to Reveal OR Tap to Lock Live) */}
      <div className="space-y-3 pt-4 max-w-sm mx-auto w-full">
        {/* Option 1: Tap to Start Turn with Chime */}
        <button
          id="tap-to-activate-turn-btn"
          type="button"
          onClick={handleTapActivate}
          className="w-full py-4 bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-white font-bold rounded-2xl text-base shadow-md cursor-pointer transition-all flex items-center justify-center space-x-2"
        >
          <Volume2 className="w-5 h-5 text-amber-400" />
          <span>I'm Facing Away • Start Turn</span>
        </button>

        {/* Option 2: Hold to Reveal Area */}
        <div
          id="hold-to-reveal-zone"
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full py-3.5 px-4 bg-stone-100 active:bg-amber-100 hover:bg-stone-200/70 border-2 border-dashed border-stone-300 active:border-amber-500 rounded-2xl text-xs font-semibold text-stone-700 active:text-amber-900 cursor-pointer transition-all flex items-center justify-center space-x-2 touch-none"
        >
          <Hand className="w-4 h-4 text-stone-600" />
          <span>Or press & hold screen to show to table</span>
        </div>

        <p className="text-[11px] text-stone-600">
          No timers. Take your time to get settled before starting!
        </p>
      </div>
    </div>
  );
};
