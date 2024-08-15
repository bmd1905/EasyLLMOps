import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Button,
  useColorMode,
  Heading,
  Container,
  Icon,
  Avatar,
  Tooltip,
  useToast,
  extendTheme,
  ChakraProvider,
  useMediaQuery,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import {DeleteIcon, SettingsIcon} from '@chakra-ui/icons';
import MessageBubble from './MessageBubble';
import SettingsPanel from './SettingsPanel';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';

// Custom theme
const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' 
          ? 'linear-gradient(to bottom right, #1a202c, #2d3748)'
          : 'linear-gradient(to bottom right, #e2e8f0, #edf2f7)',
        transition: 'background-color 0.2s ease-in-out',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'full',
      },
    },
    Input: {
      baseStyle: {
        borderRadius: 'full',
      },
    },
    Select: {
      baseStyle: {
        borderRadius: 'full',
      },
    },
  },
});

// Custom scrollbar styles
const customScrollbarStyles = {
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'blue.500',
    borderRadius: '24px',
  },
};

// Custom hook for chat functionality
const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = useCallback((newMessage) => {
    setMessages(prevMessages => [...prevMessages, newMessage]);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback(async (inputMessage, settings) => {
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/api/promptalchemy_conversation/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt_type: settings.promptType,
          message: inputMessage,
          history: messages.map(m => [m.role === 'user' ? m.content : '', m.role === 'assistant' ? m.content : '']),
          stream: settings.isStreaming = false,
          latest_prompt: inputMessage,
          model: settings.model,
          token_count: settings.tokenCount,
          temperature: settings.temperature,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      if (settings.isStreaming) {
        setIsTyping(false);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedResponse = '';

        addMessage({ role: 'assistant', content: '', timestamp: new Date() });

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          accumulatedResponse += chunk;

          setMessages(prevMessages => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = { role: 'assistant', content: accumulatedResponse, timestamp: new Date() };
            return updatedMessages;
          });
        }
      } else {
        const data = await response.json();
        addMessage({ role: 'assistant', content: data.response, timestamp: new Date() });
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show toast notification)
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [messages, addMessage]);

  return {
    messages,
    isLoading,
    isTyping,
    addMessage,
    clearChat,
    sendMessage,
  };
};

// Floating action button for mobile
const FloatingActionButton = ({ onOpen }) => {
  return (
    <Box position="fixed" bottom="20px" right="20px">
      <Button
        onClick={onOpen}
        borderRadius="full"
        w="60px"
        h="60px"
        bg="blue.500"
        color="white"
        _hover={{ bg: 'blue.600' }}
      >
        <Icon as={SettingsIcon} />
      </Button>
    </Box>
  );
};

