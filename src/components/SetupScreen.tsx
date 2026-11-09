import React, { useState, useRef, useEffect } from 'react';
import { Player } from '../types';
import { TopNavBar } from './TopNavBar';
import { MedievalIcon } from './MedievalIcon';

interface SetupScreenProps {
  players: Player[];
  onUpdatePlayers: (players: Player[]) => void;
  onClearScores?: () => void;
  onProceedToCommonalities: (finalPlayers: Player[]) => void;
  onBackToLanding: () => void;
  onOpenRules: () => void;
}

const AVATAR_COLORS = [
  'bg-[#b9bfff] text-[#09120e]',
  'bg-[#e03a28] text-[#f4efe4]',
  'bg-[#f4efe4] text-[#09120e]',
];

export const SetupScreen: React.FC<SetupScreenProps> = ({
  players,
  onUpdatePlayers,
  onClearScores,
  onProceedToCommonalities,
  onBackToLanding,
  onOpenRules,
}) => {
  const [draftName, setDraftName] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  const playerInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const draftInputRef = useRef<HTMLInputElement | null>(null);
  const nextEmptyInputRef = useRef<HTMLInputElement | null>(null);
  const ledgerScrollRef = useRef<HTMLDivElement | null>(null);
  const blurTimeoutRef = useRef<number | null>(null);

  const handleInputFocus = () => {
    if (blurTimeoutRef.current) {
      window.clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setIsInputFocused(true);
    requestAnimationFrame(() => {
      if (ledgerScrollRef.current) {
        ledgerScrollRef.current.scrollTop = ledgerScrollRef.current.scrollHeight;
      }
    });
  };

  const handleInputBlur = () => {
    blurTimeoutRef.current = window.setTimeout(() => {
      setIsInputFocused(false);
    }, 120);
  };

  // Track visualViewport height so when the mobile keyboard pops up, the layout shrinks cleanly above the keyboard
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const handleResize = () => {
      setViewportHeight(Math.round(vv.height));
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
      requestAnimationFrame(() => {
        if (ledgerScrollRef.current) {
          ledgerScrollRef.current.scrollTop = ledgerScrollRef.current.scrollHeight;
        }
      });
    };

    handleResize();
    vv.addEventListener('resize', handleResize);
    vv.addEventListener('scroll', handleResize);
    return () => {
      vv.removeEventListener('resize', handleResize);
      vv.removeEventListener('scroll', handleResize);
    };
  }, []);

  // Keep the bottom of the player list (active typing row) scrolled into view as players are added
  useEffect(() => {
    if (ledgerScrollRef.current) {
      ledgerScrollRef.current.scrollTop = ledgerScrollRef.current.scrollHeight;
    }
  }, [players.length, draftName.length > 0, isInputFocused]);

  const commitDraft = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const newPlayer: Player = {
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      avatarColor: AVATAR_COLORS[players.length % AVATAR_COLORS.length],
      score: 0,
    };

    const updated = [...players, newPlayer];
    onUpdatePlayers(updated);
    setDraftName('');
    return newPlayer;
  };

  const handleExistingKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (idx < players.length - 1) {
        playerInputRefs.current[idx + 1]?.focus();
      } else {
        draftInputRef.current?.focus();
      }
    }
  };

  const handleDraftKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (draftName.trim()) {
        commitDraft(draftName);
        requestAnimationFrame(() => {
          draftInputRef.current?.focus();
        });
      }
    }
  };

  const handleUpdatePlayerName = (idx: number, newName: string) => {
    const updated = [...players];
    updated[idx] = { ...updated[idx], name: newName };
    onUpdatePlayers(updated);
  };

  const handleRemovePlayer = (id: string) => {
    onUpdatePlayers(players.filter((p) => p.id !== id));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...players];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, moved);
    onUpdatePlayers(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleProceed = () => {
    let finalPlayers = [...players];
    if (draftName.trim()) {
      const newPlayer: Player = {
        id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: draftName.trim(),
        avatarColor: AVATAR_COLORS[players.length % AVATAR_COLORS.length],
        score: 0,
      };
      finalPlayers = [...players, newPlayer];
      onUpdatePlayers(finalPlayers);
      setDraftName('');
    }
    onProceedToCommonalities(finalPlayers);
  };

  const effectiveCount = players.length + (draftName.trim() ? 1 : 0);
  const canProceed = effectiveCount >= 2;
  const hasAnyScore = players.some((p) => p.score > 0);
  const isCompactViewport = viewportHeight !== null && viewportHeight < 560;
  const hideMobileHeader = isInputFocused || isCompactViewport;

  return (
    <div
      id="setup-screen"
      style={viewportHeight ? { height: `${viewportHeight}px`, maxHeight: `${viewportHeight}px` } : undefined}
      className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between py-2 sm:py-6 px-5 sm:px-10 h-[100dvh] overflow-hidden"
    >
      <TopNavBar onGoHome={onBackToLanding} onOpenRules={onOpenRules} />

      {/* Main Content: Single column on mobile with players anchored to bottom, wide 2-column spread on desktop */}
      <div className="py-1 sm:py-6 flex-1 flex flex-col min-h-0 lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center w-full">
        {/* Left Column on Desktop: Title & Editorial Epigraph */}
        <div className="hidden lg:block lg:col-span-5 text-left space-y-4 shrink-0">
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#b9bfff] block">
            ACT I // THE ROSTER
          </span>
          <h1 className="text-7xl lg:text-8xl font-jacquard text-[#f4efe4] leading-[0.92]">
            Players
          </h1>
          <p className="font-serif-editorial italic text-xl text-[#f4efe4]/80 max-w-xs leading-relaxed">
            Inscribe at least two souls to enter the circle of deduction.
          </p>

          {hasAnyScore && onClearScores && (
            <div className="pt-1">
              <button
                id="setup-clear-scores-btn-desktop"
                type="button"
                onClick={onClearScores}
                className="text-[11px] uppercase tracking-[0.18em] text-[#f4efe4]/60 hover:text-[#e03a28] border border-[#f4efe4]/25 hover:border-[#e03a28] px-3 py-1 transition-colors cursor-pointer"
              >
                Clear scores
              </button>
            </div>
          )}

          {/* Subtle Goose & Jester Emblem on Desktop */}
          <div className="pt-4">
            <img
              src="/assets/jester-goose.png"
              alt=""
              className="w-44 h-auto opacity-85 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>

        {/* Right Column: Editorial Player Ledger — Stuck to the bottom on mobile (mt-auto) and pushed up as players are added */}
        <div className="lg:col-span-7 flex-1 flex flex-col min-h-0 w-full max-w-lg lg:max-w-none mx-auto lg:h-full">
          <div
            ref={ledgerScrollRef}
            className="flex-1 overflow-y-auto flex flex-col min-h-0 no-scrollbar"
          >
            {/* Mobile Header: Hidden while entering names, and scrolls up naturally as players are added */}
            {!hideMobileHeader && (
              <div className="lg:hidden text-center space-y-1.5 mb-4 pt-2 shrink-0">
                <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#b9bfff] block">
                  ACT I // THE ROSTER
                </span>
                <h1 className="text-5xl xs:text-6xl font-jacquard text-[#f4efe4] leading-[0.92]">
                  Players
                </h1>
                <p className="font-serif-editorial italic text-base text-[#f4efe4]/80 max-w-xs mx-auto leading-snug">
                  Inscribe at least two souls to enter the circle of deduction.
                </p>

                {hasAnyScore && onClearScores && (
                  <div className="pt-1">
                    <button
                      id="setup-clear-scores-btn"
                      type="button"
                      onClick={onClearScores}
                      className="text-[11px] uppercase tracking-[0.18em] text-[#f4efe4]/60 hover:text-[#e03a28] border border-[#f4efe4]/25 hover:border-[#e03a28] px-3 py-1 transition-colors cursor-pointer"
                    >
                      Clear scores
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-auto lg:my-auto border-t border-b border-[#f4efe4]/35 divide-y divide-[#f4efe4]/20 bg-[#09120e]/60">
              {players.map((player, idx) => (
                <div
                  key={player.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={() => handleDrop(idx)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between min-h-[50px] sm:min-h-[56px] py-2 sm:py-3 px-2.5 sm:px-4 transition-all select-none group ${
                    draggedIndex === idx
                      ? 'opacity-40 bg-[#b9bfff]/10'
                      : dragOverIndex === idx
                      ? 'border-t-2 border-[#b9bfff] bg-[#b9bfff]/10'
                      : 'hover:bg-[#f4efe4]/[0.03]'
                  }`}
                >
                  {/* Left: Drag Handle + 1-Bit Pixel Ring Index */}
                  <div
                    className="flex items-center space-x-2.5 cursor-grab active:cursor-grabbing shrink-0 mr-3 py-1"
                    title="Hold and drag to reorder"
                    onMouseDown={() => handleDragStart(idx)}
                  >
                    <MedievalIcon name="drag" className="text-xs text-[#f4efe4]/40 group-hover:text-[#b9bfff]" />
                    <div className="pixel-ring text-xs font-semibold text-[#f4efe4] scale-90">
                      {idx + 1}
                    </div>
                  </div>

                  {/* Center: Editable Player Name */}
                  <div className="flex items-center flex-1 min-w-0">
                    <input
                      ref={(el) => {
                        playerInputRefs.current[idx] = el;
                      }}
                      type="text"
                      value={player.name}
                      onChange={(e) => handleUpdatePlayerName(idx, e.target.value)}
                      onKeyDown={(e) => handleExistingKeyDown(e, idx)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="w-full bg-transparent font-serif-editorial text-xl sm:text-2xl text-[#f4efe4] focus:outline-none focus:text-[#b9bfff]"
                      maxLength={24}
                    />

                    {player.score > 0 && (
                      <span className="text-xs font-medium uppercase tracking-widest text-[#b9bfff] border border-[#b9bfff]/40 px-2.5 py-0.5 shrink-0 ml-2">
                        {player.score} {player.score === 1 ? 'PT' : 'PTS'}
                      </span>
                    )}
                  </div>

                  {/* Right: Remove Button */}
                  <button
                    id={`remove-player-${player.id}`}
                    type="button"
                    onClick={() => handleRemovePlayer(player.id)}
                    className="p-2 text-[#f4efe4]/45 hover:text-[#e03a28] transition-colors cursor-pointer shrink-0 ml-2"
                    title="Remove player"
                    aria-label={`Remove ${player.name}`}
                  >
                    <MedievalIcon name="close" className="text-xs" />
                  </button>
                </div>
              ))}

              {/* Active Draft Input Row — Always anchored at the bottom above the CTA */}
              <div className="flex items-center justify-between min-h-[50px] sm:min-h-[56px] py-2 sm:py-3 px-2.5 sm:px-4 transition-all">
                <div className="flex items-center space-x-2.5 shrink-0 mr-3 opacity-45">
                  <MedievalIcon name="drag" className="text-xs text-[#f4efe4]/30" />
                  <div className="pixel-ring text-xs font-semibold text-[#f4efe4] scale-90">
                    {players.length + 1}
                  </div>
                </div>

                <div className="flex items-center flex-1 min-w-0">
                  <input
                    ref={draftInputRef}
                    id="active-player-name-input"
                    type="text"
                    placeholder={
                      players.length === 0
                        ? 'Inscribe Player 1...'
                        : players.length === 1
                        ? 'Inscribe Player 2...'
                        : 'Add another player...'
                    }
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onKeyDown={handleDraftKeyDown}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full bg-transparent font-serif-editorial italic text-xl sm:text-2xl text-[#f4efe4] placeholder-[#f4efe4]/35 focus:outline-none"
                    maxLength={24}
                    autoFocus={players.length === 0}
                  />
                </div>

                {draftName && (
                  <button
                    type="button"
                    onClick={() => setDraftName('')}
                    className="p-2 text-[#f4efe4]/50 hover:text-[#f4efe4] transition-colors cursor-pointer shrink-0 ml-2"
                    title="Clear"
                  >
                    <MedievalIcon name="close" className="text-xs" />
                  </button>
                )}
              </div>

              {/* Subsequent Empty Row */}
              {draftName.length > 0 && (
                <div
                  className="flex items-center justify-between min-h-[48px] sm:min-h-[54px] py-2 sm:py-3 px-2.5 sm:px-4 transition-all opacity-35 hover:opacity-70 cursor-text"
                  onClick={() => {
                    if (draftName.trim()) {
                      commitDraft(draftName);
                      requestAnimationFrame(() => {
                        draftInputRef.current?.focus();
                      });
                    }
                  }}
                >
                  <div className="flex items-center space-x-2.5 shrink-0 mr-3">
                    <MedievalIcon name="drag" className="text-xs text-[#f4efe4]/30" />
                    <div className="pixel-ring text-xs font-semibold text-[#f4efe4] scale-90">
                      {players.length + 2}
                    </div>
                  </div>

                  <div className="flex items-center flex-1 min-w-0">
                    <input
                      ref={nextEmptyInputRef}
                      type="text"
                      placeholder="Add another player..."
                      disabled
                      className="w-full bg-transparent font-serif-editorial italic text-xl text-[#f4efe4]/40 placeholder-[#f4efe4]/40 cursor-text focus:outline-none pointer-events-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Zone: Transparent background, always visible right below the input */}
      <div className="w-full shrink-0 z-30 pb-safe pb-3 sm:pb-4 pt-2">
        <div className="max-w-lg lg:max-w-6xl mx-auto flex items-center justify-between gap-3.5 sm:gap-6">
          <button
            type="button"
            onClick={onBackToLanding}
            className="min-h-[48px] sm:min-h-[50px] py-3 sm:py-3.5 px-5 border border-[#f4efe4]/45 hover:border-[#f4efe4] text-[#f4efe4]/80 hover:text-[#f4efe4] text-xs sm:text-[13px] font-medium uppercase tracking-[0.16em] transition-all cursor-pointer shrink-0"
          >
            ← BACK
          </button>

          <button
            id="proceed-to-commonalities-btn"
            type="button"
            disabled={!canProceed}
            onClick={handleProceed}
            className="flex-1 sm:flex-initial sm:min-w-[260px] min-h-[48px] sm:min-h-[50px] py-3 sm:py-3.5 px-6 border border-[#f4efe4] bg-[#f4efe4] text-[#09120e] hover:bg-[#b9bfff] hover:border-[#b9bfff] active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-[13px] font-semibold uppercase tracking-[0.18em] transition-all cursor-pointer text-center"
          >
            CHOOSE COMMONALITY →
          </button>
        </div>
      </div>
    </div>
  );
};
