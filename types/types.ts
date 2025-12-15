// Add these types to your existing types
export interface Course {
  id: string;
  title: string;
  description?: string;
  days: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface TaskBase {
  id: string;
  title: string;
  notes: string;
  dueDate: Date;
  importance: "Easy" | "Medium" | "Hard";
  completed: boolean;
}

export interface Task extends TaskBase {
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface ParsedCourseData {
  title: string;
  days: string;
  startTime: string;
  endTime: string;
  description?: string;
  notes?: string;
  instructor?: string;
  location?: string;
  semester?: string;
}

export interface ParsedTaskData {
  title: string;
  description?: string;
  dueDate: Date;
  importance: "Easy" | "Medium" | "Hard";
  type: "assignment" | "exam" | "quiz" | "project";
  courseId?: string;
  weight?: number;
}