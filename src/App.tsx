import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Text, useInput, useApp, useStdout } from 'ink';
import * as fs from 'fs';
import { watch } from 'chokidar';
import { parseMarkdown } from './utils/parser.js';
import {
  toggleTaskInFile,
  addTaskToFile,
  removeTaskFromFile,
  moveTaskInFile,
  updateTaskInFile,
  updateFocusToday,
  createNewTask,
  reorderTaskInFile,
  type ReorderResult,
} from './utils/writer.js';
import { TodoData, ViewMode, Task, TaskStatus, Section } from './types.js';
import {
  Header,
  SectionView,
  StatusBar,
  HelpView,
  AddTaskView,
  EditTaskView,
  EditFocusView,
  MoveTaskView,
} from './components/index.js';

interface AppProps {
  filePath: string;
}

// Calculate visible window for scrolling
function calculateScrollWindow(
  totalItems: number,
  selectedIndex: number,
  maxVisible: number
): { start: number; end: number } {
  if (totalItems <= maxVisible) {
    return { start: 0, end: totalItems };
  }

  const halfWindow = Math.floor(maxVisible / 2);
  let start = selectedIndex - halfWindow;
  let end = selectedIndex + halfWindow + 1;

  if (start < 0) {
    start = 0;
    end = maxVisible;
  }

  if (end > totalItems) {
    end = totalItems;
    start = totalItems - maxVisible;
  }

  return { start, end };
}

