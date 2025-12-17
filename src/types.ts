export type TaskStatus = 'doing' | 'next' | 'waiting' | 'blocked' | 'ideas' | 'done';

export type Priority = 'high' | 'normal' | 'quick';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  tags: string[];
  deadline?: string;
  duration?: string;
  priority: Priority;
  status: TaskStatus;
  waitingFor?: string;
  blockedBy?: string;
  completedDate?: string;
  rawLine: string;
}

export interface Section {
  id: TaskStatus;
  title: string;
  emoji: string;
  tasks: Task[];
}

export interface TodoData {
  focusToday: string;
  sections: Section[];
  rawContent: string;
}

export type ViewMode = 'list' | 'add' | 'edit' | 'move' | 'focus' | 'help';

export interface AppState {
  data: TodoData | null;
  selectedSection: number;
  selectedTask: number;
  viewMode: ViewMode;
  message: string;
  filePath: string;
}
