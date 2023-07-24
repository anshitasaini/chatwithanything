import React from 'react';
import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import YoutubeEmbed from '~/lib/components/YoutubeEmbed';
import Chat from '~/lib/components/Chat';

const VideoPlayerPage: React.FC = () => {
  const videoId = 'YOUR_YOUTUBE_VIDEO_ID'; 

  return (
    <Flex flexDirection="row">
      <Box flex="2">
        <YoutubeEmbed videoId={videoId} />
      </Box>
      <Box flex="1" ml={4}>
        <Chat />
      </Box>
    </Flex>
  );
};

export default VideoPlayerPage;
