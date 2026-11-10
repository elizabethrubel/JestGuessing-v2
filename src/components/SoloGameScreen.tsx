import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Character, ThemePack } from '../types';
import { TopNavBar } from './TopNavBar';
import { ShepherdStar } from './ShepherdStar';
import {
  formatSoloClue,
  checkCharacterGuess,
  evaluateSoloQuestion,
  SOLO_SUGGESTED_QUESTIONS,
  OracleVerdict,
  getAllKnownCharacterNames,
} from '../data/soloOracleEngine';
import { playSuccessTone, playPassTone, playTurnActiveTone, triggerHaptic } from '../utils/audio';
import { Loader2 } from 'lucide-react';

interface SoloLedgerEntry {
  id: string;
  type: 'question' | 'wrong_guess';
  text: string;
  verdict?: OracleVerdict;
  subnote?: string;
}

export interface SoloCareerStats {
  totalScore: number;
  roundsSolved: number;
  roundsPlayed: number;
  currentStreak: number;
  bestRoundScore: number;
  totalGuessesOnSolves: number;
}

interface SoloGameScreenProps {
  theme: ThemePack;
  secretCharacter: Character;
  roundNumber: number;
  isLoadingNewMystery?: boolean;
  onNewMystery: () => void;
  onGoHome: () => void;
  onOpenRules: () => void;
}

const BASE_BOUNTY = 100;
const FREE_QUESTION_ALLOWANCE = 3;
const EXTRA_QUESTION_PENALTY = 5;
const WRONG_GUESS_PENALTY = 20;
const ORIGIN_CLUE_PENALTY = 10;
const HINT_CLUE_PENALTY = 15;
const MIN_SOLVE_SCORE = 10;

