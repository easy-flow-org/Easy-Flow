export interface Course {
  id: string;
  title: string;
  description?: string
  days: string;
  startTime: string;
  endTime: string;
}

export interface TodoProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};
