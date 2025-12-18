import React from 'react';
import { Box, Text } from 'ink';

interface HeaderProps {
  focusToday: string;
}

export const Header: React.FC<HeaderProps> = ({ focusToday }) => {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text bold color="cyan">
          ╔══════════════════════════════════════════════════════════════╗
        </Text>
      </Box>
      <Box>
        <Text bold color="cyan">║</Text>
        <Text bold color="yellow">  📋 TODO TUI </Text>
        <Text dimColor>- Task Manager</Text>
        <Box flexGrow={1} />
        <Text bold color="cyan">║</Text>
      </Box>
      <Box>
        <Text bold color="cyan">
          ╚══════════════════════════════════════════════════════════════╝
        </Text>
      </Box>
      {focusToday && (
        <Box marginTop={1}>
          <Text bold color="magenta">🎯 Today's focus: </Text>
          <Text color="white">{focusToday}</Text>
        </Box>
      )}
    </Box>
  );
};
