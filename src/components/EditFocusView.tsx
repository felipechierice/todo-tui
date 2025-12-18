import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';

interface EditFocusViewProps {
  currentFocus: string;
  onSubmit: (newFocus: string) => void;
  onCancel: () => void;
}

export const EditFocusView: React.FC<EditFocusViewProps> = ({
  currentFocus,
  onSubmit,
  onCancel,
}) => {
  const [focus, setFocus] = useState(currentFocus);

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
    }
  });

  const handleSubmit = () => {
    onSubmit(focus.trim());
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="magenta">
          ╔════════════════════════════════════════╗
        </Text>
      </Box>
      <Box>
        <Text bold color="magenta">║</Text>
        <Text bold color="cyan">        🎯 TODAY'S FOCUS                  </Text>
        <Text bold color="magenta">║</Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold color="magenta">
          ╚════════════════════════════════════════╝
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="gray">Define your priorities for the day (1-3 main items)</Text>
      </Box>

      <Box flexDirection="column" marginLeft={2}>
        <Box>
          <Text color="cyan">▸ </Text>
          <Text bold>Focus: </Text>
          <TextInput
            value={focus}
            onChange={setFocus}
            onSubmit={handleSubmit}
            placeholder="E.g.: Finish report, Client meeting"
          />
        </Box>
      </Box>

      <Box marginTop={2}>
        <Text color="gray" italic>
          Enter to confirm │ Esc to cancel
        </Text>
      </Box>
    </Box>
  );
};
