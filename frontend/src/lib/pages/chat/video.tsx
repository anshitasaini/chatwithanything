// pages/VideoPlayerPage.tsx
import React from 'react';
import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import YoutubeEmbed from '~/lib/components/YoutubeEmbed';

const VideoPlayerPage: React.FC = () => {
  const videoId = 'YOUR_YOUTUBE_VIDEO_ID'; // Replace with the actual YouTube video ID

  return (
    <Flex flexDirection="row">
      <Box flex="2"> {/* Update the flex value to 2 to take 2/3 of the screen */}
        <YoutubeEmbed videoId={videoId} />
      </Box>
      <Box flex="1" ml={4}>
        <p style={{ fontSize: '14px' }}> {/* Decrease the font size of the text */}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec volutpat purus vel
          scelerisque pharetra.
        </p>
      </Box>
    </Flex>
  );
};

export default VideoPlayerPage;
