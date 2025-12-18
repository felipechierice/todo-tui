import React from 'react';
import { Box, Text } from 'ink';
import { Section } from '../types.js';
import { TaskItem } from './TaskItem.js';

interface SectionViewProps {
  section: Section;
  isSectionFocused: boolean;
  focusedTaskIndex: number;
  selectedTaskIds: Set<string>;
  taskWindow?: { start: number; end: number };
  collapsed?: boolean;
}

const sectionColors: Record<string, string> = {
  doing: 'red',
  next: 'blue',
  waiting: 'yellow',
  blocked: 'magenta',
  ideas: 'cyan',
  done: 'green',
};

export const SectionView: React.FC<SectionViewProps> = ({
  section,
  isSectionFocused,
  focusedTaskIndex,
  selectedTaskIds,
  taskWindow,
  collapsed = false,
}) => {
  const borderColor = isSectionFocused ? sectionColors[section.id] : 'gray';
  const taskCount = section.tasks.length;
  const selectedInSection = section.tasks.filter(t => selectedTaskIds.has(t.id)).length;

  // Determine which tasks to show
  const window = taskWindow || { start: 0, end: section.tasks.length };
  const visibleTasks = section.tasks.slice(window.start, window.end);
  const hasScrollUp = window.start > 0;
  const hasScrollDown = window.end < section.tasks.length;

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text bold color={borderColor}>
          {isSectionFocused ? '▸ ' : '  '}
        </Text>
        <Text bold color={sectionColors[section.id]}>
          {section.title}
        </Text>
        <Text color="gray"> ({taskCount})</Text>
        {selectedInSection > 0 && (
          <Text color="yellow"> [{selectedInSection} selected]</Text>
        )}
        {collapsed && taskCount > 0 && (
          <Text color="gray" italic> [collapsed]</Text>
        )}
      </Box>

      {!collapsed && (
        <Box flexDirection="column" marginLeft={2}>
          {hasScrollUp && (
            <Box>
              <Text color="gray">  ↑ {window.start} more task(s) above</Text>
            </Box>
          )}

          {visibleTasks.length === 0 ? (
            <Text color="gray" italic>  No tasks</Text>
          ) : (
            visibleTasks.map((task, idx) => {
              const actualIndex = window.start + idx;
              const isFocused = isSectionFocused && actualIndex === focusedTaskIndex;
              const isSelected = selectedTaskIds.has(task.id);
              return (
                <TaskItem
                  key={task.id}
                  task={task}
                  isFocused={isFocused}
                  isSelected={isSelected}
                  index={actualIndex}
                />
              );
            })
          )}

          {hasScrollDown && (
            <Box>
              <Text color="gray">  ↓ {section.tasks.length - window.end} more task(s) below</Text>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
