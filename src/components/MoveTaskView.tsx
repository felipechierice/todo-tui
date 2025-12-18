import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Task, TaskStatus } from '../types.js';

interface MoveTaskViewProps {
  task: Task;
  onMove: (newStatus: TaskStatus) => void;
  onCancel: () => void;
}

const sections: { id: TaskStatus; label: string; key: string }[] = [
  { id: 'doing', label: '🔥 DOING', key: '1' },
  { id: 'next', label: '📌 NEXT', key: '2' },
  { id: 'waiting', label: '⏳ WAITING', key: '3' },
  { id: 'blocked', label: '🚧 BLOCKED', key: '4' },
  { id: 'ideas', label: '💡 IDEAS', key: '5' },
  { id: 'done', label: '✅ DONE', key: '0' },
];

export const MoveTaskView: React.FC<MoveTaskViewProps> = ({
  task,
  onMove,
  onCancel,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }

    if (key.upArrow || input === 'k') {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : sections.length - 1));
      return;
    }

    if (key.downArrow || input === 'j') {
      setSelectedIndex(prev => (prev < sections.length - 1 ? prev + 1 : 0));
      return;
    }

    if (key.return) {
      onMove(sections[selectedIndex].id);
      return;
    }

    // Number shortcuts
    const section = sections.find(s => s.key === input);
    if (section) {
      onMove(section.id);
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="magenta">
          ╔════════════════════════════════════════╗
        </Text>
      </Box>
      <Box>
        <Text bold color="magenta">║</Text>
        <Text bold color="cyan">        📦 MOVE TASK                  </Text>
        <Text bold color="magenta">║</Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold color="magenta">
          ╚════════════════════════════════════════╝
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="gray">Task: </Text>
        <Text color="white">{task.text}</Text>
      </Box>

      <Box marginBottom={1}>
        <Text bold color="cyan">Move to:</Text>
      </Box>

      <Box flexDirection="column" marginLeft={2}>
        {sections.map((section, idx) => (
          <Box key={section.id}>
            <Text color={idx === selectedIndex ? 'cyan' : 'gray'}>
              {idx === selectedIndex ? '▸ ' : '  '}
            </Text>
            <Text color="yellow">[{section.key}]</Text>
            <Text color={task.status === section.id ? 'gray' : 'white'}>
              {' '}{section.label}
            </Text>
            {task.status === section.id && (
              <Text color="gray" italic> (current)</Text>
            )}
          </Box>
        ))}
      </Box>

      <Box marginTop={2}>
        <Text color="gray" italic>
          ↑↓ select │ Enter/number confirm │ Esc cancel
        </Text>
      </Box>
    </Box>
  );
};