export const App: React.FC<AppProps> = ({ filePath }) => {
  const { exit } = useApp();
  const { stdout } = useStdout();
  const [data, setData] = useState<TodoData | null>(null);
  const [selectedSection, setSelectedSection] = useState(0);
  const [selectedTask, setSelectedTask] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [message, setMessage] = useState('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [pendingDelete, setPendingDelete] = useState(false);

  // Get terminal dimensions
  const terminalHeight = stdout?.rows || 24;
  const terminalWidth = stdout?.columns || 80;

  // Reserve lines for header (6), status bar (4), padding (2)
  const RESERVED_LINES = 12;
  const maxContentHeight = Math.max(terminalHeight - RESERVED_LINES, 10);

  const loadData = useCallback(() => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = parseMarkdown(content);
      setData(parsed);
    } catch (err) {
      setMessage(`Erro ao ler arquivo: ${err}`);
    }
  }, [filePath]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Watch file for external changes
  useEffect(() => {
    const watcher = watch(filePath, {
      persistent: true,
      ignoreInitial: true,
    });

    watcher.on('change', () => {
      loadData();
      setMessage('📄 Arquivo atualizado externamente');
      setTimeout(() => setMessage(''), 3000);
    });

    return () => {
      watcher.close();
    };
  }, [filePath, loadData]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const currentSection = data?.sections[selectedSection];
  const currentTask = currentSection?.tasks[selectedTask];

  // Calculate which sections and tasks to show based on scroll
  const visibleContent = useMemo(() => {
    if (!data) return { sections: [], sectionScrollInfo: null };

    // Calculate total lines needed for all sections
    const sectionHeights = data.sections.map(section => {
      // 2 lines for header + 1 line per task (min 1 for "Nenhuma tarefa")
      return 2 + Math.max(section.tasks.length, 1);
    });

    const totalHeight = sectionHeights.reduce((a, b) => a + b, 0);

    // If everything fits, show all
    if (totalHeight <= maxContentHeight) {
      return {
        sections: data.sections.map((section, idx) => ({
          section,
          taskWindow: { start: 0, end: section.tasks.length },
          isSelected: idx === selectedSection,
        })),
        sectionScrollInfo: null,
      };
    }

    // Need to scroll - focus on selected section
    const result: Array<{
      section: Section;
      taskWindow: { start: number; end: number };
      isSelected: boolean;
    }> = [];

    let availableHeight = maxContentHeight;
    const selectedSectionData = data.sections[selectedSection];

    // Always show selected section header (2 lines)
    availableHeight -= 2;

    // Calculate how many tasks we can show in selected section
    const maxTasksInSelected = Math.min(
      availableHeight - 2, // Leave room for at least one other section header
      selectedSectionData.tasks.length
    );

    const taskWindow = calculateScrollWindow(
      selectedSectionData.tasks.length,
      selectedTask,
      Math.max(maxTasksInSelected, 3)
    );

    // Add selected section
    result.push({
      section: selectedSectionData,
      taskWindow,
      isSelected: true,
    });

    availableHeight -= (taskWindow.end - taskWindow.start) || 1;

    // Try to show adjacent sections collapsed (just headers)
    const sectionsToShow: number[] = [selectedSection];

    // Add sections before
    for (let i = selectedSection - 1; i >= 0 && availableHeight >= 2; i--) {
      sectionsToShow.unshift(i);
      availableHeight -= 2;
    }

    // Add sections after
    for (let i = selectedSection + 1; i < data.sections.length && availableHeight >= 2; i++) {
      sectionsToShow.push(i);
      availableHeight -= 2;
    }

    // Build final result in order
    const finalResult = sectionsToShow.map(idx => {
      if (idx === selectedSection) {
        return {
          section: data.sections[idx],
          taskWindow,
          isSelected: true,
        };
      }
      return {
        section: data.sections[idx],
        taskWindow: { start: 0, end: 0 }, // Collapsed
        isSelected: false,
      };
    });

    const scrollInfo = {
      current: selectedSection + 1,
      total: data.sections.length,
      hasMore: sectionsToShow.length < data.sections.length,
    };

    return { sections: finalResult, sectionScrollInfo: scrollInfo };
  }, [data, selectedSection, selectedTask, maxContentHeight]);

  // Get all selected tasks from all sections
  const getSelectedTasks = useCallback((): Task[] => {
    if (!data || selectedTaskIds.size === 0) return [];
    const tasks: Task[] = [];
    for (const section of data.sections) {
      for (const task of section.tasks) {
        if (selectedTaskIds.has(task.id)) {
          tasks.push(task);
        }
      }
    }
    return tasks;
  }, [data, selectedTaskIds]);

  // Toggle selection of current task
  const handleToggleSelection = () => {
    if (!currentTask) return;
    setSelectedTaskIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentTask.id)) {
        newSet.delete(currentTask.id);
      } else {
        newSet.add(currentTask.id);
      }
      return newSet;
    });
  };

  // Toggle selection of all tasks in current section
  const handleToggleSelectSection = () => {
    if (!currentSection || currentSection.tasks.length === 0) return;
    
    // Check if all tasks in section are selected
    const allSelected = currentSection.tasks.every(t => selectedTaskIds.has(t.id));
    
    setSelectedTaskIds(prev => {
      const newSet = new Set(prev);
      if (allSelected) {
        // Deselect all in section
        for (const task of currentSection.tasks) {
          newSet.delete(task.id);
        }
      } else {
        // Select all in section
        for (const task of currentSection.tasks) {
          newSet.add(task.id);
        }
      }
      return newSet;
    });
    
    if (allSelected) {
      showMessage(`🔄 ${currentSection.tasks.length} tarefa(s) desselecionada(s)`);
    } else {
      showMessage(`✅ ${currentSection.tasks.length} tarefa(s) selecionada(s)`);
    }
  };

  // Toggle selection of ALL tasks in ALL sections
  const handleToggleSelectAll = () => {
    if (!data) return;
    
    // Get all tasks from all sections
    const allTasks = data.sections.flatMap(s => s.tasks);
    if (allTasks.length === 0) return;
    
    // Check if all tasks are selected
    const allSelected = allTasks.every(t => selectedTaskIds.has(t.id));
    
    if (allSelected) {
      // Deselect all
      setSelectedTaskIds(new Set());
      showMessage(`🔄 Todas as ${allTasks.length} tarefas desselecionadas`);
    } else {
      // Select all
      setSelectedTaskIds(new Set(allTasks.map(t => t.id)));
      showMessage(`✅ Todas as ${allTasks.length} tarefas selecionadas`);
    }
  };

  const handleToggleTask = () => {
    if (!data) return;
    
    // Get tasks to toggle: selected tasks or current task
    const tasksToToggle = selectedTaskIds.size > 0 ? getSelectedTasks() : (currentTask ? [currentTask] : []);
    if (tasksToToggle.length === 0) return;
    
    // Toggle all tasks
    for (const task of tasksToToggle) {
      toggleTaskInFile(filePath, task);
    }
    
    // Clear selection after bulk operation
    setSelectedTaskIds(new Set());
    
    // Reload data
    const content = fs.readFileSync(filePath, 'utf-8');
    const newData = parseMarkdown(content);
    setData(newData);
    
    // If single task, navigate to it
    if (tasksToToggle.length === 1) {
      const task = tasksToToggle[0];
      const destStatus: TaskStatus = task.completed ? 'next' : 'done';
      const destSectionIndex = newData.sections.findIndex(s => s.id === destStatus);
      if (destSectionIndex >= 0) {
        setSelectedSection(destSectionIndex);
        const destSection = newData.sections[destSectionIndex];
        const taskIndex = destSection.tasks.findIndex(t => t.text === task.text);
        setSelectedTask(taskIndex >= 0 ? taskIndex : 0);
      }
      showMessage(task.completed ? '↩️ Tarefa reaberta' : '✅ Tarefa concluída!');
    } else {
      showMessage(`✅ ${tasksToToggle.length} tarefa(s) processada(s)`);
    }
  };

  const handleAddTask = (text: string, tags: string[], deadline?: string, duration?: string, priority?: 'high' | 'normal' | 'quick') => {
    if (!currentSection) return;
    const newTask = createNewTask(text, currentSection.id, tags, deadline, duration, priority);
    addTaskToFile(filePath, newTask);
    loadData();
    setViewMode('list');
    showMessage('➕ Tarefa adicionada!');
  };

  const handleEditTask = (text: string, tags: string[], deadline?: string, duration?: string, priority?: 'high' | 'normal' | 'quick') => {
    if (!currentTask) return;
    
    const updatedTask: Task = {
      ...currentTask,
      text,
      tags,
      deadline,
      duration,
      priority: priority || 'normal',
      rawLine: '', // Will be regenerated by formatTask
    };
    
    updateTaskInFile(filePath, currentTask, updatedTask);
    loadData();
    setViewMode('list');
    showMessage('✏️ Tarefa atualizada!');
  };

  const handleEditFocus = (newFocus: string) => {
    updateFocusToday(filePath, newFocus);
    loadData();
    setViewMode('list');
    showMessage('🎯 Foco do dia atualizado!');
  };

  const handleDeleteTask = () => {
    // Get tasks to delete: selected tasks or current task
    const tasksToDelete = selectedTaskIds.size > 0 ? getSelectedTasks() : (currentTask ? [currentTask] : []);
    if (tasksToDelete.length === 0) return;
    
    // Delete all tasks (in reverse order to maintain indices)
    for (const task of tasksToDelete.reverse()) {
      removeTaskFromFile(filePath, task);
    }
    
    // Clear selection after bulk operation
    setSelectedTaskIds(new Set());
    
    loadData();
    if (selectedTask > 0) {
      setSelectedTask(prev => Math.max(0, prev - tasksToDelete.length));
    }
    showMessage(`🗑️ ${tasksToDelete.length} tarefa(s) removida(s)`);
  };

  const handleReorderTask = (direction: 'up' | 'down') => {
    if (!data) return;
    
    // Get tasks to reorder: selected tasks or current task
    const hadSelection = selectedTaskIds.size > 0;
    const tasksToReorder = hadSelection ? getSelectedTasks() : (currentTask ? [currentTask] : []);
    if (tasksToReorder.length === 0) return;
    
    // Save task texts to re-select them after reload
    const taskTexts = tasksToReorder.map(t => t.text);
    
    // For multiple tasks, process them in the right order
    // When moving up: process from top to bottom
    // When moving down: process from bottom to top
    const orderedTasks = direction === 'up' ? tasksToReorder : [...tasksToReorder].reverse();
    
    let anyMoved = false;
    let movedToSection: TaskStatus | null = null;
    
    for (const task of orderedTasks) {
      const result = reorderTaskInFile(filePath, task, direction);
      if (result.moved) {
        anyMoved = true;
        if (result.type === 'section_change') {
          movedToSection = result.newStatus;
        }
      }
    }
    
    if (!anyMoved) {
      showMessage(direction === 'up' ? '⚠️ Já está no topo' : '⚠️ Já está no final');
      return;
    }
    
    // Reload data
    const content = fs.readFileSync(filePath, 'utf-8');
    const newData = parseMarkdown(content);
    setData(newData);
    
    // Re-select the moved tasks by finding them by text
    if (hadSelection) {
      const newSelectedIds = new Set<string>();
      for (const section of newData.sections) {
        for (const task of section.tasks) {
          if (taskTexts.includes(task.text)) {
            newSelectedIds.add(task.id);
          }
        }
      }
      setSelectedTaskIds(newSelectedIds);
    }
    
    // If moved to another section, navigate there
    if (movedToSection) {
      const newSectionIndex = newData.sections.findIndex(s => s.id === movedToSection);
      if (newSectionIndex >= 0) {
        setSelectedSection(newSectionIndex);
        const newSection = newData.sections[newSectionIndex];
        
        // Find the moved task in the new section
        const taskIndex = newSection.tasks.findIndex(t => taskTexts.includes(t.text));
        
        if (taskIndex >= 0) {
          setSelectedTask(taskIndex);
        } else {
          // Fallback: if moving down, task should be at start; if moving up, at end
          setSelectedTask(direction === 'down' ? 0 : Math.max(0, newSection.tasks.length - 1));
        }
      }
      
      const statusNames: Record<TaskStatus, string> = {
        doing: 'FAZENDO',
        next: 'PRÓXIMAS',
        waiting: 'ESPERANDO',
        blocked: 'BLOQUEADAS',
        ideas: 'IDEIAS',
        done: 'CONCLUÍDAS',
      };
      showMessage(`📦 ${tasksToReorder.length} tarefa(s) movida(s) para ${statusNames[movedToSection]}`);
    } else {
      // Just reordered within section
      if (!hadSelection && currentSection) {
        // Update selection to follow the single task
        if (direction === 'up' && selectedTask > 0) {
          setSelectedTask(prev => prev - 1);
        } else if (direction === 'down' && selectedTask < currentSection.tasks.length - 1) {
          setSelectedTask(prev => prev + 1);
        }
      }
      showMessage(direction === 'up' ? '⬆️ Tarefa(s) movida(s) para cima' : '⬇️ Tarefa(s) movida(s) para baixo');
    }
  };

  const handleMoveTask = (newStatus: TaskStatus) => {
    if (!data) return;
    
    // Get tasks to move: selected tasks or current task
    const tasksToMove = selectedTaskIds.size > 0 ? getSelectedTasks() : (currentTask ? [currentTask] : []);
    if (tasksToMove.length === 0) return;
    
    // Move all tasks
    const lastTaskText = tasksToMove[tasksToMove.length - 1].text;
    for (const task of tasksToMove) {
      moveTaskInFile(filePath, task, newStatus);
    }
    
    // Clear selection after bulk operation
    setSelectedTaskIds(new Set());
    
    // Reload data
    const content = fs.readFileSync(filePath, 'utf-8');
    const newData = parseMarkdown(content);
    setData(newData);
    
    // Find the destination section and focus on the last moved task
    const destSectionIndex = newData.sections.findIndex(s => s.id === newStatus);
    if (destSectionIndex >= 0) {
      setSelectedSection(destSectionIndex);
      
      // Find the task by its text in the destination section
      const destSection = newData.sections[destSectionIndex];
      const taskIndex = destSection.tasks.findIndex(t => t.text === lastTaskText);
      setSelectedTask(taskIndex >= 0 ? taskIndex : 0);
    }
    
    setViewMode('list');
    
    const statusNames: Record<TaskStatus, string> = {
      doing: 'FAZENDO',
      next: 'PRÓXIMAS',
      waiting: 'ESPERANDO',
      blocked: 'BLOQUEADAS',
      ideas: 'IDEIAS',
      done: 'CONCLUÍDAS',
    };
    showMessage(`📦 ${tasksToMove.length} tarefa(s) movida(s) para ${statusNames[newStatus]}`);
  };

  useInput((input, key) => {
    // Cancel pending delete on any key except 'd'
    if (pendingDelete && input !== 'd') {
      setPendingDelete(false);
      setMessage('');
    }

    // Global quit
    if (input === 'q' && viewMode === 'list') {
      exit();
      return;
    }

    // Help toggle
    if (input === '?' || (key.escape && viewMode === 'help')) {
      setViewMode(viewMode === 'help' ? 'list' : 'help');
      return;
    }

    // Close any view with any key if in help
    if (viewMode === 'help') {
      setViewMode('list');
      return;
    }

    // Cancel current view with Escape
    if (key.escape) {
      if (viewMode !== 'list') {
        setViewMode('list');
      }
      return;
    }

    // List view navigation
    if (viewMode === 'list' && data) {
      // Vertical navigation (tasks)
      if (key.upArrow || input === 'k') {
        if (selectedTask > 0) {
          setSelectedTask(prev => prev - 1);
        } else if (selectedSection > 0) {
          // Move to previous section, last task
          const prevSection = data.sections[selectedSection - 1];
          setSelectedSection(prev => prev - 1);
          setSelectedTask(Math.max(0, prevSection.tasks.length - 1));
        }
        return;
      }
      if (key.downArrow || input === 'j') {
        const maxTasks = (currentSection?.tasks.length || 1) - 1;
        if (selectedTask < maxTasks) {
          setSelectedTask(prev => prev + 1);
        } else if (selectedSection < data.sections.length - 1) {
          // Move to next section, first task
          setSelectedSection(prev => prev + 1);
          setSelectedTask(0);
        }
        return;
      }

      // Horizontal navigation (sections) - jump to section
      if (key.leftArrow || input === 'h') {
        if (selectedSection > 0) {
          setSelectedSection(prev => prev - 1);
          setSelectedTask(0);
        }
        return;
      }
      if (key.rightArrow || input === 'l' || key.tab) {
        if (selectedSection < data.sections.length - 1) {
          setSelectedSection(prev => prev + 1);
          setSelectedTask(0);
        }
        return;
      }

      // Selection controls
      if (input === ' ') {
        // Space: toggle selection of current task
        handleToggleSelection();
        return;
      }
      
      if (input === 's') {
        // s: toggle select all tasks in current section
        handleToggleSelectSection();
        return;
      }
      
      if (input === 'S') {
        // S: toggle select ALL tasks in ALL sections
        handleToggleSelectAll();
        return;
      }

      // Actions
      if (key.return) {
        handleToggleTask();
        return;
      }

      if (input === 'a') {
        setViewMode('add');
        return;
      }

      if (input === 'e' && currentTask) {
        setViewMode('edit');
        return;
      }

      if (input === 'f') {
        setViewMode('focus');
        return;
      }

      if (input === 'd' && currentTask) {
        if (pendingDelete) {
          // Confirmed - execute deletion
          handleDeleteTask();
          setPendingDelete(false);
        } else {
          // First press - ask for confirmation
          const count = selectedTaskIds.size > 0 ? selectedTaskIds.size : 1;
          setPendingDelete(true);
          showMessage(`⚠️ Deletar ${count} tarefa(s)? Pressione 'd' novamente para confirmar`);
        }
        return;
      }

      if (input === 'm' && currentTask) {
        setViewMode('move');
        return;
      }

      if (input === 'r') {
        loadData();
        showMessage('🔄 Arquivo recarregado');
        return;
      }

      // Reorder tasks with K/J (uppercase) or Ctrl+Up/Down
      if ((input === 'K' || (key.ctrl && key.upArrow)) && (currentTask || selectedTaskIds.size > 0)) {
        handleReorderTask('up');
        return;
      }
      if ((input === 'J' || (key.ctrl && key.downArrow)) && (currentTask || selectedTaskIds.size > 0)) {
        handleReorderTask('down');
        return;
      }

      // Quick move shortcuts
      const quickMoveMap: Record<string, TaskStatus> = {
        '1': 'doing',
        '2': 'next',
        '3': 'waiting',
        '4': 'blocked',
        '5': 'ideas',
        '0': 'done',
      };

      if (quickMoveMap[input] && currentTask) {
        handleMoveTask(quickMoveMap[input]);
        return;
      }
    }
  });

  if (!data) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="red">Carregando...</Text>
      </Box>
    );
  }

  // Help View
  if (viewMode === 'help') {
    return <HelpView onClose={() => setViewMode('list')} maxHeight={terminalHeight - 4} />;
  }

  // Add Task View
  if (viewMode === 'add' && currentSection) {
    return (
      <AddTaskView
        currentSection={currentSection.id}
        onSubmit={handleAddTask}
        onCancel={() => setViewMode('list')}
      />
    );
  }

  // Edit Task View
  if (viewMode === 'edit' && currentTask) {
    return (
      <EditTaskView
        task={currentTask}
        onSubmit={handleEditTask}
        onCancel={() => setViewMode('list')}
      />
    );
  }

  // Edit Focus View
  if (viewMode === 'focus' && data) {
    return (
      <EditFocusView
        currentFocus={data.focusToday}
        onSubmit={handleEditFocus}
        onCancel={() => setViewMode('list')}
      />
    );
  }

  // Move Task View
  if (viewMode === 'move' && currentTask) {
    return (
      <MoveTaskView
        task={currentTask}
        onMove={handleMoveTask}
        onCancel={() => setViewMode('list')}
      />
    );
  }

  // Main List View
  return (
    <Box flexDirection="column" height={terminalHeight} overflow="hidden">
      <Box flexDirection="column" paddingX={1}>
        <Header focusToday={data.focusToday} />
      </Box>

      <Box flexDirection="column" flexGrow={1} paddingX={1} overflow="hidden">
        {visibleContent.sections.map(({ section, taskWindow, isSelected }, idx) => (
          <SectionView
            key={section.id}
            section={section}
            isSectionFocused={isSelected}
            focusedTaskIndex={isSelected ? selectedTask : -1}
            selectedTaskIds={selectedTaskIds}
            taskWindow={taskWindow}
            collapsed={!isSelected && taskWindow.end === 0}
          />
        ))}

        {visibleContent.sectionScrollInfo?.hasMore && (
          <Box marginLeft={2}>
            <Text color="gray" italic>
              ... mais seções (use ←→ para navegar)
            </Text>
          </Box>
        )}
      </Box>

      <Box paddingX={1}>
        <StatusBar
          message={message}
          viewMode={viewMode}
          selectedCount={selectedTaskIds.size}
          scrollInfo={
            visibleContent.sectionScrollInfo
              ? `Seção ${visibleContent.sectionScrollInfo.current}/${visibleContent.sectionScrollInfo.total}`
              : undefined
          }
        />
      </Box>
    </Box>
  );
};
