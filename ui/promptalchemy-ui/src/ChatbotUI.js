import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Switch,
  useColorMode,
  Heading,
  Container,
  Icon,
  Avatar,
  Tooltip,
  useToast,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { ChatIcon, DeleteIcon } from '@chakra-ui/icons';
import { FaThumbsUp, FaThumbsDown, FaMoon, FaSun } from 'react-icons/fa';
import { BiCopy } from 'react-icons/bi';

const ChatbotUI = () => {
  // State declarations
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [promptType, setPromptType] = useState('enhance_prompt');
  const [isStreaming, setIsStreaming] = useState(false);
  const [model, setModel] = useState('Model A');
  const [tokenCount, setTokenCount] = useState(512);
  const [temperature, setTemperature] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Refs and hooks
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  // Color mode values
  const bgColor = colorMode === 'dark' ? 'gray.800' : 'gray.50';
  const chatBgColor = colorMode === 'dark' ? 'gray.700' : 'white';
  const textColor = colorMode === 'dark' ? 'gray.100' : 'gray.800';
  const primaryColor = 'blue.500';

  useEffect(() => {
    const systemColorScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (systemColorScheme.matches && colorMode === 'light') {
      toggleColorMode();
    }
  }, [colorMode, toggleColorMode]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const newMessage = { role: 'user', content: inputMessage, timestamp: new Date() };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/api/promptalchemy_conversation/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt_type: promptType,
          message: inputMessage,
          history: messages.map(m => [m.role === 'user' ? m.content : '', m.role === 'assistant' ? m.content : '']),
          stream: isStreaming,
          latest_prompt: inputMessage,
          model: model,
          token_count: tokenCount,
          temperature: temperature,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      if (isStreaming) {
        setIsTyping(false);  // Remove typing indicator in streaming mode
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedResponse = '';

        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: '', timestamp: new Date() }]);

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
        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.response, timestamp: new Date() }]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [inputMessage, isLoading, messages, promptType, isStreaming, model, tokenCount, temperature, toast]);

  const clearChat = useCallback(() => {
    setMessages([]);
    toast({
      title: 'Chat Cleared',
      description: 'The chat history has been cleared.',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  }, [toast]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const MessageContent = ({ content }) => (
    <Box overflowX="auto" width="100%">
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => <Text mb={2} {...props} />,
          ul: ({ node, ...props }) => <Box as="ul" pl={4} mb={2} {...props} />,
          ol: ({ node, ...props }) => <Box as="ol" pl={4} mb={2} {...props} />,
          li: ({ node, ...props }) => <Box as="li" mb={1} {...props} />,
          pre: ({ node, ...props }) => (
            <Box
              as="pre"
              p={2}
              borderRadius="md"
              bg="gray.100"
              overflowX="auto"
              fontSize="sm"
              mb={2}
              {...props}
            />
          ),
          code: ({ node, inline, ...props }) =>
            inline ? (
              <Box as="code" bg="gray.100" p={1} borderRadius="sm" {...props} />
            ) : (
              <Box as="code" display="block" whiteSpace="pre-wrap" {...props} />
            ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );

  return (
    <Container maxW="container.xl" p={0}>
      <Flex h="100vh">
        {/* Chat Area */}
        <Flex direction="column" flex={1} h="100%" overflowX="hidden">
          <Flex justify="space-between" align="center" p={4} borderBottomWidth={1}>
            <Heading size="lg" color={primaryColor}>Prompt Alchemy</Heading>
            <HStack>
              <Tooltip label={`Switch to ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}>
                <Button onClick={toggleColorMode} size="sm">
                  <Icon as={colorMode === 'light' ? FaMoon : FaSun} />
                </Button>
              </Tooltip>
              <Tooltip label="Clear Chat">
                <Button onClick={clearChat} size="sm" colorScheme="red" variant="ghost">
                  <DeleteIcon />
                </Button>
              </Tooltip>
            </HStack>
          </Flex>
  
          <Box flex={1} overflowY="auto" ref={chatContainerRef} p={4}>
            <VStack spacing={4} align="stretch">
              {messages.map((message, index) => (
                <Box key={index} alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}>
                  <Flex align="start" justify={message.role === 'user' ? 'flex-end' : 'flex-start'}>
                    {message.role === 'assistant' && (
                      <Avatar size="sm" name="AI" src="/ai-avatar.png" mr={2} />
                    )}
                    <Box
                      maxW="70%"
                      bg={chatBgColor}
                      color={textColor}
                      p={3}
                      borderRadius="lg"
                      borderWidth={1}
                    >
                      <Text fontSize="sm" fontWeight="bold" mb={1}>
                        {message.role === 'user' ? 'You' : 'AI'}
                      </Text>
                      <MessageContent content={message.content} />
                    </Box>
                    {message.role === 'user' && (
                      <Avatar size="sm" name="You" src="/user-avatar.png" ml={2} />
                    )}
                  </Flex>
                  <HStack spacing={2} mt={2} justify={message.role === 'user' ? 'flex-end' : 'flex-start'}>
                    <Tooltip label="Thumbs Up">
                      <Button size="sm" variant="ghost">
                        <Icon as={FaThumbsUp} />
                      </Button>
                    </Tooltip>
                    <Tooltip label="Thumbs Down">
                      <Button size="sm" variant="ghost">
                        <Icon as={FaThumbsDown} />
                      </Button>
                    </Tooltip>
                    <Tooltip label="Copy">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(message.content);
                          toast({
                            title: 'Copied to clipboard',
                            status: 'success',
                            duration: 2000,
                          });
                        }}
                      >
                        <Icon as={BiCopy} />
                      </Button>
                    </Tooltip>
                  </HStack>
                </Box>
              ))}
              {isTyping && !isStreaming && (
                <Flex align="center" alignSelf="flex-start">
                  <Avatar size="sm" name="AI" src="/ai-avatar.png" mr={2} />
                  <Text fontSize="sm" color="gray.500">AI is thinking...</Text>
                </Flex>
              )}
            </VStack>
          </Box>
  
          <Box p={4} borderTopWidth={1} bg={bgColor}>
            <form onSubmit={handleSubmit}>
              <InputGroup>
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  bg={colorMode === 'dark' ? 'gray.700' : 'white'}
                  borderColor="gray.600"
                  _focus={{ borderColor: primaryColor, boxShadow: `0 0 0 1px ${primaryColor}` }}
                />
                <InputRightElement>
                  <Button type="submit" colorScheme="blue" isLoading={isLoading}>
                    <ChatIcon />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </form>
          </Box>
        </Flex>
  
        {/* Settings Area */}
        <Box
          width="250px"
          bg={chatBgColor}
          p={4}
          borderLeftWidth={1}
          overflowY="auto"
          position="fixed"
          right={0}
          top={0}
          bottom={0}
        >
          <Heading size="md" mb={4}>Settings</Heading>
          <VStack spacing={6} align="stretch">
            <Box>
              <Text fontWeight="bold" mb={2}>Enable Streaming</Text>
              <Switch
                isChecked={isStreaming}
                onChange={(e) => setIsStreaming(e.target.checked)}
                colorScheme="blue"
              />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>Prompt Type</Text>
              <Select
                value={promptType}
                onChange={(e) => setPromptType(e.target.value)}
                bg={chatBgColor}
              >
                <option value="enhance_prompt">Enhance Prompt</option>
                <option value="few_shot_prompt">Few Shot Prompt</option>
                <option value="chain_of_thought_prompt">Chain of Thought Prompt</option>
                <option value="structure_output_prompt">Structure Output Prompt</option>
              </Select>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>Model</Text>
              <Select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                bg={chatBgColor}
              >
                <option value="Model A">Model A</option>
                <option value="Model B">Model B</option>
              </Select>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>Token Count: {tokenCount}</Text>
              <Slider
                min={0}
                max={1024}
                step={1}
                value={tokenCount}
                onChange={(v) => setTokenCount(v)}
                colorScheme="blue"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>Temperature: {temperature.toFixed(1)}</Text>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={temperature}
                onChange={(v) => setTemperature(v)}
                colorScheme="blue"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

export default ChatbotUI;