export const SoloGameScreen: React.FC<SoloGameScreenProps> = ({
  theme,
  secretCharacter,
  roundNumber,
  isLoadingNewMystery = false,
  onNewMystery,
  onGoHome,
  onOpenRules,
}) => {
  const [questionInput, setQuestionInput] = useState('');
  const [guessInput, setGuessInput] = useState('');
  const [isAskingOracle, setIsAskingOracle] = useState(false);
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);

  const [ledger, setLedger] = useState<SoloLedgerEntry[]>([]);
  const [askedQuestionIds, setAskedQuestionIds] = useState<Set<string>>(new Set());
  const [questionsCount, setQuestionsCount] = useState(0);
  const [wrongGuessesCount, setWrongGuessesCount] = useState(0);
  const [revealedOriginClue, setRevealedOriginClue] = useState(false);
  const [revealedHintClue, setRevealedHintClue] = useState(false);

  const [roundStatus, setRoundStatus] = useState<'playing' | 'solved' | 'surrendered'>('playing');
  const [finalRoundScore, setFinalRoundScore] = useState<number>(0);
  const [totalGuessesTaken, setTotalGuessesTaken] = useState<number>(0);
  const [shakeScore, setShakeScore] = useState(false);

  // Mobile keyboard viewport tracking
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [careerStats, setCareerStats] = useState<SoloCareerStats>(() => {
    try {
      const saved = localStorage.getItem('jest_guessing_solo_stats_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      totalScore: 0,
      roundsSolved: 0,
      roundsPlayed: 0,
      currentStreak: 0,
      bestRoundScore: 0,
      totalGuessesOnSolves: 0,
    };
  });

  const ledgerScrollRef = useRef<HTMLDivElement | null>(null);
  const blurTimeoutRef = useRef<number | null>(null);
  const allCharacterNames = useMemo(() => getAllKnownCharacterNames(), []);

  const scrollToLatestAnswer = () => {
    requestAnimationFrame(() => {
      if (ledgerScrollRef.current) {
        ledgerScrollRef.current.scrollTop = ledgerScrollRef.current.scrollHeight;
      }
    });
  };

  // Track visualViewport height so when the mobile keyboard pops up, the Q&A list and inputs stay visible and scroll up cleanly
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const handleResize = () => {
      setViewportHeight(Math.round(vv.height));
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
      scrollToLatestAnswer();
    };

    handleResize();
    vv.addEventListener('resize', handleResize);
    vv.addEventListener('scroll', handleResize);
    return () => {
      vv.removeEventListener('resize', handleResize);
      vv.removeEventListener('scroll', handleResize);
    };
  }, []);

  const handleInputFocus = () => {
    if (blurTimeoutRef.current) {
      window.clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setIsInputFocused(true);
    scrollToLatestAnswer();
  };

  const handleInputBlur = () => {
    blurTimeoutRef.current = window.setTimeout(() => {
      setIsInputFocused(false);
    }, 150);
  };

  // Reset state on new mystery
  useEffect(() => {
    setLedger([]);
    setAskedQuestionIds(new Set());
    setQuestionsCount(0);
    setWrongGuessesCount(0);
    setRevealedOriginClue(false);
    setRevealedHintClue(false);
    setRoundStatus('playing');
    setFinalRoundScore(0);
    setTotalGuessesTaken(0);
    setQuestionInput('');
    setGuessInput('');
    setShowSampleDropdown(false);
  }, [secretCharacter.name, theme.id]);

  // Keep most recent answer scrolled into view
  useEffect(() => {
    scrollToLatestAnswer();
  }, [ledger.length, isInputFocused]);

  const updateCareerStats = (updater: (prev: SoloCareerStats) => SoloCareerStats) => {
    setCareerStats((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem('jest_guessing_solo_stats_v1', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const extraQuestionsUsed = Math.max(0, questionsCount - FREE_QUESTION_ALLOWANCE);
  const questionPenalty = extraQuestionsUsed * EXTRA_QUESTION_PENALTY;
  const wrongGuessPenalty = wrongGuessesCount * WRONG_GUESS_PENALTY;
  const cluePenalty =
    (revealedOriginClue ? ORIGIN_CLUE_PENALTY : 0) +
    (revealedHintClue ? HINT_CLUE_PENALTY : 0);

  const currentPotentialScore = Math.max(
    MIN_SOLVE_SCORE,
    BASE_BOUNTY - questionPenalty - wrongGuessPenalty - cluePenalty
  );

  const soloClueText = useMemo(() => formatSoloClue(theme.name), [theme.name]);

  const triggerPenaltyPulse = () => {
    setShakeScore(true);
    window.setTimeout(() => setShakeScore(false), 450);
  };

  const handleSolveSuccess = (guessesUsed: number) => {
    triggerHaptic([60, 40, 80]);
    playSuccessTone();
    const earned = currentPotentialScore;
    setFinalRoundScore(earned);
    setTotalGuessesTaken(guessesUsed);
    setRoundStatus('solved');

    updateCareerStats((prev) => ({
      totalScore: prev.totalScore + earned,
      roundsSolved: prev.roundsSolved + 1,
      roundsPlayed: prev.roundsPlayed + 1,
      currentStreak: prev.currentStreak + 1,
      bestRoundScore: Math.max(prev.bestRoundScore, earned),
      totalGuessesOnSolves: prev.totalGuessesOnSolves + guessesUsed,
    }));
  };

  const handleSurrender = () => {
    triggerHaptic(40);
    playPassTone();
    setFinalRoundScore(0);
    setTotalGuessesTaken(wrongGuessesCount);
    setRoundStatus('surrendered');

    updateCareerStats((prev) => ({
      ...prev,
      roundsPlayed: prev.roundsPlayed + 1,
      currentStreak: 0,
    }));
  };

  const handleAskQuestion = async (questionText: string, chipId?: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isAskingOracle || roundStatus !== 'playing') return;

    setIsAskingOracle(true);
    setQuestionInput('');
    setShowSampleDropdown(false);

    // Check if the user typed a direct character guess into the question box
    const localGuessCheck = checkCharacterGuess(trimmed, secretCharacter);
    if (localGuessCheck.isCorrect) {
      setIsAskingOracle(false);
      handleSolveSuccess(wrongGuessesCount + 1);
      return;
    }

    const nextQNumber = questionsCount + 1;
    let verdict: OracleVerdict = 'NO';

    try {
      const res = await fetch('/api/solo-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          character: secretCharacter,
          themeName: theme.name,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isDirectGuess && data.guessedCharacterMatch) {
          setIsAskingOracle(false);
          handleSolveSuccess(wrongGuessesCount + 1);
          return;
        }
        verdict = data.verdict || 'NO';
      } else {
        verdict = evaluateSoloQuestion(trimmed, secretCharacter, theme.name).verdict;
      }
    } catch {
      verdict = evaluateSoloQuestion(trimmed, secretCharacter, theme.name).verdict;
    } finally {
      setIsAskingOracle(false);
    }

    if (chipId) {
      setAskedQuestionIds((prev) => new Set(prev).add(chipId));
    }

    setQuestionsCount(nextQNumber);
    if (nextQNumber > FREE_QUESTION_ALLOWANCE) {
      triggerPenaltyPulse();
    }
    playTurnActiveTone();

    setLedger((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'question',
        text: trimmed.endsWith('?') ? trimmed : `${trimmed}?`,
        verdict,
      },
    ]);
  };

  const handleGuessSubmit = (rawGuessText?: string) => {
    const candidate = (rawGuessText ?? guessInput).trim();
    if (!candidate || roundStatus !== 'playing') return;

    setGuessInput('');
    const nextGuessCount = wrongGuessesCount + 1;
    const { isCorrect, isSameOrigin } = checkCharacterGuess(candidate, secretCharacter);

    if (isCorrect) {
      handleSolveSuccess(nextGuessCount);
      return;
    }

    triggerHaptic(50);
    playPassTone();
    setWrongGuessesCount(nextGuessCount);
    triggerPenaltyPulse();

    setLedger((prev) => [
      ...prev,
      {
        id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'wrong_guess',
        text: candidate,
        subnote: isSameOrigin ? 'Warm — same franchise!' : undefined,
      },
    ]);
  };

  const matchingCharacterSuggestions = useMemo(() => {
    const q = guessInput.trim().toLowerCase();
    if (q.length < 2) return [];
    return allCharacterNames
      .filter((name) => name.toLowerCase().includes(q))
      .slice(0, 5);
  }, [guessInput, allCharacterNames]);

  const availableSuggestedQuestions = useMemo(() => {
    return SOLO_SUGGESTED_QUESTIONS.filter((item) => !askedQuestionIds.has(item.id));
  }, [askedQuestionIds]);

  const isCompactKeyboard = isInputFocused && viewportHeight !== null && viewportHeight < 580;

  return (
    <div
      id="solo-game-screen"
      style={viewportHeight ? { height: `${viewportHeight}px`, maxHeight: `${viewportHeight}px` } : undefined}
      className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-between py-2 sm:py-5 px-5 sm:px-8 select-none h-[100dvh] overflow-hidden"
    >
      {/* Hide top nav on mobile when software keyboard is up to maximize room for Q&A and inputs */}
      {!isCompactKeyboard && (
        <TopNavBar
          onGoHome={onGoHome}
          onOpenRules={onOpenRules}
          centerContent={
            <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#b9bfff]">
              <ShepherdStar size={13} className="text-[#b9bfff]" />
              <span>SOLO JEST</span>
            </span>
          }
        />
      )}

      {roundStatus === 'playing' ? (
        <>
          {/* Open Editorial Clue Header (No box) */}
          <div className="w-full border-b border-[#f4efe4]/15 pb-2.5 sm:pb-3.5 pt-1 shrink-0 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-[0.2em] text-[#b9bfff] font-medium">
                CLUE #{roundNumber}
              </span>

              <div className="flex items-center gap-3.5">
                <span
                  id="solo-live-score"
                  className={`font-serif-editorial italic text-base sm:text-lg transition-colors ${
                    shakeScore ? 'text-[#e03a28] font-semibold' : 'text-[#b9bfff]'
                  }`}
                >
                  {currentPotentialScore} pts
                </span>

                <button
                  id="solo-new-mystery-btn"
                  type="button"
                  disabled={isLoadingNewMystery}
                  onClick={onNewMystery}
                  className="text-[11px] uppercase tracking-[0.16em] text-[#f4efe4]/55 hover:text-[#b9bfff] transition-colors cursor-pointer"
                  title="Don't know this character? Swap for a new one"
                >
                  {isLoadingNewMystery ? '...' : '↻ Swap'}
                </button>

                <button
                  id="solo-surrender-btn"
                  type="button"
                  onClick={handleSurrender}
                  className="text-[11px] uppercase tracking-[0.16em] text-[#f4efe4]/45 hover:text-[#e03a28] transition-colors cursor-pointer"
                >
                  Give up
                </button>
              </div>
            </div>

            <p
              id="solo-opening-clue-text"
              className="font-serif-editorial italic text-xl sm:text-2xl lg:text-3xl text-[#f4efe4] leading-snug"
            >
              “{soloClueText}.”
            </p>

            {/* Progressive Subtle Clues (Franchise & Hint) to prevent unfamiliar character dead-ends */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5 text-xs">
              {revealedOriginClue && secretCharacter.origin ? (
                <span className="font-serif-editorial italic text-base text-[#b9bfff]">
                  Franchise: {secretCharacter.origin}
                </span>
              ) : (
                secretCharacter.origin && (
                  <button
                    id="unseal-origin-clue-btn"
                    type="button"
                    onClick={() => {
                      setRevealedOriginClue(true);
                      triggerPenaltyPulse();
                    }}
                    className="text-[11px] uppercase tracking-[0.15em] text-[#f4efe4]/50 hover:text-[#b9bfff] transition-colors cursor-pointer"
                  >
                    + Reveal franchise (-{ORIGIN_CLUE_PENALTY} pts)
                  </button>
                )
              )}

              {revealedHintClue && secretCharacter.hint ? (
                <span className="font-serif-editorial italic text-base text-[#f4efe4]/80">
                  Hint: “{secretCharacter.hint}”
                </span>
              ) : (
                secretCharacter.hint && (
                  <button
                    id="unseal-hint-clue-btn"
                    type="button"
                    onClick={() => {
                      setRevealedHintClue(true);
                      triggerPenaltyPulse();
                    }}
                    className="text-[11px] uppercase tracking-[0.15em] text-[#f4efe4]/50 hover:text-[#b9bfff] transition-colors cursor-pointer"
                  >
                    + Reveal hint (-{HINT_CLUE_PENALTY} pts)
                  </button>
                )
              )}
            </div>
          </div>

          {/* Open, Unboxed Scrollable Q&A Stream — Anchored to bottom so latest answers stay visible above keyboard */}
          <div
            ref={ledgerScrollRef}
            className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col py-2"
          >
            {ledger.length === 0 ? (
              <div className="my-auto text-center py-4 space-y-2 opacity-75">
                {!isCompactKeyboard && (
                  <img
                    src="/assets/illus-owl-scholar.png"
                    alt=""
                    className="w-20 sm:w-24 h-auto mx-auto object-contain opacity-85"
                  />
                )}
                <p className="font-serif-editorial italic text-lg sm:text-xl text-[#f4efe4]/70 max-w-sm mx-auto">
                  Ask Yes/No questions below, or venture a guess whenever you’re ready.
                </p>
              </div>
            ) : (
              <div className="mt-auto divide-y divide-[#f4efe4]/12">
                {ledger.map((entry) => (
                  <div
                    key={entry.id}
                    className="py-2.5 flex items-baseline justify-between gap-4 text-left"
                  >
                    {entry.type === 'question' ? (
                      <>
                        <span className="font-serif-editorial text-lg sm:text-xl text-[#f4efe4]/90 leading-snug">
                          {entry.text}
                        </span>
                        <span
                          className={`text-xs font-semibold uppercase tracking-[0.2em] shrink-0 ${
                            entry.verdict === 'YES'
                              ? 'text-[#b9bfff]'
                              : entry.verdict === 'PARTIAL'
                              ? 'text-[#b9bfff]/80'
                              : 'text-[#f4efe4]/50'
                          }`}
                        >
                          {entry.verdict}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-serif-editorial italic text-lg sm:text-xl text-[#f4efe4]/75 leading-snug">
                          Guessed {entry.text}
                          {entry.subnote && (
                            <span className="text-[#b9bfff] ml-2 text-sm">
                              ({entry.subnote})
                            </span>
                          )}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#e03a28] shrink-0">
                          ✕ -{WRONG_GUESS_PENALTY} pts
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Always-Visible Bottom Action Area: Both Ask & Guess Displayed */}
          <div className="w-full shrink-0 z-30 pb-safe pb-2 sm:pb-3 pt-1.5 relative">
            {/* Hidden Sample Questions Popover (Only shown when "Ideas" is toggled) */}
            {showSampleDropdown && availableSuggestedQuestions.length > 0 && (
              <div
                id="solo-sample-questions-dropdown"
                className="mb-2 p-3 bg-[#09120e] border border-[#f4efe4]/40 shadow-2xl max-h-44 overflow-y-auto no-scrollbar animate-in fade-in duration-150"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#f4efe4]/15">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#b9bfff]">
                    SAMPLE QUESTIONS (TAP TO ASK)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSampleDropdown(false)}
                    className="text-xs text-[#f4efe4]/60 hover:text-[#f4efe4] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {availableSuggestedQuestions.map((item) => (
                    <button
                      key={item.id}
                      id={`quick-ask-${item.id}`}
                      type="button"
                      onClick={() => handleAskQuestion(item.question, item.id)}
                      className="px-2.5 py-1 border border-[#f4efe4]/25 hover:border-[#b9bfff] text-xs font-serif-editorial italic text-[#f4efe4]/90 hover:text-[#b9bfff] transition-colors cursor-pointer"
                    >
                      {item.question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {/* Row 1: Ask a Yes/No Question + Ideas Dropdown Toggle */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskQuestion(questionInput);
                }}
                className="flex items-center border-b border-[#f4efe4]/35 focus-within:border-[#b9bfff] transition-colors py-1"
              >
                <input
                  id="solo-question-input"
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Ask a Yes/No question..."
                  className="flex-1 min-w-0 bg-transparent font-serif-editorial text-lg sm:text-xl text-[#f4efe4] placeholder-[#f4efe4]/40 focus:outline-none py-1.5"
                />

                <button
                  id="solo-toggle-ideas-btn"
                  type="button"
                  onClick={() => setShowSampleDropdown((prev) => !prev)}
                  className={`px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] transition-colors cursor-pointer shrink-0 ${
                    showSampleDropdown
                      ? 'text-[#b9bfff] font-semibold'
                      : 'text-[#f4efe4]/55 hover:text-[#b9bfff]'
                  }`}
                >
                  Ideas {showSampleDropdown ? '▴' : '▾'}
                </button>

                <button
                  id="solo-ask-submit-btn"
                  type="submit"
                  disabled={!questionInput.trim() || isAskingOracle}
                  className="ml-1.5 py-1.5 px-3.5 border border-[#f4efe4]/45 hover:border-[#b9bfff] text-[#f4efe4] hover:text-[#b9bfff] disabled:opacity-30 text-xs font-semibold uppercase tracking-[0.18em] transition-all cursor-pointer shrink-0"
                >
                  {isAskingOracle ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'ASK'}
                </button>
              </form>

              {/* Autocomplete strip when typing a character guess */}
              {matchingCharacterSuggestions.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                  {matchingCharacterSuggestions.map((sugName) => (
                    <button
                      key={sugName}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleGuessSubmit(sugName);
                      }}
                      className="px-2.5 py-0.5 border border-[#b9bfff]/45 bg-[#b9bfff]/10 hover:bg-[#b9bfff] text-[#f4efe4] hover:text-[#09120e] text-xs font-serif-editorial shrink-0 transition-colors cursor-pointer"
                    >
                      {sugName}
                    </button>
                  ))}
                </div>
              )}

              {/* Row 2: Always-Displayed Guess Character Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleGuessSubmit();
                }}
                className="flex items-stretch gap-2 pt-0.5"
              >
                <input
                  id="solo-guess-input"
                  type="text"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Guess character (-20 pts if wrong)..."
                  className="flex-1 min-w-0 min-h-[44px] px-3.5 py-2 bg-[#09120e]/80 border border-[#f4efe4]/45 focus:border-[#b9bfff] font-serif-editorial text-lg sm:text-xl text-[#f4efe4] placeholder-[#f4efe4]/40 focus:outline-none"
                />
                <button
                  id="solo-guess-submit-btn"
                  type="submit"
                  disabled={!guessInput.trim()}
                  className="min-h-[44px] px-5 border border-[#f4efe4] bg-[#f4efe4] hover:bg-[#b9bfff] hover:border-[#b9bfff] disabled:opacity-35 text-[#09120e] text-xs font-semibold uppercase tracking-[0.18em] transition-all cursor-pointer shrink-0"
                >
                  GUESS →
                </button>
              </form>
            </div>
          </div>
        </>
      ) : (
        /* Clean Editorial Post-Round Resolution */
        <div
          id="solo-resolution-panel"
          className="my-auto py-4 flex-1 flex flex-col items-center justify-center text-center space-y-5 max-w-xl mx-auto w-full"
        >
          <img
            src={
              roundStatus === 'solved'
                ? '/assets/illus-snail-cat.png'
                : '/assets/illus-masked-fox.png'
            }
            alt=""
            className="w-28 sm:w-36 h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]"
          />

          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#b9bfff]">
              <ShepherdStar size={14} className="text-[#b9bfff]" />
              <span>
                {roundStatus === 'solved' ? `+${finalRoundScore} PTS EARNED` : 'IDENTITY REVEALED'}
              </span>
            </span>

            <h1 className="text-5xl xs:text-6xl sm:text-7xl font-jacquard text-[#f4efe4] leading-[0.94]">
              {secretCharacter.name}
            </h1>

            {secretCharacter.origin && (
              <p className="font-serif-editorial italic text-2xl text-[#b9bfff]">
                {secretCharacter.origin}
              </p>
            )}
          </div>

          <p className="font-serif-editorial italic text-lg sm:text-xl text-[#f4efe4]/75 max-w-md">
            {roundStatus === 'solved'
              ? `Solved in ${totalGuessesTaken} ${totalGuessesTaken === 1 ? 'guess' : 'guesses'} and ${questionsCount} ${questionsCount === 1 ? 'question' : 'questions'}.`
              : `“${secretCharacter.traitVerification || secretCharacter.hint || soloClueText}”`}
          </p>

          <div className="flex items-center justify-center gap-8 border-t border-b border-[#f4efe4]/20 py-3 w-full max-w-sm text-center">
            <div>
              <span className="text-3xl font-jacquard text-[#f4efe4] block">
                {careerStats.totalScore}
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#b9bfff]">
                TOTAL PTS
              </span>
            </div>
            <div className="h-6 w-px bg-[#f4efe4]/15" />
            <div>
              <span className="text-3xl font-jacquard text-[#f4efe4] block">
                {careerStats.currentStreak}
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#b9bfff]">
                STREAK
              </span>
            </div>
          </div>

          <div className="w-full max-w-sm pt-2">
            <button
              id="solo-play-next-btn"
              type="button"
              onClick={onNewMystery}
              className="w-full min-h-[52px] py-4 px-6 border border-[#f4efe4] bg-[#f4efe4] hover:bg-[#b9bfff] hover:border-[#b9bfff] text-[#09120e] font-semibold text-xs sm:text-[13px] uppercase tracking-[0.2em] transition-all cursor-pointer text-center"
            >
              NEXT MYSTERY →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
