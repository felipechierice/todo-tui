import React from 'react';
import { Box, Text } from 'ink';
import { Task } from '../types.js';

interface TaskItemProps {
  task: Task;
  isFocused: boolean;      // Has cursor/active focus
  isSelected: boolean;     // Is in multi-selection
  index: number;
}

const priorityColors: Record<string, string> = {
  high: 'red',
  normal: 'white',
  quick: 'green',
};

/**
 * Background colors for 4 states:
 * - Focused + Selected: magenta (most prominent)
 * - Focused + Not Selected: blue (active cursor)
 * - Not Focused + Selected: gray (selected but not active)
 * - Not Focused + Not Selected: undefined (no background)
 */
function getBackgroundColor(isFocused: boolean, isSelected: boolean): string | undefined {
  if (isFocused && isSelected) return 'magenta';
  if (isFocused && !isSelected) return 'blue';
  if (!isFocused && isSelected) return 'gray';
  return undefined;
}

function getIndicator(isFocused: boolean, isSelected: boolean): string {
  if (isFocused && isSelected) return '▶●';
  if (isFocused && !isSelected) return '▶ ';
  if (!isFocused && isSelected) return ' ●';
  return '  ';
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, isFocused, isSelected, index }) => {
  const checkbox = task.completed ? '[✓]' : '[ ]';
  const checkColor = task.completed ? 'green' : 'gray';
  const textColor = task.completed ? 'gray' : priorityColors[task.priority];
  const bg = getBackgroundColor(isFocused, isSelected);
  const indicator = getIndicator(isFocused, isSelected);
  const indicatorColor = isSelected ? 'yellow' : (isFocused ? 'white' : 'gray');

  return (
    <Box>
      <Text backgroundColor={bg}>
        <Text color={indicatorColor}>{indicator}</Text>
        <Text color={checkColor}>{checkbox} </Text>
        <Text color={textColor} strikethrough={task.completed}>
          {task.text}
        </Text>
        {task.tags.length > 0 && (
          <Text color="cyan"> {task.tags.map(t => `#${t}`).join(' ')}</Text>
        )}
        {task.deadline && <Text color="yellow"> 📅 {task.deadline}</Text>}
        {task.duration && <Text color="magenta"> ~{task.duration}</Text>}
        {task.waitingFor && <Text color="gray"> → {task.waitingFor}</Text>}
        {task.priority === 'high' && !task.completed && <Text color="red"> ⚡</Text>}
        {task.priority === 'quick' && !task.completed && <Text color="green"> 🚀</Text>}
        {task.completedDate && <Text color="green"> ✓ {task.completedDate}</Text>}
      </Text>
    </Box>
  );
};
