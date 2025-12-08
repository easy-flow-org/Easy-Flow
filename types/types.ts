export interface Course {
  id: string;
  title: string;
  description?: string
  days: string;
  startTime: string;
  endTime: string;
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
};
