export interface Criterion {
  id: string;
  title: string;
  prompt: string;
}

export interface Evaluation {
  criterionId: string;
  score: number; // 0-10
  feedback: string;
}

export interface SavedState {
  text: string;
  criteria: Criterion[];
  evaluations: Evaluation[];
  updatedAt: string; // ISO
}

export interface EvaluationResult {
  [criterionId: string]: {
    score: number;
    feedback: string;
  };
} 