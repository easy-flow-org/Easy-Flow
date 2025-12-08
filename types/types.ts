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
  // dueTime stores the time portion as HH:MM (24-hour) for easier display and editing
  dueTime?: string;
  importance: "Easy" | "Medium" | "Hard";
  completed: boolean;
};
