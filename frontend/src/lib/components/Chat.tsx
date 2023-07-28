import React, { useState, useEffect, useRef } from 'react';
import { Box, Input, IconButton, Flex } from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';
import { ChatMessageSchema, ChatService } from '~/client';
import { Spinner } from '@chakra-ui/react';


// Simulated AI bot responses
const botResponses = [
  "Hello! How can I assist you today?",
  "What seems to be the problem?",
  "I'm sorry, I don't have the information you're looking for.",
  "How can I help you?",
  "Please provide more details.",
];

interface Props {
  sourceId: string | undefined;
  setCodeUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const ChatBot: React.FC<Props> = ({ sourceId, setCodeUrl }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessageSchema[]>([{message: 'Ask me any questions about this repository!', sender: 'ai'}]);
  const [userMessage, setUserMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // if (!sourceId) {
  //   return (
  //   <Flex justifyContent="center" alignItems="center" height="83vh">
  //       <Spinner size="xl" />
  //   </Flex>
  //   )
  // }
  
  const handleUserMessage = async () => {
    if (userMessage.trim() === '') return;

    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      {message: userMessage, sender: 'user'},
    ]);
    
    const {answer, source_content, source_metadata} = await ChatService.sendChatMessage(
      { 
        query: userMessage,
        chat_session: {
            chat_id: "",
            source_id : sourceId,
            type: ""
        }, 
        history: chatHistory
      }
    )
    setCodeUrl(source_metadata["file_request_url"])

    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      {message: answer, sender: 'ai'},
    ]);
 
    setUserMessage('');
  };

  // Allow pressing enter to send message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUserMessage();
    }
  };

  // Autoscroll to the bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  return (
    <Flex
      flex="1"
      border="1px solid gray"
      borderRadius="md"
      overflowY="auto"
      mb={4}
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      height="100vh"
      top="0"
      position="fixed" 
    >
      <Box
        p={8}
        flex="1"
        borderRadius="md"
        overflowY="auto"
        mb={4}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        height="83vh"
        bottom="7vh"
        position="fixed"
      >
        {chatHistory.map((entry, index) => {
          const {message, sender}  = entry
          const isUser = sender == 'user'
          return (
            <Box
              key={index}
              backgroundColor={isUser ? '#0d6efd' : '#f0f0f0'}
              color={isUser ? '#fff' : '#000'}
              padding={4}
              borderRadius={isUser ? '8px 8px 0 8px' : '8px 8px 8px 0'}
              marginBottom={index === chatHistory.length - 1 ? 0 : 2}
              alignSelf={isUser ? 'flex-end' : 'flex-start'}
              maxWidth="70%"
              boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)" // Add shadow to the chat boxes
            >
              {entry.message}
            </Box>
        )})}
        <div ref={chatEndRef}></div>
      </Box>
      <Flex 
        alignItems="center" 
        justifyContent="center" 
        position="fixed" 
        bottom="1vh" 
        width="29%" 
        ml={8}
      >
        <Input
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          flex="1"
          mb={2}
        />
        <IconButton
          aria-label="Send"
          icon={<FiSend />}
          onClick={handleUserMessage}
          ml={2}
          mb={2}
        />
      </Flex>
    </Flex>
  );
};

export default ChatBot;
