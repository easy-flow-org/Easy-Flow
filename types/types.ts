export interface Course {
  title: string;
  id: string;
  startTime: number;
  weekdays: string[];
}

export interface TodoProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};
