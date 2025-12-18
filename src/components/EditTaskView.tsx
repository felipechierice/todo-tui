import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { Task, Priority } from '../types.js';

interface EditTaskViewProps {
  task: Task;
  onSubmit: (text: string, tags: string[], deadline?: string, duration?: string, priority?: Priority) => void;
  onCancel: () => void;
}

type Step = 'text' | 'tags' | 'deadline' | 'duration' | 'marker' | 'confirm';

type MarkerOption = { label: string; value: Priority; emoji: string };

const MARKER_OPTIONS: MarkerOption[] = [
  { label: 'None', value: 'normal', emoji: '' },
  { label: 'Important', value: 'high', emoji: '⚡' },
  { label: 'Quick', value: 'quick', emoji: '🚀' },
];

function getMarkerIndexFromPriority(priority: Priority): number {
  return MARKER_OPTIONS.findIndex(opt => opt.value === priority);
}

export const EditTaskView: React.FC<EditTaskViewProps> = ({
  task,
  onSubmit,
  onCancel,
}) => {
  const [step, setStep] = useState<Step>('text');
  const [text, setText] = useState(task.text);
  const [tagsInput, setTagsInput] = useState(task.tags.join(', '));
  const [deadline, setDeadline] = useState(task.deadline || '');
  const [duration, setDuration] = useState(task.duration || '');
  const [markerIndex, setMarkerIndex] = useState(getMarkerIndexFromPriority(task.priority));

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }
    
    // Handle marker selection
    if (step === 'marker') {
      if (key.leftArrow || input === 'h') {
        setMarkerIndex(i => (i - 1 + MARKER_OPTIONS.length) % MARKER_OPTIONS.length);
      } else if (key.rightArrow || input === 'l') {
        setMarkerIndex(i => (i + 1) % MARKER_OPTIONS.length);
      } else if (key.return) {
        handleMarkerSubmit();
      }
    }
  });

  const handleTextSubmit = () => {
    if (text.trim()) {
      setStep('tags');
    }
  };

  const handleTagsSubmit = () => {
    setStep('deadline');
  };

  const handleDeadlineSubmit = () => {
    setStep('duration');
  };

  const handleDurationSubmit = () => {
    setStep('marker');
  };

  const handleMarkerSubmit = () => {
    const tags = tagsInput
      .split(/[,\s]+/)
      .map(t => t.replace('#', '').trim())
      .filter(t => t.length > 0);
    
    const selectedMarker = MARKER_OPTIONS[markerIndex];
    
    onSubmit(
      text.trim(),
      tags,
      deadline.trim() || undefined,
      duration.trim() || undefined,
      selectedMarker.value
    );
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="yellow">
          ╔════════════════════════════════════════╗
        </Text>
      </Box>
      <Box>
        <Text bold color="yellow">║</Text>
        <Text bold color="cyan">        ✏️  EDIT TASK                 </Text>
        <Text bold color="yellow">║</Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold color="yellow">
          ╚════════════════════════════════════════╝
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="gray">Section: </Text>
        <Text color="yellow">{task.status.toUpperCase()}</Text>
      </Box>

      <Box flexDirection="column" marginLeft={2}>
        <Box>
          <Text color={step === 'text' ? 'cyan' : 'green'}>
            {step === 'text' ? '▸ ' : '✓ '}
          </Text>
          <Text bold>Task: </Text>
          {step === 'text' ? (
            <TextInput
              value={text}
              onChange={setText}
              onSubmit={handleTextSubmit}
              placeholder="Describe the task..."
            />
          ) : (
            <Text color="white">{text}</Text>
          )}
        </Box>

        {(step === 'tags' || step === 'deadline' || step === 'duration' || step === 'marker' || step === 'confirm') && (
          <Box marginTop={1}>
            <Text color={step === 'tags' ? 'cyan' : 'green'}>
              {step === 'tags' ? '▸ ' : '✓ '}
            </Text>
            <Text bold>Tags: </Text>
            {step === 'tags' ? (
              <TextInput
                value={tagsInput}
                onChange={setTagsInput}
                onSubmit={handleTagsSubmit}
                placeholder="work, project (comma separated)"
              />
            ) : (
              <Text color="cyan">{tagsInput || '(none)'}</Text>
            )}
          </Box>
        )}

        {(step === 'deadline' || step === 'duration' || step === 'marker' || step === 'confirm') && (
          <Box marginTop={1}>
            <Text color={step === 'deadline' ? 'cyan' : 'green'}>
              {step === 'deadline' ? '▸ ' : '✓ '}
            </Text>
            <Text bold>Deadline: </Text>
            {step === 'deadline' ? (
              <TextInput
                value={deadline}
                onChange={setDeadline}
                onSubmit={handleDeadlineSubmit}
                placeholder="DD/MM (optional)"
              />
            ) : (
              <Text color="yellow">{deadline || '(no deadline)'}</Text>
            )}
          </Box>
        )}

        {(step === 'duration' || step === 'marker' || step === 'confirm') && (
          <Box marginTop={1}>
            <Text color={step === 'duration' ? 'cyan' : 'green'}>
              {step === 'duration' ? '▸ ' : '✓ '}
            </Text>
            <Text bold>Duration: </Text>
            {step === 'duration' ? (
              <TextInput
                value={duration}
                onChange={setDuration}
                onSubmit={handleDurationSubmit}
                placeholder="30min, 1h (optional)"
              />
            ) : (
              <Text color="magenta">{duration || '(not set)'}</Text>
            )}
          </Box>
        )}

        {(step === 'marker' || step === 'confirm') && (
          <Box marginTop={1}>
            <Text color={step === 'marker' ? 'cyan' : 'green'}>
              {step === 'marker' ? '▸ ' : '✓ '}
            </Text>
            <Text bold>Marker: </Text>
            {step === 'marker' ? (
              <Box>
                {MARKER_OPTIONS.map((opt, idx) => (
                  <Text key={opt.value}>
                    <Text color={idx === markerIndex ? 'cyan' : 'gray'} bold={idx === markerIndex}>
                      {idx === markerIndex ? '[' : ' '}
                      {opt.emoji ? `${opt.emoji} ` : ''}{opt.label}
                      {idx === markerIndex ? ']' : ' '}
                    </Text>
                    {idx < MARKER_OPTIONS.length - 1 && <Text color="gray"> │ </Text>}
                  </Text>
                ))}
              </Box>
            ) : (
              <Text color="red">
                {MARKER_OPTIONS[markerIndex].emoji 
                  ? `${MARKER_OPTIONS[markerIndex].emoji} ${MARKER_OPTIONS[markerIndex].label}`
                  : '(none)'}
              </Text>
            )}
          </Box>
        )}
      </Box>

      <Box marginTop={2}>
        <Text color="gray" italic>
          {step === 'marker' 
            ? '← → to choose │ Enter to confirm │ Esc to cancel'
            : 'Enter to confirm │ Esc to cancel'}
        </Text>
      </Box>
    </Box>
  );
};
