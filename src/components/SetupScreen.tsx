import React, { useState, useRef } from 'react';
import { Player } from '../types';
import { TopNavBar } from './TopNavBar';
import { MedievalIcon } from './MedievalIcon';

interface SetupScreenProps {
  players: Player[];
  onUpdatePlayers: (players: Player[]) => void;
  onProceedToCommonalities: (finalPlayers: Player[]) => void;
  onBackToLanding: () => void;
  onOpenRules: () => void;
}

const AVATAR_COLORS = [
  'bg-emerald-500 text-white',
  'bg-sky-500 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
  'bg-indigo-500 text-white',
  'bg-teal-500 text-white',
  'bg-purple-500 text-white',
  'bg-orange-500 text-white',
];

export const SetupScreen: React.FC<SetupScreenProps> = ({
  players,
  onUpdatePlayers,
  onProceedToCommonalities,
  onBackToLanding,
  onOpenRules,
}) => {
  const [draftName, setDraftName] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const playerInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const draftInputRef = useRef<HTMLInputElement | null>(null);
  const nextEmptyInputRef = useRef<HTMLInputElement | null>(null);

  // Commit the current draft name to players list
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

  // Handle Return key on existing player inputs
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

  // Handle Return key on the active draft input
  const handleDraftKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (draftName.trim()) {
        commitDraft(draftName);
        // Request animation frame to focus the next empty input after render
        requestAnimationFrame(() => {
          draftInputRef.current?.focus();
        });
      }
    }
  };

  // Update existing player name in place
  const handleUpdatePlayerName = (idx: number, newName: string) => {
    const updated = [...players];
    updated[idx] = { ...updated[idx], name: newName };
    onUpdatePlayers(updated);
  };

  // Remove player
  const handleRemovePlayer = (id: string) => {
    onUpdatePlayers(players.filter((p) => p.id !== id));
  };

  // Drag and Drop reordering
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

  // Proceed handler ensures any ongoing draft is committed and triggers round start
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

  return (
    <div
      id="setup-screen"
      className="w-full flex-1 flex flex-col pt-4 pb-4 px-4 sm:px-6 max-w-lg md:max-w-xl lg:max-w-2xl mx-auto"
    >
      {/* Consistent Top Navigation */}
      <TopNavBar
        onGoHome={onBackToLanding}
        onOpenRules={onOpenRules}
      />

      <div className="flex-1 flex flex-col items-center justify-center min-h-[90px] shrink-0">
        <h1 className="text-6xl sm:text-7xl font-jacquard text-[#f4f1ea] tracking-wider text-center">
          Players
        </h1>
        <p className="text-xs text-[#cbb279]/80 font-sans mt-2 tracking-wide text-center max-w-xs">
          Inscribe at least two noble souls to partake in the trial of wits
        </p>
      </div>

      {/* Players List with Drag Dots on Left, Cross on Right, styled as medieval manuscript ledger */}
      <div className="flex-1 overflow-y-auto flex flex-col min-h-0 no-scrollbar max-w-md md:max-w-lg mx-auto w-full">
        <div className="mt-auto border-t border-b border-[#cbb279]/25 divide-y divide-[#cbb279]/15 bg-[#0a101b]/40 rounded-lg">
          {/* Committed Players */}
          {players.map((player, idx) => (
            <div
              key={player.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={handleDragEnd}
              className={`flex items-center justify-between py-3 px-2 transition-all select-none group ${
                draggedIndex === idx
                  ? 'opacity-40 bg-[#142033]/60'
                  : dragOverIndex === idx
                  ? 'border-t-2 border-[#cbb279] bg-[#142033]/40'
                  : 'hover:bg-[#142033]/30'
              }`}
            >
              {/* LEFT: Drag dots handle only */}
              <div
                className="p-1.5 text-[#8c827a] hover:text-[#cbb279] active:text-white cursor-grab active:cursor-grabbing rounded-lg hover:bg-[#1c2a42]/60 transition-colors shrink-0 mr-2"
                title="Hold and drag to reorder"
                onMouseDown={() => handleDragStart(idx)}
              >
                <MedievalIcon name="drag" className="text-xs text-[#8c827a]" />
              </div>

              {/* CENTER: Editable Name Input */}
              <div className="flex items-center flex-1 min-w-0">
                <input
                  ref={(el) => {
                    playerInputRefs.current[idx] = el;
                  }}
                  type="text"
                  value={player.name}
                  onChange={(e) => handleUpdatePlayerName(idx, e.target.value)}
                  onKeyDown={(e) => handleExistingKeyDown(e, idx)}
                  className="w-full bg-transparent text-sm font-semibold text-[#f4f1ea] focus:outline-none focus:text-white"
                  maxLength={24}
                />

                {player.score > 0 && (
                  <span className="text-[10px] font-bold text-[#cbb279] bg-[#2d1c15] border border-[#cbb279]/40 px-2 py-0.5 rounded-sm shrink-0 font-mono">
                    {player.score} {player.score === 1 ? 'pt' : 'pts'}
                  </span>
                )}
              </div>

              {/* RIGHT: Delete Cross */}
              <button
                id={`remove-player-${player.id}`}
                type="button"
                onClick={() => handleRemovePlayer(player.id)}
                className="p-1.5 text-[#8c827a] hover:text-[#c94134] transition-colors cursor-pointer rounded-lg hover:bg-[#1c2a42]/60 shrink-0 ml-2"
                title="Remove player"
              >
                <MedievalIcon name="close" className="text-xs" />
              </button>
            </div>
          ))}

          {/* Active typing row: Always available */}
          <div className="flex items-center justify-between py-3 px-2 transition-all">
            {/* LEFT: Drag dots (subtle placeholder) */}
            <div className="p-1.5 text-[#57534e] shrink-0 mr-2">
              <MedievalIcon name="drag" className="text-xs text-[#57534e]" />
            </div>

            {/* CENTER: Player Name Input (Return key commits and focuses next) */}
            <div className="flex items-center flex-1 min-w-0">
              <input
                ref={draftInputRef}
                id="active-player-name-input"
                type="text"
                placeholder={players.length === 0 ? "Add Player 1..." : players.length === 1 ? "Add at least 2 players..." : "Add another player..."}
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={handleDraftKeyDown}
                className="w-full bg-transparent text-sm font-semibold text-[#f4f1ea] placeholder-[#78716c] focus:outline-none"
                maxLength={24}
                autoFocus={players.length === 0}
              />
            </div>

            {/* RIGHT: Cross to clear active draft if typed */}
            {draftName && (
              <button
                type="button"
                onClick={() => setDraftName('')}
                className="p-1.5 text-[#8c827a] hover:text-[#f4f1ea] transition-colors cursor-pointer rounded-lg hover:bg-[#1c2a42]/60 shrink-0 ml-2"
                title="Clear"
              >
                <MedievalIcon name="close" className="text-xs" />
              </button>
            )}
          </div>

          {/* Subsequent empty row: Appears whenever user starts typing so there's always an empty row below */}
          {draftName.length > 0 && (
            <div
              className="flex items-center justify-between py-3 px-2 transition-all opacity-40 hover:opacity-80 cursor-text"
              onClick={() => {
                if (draftName.trim()) {
                  commitDraft(draftName);
                  requestAnimationFrame(() => {
                    draftInputRef.current?.focus();
                  });
                }
              }}
            >
              {/* LEFT: Drag dots placeholder */}
              <div className="p-1.5 text-[#57534e] shrink-0 mr-2">
                <MedievalIcon name="drag" className="text-xs text-[#57534e]" />
              </div>

              {/* CENTER: Next empty row placeholder */}
              <div className="flex items-center flex-1 min-w-0">
                <input
                  ref={nextEmptyInputRef}
                  type="text"
                  placeholder={players.length === 0 ? "Add at least 2 players..." : "Add another player..."}
                  disabled
                  className="w-full bg-transparent text-sm text-[#78716c] placeholder-[#78716c] cursor-text focus:outline-none pointer-events-none"
                />
              </div>

              <div className="w-7 shrink-0" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA: Proceed to Commonalities Selection (Sticky to bottom on mobile) */}
      <div className="pt-3 pb-safe pb-3 sticky bottom-0 z-20 bg-[#060910]/95 backdrop-blur-xs max-w-md md:max-w-lg mx-auto w-full">
        <button
          id="proceed-to-commonalities-btn"
          type="button"
          disabled={!canProceed}
          onClick={handleProceed}
          className="w-full py-4 bg-gradient-to-b from-[#e5cf96] via-[#d4b76a] to-[#ba9848] hover:from-[#edd8a4] hover:to-[#c6a454] active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed text-[#120e09] font-bold rounded-2xl text-base transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-[0_4px_24px_rgba(212,183,106,0.25)] border border-[#fbf0cf]"
        >
          <span>Choose commonality</span>
          <MedievalIcon name="arrow-right" className="text-sm text-[#120e09]" />
        </button>
      </div>
    </div>
  );
};
