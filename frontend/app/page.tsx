'use client';
import { useState, useRef, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import ThoughtTrace from './components/ThoughtTrace';

export default function Home() {
  const { messages, sendMessage, thoughtTrace, isLoading } = useChat('http://localhost:8000/chat');
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || thoughtTrace.isThinking) return;
    sendMessage(input);
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="container">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, backgroundImage: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
          Research Agent
        </h1>
        <p style={{ color: '#94a3b8' }}>Coding Challenge</p>
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingBottom: '2rem' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}>
            {msg.content}
          </div>
        ))}

        {isLoading && (
          <div style={{ color: '#94a3b8', fontStyle: 'italic', paddingLeft: '1rem' }}>
            Agent is thinking... (This can take a while)
          </div>
        )}

        {/* TASK: Render the ThoughtTrace component here when active */}
        <ThoughtTrace status={thoughtTrace.status} isThinking={thoughtTrace.isThinking} />。

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ position: 'sticky', bottom: 0, background: 'var(--background)', padding: '1rem 0' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me a question..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </form>
    </main>
  );
}
