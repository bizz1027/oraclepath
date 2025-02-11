import { db } from './firebase';
import { collection, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { DailyUsage } from '../types/usage';

const DAILY_LIMIT = 5;
const USAGE_COLLECTION = 'daily_usage';

export async function checkDailyLimit(userId: string): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const usageRef = doc(db, USAGE_COLLECTION, `${userId}_${today}`);
  
  try {
    const usageDoc = await getDoc(usageRef);
    const usage = usageDoc.data() as DailyUsage | undefined;

    // If no usage today or usage is from a different day, user can proceed
    if (!usage || usage.date !== today) {
      return true;
    }

    // Check if user has reached the daily limit
    return usage.count < DAILY_LIMIT;
  } catch (error) {
    console.error('Error checking daily limit:', error);
    return false;
  }
}

export async function incrementDailyUsage(userId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const usageRef = doc(db, USAGE_COLLECTION, `${userId}_${today}`);
  
  try {
    const usageDoc = await getDoc(usageRef);
    const currentUsage = usageDoc.data() as DailyUsage | undefined;

    if (!currentUsage || currentUsage.date !== today) {
      // Create new usage record for today
      await setDoc(usageRef, {
        userId,
        date: today,
        count: 1,
        lastUpdated: Timestamp.now(),
      });
    } else {
      // Increment existing usage
      await setDoc(usageRef, {
        ...currentUsage,
        count: currentUsage.count + 1,
        lastUpdated: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error incrementing daily usage:', error);
    throw new Error('Failed to update usage count');
  }
}

export async function getRemainingPredictions(userId: string): Promise<number> {
  const today = new Date().toISOString().split('T')[0];
  const usageRef = doc(db, USAGE_COLLECTION, `${userId}_${today}`);
  
  try {
    const usageDoc = await getDoc(usageRef);
    const usage = usageDoc.data() as DailyUsage | undefined;

    if (!usage || usage.date !== today) {
      return DAILY_LIMIT;
    }

    return Math.max(0, DAILY_LIMIT - usage.count);
  } catch (error) {
    console.error('Error getting remaining predictions:', error);
    return DAILY_LIMIT;
  }
} 