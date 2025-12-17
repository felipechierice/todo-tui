import { Task, Section, TodoData, TaskStatus, Priority } from '../types.js';

const SECTION_MAP: Record<string, { id: TaskStatus; emoji: string }> = {
  'FAZENDO': { id: 'doing', emoji: '🔥' },
  'PRÓXIMAS': { id: 'next', emoji: '📌' },
  'ESPERANDO': { id: 'waiting', emoji: '⏳' },
  'BLOQUEADAS': { id: 'blocked', emoji: '🚧' },
  'IDEIAS': { id: 'ideas', emoji: '💡' },
  'CONCLUÍDAS': { id: 'done', emoji: '✅' },
};

let taskIdCounter = 0;

function generateTaskId(): string {
  return `task-${++taskIdCounter}`;
}

function extractTags(text: string): string[] {
  const tagRegex = /`#([^`]+)`/g;
  const tags: string[] = [];
  let match;
  while ((match = tagRegex.exec(text)) !== null) {
    tags.push(match[1]);
  }
  return tags;
}

function extractDeadline(text: string): string | undefined {
  const match = text.match(/`📅\s*([^`]+)`/);
  return match ? match[1].trim() : undefined;
}

function extractDuration(text: string): string | undefined {
  const match = text.match(/`~([^`]+)`/);
  return match ? match[1].trim() : undefined;
}

function extractWaitingFor(text: string): string | undefined {
  const match = text.match(/→\s*_([^_]+)_/);
  return match ? match[1].trim() : undefined;
}

function extractCompletedDate(text: string): string | undefined {
  const match = text.match(/✓\s*(\d{1,2}\/\d{1,2})/);
  return match ? match[1] : undefined;
}

function determinePriority(text: string, subsection: string): Priority {
  if (text.includes('⚡') || subsection.toLowerCase().includes('alta prioridade')) {
    return 'high';
  }
  if (subsection.toLowerCase().includes('rápidas') || text.includes('🚀')) {
    return 'quick';
  }
  return 'normal';
}

function cleanTaskText(text: string): string {
  return text
    .replace(/^-\s*\[[ x]\]\s*/, '')
    .replace(/^-\s*/, '')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/`#[^`]+`/g, '')
    .replace(/`📅[^`]+`/g, '')
    .replace(/`~[^`]+`/g, '')
    .replace(/→\s*_[^_]+_/g, '')
    .replace(/✓\s*\d{1,2}\/\d{1,2}/g, '')
    .replace(/⚡/g, '')
    .replace(/🚀/g, '')
    .trim();
}

function parseTask(line: string, status: TaskStatus, subsection: string): Task | null {
  const trimmed = line.trim();
  
  if (!trimmed.startsWith('-')) {
    return null;
  }

  const isCheckbox = /^-\s*\[[ x]\]/.test(trimmed);
  const isCompleted = /^-\s*\[x\]/i.test(trimmed);

  return {
    id: generateTaskId(),
    text: cleanTaskText(trimmed),
    completed: isCompleted,
    tags: extractTags(trimmed),
    deadline: extractDeadline(trimmed),
    duration: extractDuration(trimmed),
    priority: determinePriority(trimmed, subsection),
    status,
    waitingFor: extractWaitingFor(trimmed),
    blockedBy: status === 'blocked' ? extractWaitingFor(trimmed) : undefined,
    completedDate: extractCompletedDate(trimmed),
    rawLine: line,
  };
}

export function parseMarkdown(content: string): TodoData {
  taskIdCounter = 0;
  const lines = content.split('\n');
  const sections: Section[] = [];
  
  let currentSection: Section | null = null;
  let currentSubsection = '';
  let focusToday = '';

  for (const line of lines) {
    // Extract focus of the day
    if (line.includes('**Foco de hoje:**')) {
      const match = line.match(/_\[?([^\]_]*)\]?_/);
      focusToday = match ? match[1] : '';
      continue;
    }

    // Detect main sections (## headers)
    if (line.startsWith('## ')) {
      for (const [key, value] of Object.entries(SECTION_MAP)) {
        if (line.toUpperCase().includes(key)) {
          currentSection = {
            id: value.id,
            title: line.replace(/^##\s*/, '').trim(),
            emoji: value.emoji,
            tasks: [],
          };
          sections.push(currentSection);
          currentSubsection = '';
          break;
        }
      }
      continue;
    }

    // Detect subsections (### headers)
    if (line.startsWith('### ')) {
      currentSubsection = line.replace(/^###\s*/, '').trim();
      continue;
    }

    // Parse task lines (but not horizontal rules like ---)
    const trimmedLine = line.trim();
    if (currentSection && trimmedLine.startsWith('-') && !trimmedLine.match(/^-+$/)) {
      const task = parseTask(line, currentSection.id, currentSubsection);
      if (task && task.text) {
        currentSection.tasks.push(task);
      }
    }
  }

  return {
    focusToday,
    sections,
    rawContent: content,
  };
}

export function findSectionByStatus(data: TodoData, status: TaskStatus): Section | undefined {
  return data.sections.find(s => s.id === status);
}
