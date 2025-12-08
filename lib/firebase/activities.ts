import { Course, Task } from "@/types/types";
import { getCourses } from "./courses";
import { getTasks } from "./tasks";
import { getPomodoroSessions, PomodoroSession } from "./pomodoro";

export type UserActivity = {
  id: string;
  type: "course" | "task" | "pomodoro";
  title: string;
  description?: string;
  date: Date;
  data: Course | Task | PomodoroSession;
};

/**
 * Get all user activities (courses, tasks, pomodoro sessions) combined
 * Useful for activity feeds, timelines, and activity history pages
 */
export const getUserActivities = async (userId: string): Promise<UserActivity[]> => {
  try {
    const [courses, tasks, pomodoroSessions] = await Promise.all([
      getCourses(userId),
      getTasks(userId),
      getPomodoroSessions(userId),
    ]);

    const activities: UserActivity[] = [];

    // Add courses as activities
    courses.forEach((course) => {
      activities.push({
        id: `course-${course.id}`,
        type: "course",
        title: course.title,
        description: course.description,
        date: new Date(), // Courses don't have a specific date in current schema
        data: course,
      });
    });

    // Add tasks as activities
    tasks.forEach((task) => {
      activities.push({
        id: `task-${task.id}`,
        type: "task",
        title: task.title,
        description: task.notes,
        date: task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate),
        data: task,
      });
    });

    // Add pomodoro sessions as activities
    pomodoroSessions.forEach((session) => {
      activities.push({
        id: `pomodoro-${session.id}`,
        type: "pomodoro",
        title: `${session.mode === "work" ? "Work" : "Break"} Session (${Math.round(session.duration / 60)}min)`,
        description: session.completed ? "Completed" : "Incomplete",
        date: session.timestamp instanceof Date ? session.timestamp : new Date(session.timestamp),
        data: session,
      });
    });

    // Sort by date (most recent first)
    activities.sort((a, b) => b.date.getTime() - a.date.getTime());

    return activities;
  } catch (error) {
    console.error("Error getting user activities:", error);
    throw error;
  }
};

/**
 * Get activities for a specific date
 */
export const getActivitiesForDate = async (userId: string, date: Date): Promise<UserActivity[]> => {
  const activities = await getUserActivities(userId);
  return activities.filter((activity) => {
    const activityDate = new Date(activity.date);
    return (
      activityDate.getFullYear() === date.getFullYear() &&
      activityDate.getMonth() === date.getMonth() &&
      activityDate.getDate() === date.getDate()
    );
  });
};

/**
 * Get activities for a date range
 */
export const getActivitiesInRange = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<UserActivity[]> => {
  const activities = await getUserActivities(userId);
  return activities.filter((activity) => {
    const activityDate = new Date(activity.date);
    return activityDate >= startDate && activityDate <= endDate;
  });
};

/**
 * Get only tasks that are incomplete
 */
export const getIncompleteTasks = async (userId: string): Promise<Task[]> => {
  const tasks = await getTasks(userId);
  return tasks.filter((task) => !task.completed);
};

/**
 * Get only completed tasks
 */
export const getCompletedTasks = async (userId: string): Promise<Task[]> => {
  const tasks = await getTasks(userId);
  return tasks.filter((task) => task.completed);
};

/**
 * Get tasks sorted by importance
 */
export const getTasksByImportance = async (userId: string): Promise<Task[]> => {
  const tasks = await getTasks(userId);
  const importanceOrder = { Hard: 0, Medium: 1, Easy: 2 };
  return tasks.sort((a, b) => {
    return importanceOrder[a.importance as keyof typeof importanceOrder] -
           importanceOrder[b.importance as keyof typeof importanceOrder];
  });
};

/**
 * Get tasks due today
 */
export const getTasksDueToday = async (userId: string): Promise<Task[]> => {
  const tasks = await getTasks(userId);
  const today = new Date();
  return tasks.filter((task) => {
    const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
    return (
      taskDate.getFullYear() === today.getFullYear() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getDate() === today.getDate()
    );
  });
};

/**
 * Get overdue tasks (due date has passed and not completed)
 */
export const getOverdueTasks = async (userId: string): Promise<Task[]> => {
  const tasks = await getTasks(userId);
  const now = new Date();
  return tasks.filter((task) => {
    if (task.completed) return false;
    const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
    return taskDate < now;
  });
};

/**
 * Get tasks due in the next N days
 */
export const getTasksDueInDays = async (userId: string, days: number): Promise<Task[]> => {
  const tasks = await getTasks(userId);
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return tasks.filter((task) => {
    const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
    return taskDate >= now && taskDate <= futureDate;
  });
};

/**
 * Get summary stats for dashboard
 */
export const getUserStats = async (userId: string) => {
  try {
    const [courses, tasks, pomodoroSessions] = await Promise.all([
      getCourses(userId),
      getTasks(userId),
      getPomodoroSessions(userId),
    ]);

    const completedTasks = tasks.filter((t) => t.completed).length;
    const totalTasks = tasks.length;
    const completedPomodoros = pomodoroSessions.filter((s) => s.completed && s.mode === "work").length;
    const overdueTasks = await getOverdueTasks(userId);
    const tasksDueToday = await getTasksDueToday(userId);

    return {
      totalCourses: courses.length,
      totalTasks,
      completedTasks,
      taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      completedPomodoros,
      overdueTasks: overdueTasks.length,
      tasksDueToday: tasksDueToday.length,
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    throw error;
  }
};
