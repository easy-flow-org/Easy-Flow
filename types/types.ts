export interface Course {
  title: string;
  description: string
  date: string;
  time: string;
  id: number;
}

export interface TodoProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};
