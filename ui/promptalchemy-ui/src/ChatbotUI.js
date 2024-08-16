import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Button,
  useColorMode,
  Heading,
  Container,
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
import { DeleteIcon, SettingsIcon, ChevronRightIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import SettingsPanel from './SettingsPanel';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import useChat from './useChat';

// Custom theme with glassmorphism styles
const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        // Use linear gradient
        // bg: 'linear-gradient(45deg, #C7C8CC 0%, #ffffff 99%, #ffffff 100%)',
        // Use smooth radial gradient
        bg: 'radial-gradient(circle, #C7C8CC 0%, #ffffff 99%, #ffffff 100%)',
        backgroundAttachment: 'fixed',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'full',
        bg: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        _hover: {
          bg: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'full',
          bg: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        },
      },
    },
  },
});

// Update glassContainer to be a function that returns an object
const glassContainer = (colorMode) => ({
  bg: colorMode === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  border: colorMode === 'dark' ? '0.5px solid rgba(255, 255, 255, 0.18)' : '0.5px solid rgba(0, 0, 0, 0.18)',
});

// Motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const ChatbotUI = () => {
  const {
    messages,
    isLoading,
    isTyping,
    addMessage,
    clearChat,
    sendMessage,
  } = useChat();

  const [settings, setSettings] = useState({
    isStreaming: true,
    promptType: 'enhance_prompt',
    model: 'Model A',
    tokenCount: 512,
    temperature: 0.7,
    jsonMode: false,
    codeExecution: false,
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");
  const chatContainerRef = useRef(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  const updateSetting = useCallback((key, value) => {
    setSettings(prevSettings => ({ ...prevSettings, [key]: value }));
  }, []);

  const handleToggleColorMode = () => {
    toggleColorMode();
    toast({
      title: `${colorMode === 'light' ? 'Dark' : 'Light'} mode activated`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

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

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen(prev => !prev);
  }, []);

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

  const renderMessages = useMemo(() => (
    messages.map((message, index) => (
      <Flex key={index} justify={message.role === 'user' ? 'flex-end' : 'flex-start'}>
        {message.role === 'assistant' && (
          <Avatar size="sm" name="Assistant" src="/ai-avatar.png" mr={2} />
        )}
        <MessageBubble
          message={message}
          onThumbsUp={() => {/* Implement thumbs up logic */}}
          onThumbsDown={() => {/* Implement thumbs down logic */}}
          onCopy={() => {
            navigator.clipboard.writeText(message.content);
            toast({
              title: 'Copied',
              status: 'success',
              duration: 2000,
            });
          }}
        />
        {message.role === 'user' && (
          <Avatar size="sm" name="You" src="/user-avatar.png" ml={2} />
        )}
      </Flex>
    ))
  ), [messages, toast]);

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="100%" p={2} h="100vh">
        <MotionFlex
          h="calc(100vh - 16px)"
          sx={{
            ...glassContainer(colorMode),
            position: 'relative',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          overflow="hidden"
        >
          {/* Chat Area */}
          <MotionFlex
            layout
            direction="column"
            flex={1}
            p={5}
            h="100%"
            overflowX="hidden"
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Flex justify="space-between" align="center" p={2} borderBottomWidth={1} borderColor={colorMode === 'dark' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.18)'}>
              <Heading size="md" pl="2" color={colorMode === 'dark' ? 'white' : 'black'}>Prompt Alchemy</Heading>
              <HStack spacing={1}>
                {/* Toggle Color Mode */}
                {/* <Tooltip label={colorMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
                  <Button onClick={handleToggleColorMode} size="sm" variant="ghost">
                    {colorMode === 'light' ? <MoonIcon color="black" /> : <SunIcon color="white" />}
                  </Button>
                </Tooltip> */}
                <Tooltip label="Clear Chat">
                  <Button onClick={handleClearChat} size="sm" colorScheme="red" variant="ghost">
                    <DeleteIcon color={colorMode === 'dark' ? 'white' : 'black'} />
                  </Button>
                </Tooltip>
                {isLargerThan1280 ? (
                  <Tooltip label={isSettingsOpen ? "Hide Settings" : "Show Settings"}>
                    <MotionBox
                      as={Button}
                      onClick={toggleSettings}
                      size="sm"
                      variant="ghost"
                      animate={{ rotate: isSettingsOpen ? 0 : 180 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRightIcon color={colorMode === 'dark' ? 'white' : 'black'} />
                    </MotionBox>
                  </Tooltip>
                ) : (
                  <Tooltip label="Settings">
                    <Button onClick={() => setIsSettingsOpen(true)} size="sm" variant="ghost">
                      <SettingsIcon color={colorMode === 'dark' ? 'white' : 'black'} />
                    </Button>
                  </Tooltip>
                )}
              </HStack>
            </Flex>
  
            <Box 
              flex={1} 
              overflowY="auto" 
              ref={chatContainerRef} 
              p={2} 
              sx={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '24px',
                },
              }}
            >
              <VStack spacing={2} align="stretch" width="90%" mx="auto">
                {/* Chat Messages */}
                {renderMessages}
                {/* Typing Indicator */}
                {isTyping && settings.isStreaming && (
                  <Flex align="center" alignSelf="flex-start">
                    <Avatar size="xs" name="Assistant" src="/ai-avatar.png" mr={2} />
                    <TypingIndicator dotCount={3} dotColor={colorMode === 'dark' ? 'white' : 'black'} dotSize={6} animationSpeed={2} />
                  </Flex>
                )}
              </VStack>
            </Box>
  
            {/* Chat Input */}
            <Box p={2} borderTopWidth={0} pb="-10" borderColor={colorMode === 'dark' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.18)'}>
              <ChatInput
                onSubmit={(message) => {
                  const newMessage = { role: 'user', content: message, timestamp: new Date() };
                  addMessage(newMessage);
                  sendMessage(message, settings);
                }}
                isLoading={isLoading}
                colorMode={colorMode}
              />
            </Box>
          </MotionFlex>
  
          {/* Settings Area */}
          {isLargerThan1280 ? (
            <AnimatePresence>
              {isSettingsOpen && (
                <MotionBox
                  layout
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "300px", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  p={2}
                  borderLeftWidth={1}
                  borderColor={colorMode === 'dark' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.18)'}
                  overflowY="auto"
                  h="100%"
                  sx={glassContainer(colorMode)}
                >
                  <SettingsPanel settings={settings} updateSetting={updateSetting} colorMode={colorMode} />
                </MotionBox>
              )}
            </AnimatePresence>
          ) : (
            <Drawer
              isOpen={isSettingsOpen}
              placement="right"
              onClose={() => setIsSettingsOpen(false)}
            >
              <DrawerOverlay />
              <DrawerContent sx={glassContainer(colorMode)}>
                <DrawerCloseButton color={colorMode === 'dark' ? 'white' : 'black'} />
                <DrawerHeader color={colorMode === 'dark' ? 'white' : 'black'}>Settings</DrawerHeader>
                <DrawerBody>
                  <SettingsPanel settings={settings} updateSetting={updateSetting} colorMode={colorMode} />
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          )}
        </MotionFlex>
      </Container>
    </ChakraProvider>
  );
};

export default React.memo(ChatbotUI);