import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatbotUI from './ChatbotUI';
import LandingPage from './LandingPage';

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatbotUI />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
