import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Textarea,
  Button,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { Send } from 'lucide-react';

const ChatInput = ({ onSubmit, isLoading }) => {
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSubmit(message);
      setMessage('');
      setCharCount(0);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    setCharCount(e.target.value.length);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="90%" mx="auto">
      <InputGroup size="md">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          placeholder="Type your message..."
          pr="5.5rem"
          minH="60px"
          maxH="200px"
          resize="none"
          bg={bgColor}
          pt="6"
          pl="6"
          borderColor={borderColor}
          borderRadius="xl"
          _focus={{
            borderColor: 'blue.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
          }}
          aria-label="Chat Input"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <InputRightElement width="4.5rem" h="100%">
          <Button
            h="2.5rem"
            size="sm"
            type="submit"
            isLoading={isLoading}
            colorScheme="blue"
            variant="solid"
            borderRadius="full"
            mr={2}
            isDisabled={!message.trim() || isLoading} // Disable if message is empty or loading
          >
            <Send size={20} />
          </Button>
        </InputRightElement>
      </InputGroup>
      <Text fontSize="sm" color="gray.500" align="right" mt={1}>
        {charCount} characters
      </Text>
    </Box>
  );
};

export default ChatInput;
