export interface Course {
  title: string;
  id: string;
  startTime: string;
  endTime: string;
  weekdays: boolean[]; // sunday, monday...
}

export interface TodoProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};
