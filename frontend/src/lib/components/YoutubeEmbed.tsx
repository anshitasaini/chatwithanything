import React, { useState, useEffect } from 'react';
import { AspectRatio, Box } from '@chakra-ui/react';
import YouTube from 'react-youtube';
import Options from 'react-youtube';
import axios from 'axios';
import TranscriptDisplay from '~/lib/components/TranscriptDisplay'; 
import { YoutubeTranscript } from 'youtube-transcript';
import { getSubtitles } from 'youtube-captions-scraper';

interface YoutubeEmbedProps {
  videoId: string;
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ videoId }) => {
  const [transcript, setTranscript] = useState<string>('');
  const [displayedTranscript, setDisplayedTranscript] = useState<string>('');
  const playerRef = React.useRef<YouTube | null>(null);

  useEffect(() => {
    getSubtitles({
      videoID: 'qQp2FX13Hlg', // youtube video id
      lang: 'en' // default: `en`
    }).then(captions => {
      console.log(captions);
    });
    
  }, [videoId]);

  // const handleStateChange = (event: any) => {
  //   // event.target contains the player instance and the player's state
  //   const player = event.target;
  //   if (event.data === window['YT'].PlayerState.PLAYING) {
  //     // Get the current video time
  //     const currentTime = player.getCurrentTime();

  //     // Split the transcript by newlines to get individual lines
  //     const transcriptLines = transcript.split('\n');

  //     // Find the current transcript line based on the current time
  //     let currentLineIndex = 0;
  //     for (let i = 0; i < transcriptLines.length; i++) {
  //       const lineStartTime = parseFloat(transcriptLines[i].split(' ')[0]);
  //       if (lineStartTime > currentTime) {
  //         break;
  //       }
  //       currentLineIndex = i;
  //     }

  //     // Display the current transcript line and the next line
  //     const displayedTranscript = transcriptLines
  //       .slice(currentLineIndex, currentLineIndex + 2)
  //       .join('\n');

  //     setDisplayedTranscript(displayedTranscript);
  //   }
  // };

  // const playerOptions: Options = {
  //   playerVars: {
  //     cc_load_policy: 1,
  //     cc_lang_pref: 'en',
  //   },
  // };

  return (
    <Box>
      {/* YouTube Video Player */}
      <Box w="100%" h="0" pb="56.25%" pos="relative">
        <AspectRatio
          ratio={16 / 9}
          pos="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
        >
          <YouTube videoId={videoId} />
        </AspectRatio>
      </Box>

      {/* Display Live Transcript */}
      {/* {displayedTranscript && <TranscriptDisplay transcript={displayedTranscript} />} */}
    </Box>
  );
};

export default YoutubeEmbed;
