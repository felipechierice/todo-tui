import React from 'react';
import { Box, Text } from 'ink';

interface HelpViewProps {
  onClose: () => void;
  maxHeight?: number;
}

export const HelpView: React.FC<HelpViewProps> = ({ onClose, maxHeight }) => {
  return (
    <Box
      flexDirection="column"
      padding={1}
      height={maxHeight}
      overflow="hidden"
    >
      <Box marginBottom={1}>
        <Text bold color="yellow">
          ╔════════════════════════════════════════╗
        </Text>
      </Box>
      <Box>
        <Text bold color="yellow">║</Text>
        <Text bold color="cyan">        📖 HELP - Shortcuts              </Text>
        <Text bold color="yellow">║</Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold color="yellow">
          ╚════════════════════════════════════════╝
        </Text>
      </Box>

      <Box flexDirection="column" marginLeft={2} flexGrow={1} overflow="hidden">
        <Text bold color="cyan">Navigation:</Text>
        <Text>  <Text color="white">↑ / k</Text>     <Text color="gray">Previous task</Text></Text>
        <Text>  <Text color="white">↓ / j</Text>     <Text color="gray">Next task</Text></Text>
        <Text>  <Text color="white">← / h</Text>     <Text color="gray">Previous section</Text></Text>
        <Text>  <Text color="white">→ / l</Text>     <Text color="gray">Next section</Text></Text>
        <Text>  <Text color="white">Tab</Text>       <Text color="gray">Next section</Text></Text>

        <Box marginTop={1}>
          <Text bold color="cyan">Selection (multi-task):</Text>
        </Box>
        <Text>  <Text color="white">Space</Text>    <Text color="gray">Select/deselect task</Text></Text>
        <Text>  <Text color="white">s</Text>         <Text color="gray">Toggle selection of current group</Text></Text>
        <Text>  <Text color="white">S</Text>         <Text color="gray">Toggle selection of ALL tasks</Text></Text>

        <Box marginTop={1}>
          <Text bold color="cyan">Actions:</Text>
        </Box>
        <Text>  <Text color="white">Enter</Text>     <Text color="gray">Complete (selected or current)</Text></Text>
        <Text>  <Text color="white">a</Text>         <Text color="gray">Add new task</Text></Text>
        <Text>  <Text color="white">e</Text>         <Text color="gray">Edit current task</Text></Text>
        <Text>  <Text color="white">f</Text>         <Text color="gray">Edit today's focus</Text></Text>
        <Text>  <Text color="white">d</Text>         <Text color="gray">Delete (selected or current)</Text></Text>
        <Text>  <Text color="white">m</Text>         <Text color="gray">Move (selected or current)</Text></Text>
        <Text>  <Text color="white">K</Text>         <Text color="gray">Move task(s) up/previous group</Text></Text>
        <Text>  <Text color="white">J</Text>         <Text color="gray">Move task(s) down/next group</Text></Text>

        <Box marginTop={1}>
          <Text bold color="cyan">Quick move (numbers):</Text>
        </Box>
        <Text>  <Text color="white">1</Text> Doing  <Text color="white">2</Text> Next  <Text color="white">3</Text> Waiting</Text>
        <Text>  <Text color="white">4</Text> Blocked  <Text color="white">5</Text> Ideas  <Text color="white">0</Text> Done</Text>

        <Box marginTop={1}>
          <Text bold color="cyan">General:</Text>
        </Box>
        <Text>  <Text color="white">r</Text>         <Text color="gray">Reload file</Text></Text>
        <Text>  <Text color="white">?</Text>         <Text color="gray">Show/Hide help</Text></Text>
        <Text>  <Text color="white">q / Esc</Text>   <Text color="gray">Quit / Close</Text></Text>
      </Box>

      <Box marginTop={1}>
        <Text color="gray" italic>Press any key to close...</Text>
      </Box>
    </Box>
  );
};
