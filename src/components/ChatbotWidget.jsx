import React, { useState, useEffect } from 'react';
import './ChatbotWidget.css';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Use your deployed chatbot URL
    const chatbotBaseUrl = process.env.REACT_APP_CHATBOT_URL || 'https://vcompass-chatbot.vercel.app';

    useEffect(() => {
        // Check if chatbot server is available
        const checkServer = async () => {
            try {
                // For deployed chatbot, use direct API endpoints
                const healthUrl = `${chatbotBaseUrl}/api/health`;
                const response = await fetch(healthUrl);
                if (response.ok) {
                    setIsLoaded(true);
                }
            } catch (error) {
                console.warn('Chatbot server not available:', error);
                // Always show widget for deployed chatbot
                setIsLoaded(true);
            }
        };

        checkServer();
    }, [chatbotBaseUrl]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    if (!isLoaded) {
        return null; // Don't show widget if server is not available
    }

    return (
        <>
            {/* Chat Button */}
            <div className="chatbot-button" onClick={toggleChat}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="white" />
                    <path d="M7 9H17V11H7V9ZM7 12H15V14H7V12Z" fill="white" />
                </svg>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>V-Compass Assistant</h3>
                        <button className="close-button" onClick={toggleChat}>×</button>
                    </div>
                    <div className="chatbot-content">
                        <iframe
                            src={`${chatbotBaseUrl}/embed.html`}
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                            title="V-Compass Chatbot"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatbotWidget;