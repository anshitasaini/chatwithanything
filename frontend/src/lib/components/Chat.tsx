import React, { useState, useEffect, useRef } from 'react';
import { Box, Input, IconButton, Flex } from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';

// Simulated AI bot responses
const botResponses = [
  "Hello! How can I assist you today?",
  "What seems to be the problem?",
  "I'm sorry, I don't have the information you're looking for.",
  "How can I help you?",
  "Please provide more details.",
];

const ChatBot: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<{ message: string; isUser: boolean }[]>(
    []
  );
  const [userMessage, setUserMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // TODO: Replace with API call
  const getBotResponse = () => {
    const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
    return randomResponse;
  };

  const handleUserMessage = () => {
    if (userMessage.trim() === '') return;

    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { message: userMessage, isUser: true },
    ]);
    setUserMessage('');

    // Simulate a delay before getting the bot's response
    setTimeout(() => {
      const botResponse = getBotResponse();
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { message: botResponse, isUser: false },
      ]);
    }, 1000);
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

  useEffect(() => {
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { message: getBotResponse(), isUser: false },
    ]);
  }, []);

  return (
    <Box maxW="400px" mx="auto">
      <Box
        p={4}
        border="1px solid gray"
        borderRadius="md"
        h="50vh"
        overflowY="auto"
        mb={4}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
      >
        {chatHistory.map((entry, index) => (
          <Box
            key={index}
            backgroundColor={entry.isUser ? '#0d6efd' : '#f0f0f0'}
            color={entry.isUser ? '#fff' : '#000'}
            padding={4}
            borderRadius={entry.isUser ? '8px 8px 0 8px' : '8px 8px 8px 0'}
            marginBottom={2}
            alignSelf={entry.isUser ? 'flex-end' : 'flex-start'}
            maxWidth="70%"
          >
            {entry.message}
          </Box>
        ))}
        <div ref={chatEndRef}></div>
      </Box>
      <Flex alignItems="center" justifyContent="center">
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
    </Box>
  );
};

export default ChatBot;
