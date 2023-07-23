import React from 'react';
import { AspectRatio, Box } from '@chakra-ui/react';
import YouTube from 'react-youtube';

interface YoutubeEmbedProps {
  videoId: string;
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ videoId }) => {
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <Box w="100%" h="0" pb="56.25%" pos="relative">
      <AspectRatio
        ratio={16 / 9}
        pos="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
      >
        <YouTube videoId={videoId} opts={opts} />
      </AspectRatio>
    </Box>
  );
};

export default YoutubeEmbed;
