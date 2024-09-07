import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  Link,
  Image,
  Flex,
} from '@chakra-ui/react';
import { FaThumbsUp, FaThumbsDown, FaRegCopy, FaCheck } from 'react-icons/fa';

const MessageBubble = ({ message, onThumbsUp, onThumbsDown }) => {
  const { colorMode } = useColorMode();
  const bgGradient = colorMode === 'dark'
    ? 'linear(circle, #C7C8CC 0%, #ffffff 99%, #ffffff 100%)'
    : 'linear(circle, #C7C8CC 0%, #ffffff 99%, #ffffff 100%)';
  const textColor = colorMode === 'dark' ? 'gray.100' : 'gray.800';
  const { hasCopied, onCopy: onClipboardCopy } = useClipboard(message.content);

  const CodeBlock = ({ language, value }) => {
    const [copied, setCopied] = useState(false);
    const { onCopy } = useClipboard(value);

    const handleCopy = () => {
      onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <Box position="relative" my={4}>
        <Flex
          position="absolute"
          top={2}
          right={2}
          alignItems="center"
          zIndex={1}
        >
          <Text fontSize="xs" mr={2} color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}>
            {language}
          </Text>
          <Tooltip label={copied ? 'Copied!' : 'Copy'}>
            <Button
              size="sm"
              onClick={handleCopy}
              bg={colorMode === 'dark' ? 'gray.600' : 'gray.100'}
              _hover={{ bg: colorMode === 'dark' ? 'gray.500' : 'gray.200' }}
            >
              <Icon as={copied ? FaCheck : FaRegCopy} />
            </Button>
          </Tooltip>
        </Flex>
        <SyntaxHighlighter
          language={language}
          style={tomorrow}
          customStyle={{
            borderRadius: '0.5rem',
            padding: '2.5rem 1rem 1rem 1rem',
          }}
        >
          {value}
        </SyntaxHighlighter>
      </Box>
    );
  };

  return (
    <Box
      maxW="70%"
      bgGradient={bgGradient}
      color={textColor}
      p={6}
      borderRadius="2xl"
      boxShadow="xl"
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
        remarkPlugins={[remarkGfm]}
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
              <CodeBlock
                language={match[1]}
                value={String(children).replace(/\n$/, '')}
                {...props}
              />
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
          a: ({ node, ...props }) => (
            <Link href={props.href} target="_blank" rel="noopener noreferrer" color="blue.500">
              {props.children}
            </Link>
          ),
          img: ({ node, ...props }) => (
            <Image src={props.src} alt={props.alt} maxW="100%" my={2} />
          ),
          table: ({ node, ...props }) => (
            <Box as="table" borderCollapse="collapse" my={2} {...props} />
          ),
          th: ({ node, ...props }) => (
            <Text as="th" bg="gray.100" p={2} fontWeight="bold" {...props} />
          ),
          td: ({ node, ...props }) => (
            <Text as="td" p={2} border="1px solid gray.200" {...props} />
          ),
        }}
      >
        {message.content}
      </ReactMarkdown>

      <HStack spacing={2} mt={4} justifyContent="flex-end">
        {message.role !== 'user' && (
          <>
            <Tooltip label="Thumbs Up">
              <Button size="sm" variant="ghost" onClick={onThumbsUp}>
                <Icon as={FaThumbsUp} opacity={0.7} /> {/* Added opacity */}
              </Button>
            </Tooltip>
            <Tooltip label="Thumbs Down">
              <Button size="sm" variant="ghost" onClick={onThumbsDown}>
                <Icon as={FaThumbsDown} opacity={0.7} /> {/* Added opacity */}
              </Button>
            </Tooltip>
          </>
        )}
        <Tooltip label={hasCopied ? 'Copied!' : 'Copy'}>
          <Button size="sm" variant="ghost" onClick={onClipboardCopy}>
            <Icon as={FaRegCopy} opacity={0.7} /> {/* Added opacity */}
          </Button>
        </Tooltip>
      </HStack>
    </Box>
  );
};

export default MessageBubble;
