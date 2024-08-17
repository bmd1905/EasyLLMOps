import React from 'react';
import { Box, Text, keyframes, useColorModeValue } from '@chakra-ui/react';

// Customizable pulse animation keyframes
const pulseKeyframes = keyframes`
  0% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.5; }
`;

const TypingIndicator = ({ dotCount = 3, dotColor, dotSize = 6, animationSpeed = 1.5, ...props }) => {
  // Use color mode value or custom dot color
  const finalDotColor = dotColor;

  // Calculate animation delay for each dot
  const animationDelay = (index) => `${index * (animationSpeed / dotCount)}s`;

  // Dynamic pulse animation based on speed
  const pulseAnimation = `${pulseKeyframes} ${animationSpeed}s infinite`;

  return (
    <Box
      display="flex"
      alignItems="center"
      bg={useColorModeValue('gray.100', 'gray.700')}
      borderRadius="full"
      px={3}
      py={2}
      maxWidth="300px"
      {...props} // Allow passing custom props to the container
    >
      <Text fontSize="sm" fontWeight="medium" mr={2}>
        Generating response
      </Text>
      <Box display="flex" alignItems="center">
        {Array.from({ length: dotCount }).map((_, index) => (
          <Box
            key={index}
            width={`${dotSize}px`}
            height={`${dotSize}px`}
            borderRadius="full"
            bg={finalDotColor}
            mx="1px"
            animation={pulseAnimation}
            animationDelay={animationDelay(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TypingIndicator;
