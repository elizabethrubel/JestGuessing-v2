/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Player, ThemePack, GameStage, CandidateCommonality } from './types';
import { LandingScreen } from './components/LandingScreen';
import { SetupScreen } from './components/SetupScreen';
import { PrivacyInterstitialScreen } from './components/PrivacyInterstitialScreen';
import { ActiveTurnScreen } from './components/ActiveTurnScreen';
import { LastTurnInterstitial } from './components/LastTurnInterstitial';
import { ScoreboardScreen } from './components/ScoreboardScreen';
import { ThemeRevealScreen } from './components/ThemeRevealScreen';
import { CommonalitySelectionScreen } from './components/CommonalitySelectionScreen';
import { RulesOverlay } from './components/RulesOverlay';
import { LatencyTipsOverlay } from './components/LatencyTipsOverlay';
import { VERIFIED_CATEGORIES } from './data/verifiedCharacterSets';

function getLocalCandidateCommonalities(excludeIds: number[] = []): CandidateCommonality[] {
  const indexed = VERIFIED_CATEGORIES.map((cat, idx) => ({
    id: idx + 1000,
    trait: cat.trait,
    formattedName: cat.name,
  }));
  const available = indexed.filter((c) => !excludeIds.includes(c.id));
  const pool = available.length >= 3 ? available : indexed;
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
}

