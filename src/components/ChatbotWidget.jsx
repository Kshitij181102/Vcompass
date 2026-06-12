import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Bot } from 'lucide-react';
import './ChatbotWidget.css';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const chatbotBaseUrl = process.env.REACT_APP_CHATBOT_URL || 'https://vcompass-chatbot.vercel.app';

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch(`${chatbotBaseUrl}/api/health`);
        if (response.ok) setIsLoaded(true);
      } catch {
        setIsLoaded(true); // show widget for deployed chatbot even if health check fails
      }
    };
    checkServer();
  }, [chatbotBaseUrl]);

  if (!isLoaded) return null;

  return (
    <>
      {/* Trigger Button */}
      <button
        className={`vc-chatbot-btn${isOpen ? ' vc-chatbot-btn--open' : ''}`}
        onClick={() => setIsOpen(p => !p)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X size={22} color="#fff" strokeWidth={2.5} />
        ) : (
          <MessageCircle size={22} color="#fff" strokeWidth={2} />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="vc-chatbot-window">
          {/* Header */}
          <div className="vc-chatbot-header">
            <div className="vc-chatbot-header-left">
              <div className="vc-chatbot-avatar">
                <Bot size={18} color="#fff" strokeWidth={1.8} />
              </div>
              <div className="vc-chatbot-header-text">
                <span className="vc-chatbot-header-name">V-Compass Assistant</span>
                <span className="vc-chatbot-header-status">
                  <span className="vc-chatbot-status-dot" />
                  Online · Ready to help
                </span>
              </div>
            </div>
            <button className="vc-chatbot-close" onClick={() => setIsOpen(false)} aria-label="Close">
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* iframe content */}
          <div className="vc-chatbot-content">
            <iframe
              src={`${chatbotBaseUrl}/embed.html`}
              title="V-Compass Chatbot"
              allow="microphone"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
