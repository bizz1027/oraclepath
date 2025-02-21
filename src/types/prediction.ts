export interface Prediction {
  id: string;
  userId: string;
  prompt: string;
  prediction: string;
  isPremium: boolean;
  createdAt: Date;
}

export interface PredictionInput {
  userId: string;
  prompt: string;
  prediction: string;
  isPremium: boolean;
  language?: string;
  readingType?: 'mystic' | 'tarot';
}

export interface Prediction extends PredictionInput {
  id: string;
  createdAt: Date;
} 