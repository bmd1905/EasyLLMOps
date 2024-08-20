import { useCallback, useState } from 'react';

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
      const response = await fetch('http://localhost:30000/api/promptalchemy_conversation/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt_type: settings.promptType,
          message: inputMessage,
          history: messages.map(m => [m.role === 'user' ? m.content : '', m.role === 'assistant' ? m.content : '']),
          stream: settings.isStreaming = true,
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

export default useChat;
