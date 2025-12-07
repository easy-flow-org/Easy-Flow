export interface Course {
  id: string;
  title: string;
  description?: string
  days: string;
  startTime: string;
  endTime: string;
}

export interface Task {
  id: string;
  title: string;
  notes: string;
  dueDate: Date;
  importance: "Easy" | "Medium" | "Hard";
  completed: boolean;
};
