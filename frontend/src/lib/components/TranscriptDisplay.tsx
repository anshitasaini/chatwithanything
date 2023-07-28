import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface TranscriptDisplayProps {
  transcript: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => {
  return (
    <Box mt="2">
      <Text fontSize="lg" fontWeight="bold">Live Transcript:</Text>
      <Text>{transcript}</Text>
    </Box>
  );
};

export default TranscriptDisplay;
