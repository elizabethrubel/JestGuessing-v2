export interface Character {
  name: string;
  wikiSlug: string;
  hint: string;
  imageUrl?: string;
  origin?: string;
  assignedPlayerId?: string;
  traitVerification?: string;
}

export interface CandidateCommonality {
  id: number;
  trait: string;
  formattedName: string;
}

export interface ThemePack {
  id: string;
  name: string;
  characters: Character[];
  commonalityId?: number;
}

export interface Player {
  id: string;
  name: string;
  avatarColor: string;
  score: number;
  assignedCharacter?: Character;
  hasGuessedCorrectly?: boolean;
}

export type GameStage = 
  | 'landing'
  | 'setup'
  | 'commonality_selection'
  | 'theme_reveal'
  | 'privacy_interstitial'
  | 'active_turn'
  | 'last_turn_interstitial'
  | 'scoreboard'
  | 'solo_game';


export interface GameState {
  players: Player[];
  activeTheme: ThemePack | null;
  roundNumber: number;
  activePlayerIndex: number;
  stage: GameStage;
  // Last Turn mechanics (first to guess triggers last turn for everyone else)
  isLastTurnRound: boolean;
  lastTurnTriggerPlayerId: string | null;
  lastTurnRemainingPlayerIds: string[];
  turnNumber: number;
}
