import { db, predictionsCollection } from './firebase';
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { Prediction, PredictionInput } from '../types/prediction';

export async function savePrediction(input: PredictionInput): Promise<string> {
  try {
    const docRef = await addDoc(predictionsCollection, {
      ...input,
      createdAt: Timestamp.now(),
    });
    console.log('Prediction saved successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving prediction:', error);
    throw new Error('Failed to save prediction');
  }
}

export async function getUserPredictions(userId: string): Promise<Prediction[]> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    console.log('Fetching predictions for user:', userId);
    const predictionsQuery = query(
      predictionsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    console.log('Executing predictions query...');
    try {
      const snapshot = await getDocs(predictionsQuery);
      console.log('Found predictions:', snapshot.size);
      
      const predictions = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Processing prediction:', doc.id, data);
        return {
          id: doc.id,
          userId: data.userId,
          prompt: data.prompt,
          prediction: data.prediction,
          isPremium: data.isPremium,
          createdAt: data.createdAt.toDate(),
        };
      });
      
      console.log('Processed predictions:', predictions.length);
      return predictions;
    } catch (error: any) {
      if (error.code === 'failed-precondition') {
        console.log('Index is still being built, falling back to basic query...');
        // Fallback to a simpler query while index is building
        const simpleQuery = query(
          predictionsCollection,
          where('userId', '==', userId)
        );
        const snapshot = await getDocs(simpleQuery);
        const predictions = snapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              userId: data.userId,
              prompt: data.prompt,
              prediction: data.prediction,
              isPremium: data.isPremium,
              createdAt: data.createdAt.toDate(),
            };
          })
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        return predictions;
      }
      throw error;
    }
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw new Error('Failed to fetch predictions');
  }
} 