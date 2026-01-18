import { useState, useCallback } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function useChat(endpoint: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thoughtTrace, setThoughtTrace] = useState<{ status: string; isThinking: boolean }>({ status: '', isThinking: false });

  const sendMessage = (message: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setIsLoading(true);
    setThoughtTrace({ status: 'Thinking...', isThinking: true });

    const eventSource = new EventSource(`${endpoint}?message=${encodeURIComponent(message)}`);
    let assistantContent = '';

    eventSource.onmessage = (event) => {
      const chunk = event.data;
      assistantContent += chunk;
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage?.role === 'assistant') {
          lastMessage.content = assistantContent;
        } else {
          newMessages.push({ role: 'assistant', content: assistantContent });
        }
        return newMessages;
      });
      if (chunk.includes('[END]')) {
        setIsLoading(false);
        setThoughtTrace({ status: 'Completed', isThinking: false });
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      setIsLoading(false);
      setThoughtTrace({ status: 'Error', isThinking: false });
      eventSource.close();
    };
  };

  return { messages, isLoading, thoughtTrace, sendMessage };
}
