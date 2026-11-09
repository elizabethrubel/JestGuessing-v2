import React, { useState, useEffect } from 'react';
import { Player, ThemePack } from '../types';
import { triggerHaptic, playTurnActiveTone } from '../utils/audio';
import { TopNavBar } from './TopNavBar';

interface PrivacyInterstitialScreenProps {
  activePlayer: Player;
  players?: Player[];
  theme: ThemePack;
  turnNumber: number;
  totalPlayers: number;
  isLastTurnRound?: boolean;
  onUnlock: () => void;
  onSkipPlayer: () => void;
  onOpenRules: () => void;
  onGoHome: () => void;
}

function formatCompanionList(companions: Player[]): string {
  const names = companions.map((p) => p.name);
  if (names.length === 0) return 'another player';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} or ${names[1]}`;
  if (names.length === 3) return `${names[0]}, ${names[1]}, or ${names[2]}`;
  return `${names[0]}, ${names[1]}, or another player`;
}

export const PrivacyInterstitialScreen: React.FC<PrivacyInterstitialScreenProps> = ({
  activePlayer,
  players = [],
  theme,
  turnNumber,
  totalPlayers,
  isLastTurnRound,
  onUnlock,
  onSkipPlayer,
  onOpenRules,
  onGoHome,
}) => {
  // Brief guard on mount so a stray double-tap from the previous screen's bottom button never triggers reveal
  const [isArmed, setIsArmed] = useState(false);

  useEffect(() => {
    setIsArmed(false);
    const timer = window.setTimeout(() => {
      setIsArmed(true);
    }, 550);
    return () => window.clearTimeout(timer);
  }, [activePlayer.id, turnNumber]);

  const handleReveal = () => {
    if (!isArmed) return;
    triggerHaptic([35, 25, 60]);
    playTurnActiveTone();
    onUnlock();
  };

  const companions = players.filter((p) => p.id !== activePlayer.id);
  const isTwoPlayerGame = totalPlayers === 2 && companions.length === 1;
  const soleCompanion = isTwoPlayerGame ? companions[0] : null;
  const companionListText = formatCompanionList(companions);

  const headlineText = soleCompanion
    ? `Pass to ${soleCompanion.name}`
    : `Hide from ${activePlayer.name}`;

  return (
    <div
      id="privacy-interstitial-screen"
      className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between py-2.5 sm:py-6 px-5 sm:px-10 text-center select-none relative h-[100dvh] overflow-hidden"
    >
      <TopNavBar
        onGoHome={onGoHome}
        onOpenRules={onOpenRules}
        theme={theme}
        isLastTurnRound={isLastTurnRound}
      />

      {/* Main Focus: Keep device away from the active guesser */}
      <div className="my-auto py-3 sm:py-6 flex flex-col items-center justify-center w-full max-w-3xl mx-auto space-y-4 sm:space-y-6 relative z-20">
        {/* Turn Ring + Guesser Alert Badge */}
        <div className="flex flex-col items-center space-y-3">
          <div className="pixel-ring-periwinkle text-xs sm:text-sm font-bold text-[#b9bfff] scale-110">
            {turnNumber}
          </div>

          <div className="inline-flex items-center space-x-2 px-3.5 py-1 border border-[#e03a28]/80 bg-[#e03a28]/15 text-[#f4efe4] text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em]">
            <span>{activePlayer.name}’S TURN TO GUESS • NO PEEKING</span>
          </div>
        </div>

        {/* Headline & Role Instructions */}
        <div className="space-y-3 sm:space-y-4 flex flex-col items-center justify-center w-full">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.24em] text-[#b9bfff]">
            {soleCompanion
              ? `KEEP HIDDEN FROM ${activePlayer.name.toUpperCase()} • ONLY ${soleCompanion.name.toUpperCase()} LOOKS`
              : `KEEP SCREEN AWAY FROM ${activePlayer.name.toUpperCase()}`}
          </p>

          <h1
            className={`${
              headlineText.length > 16
                ? 'text-5xl xs:text-6xl sm:text-7xl lg:text-8xl'
                : 'text-6xl xs:text-7xl sm:text-8xl lg:text-9xl'
            } font-jacquard text-[#f4efe4] leading-[0.95] text-center break-words max-w-full px-3`}
          >
            {headlineText}
          </h1>

          {soleCompanion ? (
            <p className="font-serif-editorial italic text-xl sm:text-2xl lg:text-3xl text-[#f4efe4]/85 max-w-lg mx-auto pt-1 leading-relaxed">
              <strong className="not-italic font-semibold text-[#f4efe4]">{activePlayer.name}</strong> is guessing this turn. Only{' '}
              <strong className="not-italic font-semibold text-[#b9bfff]">{soleCompanion.name}</strong> should hold the phone and view {activePlayer.name}’s character.
            </p>
          ) : (
            <p className="font-serif-editorial italic text-xl sm:text-2xl lg:text-3xl text-[#f4efe4]/85 max-w-xl mx-auto pt-1 leading-relaxed">
              <strong className="not-italic font-semibold text-[#f4efe4]">{activePlayer.name}</strong> is guessing! Have{' '}
              <strong className="not-italic font-semibold text-[#b9bfff]">{companionListText}</strong> hold the phone and show the screen to everyone{' '}
              <span className="underline decoration-[#e03a28] underline-offset-4">except {activePlayer.name}</span>.
            </p>
          )}
        </div>
      </div>

      {/* Bottom Action Zone: Only explicit button unlocks (no full-screen accidental tap) */}
      <div className="w-full shrink-0 z-30 pb-safe pb-3 sm:pb-4 pt-2">
        <div className="max-w-md sm:max-w-xl mx-auto flex flex-col items-center space-y-2.5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#f4efe4]/65">
            {soleCompanion
              ? `${soleCompanion.name}: Make sure ${activePlayer.name} cannot see the screen`
              : `Table: Make sure ${activePlayer.name} cannot see the screen`}
          </p>

          <button
            id="tap-to-unlock-btn"
            type="button"
            disabled={!isArmed}
            onClick={(e) => {
              e.stopPropagation();
              handleReveal();
            }}
            className="w-full min-h-[54px] py-4 px-5 border border-[#f4efe4] bg-[#f4efe4] hover:bg-[#b9bfff] hover:border-[#b9bfff] text-[#09120e] font-semibold text-xs sm:text-[13px] uppercase tracking-[0.18em] transition-all cursor-pointer select-none active:scale-[0.99] disabled:opacity-60"
          >
            {soleCompanion
              ? `I’M ${soleCompanion.name.toUpperCase()} — REVEAL ${activePlayer.name.toUpperCase()}’S CARD →`
              : `HIDDEN FROM ${activePlayer.name.toUpperCase()} — REVEAL TO TABLE →`}
          </button>

          <button
            id="skip-player-turn-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSkipPlayer();
            }}
            className="min-h-[38px] py-1.5 px-4 text-xs uppercase tracking-[0.18em] text-[#f4efe4]/60 hover:text-[#b9bfff] transition-colors cursor-pointer"
          >
            Skip {activePlayer.name}’s turn
          </button>
        </div>
      </div>
    </div>
  );
};