export default function App() {
  // Upon first landing, there should be NO users automatically applied
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem('who_am_i_players_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [activeTheme, setActiveTheme] = useState<ThemePack | null>(null);
  const [stage, setStage] = useState<GameStage>('landing');
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [isLoadingRound, setIsLoadingRound] = useState<boolean>(false);
  const [loadingContext, setLoadingContext] = useState<{ title: string; subtitle: string }>({
    title: 'Divining Commonality',
    subtitle: 'Aligning matching secret identities for your players...',
  });
  const [isRerollingCharacter, setIsRerollingCharacter] = useState<boolean>(false);
  const [playedCommonalityIds, setPlayedCommonalityIds] = useState<number[]>([]);

  // Two-Stage Candidate Commonalities (0 tokens, 0ms)
  const [candidateCommonalities, setCandidateCommonalities] = useState<CandidateCommonality[]>(() =>
    getLocalCandidateCommonalities()
  );
  const [selectedCommonality, setSelectedCommonality] = useState<CandidateCommonality | null>(null);

  // Deck Cache for EACH candidate commonality sitting in memory ready for 0ms instant launch
  const [candidateDeckCache, setCandidateDeckCache] = useState<Record<number, ThemePack>>({});
  const inFlightDecksRef = useRef<Set<number>>(new Set());
  const [preloadedTheme, setPreloadedTheme] = useState<(ThemePack & { commonalityId?: number }) | null>(null);
  const isPrefetchingRef = useRef<boolean>(false);

  // Last Turn mechanics
  const [isLastTurnRound, setIsLastTurnRound] = useState<boolean>(false);
  const [lastTurnTriggerPlayerId, setLastTurnTriggerPlayerId] = useState<string | null>(null);
  const [lastTurnRemainingPlayerIds, setLastTurnRemainingPlayerIds] = useState<string[]>([]);
  const [lastTurnWinner, setLastTurnWinner] = useState<Player | null>(null);
  const [turnCounter, setTurnCounter] = useState<number>(1);

  // Sync players to local storage
  useEffect(() => {
    try {
      localStorage.setItem('who_am_i_players_v2', JSON.stringify(players));
    } catch {
      // ignore
    }
  }, [players]);

  // Load candidate commonalities from catalog (with instant local fallback)
  const fetchCandidateCommonalities = async () => {
    try {
      const res = await fetch(`/api/candidate-commonalities?exclude=${playedCommonalityIds.join(',')}`);
      if (res.ok) {
        const data = await res.json();
        if (data.candidates && Array.isArray(data.candidates) && data.candidates.length > 0) {
          setCandidateCommonalities(data.candidates);
          setSelectedCommonality(data.candidates[0]);
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch candidate commonalities, using local verified catalog:', err);
    }
    const localCands = getLocalCandidateCommonalities(playedCommonalityIds);
    setCandidateCommonalities(localCands);
    setSelectedCommonality(localCands[0] || null);
  };

  useEffect(() => {
    fetchCandidateCommonalities();
  }, [playedCommonalityIds]);

  // Pre-load character decks for EACH candidate commonality sequentially ahead of time to eliminate loading delay
  useEffect(() => {
    if (players.length < 2 || candidateCommonalities.length === 0) return;

    let isCancelled = false;

    async function loadCandidatesSequentially() {
      for (const cand of candidateCommonalities) {
        if (isCancelled) break;
        if (candidateDeckCache[cand.id] || inFlightDecksRef.current.has(cand.id)) continue;

        inFlightDecksRef.current.add(cand.id);
        try {
          const res = await fetch('/api/round-theme', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              players: players.map((p) => ({ id: p.id, name: p.name })),
              excludeCommonalityIds: playedCommonalityIds,
              specificCommonalityId: cand.id,
              specificTrait: cand.trait,
            }),
          });
          if (res.ok && !isCancelled) {
            const theme = await res.json();
            if (theme && theme.characters && theme.characters.length > 0) {
              setCandidateDeckCache((prev) => ({
                ...prev,
                [cand.id]: theme,
              }));
            }
          }
        } catch {
          // Silently ignore prefetch failures; will load on-demand if clicked
        } finally {
          inFlightDecksRef.current.delete(cand.id);
        }

        // Small delay between fetches to prevent server concurrency spikes
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    loadCandidatesSequentially();

    return () => {
      isCancelled = true;
    };
  }, [candidateCommonalities, players.length, playedCommonalityIds]);

  // Silent background prefetch: keeps 1 round theme warm in memory for instant start (0 tokens wasted)
  const prefetchRoundTheme = async (
    targetPlayers: Player[],
    specificCommId?: number,
    specificTrait?: string
  ) => {
    if (targetPlayers.length < 2 || isPrefetchingRef.current) return;
    isPrefetchingRef.current = true;
    try {
      const res = await fetch('/api/round-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          players: targetPlayers.map((p) => ({ id: p.id, name: p.name })),
          excludeCommonalityIds: playedCommonalityIds,
          specificCommonalityId: specificCommId,
          specificTrait: specificTrait,
        }),
      });

      if (res.ok) {
        const theme: ThemePack & { commonalityId?: number } = await res.json();
        if (theme && theme.characters && theme.characters.length > 0) {
          setPreloadedTheme(theme);
        }
      }
    } catch (err) {
      console.warn('Background prefetch failed silently:', err);
    } finally {
      isPrefetchingRef.current = false;
    }
  };

  // Prefetch when players are typing on Setup screen (debounced)
  useEffect(() => {
    if (stage === 'setup' && players.length >= 2) {
      const timer = setTimeout(() => {
        prefetchRoundTheme(players, selectedCommonality?.id, selectedCommonality?.trait);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [players.length, stage, selectedCommonality]);

  // Core round initiator: checks preloaded cache first for instant 0ms start, or generates
  const handleStartRandomRound = async (
    customPlayersList?: Player[],
    chosenCommonality?: CandidateCommonality | null,
    contextTitle?: string,
    contextSubtitle?: string
  ) => {
    const targetPlayers = customPlayersList || players;
    if (targetPlayers.length < 2) return;

    const commChoice = chosenCommonality !== undefined ? chosenCommonality : selectedCommonality;

    // 1. Check if the candidate's pre-loaded deck is sitting ready in cache (Instant 0ms launch!)
    if (commChoice && candidateDeckCache[commChoice.id]) {
      const readyTheme = candidateDeckCache[commChoice.id];
      if (readyTheme.commonalityId) {
        setPlayedCommonalityIds((prev) => [...prev.slice(-30), readyTheme.commonalityId!]);
      }
      handleStartRound(readyTheme, targetPlayers, commChoice);
      return;
    }

    // 2. Check if we have a matching generic preloaded theme in memory
    if (preloadedTheme && preloadedTheme.characters && preloadedTheme.characters.length > 0) {
      const matchesChoice =
        !commChoice ||
        preloadedTheme.commonalityId === commChoice.id;

      if (matchesChoice) {
        const readyTheme = preloadedTheme;
        setPreloadedTheme(null); // Consume preloaded theme
        if (readyTheme.commonalityId) {
          setPlayedCommonalityIds((prev) => [...prev.slice(-30), readyTheme.commonalityId!]);
        }
        handleStartRound(readyTheme, targetPlayers, commChoice);
        return;
      }
    }

    // Otherwise, show the streamlined Latency Tips overlay while fetching
    setLoadingContext({
      title: contextTitle || (commChoice ? commChoice.formattedName : 'Divining the Commonality'),
      subtitle: contextSubtitle || 'Consulting the royal archives to bind all players under one secret decree...',
    });
    setIsLoadingRound(true);

    try {
      const res = await fetch('/api/round-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          players: targetPlayers.map((p) => ({ id: p.id, name: p.name })),
          excludeCommonalityIds: playedCommonalityIds,
          specificCommonalityId: commChoice?.id,
          specificTrait: commChoice?.trait,
        }),
      });

      if (res.ok) {
        const theme: ThemePack & { commonalityId?: number } = await res.json();
        if (theme && theme.characters && theme.characters.length > 0) {
          if (theme.commonalityId) {
            setPlayedCommonalityIds((prev) => [...prev.slice(-30), theme.commonalityId!]);
          }
          handleStartRound(theme, targetPlayers, commChoice);
          return;
        }
      }

      // Local fallback matching chosen commonality if API fails
      const matchedCat = commChoice
        ? VERIFIED_CATEGORIES.find(
            (c) => c.trait === commChoice.trait || c.name === commChoice.formattedName
          )
        : null;
      if (matchedCat) {
        handleStartRound(
          {
            id: matchedCat.id,
            name: commChoice?.formattedName || matchedCat.name,
            characters: matchedCat.characters,
          },
          targetPlayers,
          commChoice
        );
        return;
      }

      const { CURATED_THEMES } = await import('./data/themes');
      const fallback = CURATED_THEMES[Math.floor(Math.random() * CURATED_THEMES.length)];
      handleStartRound(fallback, targetPlayers, commChoice);
    } catch (err) {
      console.error('Error starting round with random commonality:', err);
      const matchedCat = commChoice
        ? VERIFIED_CATEGORIES.find(
            (c) => c.trait === commChoice.trait || c.name === commChoice.formattedName
          )
        : null;
      if (matchedCat) {
        handleStartRound(
          {
            id: matchedCat.id,
            name: commChoice?.formattedName || matchedCat.name,
            characters: matchedCat.characters,
          },
          targetPlayers,
          commChoice
        );
        return;
      }
      const { CURATED_THEMES } = await import('./data/themes');
      const fallback = CURATED_THEMES[Math.floor(Math.random() * CURATED_THEMES.length)];
      handleStartRound(fallback, targetPlayers, commChoice);
    } finally {
      setIsLoadingRound(false);
    }
  };

  // Track all characters assigned or rejected in the current round to NEVER repeat a character
  const [seenCharactersInRound, setSeenCharactersInRound] = useState<Set<string>>(new Set());

  // Start round with theme and distribute characters
  const handleStartRound = (theme: ThemePack, playerList?: Player[], chosenComm?: CandidateCommonality | null) => {
    const list = playerList || players;
    const commChoice = chosenComm !== undefined ? chosenComm : selectedCommonality;
    const finalTheme: ThemePack = {
      ...theme,
      name: commChoice ? commChoice.formattedName : theme.name,
      commonalityId: commChoice ? commChoice.id : (theme as any).commonalityId,
    };
    setActiveTheme(finalTheme);

    // Shuffle characters and distribute to players
    const unassignedChars = [...theme.characters].sort(() => Math.random() - 0.5);
    
    let charIndex = 0;
    const initialSeen = new Set<string>();

    const updatedPlayers = list.map((player) => {
      const assignedChar = unassignedChars[charIndex % unassignedChars.length];
      charIndex++;
      
      if (assignedChar) {
        if (assignedChar.wikiSlug) initialSeen.add(assignedChar.wikiSlug.toLowerCase());
        if (assignedChar.name) initialSeen.add(assignedChar.name.toLowerCase());
      }

      return {
        ...player,
        assignedCharacter: assignedChar,
        hasGuessedCorrectly: false,
      };
    });

    setSeenCharactersInRound(initialSeen);
    setPlayers(updatedPlayers);
    setActivePlayerIndex(0);
    setIsLastTurnRound(false);
    setLastTurnTriggerPlayerId(null);
    setLastTurnRemainingPlayerIds([]);
    setLastTurnWinner(null);
    setTurnCounter(1);
    // User directly proceeds to first player's turn, never repeating the commonality
    setStage('privacy_interstitial');

    // Background Pipelining: quietly prepare Round N+1 while players play this round
    setTimeout(() => {
      prefetchRoundTheme(updatedPlayers);
    }, 3500);
  };

  // Turn progression
  const handleTurnEnd = (guessedCorrectly: boolean) => {
    const currentPlayer = players[activePlayerIndex];
    let updatedPlayers = [...players];

    if (guessedCorrectly) {
      updatedPlayers = updatedPlayers.map((p, idx) =>
        idx === activePlayerIndex
          ? { ...p, score: p.score + 1, hasGuessedCorrectly: true }
          : p
      );
      setPlayers(updatedPlayers);
    }

    // Trigger Last Turn Interstitial if this is the FIRST player to guess correctly!
    if (guessedCorrectly && !isLastTurnRound) {
      setIsLastTurnRound(true);
      setLastTurnTriggerPlayerId(currentPlayer.id);
      setLastTurnWinner(currentPlayer);

      // Construct remaining queue of players who still get their one final turn
      const remaining: string[] = [];
      const total = players.length;
      for (let i = 1; i < total; i++) {
        const nextIdx = (activePlayerIndex + i) % total;
        remaining.push(players[nextIdx].id);
      }

      if (remaining.length === 0) {
        setStage('scoreboard');
        return;
      }

      setLastTurnRemainingPlayerIds(remaining);
      const nextIndex = (activePlayerIndex + 1) % total;
      setActivePlayerIndex(nextIndex);
      setTurnCounter((t) => t + 1);

      // Show BIG indication interstitial screen
      setStage('last_turn_interstitial');
      return;
    }

    // Handle ongoing Last Turn round
    if (isLastTurnRound) {
      const remaining = lastTurnRemainingPlayerIds.filter(
        (id) => id !== currentPlayer.id
      );

      if (remaining.length === 0) {
        setStage('scoreboard');
        return;
      }

      setLastTurnRemainingPlayerIds(remaining);
      const nextIndex = (activePlayerIndex + 1) % players.length;
      setActivePlayerIndex(nextIndex);
      setTurnCounter((t) => t + 1);
      setStage('privacy_interstitial');
      return;
    }

    // Standard turn advance
    const nextIndex = (activePlayerIndex + 1) % players.length;
    setActivePlayerIndex(nextIndex);
    setTurnCounter((t) => t + 1);
    setStage('privacy_interstitial');
  };

  // Skip a player's turn if they stepped away
  const handleSkipPlayer = () => {
    const nextIndex = (activePlayerIndex + 1) % players.length;
    setActivePlayerIndex(nextIndex);
    setStage('privacy_interstitial');
  };

  // Reroll single character without EVER repeating any character that was already seen, assigned, or skipped in this round
  const handleRerollCharacter = async () => {
    if (!activeTheme) return;

    const currentPlayer = players[activePlayerIndex];
    const currentSlug = currentPlayer.assignedCharacter?.wikiSlug?.toLowerCase();
    const currentName = currentPlayer.assignedCharacter?.name?.toLowerCase();

    const updatedSeen = new Set(seenCharactersInRound);
    if (currentSlug) updatedSeen.add(currentSlug);
    if (currentName) updatedSeen.add(currentName);

    // Characters from activeTheme that have NEVER been assigned or rejected this round
    const available = activeTheme.characters.filter((c) => {
      const slugLower = (c.wikiSlug || '').toLowerCase();
      const nameLower = (c.name || '').toLowerCase();
      return !updatedSeen.has(slugLower) && !updatedSeen.has(nameLower);
    });

    if (available.length > 0) {
      const pick = available[0];
      if (pick.wikiSlug) updatedSeen.add(pick.wikiSlug.toLowerCase());
      if (pick.name) updatedSeen.add(pick.name.toLowerCase());
      setSeenCharactersInRound(updatedSeen);

      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex ? { ...p, assignedCharacter: pick } : p
        )
      );
      return;
    }

    // If local pool is exhausted, fetch a guaranteed fresh unique character from the server API
    setIsRerollingCharacter(true);
    try {
      const res = await fetch('/api/reroll-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trait: activeTheme.name,
          commonalityId: activeTheme.commonalityId,
          excludeSlugs: Array.from(updatedSeen),
          excludeNames: Array.from(updatedSeen),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.character) {
          const freshChar = data.character;
          if (freshChar.wikiSlug) updatedSeen.add(freshChar.wikiSlug.toLowerCase());
          if (freshChar.name) updatedSeen.add(freshChar.name.toLowerCase());
          setSeenCharactersInRound(updatedSeen);

          setActiveTheme((prev) => prev ? {
            ...prev,
            characters: [...prev.characters, freshChar],
          } : prev);

          setPlayers((prev) =>
            prev.map((p, idx) =>
              idx === activePlayerIndex ? { ...p, assignedCharacter: freshChar } : p
            )
          );
        }
      }
    } catch (err) {
      console.warn('Failed to fetch remote reroll character:', err);
    } finally {
      setIsRerollingCharacter(false);
    }
  };

  const activePlayer = players[activePlayerIndex] || players[0];

  return (
    <div className={`min-h-[100dvh] text-[#f4f1ea] flex flex-col justify-between selection:bg-[#7d221c]/40 selection:text-[#f4f1ea] relative font-sans transition-colors duration-500 ${
      (stage === 'active_turn' && isLastTurnRound) || stage === 'last_turn_interstitial' 
        ? 'bg-medieval-lastturn' 
        : 'bg-medieval-diamonds'
    }`}>
      {/* Active Screen */}
      <main className="flex-1 flex flex-col w-full">
        {stage === 'landing' && (
          <LandingScreen
            onStartSetup={() => setStage('setup')}
            onOpenRules={() => setShowRules(true)}
          />
        )}

        {stage === 'setup' && (
          <SetupScreen
            players={players}
            onUpdatePlayers={setPlayers}
            onClearScores={() => {
              setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
              setRoundNumber(1);
            }}
            onProceedToCommonalities={(finalPlayers) => {
              setPlayers(finalPlayers);
              setStage('commonality_selection');
              if (finalPlayers.length >= 2) {
                prefetchRoundTheme(finalPlayers, selectedCommonality?.id, selectedCommonality?.trait);
              }
            }}
            onBackToLanding={() => setStage('landing')}
            onOpenRules={() => setShowRules(true)}
          />
        )}

        {stage === 'commonality_selection' && (
          <CommonalitySelectionScreen
            players={players}
            candidateCommonalities={candidateCommonalities}
            selectedCommonality={selectedCommonality}
            onSelectCommonality={(c) => {
              setSelectedCommonality(c);
              if (players.length >= 2) {
                prefetchRoundTheme(players, c?.id, c?.trait);
              }
            }}
            onRefreshCandidates={fetchCandidateCommonalities}
            onConfirmAndStart={(chosen) => {
              handleStartRandomRound(players, chosen);
            }}
            onBackToSetup={() => setStage('setup')}
            onGoHome={() => setStage('landing')}
            onOpenRules={() => setShowRules(true)}
            isLoading={isLoadingRound}
          />
        )}

        {stage === 'theme_reveal' && activeTheme && (
          <ThemeRevealScreen
            theme={activeTheme}
            onContinue={() => setStage('privacy_interstitial')}
            onShuffleTheme={() =>
              handleStartRandomRound(
                undefined,
                null,
                'Shuffling Commonality',
                'Consulting the medieval archives for a brand new theme...'
              )
            }
            onGoHome={() => setStage('landing')}
            onOpenRules={() => setShowRules(true)}
          />
        )}

        {stage === 'privacy_interstitial' && activeTheme && (
          <PrivacyInterstitialScreen
            activePlayer={activePlayer}
            theme={activeTheme}
            turnNumber={turnCounter}
            totalPlayers={players.length}
            isLastTurnRound={isLastTurnRound}
            onUnlock={() => setStage('active_turn')}
            onSkipPlayer={handleSkipPlayer}
            onOpenRules={() => setShowRules(true)}
            onGoHome={() => setStage('landing')}
          />
        )}

        {stage === 'active_turn' && activeTheme && (
          <ActiveTurnScreen
            player={activePlayer}
            theme={activeTheme}
            roundNumber={roundNumber}
            isLastTurnRound={isLastTurnRound}
            isRerolling={isRerollingCharacter}
            onMissedGuess={() => handleTurnEnd(false)}
            onCorrectGuess={() => handleTurnEnd(true)}
            onRerollCharacter={handleRerollCharacter}
            onGoHome={() => setStage('landing')}
            onOpenRules={() => setShowRules(true)}
          />
        )}

        {stage === 'last_turn_interstitial' && activeTheme && lastTurnWinner && (
          <LastTurnInterstitial
            winnerPlayer={lastTurnWinner}
            theme={activeTheme}
            remainingCount={lastTurnRemainingPlayerIds.length}
            nextPlayerName={activePlayer.name}
            onContinue={() => setStage('privacy_interstitial')}
            onGoHome={() => setStage('landing')}
            onOpenRules={() => setShowRules(true)}
          />
        )}

        {stage === 'scoreboard' && activeTheme && (
          <ScoreboardScreen
            players={players}
            theme={activeTheme}
            roundNumber={roundNumber}
            firstSolverId={lastTurnTriggerPlayerId}
            onPlayAgain={() => {
              setRoundNumber((r) => r + 1);
              setSelectedCommonality(null);
              fetchCandidateCommonalities();
              setStage('commonality_selection');
            }}
            onClearScores={() => {
              setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
              setRoundNumber(1);
            }}
            onGoHome={() => setStage('landing')}
            onOpenRules={() => setShowRules(true)}
          />
        )}
      </main>

      {/* How to Play Rules Overlay */}
      <RulesOverlay
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />

      {/* Dynamic Latency Tips & Sample Questions Overlay */}
      {isLoadingRound && (
        <LatencyTipsOverlay
          title={loadingContext.title}
          subtitle={loadingContext.subtitle}
        />
      )}
    </div>
  );
}
