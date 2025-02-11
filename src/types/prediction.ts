export interface Prediction {
  id: string;
  userId: string;
  prompt: string;
  prediction: string;
  isPremium: boolean;
  createdAt: Date;
}

export type PredictionInput = Omit<Prediction, 'id' | 'createdAt'>; 