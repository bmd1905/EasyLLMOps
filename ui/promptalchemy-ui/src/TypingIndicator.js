import React from 'react';
import { Box, Text, keyframes, useColorModeValue } from '@chakra-ui/react';

const pulseKeyframes = keyframes`
  0% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.5; }
`;

const TypingIndicator = ({ dotCount = 3, ...props }) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const dotColor = useColorModeValue('--dot-color-light', '--dot-color-dark');

  const pulseAnimation = `${pulseKeyframes} 1.5s infinite`;

  return (
    <Box
      display="flex"
      alignItems="center"
      bg={bgColor}
      borderRadius="full"
      px={3}
      py={2}
      maxWidth="300px"
    >
      <Text fontSize="sm" fontWeight="medium" mr={2}>
          Generating response...
      </Text>
      <Box display="flex" alignItems="center">
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            width="6px"
            height="6px"
            borderRadius="full"
            bg={dotColor}
            mx="1px"
            animation={pulseAnimation}
            animationDelay={`${i * 0.15}s`}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TypingIndicator;