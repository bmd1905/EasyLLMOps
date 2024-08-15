import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import ChatbotUI from './ChatbotUI';

const App = () => {
  return (
    <ChakraProvider>
      <ChatbotUI />
    </ChakraProvider>
  );
};

export default App;