import React from 'react';
import { Box, Text } from 'ink';
import { ViewMode } from '../types.js';

interface StatusBarProps {
  message: string;
  viewMode: ViewMode;
  scrollInfo?: string;
  selectedCount?: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ message, viewMode, scrollInfo, selectedCount = 0 }) => {
  return (
    <Box flexDirection="column" marginTop={1}>
      <Box>
        <Text color="cyan">
          ────────────────────────────────────────────────────────────────
        </Text>
      </Box>
      {message && (
        <Box>
          <Text color="green">💬 {message}</Text>
        </Box>
      )}
      <Box marginTop={0}>
        <Text bold color="gray">
          Mode:{' '}
        </Text>
        <Text color="yellow">{viewMode.toUpperCase()}</Text>
        {selectedCount > 0 && (
          <>
            <Text color="gray"> │ </Text>
            <Text color="magenta" bold>● {selectedCount} selected</Text>
          </>
        )}
        {scrollInfo && (
          <>
            <Text color="gray"> │ </Text>
            <Text color="cyan">{scrollInfo}</Text>
          </>
        )}
        <Text color="gray"> │ </Text>
        <Text color="gray">
          <Text color="white">↑↓</Text> nav{' '}
          <Text color="white">Enter</Text> ✓{' '}
          <Text color="white">e</Text> edit{' '}
          <Text color="white">m</Text> move{' '}
          <Text color="white">?</Text> help
        </Text>
      </Box>
    </Box>
  );
};
