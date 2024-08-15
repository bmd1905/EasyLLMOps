import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Box,
  Text,
  HStack,
  Button,
  Icon,
  Tooltip,
  useColorMode,
  useClipboard,
} from '@chakra-ui/react';
import { FaThumbsUp, FaThumbsDown, FaRegCopy } from 'react-icons/fa';

const MessageBubble = ({ message, onThumbsUp, onThumbsDown, onCopy }) => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'dark' ? 'gray.700' : 'white';
  const textColor = colorMode === 'dark' ? 'gray.100' : 'gray.800';
  const { hasCopied, onCopy: onClipboardCopy } = useClipboard(message.content);

  return (
    <Box
      maxW="70%"
      bg={bgColor}
      color={textColor}
      p={4}
      borderRadius="2xl"
      boxShadow="md"
      mb={4}
      animation={`fadeIn 0.3s ease-out`}
      sx={{
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Text fontSize="sm" fontWeight="bold" mb={2}>
        {message.role === 'user' ? 'You' : 'AI'}
      </Text>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <Text as="h1" fontSize="2xl" fontWeight="bold" mt={4} mb={2} {...props} />
          ),
          h2: ({ node, ...props }) => (
            <Text as="h2" fontSize="xl" fontWeight="bold" mt={3} mb={2} {...props} />
          ),
          h3: ({ node, ...props }) => (
            <Text as="h3" fontSize="lg" fontWeight="bold" mt={2} mb={1} {...props} />
          ),
          p: ({ node, ...props }) => <Text mb={2} {...props} />,
          ul: ({ node, ...props }) => <Box as="ul" pl={4} mb={2} {...props} />,
          ol: ({ node, ...props }) => <Box as="ol" pl={4} mb={2} {...props} />,
          li: ({ node, ...props }) => <Box as="li" mb={1} {...props} />,
          blockquote: ({ node, ...props }) => (
            <Box
              borderLeftWidth={4}
              borderLeftColor="gray.300"
              pl={4}
              py={2}
              my={2}
              fontStyle="italic"
              {...props}
            />
          ),
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <Box my={4}>
                <SyntaxHighlighter
                  language={match[1]}
                  style={tomorrow}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </Box>
            ) : (
              <Text
                as="code"
                px={1}
                bg={colorMode === 'dark' ? 'gray.600' : 'gray.100'}
                borderRadius="sm"
                {...props}
              >
                {children}
              </Text>
            );
          },
        }}
      >
        {message.content}
      </ReactMarkdown>
      {/* Conditionally render like/dislike and copy buttons */}
      <HStack spacing={2} mt={4} justifyContent="flex-end">
        {message.role !== 'user' && (
          <>
            <Tooltip label="Thumbs Up">
              <Button size="sm" variant="ghost" onClick={onThumbsUp}>
                <Icon as={FaThumbsUp} />
              </Button>
            </Tooltip>
            <Tooltip label="Thumbs Down">
              <Button size="sm" variant="ghost" onClick={onThumbsDown}>
                <Icon as={FaThumbsDown} />
              </Button>
            </Tooltip>
          </>
        )}
        <Tooltip label={hasCopied ? 'Copied!' : 'Copy'}>
          <Button size="sm" variant="ghost" onClick={onClipboardCopy}>
            <Icon as={FaRegCopy} />
          </Button>
        </Tooltip>
      </HStack>
    </Box>
  );
};

export default MessageBubble;