import { Box, Flex, IconButton, Input, useColorMode, useBreakpointValue } from '@chakra-ui/react';
import type React from 'react';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { FiSend } from 'react-icons/fi';
import FileUpload from './FileUpload';

interface Props {
  onMessageSend: (message: string) => void;
}

const ChatInputBox: React.FC<Props> = ({ onMessageSend }) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | undefined>();

  const handleSendMessage = () => {
    if (message === '') return;
    // onMessageSend(message);
    setMessage('');
    setFile(undefined);

    router.push('/chat/video');
  };

  // Use useBreakpointValue to set the width responsively
  const inputWidth = useBreakpointValue({ base: '100%', sm: '80%', md: '70%', lg: '60%' });

  return (
    <Flex
      alignItems="center"
      p={2}
      borderWidth={1}
      borderRadius="md"
      borderColor={colorMode === 'light' ? 'gray.300' : 'gray.600'}
      maxW="600px"
      w="100%" 
    >
      <Input
        flex="1"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        border="none"
        autoFocus
        outline="none"
        _focus={{
          boxShadow: 'none',
        }}
        w={inputWidth}
      />
      <FileUpload onFileUploaded={setFile} />
      <IconButton
        ml={4}
        mr={2}
        aria-label="Send"
        icon={<FiSend />}
        onClick={handleSendMessage}
        disabled={!message.trim() && !file}
      />
    </Flex>
  );
};

export default ChatInputBox;
