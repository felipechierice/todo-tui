import * as fs from 'fs';
import { Task, TaskStatus } from '../types.js';

// ============================================================================
// Constants
// ============================================================================

const SECTION_KEYWORDS: Record<TaskStatus, string> = {
  doing: 'DOING',
  next: 'NEXT',
  waiting: 'WAITING',
  blocked: 'BLOCKED',
  ideas: 'IDEAS',
  done: 'DONE',
};

const SECTION_ORDER: TaskStatus[] = ['doing', 'next', 'waiting', 'blocked', 'ideas', 'done'];

const KEYWORD_TO_STATUS: Record<string, TaskStatus> = {
  'DOING': 'doing',
  'NEXT': 'next',
  'WAITING': 'waiting',
  'BLOCKED': 'blocked',
  'IDEAS': 'ideas',
  'DONE': 'done',
};

// ============================================================================
// Helper Functions
// ============================================================================

/** Check if a line is a task (starts with - followed by content) */
function isTaskLine(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith('- ');
}

/** Check if a line is a section header */
function isSectionHeader(line: string): boolean {
  return line.startsWith('## ');
}

/** Find task line index by comparing content */
function findTaskLineIndex(lines: string[], task: Task): number {
  return lines.findIndex(line =>
    line === task.rawLine ||
    line.trimEnd() === task.rawLine.trimEnd() ||
    line.trim() === task.rawLine.trim()
  );
}

/** Find section header index by keyword */
function findSectionStart(lines: string[], status: TaskStatus): number {
  const keyword = SECTION_KEYWORDS[status];
  return lines.findIndex(line =>
    isSectionHeader(line) && line.toUpperCase().includes(keyword)
  );
}

/** Find section end (next ## header or end of file) */
function findSectionEnd(lines: string[], sectionStart: number): number {
  for (let i = sectionStart + 1; i < lines.length; i++) {
    if (isSectionHeader(lines[i])) {
      return i;
    }
  }
  return lines.length;
}

/** Find all task line indices within a section */
function findTasksInSection(lines: string[], sectionStart: number, sectionEnd: number): number[] {
  const tasks: number[] = [];
  for (let i = sectionStart + 1; i < sectionEnd; i++) {
    if (isTaskLine(lines[i])) {
      tasks.push(i);
    }
  }
  return tasks;
}

/** Detect which section a line belongs to */
function detectSection(lines: string[], lineIndex: number): { status: TaskStatus; start: number } | null {
  for (let i = lineIndex; i >= 0; i--) {
    if (isSectionHeader(lines[i])) {
      const lineUpper = lines[i].toUpperCase();
      for (const [keyword, status] of Object.entries(KEYWORD_TO_STATUS)) {
        if (lineUpper.includes(keyword)) {
          return { status, start: i };
        }
      }
    }
  }
  return null;
}

/** Get current date as DD/MM */
function getCurrentDate(): string {
  const now = new Date();
  return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}`;
}

/** Format a task object into a markdown line */
function formatTask(task: Task): string {
  const parts: string[] = [];

  // Checkbox
  parts.push(task.completed ? '- [x]' : '- [ ]');

  // Text (strikethrough if done)
  parts.push(task.completed && task.status === 'done' ? `~~${task.text}~~` : task.text);

  // Waiting/blocked info
  if (task.waitingFor && (task.status === 'waiting' || task.status === 'blocked')) {
    parts.push(`→ _${task.waitingFor}_`);
  }

  // Tags
  task.tags.forEach(tag => parts.push(`\`#${tag}\``));

  // Deadline
  if (task.deadline) parts.push(`\`📅 ${task.deadline}\``);

  // Duration
  if (task.duration) parts.push(`\`~${task.duration}\``);

  // Priority marker
  if (task.status !== 'done') {
    if (task.priority === 'high') parts.push('⚡');
    if (task.priority === 'quick') parts.push('🚀');
  }

  // Completed date
  if (task.completedDate && task.status === 'done') parts.push(`✓ ${task.completedDate}`);

  return parts.join(' ');
}

// ============================================================================
// File Operations
// ============================================================================

/** Insert a task into a section at start or end */
function insertTaskInSection(
  lines: string[],
  taskLine: string,
  status: TaskStatus,
  position: 'start' | 'end'
): void {
  const sectionStart = findSectionStart(lines, status);

  if (sectionStart === -1) {
    lines.push(taskLine);
    return;
  }

  const sectionEnd = findSectionEnd(lines, sectionStart);
  const tasks = findTasksInSection(lines, sectionStart, sectionEnd);

  let insertIndex: number;

  if (tasks.length === 0) {
    // Empty section: insert after header + 1 empty line
    insertIndex = sectionStart + 1;
    // Skip empty lines after header
    while (insertIndex < sectionEnd && lines[insertIndex].trim() === '') {
      insertIndex++;
    }
    // If we reached another section, insert before it
    if (insertIndex >= sectionEnd) {
      insertIndex = sectionEnd;
    }
  } else if (position === 'start') {
    insertIndex = tasks[0];
  } else {
    insertIndex = tasks[tasks.length - 1] + 1;
  }

  lines.splice(insertIndex, 0, taskLine);
}

// ============================================================================
// Public API
// ============================================================================

export function createNewTask(
  text: string,
  status: TaskStatus,
  tags: string[] = [],
  deadline?: string,
  duration?: string,
  priority: 'high' | 'normal' | 'quick' = 'normal'
): Task {
  return {
    id: `task-${Date.now()}`,
    text,
    completed: false,
    tags,
    deadline,
    duration,
    priority,
    status,
    rawLine: '',
  };
}

