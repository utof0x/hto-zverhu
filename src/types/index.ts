export type GamePhase =
  | "home"
  | "round-start"
  | "challenge"
  | "bonus"
  | "round-end";

export type Team = "men" | "women";

export type ChallengeType =
  | "five-words"
  | "who-am-i"
  | "role-swap"
  | "word-assembly"
  | "truth-lie"
  | "guess-song"
  | "final";

export interface Challenge {
  id: ChallengeType;
  name: string;
  description: string;
}

export interface GameState {
  phase: GamePhase;
  currentRound: number;
  totalRounds: number;
  scores: { men: number; women: number };
  roundScores: { men: number; women: number }; // points added this scoring session
  currentChallenge: ChallengeType;
  bonusTeam: Team | null;
  bonusAnswer: number; // percentage 0-100
  bonusAnswerTolerance: number; // ± percentage
  bonusQuestion: string;
}