// Main ChatbotUI component
const ChatbotUI = () => {
  const {
    messages,
    isLoading,
    isTyping,
    addMessage,
    clearChat,
    sendMessage,
  } = useChat();

  const [inputMessage, setInputMessage] = useState('');
  const [settings, setSettings] = useState({
    isStreaming: false,
    promptType: 'enhance_prompt',
    model: 'Model A',
    tokenCount: 512,
    temperature: 0.7,
    jsonMode: false,
    codeExecution: false,
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");
  const chatContainerRef = useRef(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const textareaRef = useRef(null);

  const updateSetting = useCallback((key, value) => {
    setSettings(prevSettings => ({ ...prevSettings, [key]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const newMessage = { role: 'user', content: inputMessage, timestamp: new Date() };
    addMessage(newMessage);
    sendMessage(inputMessage, settings);
    setInputMessage('');
  }, [inputMessage, isLoading, addMessage, sendMessage, settings]);

  const handleClearChat = useCallback(() => {
    clearChat();
    toast({
      title: 'Chat Cleared',
      description: 'The chat history has been cleared.',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  }, [clearChat, toast]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const systemColorScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (systemColorScheme.matches && colorMode === 'light') {
      toggleColorMode();
    }
  }, [colorMode, toggleColorMode]);

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.xl" p={0}>
        <Flex h="100vh" bgGradient={colorMode === 'dark' ? 'linear-gradient(to bottom right, #1a202c, #2d3748)' : 'linear-gradient(to bottom right, #e2e8f0, #edf2f7)'}>
          {/* Chat Area */}
          <Flex direction="column" flex={1} h="100%" overflowX="hidden">
            <Flex justify="space-between" align="center" p={4} borderBottomWidth={1} bgGradient={colorMode === 'dark' ? 'linear-gradient(to bottom right, #1a202c, #2d3748)' : 'linear-gradient(to bottom right, #e2e8f0, #edf2f7)'}>
              <Heading size="lg" color="blue.500">Prompt Alchemy</Heading>
              <HStack>
                <Tooltip label="Clear Chat">
                  <Button onClick={handleClearChat} size="sm" colorScheme="red" variant="ghost">
                    <DeleteIcon />
                  </Button>
                </Tooltip>
                {!isLargerThan1280 && (
                  <Tooltip label="Settings">
                    <Button onClick={() => setIsSettingsOpen(true)} size="sm" variant="ghost">
                      <SettingsIcon />
                    </Button>
                  </Tooltip>
                )}
              </HStack>
            </Flex>
  
            <Box flex={1} overflowY="auto" ref={chatContainerRef} p={4} sx={customScrollbarStyles}>
              <VStack spacing={4} align="stretch">
                {messages.map((message, index) => (
                  <Flex key={index} justify={message.role === 'user' ? 'flex-end' : 'flex-start'}>
                    {message.role === 'assistant' && (
                      <Avatar size="sm" name="AI" src="/ai-avatar.png" mr={2} />
                    )}
                    <MessageBubble
                      message={message}
                      onThumbsUp={() => {/* Implement thumbs up logic */}}
                      onThumbsDown={() => {/* Implement thumbs down logic */}}
                      onCopy={() => {
                        navigator.clipboard.writeText(message.content);
                        toast({
                          title: 'Copied to clipboard',
                          status: 'success',
                          duration: 2000,
                        });
                      }}
                    />
                    {message.role === 'user' && (
                      <Avatar size="sm" name="You" src="/user-avatar.png" ml={2} />
                    )}
                  </Flex>
                ))}
                {isTyping && !settings.isStreaming && (
                  <Flex align="center" alignSelf="flex-start">
                    <Avatar size="sm" name="AI" src="/ai-avatar.png" mr={2} />
                    <TypingIndicator />
                  </Flex>
                )}
              </VStack>
            </Box>
  
            <Box p={4} borderTopWidth={1} bgGradient={colorMode === 'dark' ? 'linear-gradient(to bottom right, #1a202c, #2d3748)' : 'linear-gradient(to bottom right, #e2e8f0, #edf2f7)'}>
              <ChatInput
                onSubmit={(message) => {
                  const newMessage = { role: 'user', content: message, timestamp: new Date() };
                  addMessage(newMessage);
                  sendMessage(message, settings);
                }}
                isLoading={isLoading}
              />
            </Box>
          </Flex>
  
          {/* Settings Area */}
          {isLargerThan1280 ? (
            <Box
              width="250px"
              bgGradient={colorMode === 'dark' ? 'linear-gradient(to bottom right, #1a202c, #2d3748)' : 'linear-gradient(to bottom right, #e2e8f0, #edf2f7)'}
              p={4}
              borderLeftWidth={1}
              overflowY="auto"
            >
              <Heading size="md" mb={4}>Settings</Heading>
              <SettingsPanel settings={settings} updateSetting={updateSetting} />
            </Box>
          ) : (
            <>
              <Drawer
                isOpen={isSettingsOpen}
                placement="right"
                onClose={() => setIsSettingsOpen(false)}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>Settings</DrawerHeader>
                  <DrawerBody>
                    <SettingsPanel settings={settings} updateSetting={updateSetting} />
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
              <FloatingActionButton onOpen={() => setIsSettingsOpen(true)} />
            </>
          )}
        </Flex>
      </Container>
    </ChakraProvider>
  );
}

export default ChatbotUI;