export function addTaskToFile(filePath: string, task: Task): void {
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  insertTaskInSection(lines, formatTask(task), task.status, 'end');
  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
}

export function removeTaskFromFile(filePath: string, task: Task): void {
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  const index = findTaskLineIndex(lines, task);

  if (index !== -1) {
    lines.splice(index, 1);
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  }
}

export function updateTaskInFile(filePath: string, oldTask: Task, newTask: Task): void {
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  const index = findTaskLineIndex(lines, oldTask);

  if (index !== -1) {
    lines[index] = formatTask(newTask);
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  }
}

export function updateFocusToday(filePath: string, newFocus: string): void {
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('**Today\'s focus:**')) {
      // Replace the focus line with new content
      lines[i] = `> **Today's focus:** _${newFocus || '[write 1-3 main things for the day]'}_`;
      fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
      return;
    }
  }
}

export function moveTaskInFile(filePath: string, task: Task, newStatus: TaskStatus): void {
  removeTaskFromFile(filePath, task);

  // Auto-complete when moving to DONE, auto-uncomplete when leaving
  const isMovingToDone = newStatus === 'done';
  
  const updatedTask: Task = {
    ...task,
    status: newStatus,
    completed: isMovingToDone,
    completedDate: isMovingToDone ? getCurrentDate() : undefined,
    rawLine: '',
  };

  addTaskToFile(filePath, updatedTask);
}

export function toggleTaskInFile(filePath: string, task: Task): void {
  if (!task.completed) {
    moveTaskInFile(filePath, task, 'done');
  } else {
    // Reopen: move back to NEXT
    removeTaskFromFile(filePath, task);
    const updatedTask: Task = {
      ...task,
      status: 'next',
      completed: false,
      completedDate: undefined,
      rawLine: '',
    };
    addTaskToFile(filePath, updatedTask);
  }
}

// ============================================================================
// Reorder
// ============================================================================

export type ReorderResult =
  | { moved: false }
  | { moved: true; type: 'reorder' }
  | { moved: true; type: 'section_change'; newStatus: TaskStatus };

/** 
 * Transform task line when moving to/from DONE
 * - Moving TO done: mark as completed, add date
 * - Moving FROM done: unmark, remove strikethrough and date
 */
function transformTaskForSection(taskLine: string, fromStatus: TaskStatus, toStatus: TaskStatus): string {
  let line = taskLine;
  
  if (toStatus === 'done' && fromStatus !== 'done') {
    // Moving TO DONE: mark as completed
    line = line.replace('- [ ]', '- [x]');
    // Add strikethrough to text (after checkbox, before tags)
    const match = line.match(/^(- \[x\] )(.+?)(\s*`|$)/);
    if (match && !match[2].startsWith('~~')) {
      line = line.replace(match[2], `~~${match[2].trim()}~~`);
    }
    // Add completion date if not present
    if (!line.includes('✓')) {
      line = line.trimEnd() + ` ✓ ${getCurrentDate()}`;
    }
  } else if (fromStatus === 'done' && toStatus !== 'done') {
    // Moving FROM DONE: unmark
    line = line.replace('- [x]', '- [ ]');
    // Remove strikethrough
    line = line.replace(/~~(.+?)~~/g, '$1');
    // Remove completion date
    line = line.replace(/\s*✓\s*\d{1,2}\/\d{1,2}/, '');
  }
  
  return line;
}

export function reorderTaskInFile(
  filePath: string,
  task: Task,
  direction: 'up' | 'down'
): ReorderResult {
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  const taskIndex = findTaskLineIndex(lines, task);

  if (taskIndex === -1) return { moved: false };

  const section = detectSection(lines, taskIndex);
  if (!section) return { moved: false };

  const sectionEnd = findSectionEnd(lines, section.start);
  const tasksInSection = findTasksInSection(lines, section.start, sectionEnd);
  const positionInSection = tasksInSection.indexOf(taskIndex);

  if (positionInSection === -1) return { moved: false };

  const currentSectionIndex = SECTION_ORDER.indexOf(section.status);

  // Moving UP from first position → go to previous section (end)
  if (direction === 'up' && positionInSection === 0) {
    if (currentSectionIndex > 0) {
      const newStatus = SECTION_ORDER[currentSectionIndex - 1];
      const taskContent = transformTaskForSection(lines[taskIndex], section.status, newStatus);
      lines.splice(taskIndex, 1);
      insertTaskInSection(lines, taskContent, newStatus, 'end');
      fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
      return { moved: true, type: 'section_change', newStatus };
    }
    return { moved: false };
  }

  // Moving DOWN from last position → go to next section (start)
  if (direction === 'down' && positionInSection === tasksInSection.length - 1) {
    if (currentSectionIndex < SECTION_ORDER.length - 1) {
      const newStatus = SECTION_ORDER[currentSectionIndex + 1];
      const taskContent = transformTaskForSection(lines[taskIndex], section.status, newStatus);
      lines.splice(taskIndex, 1);
      insertTaskInSection(lines, taskContent, newStatus, 'start');
      fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
      return { moved: true, type: 'section_change', newStatus };
    }
    return { moved: false };
  }

  // Normal swap within section
  const targetPosition = direction === 'up' ? positionInSection - 1 : positionInSection + 1;
  const targetIndex = tasksInSection[targetPosition];

  // Swap
  [lines[taskIndex], lines[targetIndex]] = [lines[targetIndex], lines[taskIndex]];

  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  return { moved: true, type: 'reorder' };
}
