import { getFunctions, httpsCallable } from "firebase/functions";

export type PomodoroSession = {
  id: string;
  userId: string;
  mode: "work" | "shortBreak" | "longBreak";
  duration: number; // in seconds
  completed: boolean;
  timestamp: Date;
};

// Initialize Firebase Functions
const functions = getFunctions();

// Record a pomodoro session
export const recordPomodoroSession = async (
  userId: string,
  mode: "work" | "shortBreak" | "longBreak",
  duration: number,
  completed: boolean
): Promise<string> => {
  try {
    const recordSessionFunction = httpsCallable(functions, "recordPomodoroSession");
    const result = await recordSessionFunction({ mode, duration, completed });
    
    if (result.data && (result.data as any).success) {
      return (result.data as any).id;
    }
    throw new Error("Failed to record pomodoro session");
  } catch (error) {
    console.error("Error recording pomodoro session:", error);
    throw error;
  }
};

// Get all pomodoro sessions for a user
export const getPomodoroSessions = async (userId: string): Promise<PomodoroSession[]> => {
  try {
    const getSessionsFunction = httpsCallable(functions, "getPomodoroSessions");
    const result = await getSessionsFunction();
    
    if (result.data && (result.data as any).success) {
      const sessions = (result.data as any).data.map((session: any) => ({
        id: session.id,
        userId: session.userId,
        mode: session.mode,
        duration: session.duration,
        completed: session.completed,
        timestamp: session.timestamp instanceof Date ? session.timestamp : new Date(session.timestamp),
      }));
      return sessions;
    }
    throw new Error("Failed to get pomodoro sessions");
  } catch (error) {
    console.error("Error getting pomodoro sessions:", error);
    throw error;
  }
};

// Get completed work sessions count for a user
export const getCompletedPomodoros = async (userId: string): Promise<number> => {
  try {
    const getCompletedFunction = httpsCallable(functions, "getCompletedPomodoros");
    const result = await getCompletedFunction();
    
    if (result.data && (result.data as any).success) {
      return (result.data as any).count;
    }
    throw new Error("Failed to get completed pomodoros");
  } catch (error) {
    console.error("Error getting completed pomodoros:", error);
    throw error;
  }
};

