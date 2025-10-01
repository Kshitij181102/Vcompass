import { useEffect } from 'react';
import { initChatbotHealthCheck } from './ChatbotHealth';

const Chatbot = () => {
    useEffect(() => {
        // Load the V-Compass chatbot widget
        if (window.__vcompass_widget_loaded) return;

        // Set the chatbot server origin
        // For production, use a deployed chatbot server URL
        // For development, use localhost:3001
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

        // You need to deploy your chatbot server separately and update this URL
        window.VCOMPASS_ORIGIN = isProduction
            ? 'https://your-chatbot-server.onrender.com' // Replace with your deployed chatbot URL
            : 'http://localhost:3001';
        window.VCOMPASS_ICON_URL = 'logo.png'// Use your app's logo

        // Initialize health check
        initChatbotHealthCheck();

        // Create and load the widget script
        const script = document.createElement('script');
        script.src = `${window.VCOMPASS_ORIGIN}/widget.js`;
        script.async = true;
        script.onload = () => {
            console.log('✅ V-Compass chatbot widget loaded successfully');
        };
        script.onerror = () => {
            console.error('❌ Failed to load V-Compass chatbot widget. Make sure the chatbot server is running on', window.VCOMPASS_ORIGIN);
            // Create a fallback widget when the server is not available
            createFallbackWidget();
        };

        document.body.appendChild(script);

        // Function to create a self-contained chatbot widget
        function createFallbackWidget() {
            let isOpen = false;

            // Create chatbot button
            const button = document.createElement('button');
            button.innerHTML = '💬';
            button.setAttribute('aria-label', 'Open V-Compass chatbot');
            button.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 999999;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // Create chat window
            const chatWindow = document.createElement('div');
            chatWindow.style.cssText = `
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                z-index: 999998;
                display: none;
                flex-direction: column;
                overflow: hidden;
            `;

            chatWindow.innerHTML = `
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; font-weight: 600;">
                    V-Compass Assistant
                    <button id="closeChat" style="float: right; background: none; border: none; color: white; font-size: 18px; cursor: pointer;">✕</button>
                </div>
                <div id="messages" style="flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
                    <div style="background: #f1f3f4; padding: 10px 14px; border-radius: 18px; font-size: 14px; max-width: 80%; align-self: flex-start;">
                        Hello! I'm V-Compass assistant. Ask me about professor offices, campus locations, or placement queries.
                    </div>
                </div>
                <div style="padding: 16px; border-top: 1px solid #e0e0e0; display: flex; gap: 8px;">
                    <input id="chatInput" type="text" placeholder="Ask about professor offices..." style="flex: 1; padding: 10px 12px; border: 1px solid #ddd; border-radius: 20px; outline: none; font-size: 14px;" />
                    <button id="sendBtn" style="padding: 10px 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 20px; cursor: pointer; font-size: 14px;">Send</button>
                </div>
            `;

            button.addEventListener('click', () => {
                if (isOpen) {
                    chatWindow.style.display = 'none';
                    button.innerHTML = '💬';
                } else {
                    chatWindow.style.display = 'flex';
                    button.innerHTML = '✕';
                }
                isOpen = !isOpen;
            });

            // Add chat functionality
            setTimeout(() => {
                const closeBtn = chatWindow.querySelector('#closeChat');
                const input = chatWindow.querySelector('#chatInput');
                const sendBtn = chatWindow.querySelector('#sendBtn');
                const messages = chatWindow.querySelector('#messages');

                closeBtn?.addEventListener('click', () => {
                    chatWindow.style.display = 'none';
                    button.innerHTML = '💬';
                    isOpen = false;
                });

                function addMessage(text, isUser = false) {
                    const messageDiv = document.createElement('div');
                    messageDiv.style.cssText = `
                        background: ${isUser ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f1f3f4'};
                        color: ${isUser ? 'white' : '#333'};
                        padding: 10px 14px;
                        border-radius: 18px;
                        font-size: 14px;
                        max-width: 80%;
                        align-self: ${isUser ? 'flex-end' : 'flex-start'};
                        word-wrap: break-word;
                    `;
                    messageDiv.textContent = text;
                    messages.appendChild(messageDiv);
                    messages.scrollTop = messages.scrollHeight;
                }

                function handleQuery(query) {
                    const lowerQuery = query.toLowerCase();

                    // Professor queries
                    if (lowerQuery.includes('deepasikha') || lowerQuery.includes('mishra')) {
                        return "Deepasikha Mishra's office is in AB-1, Room 326-G.";
                    }
                    if (lowerQuery.includes('hari seetha') || lowerQuery.includes('seetha')) {
                        return "Hari Seetha's office is in CB, Room 222.";
                    }
                    if (lowerQuery.includes('ganesh') || lowerQuery.includes('karri')) {
                        return "Ganesh Reddy Karri's office is in CB, Room 221.";
                    }
                    if (lowerQuery.includes('mahesh')) {
                        return "Mahesh's office is in CB, Room 607-A.";
                    }
                    if (lowerQuery.includes('vikash') || lowerQuery.includes('singh')) {
                        return "Vikash Kumar Singh's office is in AB-1, Room G36.";
                    }
                    if (lowerQuery.includes('rahul') || lowerQuery.includes('katarya')) {
                        return "Rahul Katarya's office is in CB, Room 201-E.";
                    }
                    if (lowerQuery.includes('library')) {
                        return "The Library is in AB1, 2nd floor.";
                    }
                    if (lowerQuery.includes('cdc') && lowerQuery.includes('office')) {
                        return "The CDC Office is in CB, Room 312.";
                    }
                    if (lowerQuery.includes('placement') || lowerQuery.includes('training')) {
                        return "For placement queries, write to patqueries.ap@vitap.ac.in. For training queries, write to training.cdc@vitap.ac.in";
                    }

                    return "I'm sorry, I don't have information about that. Try asking about professor offices, campus locations, or placement queries.";
                }

                function sendMessage() {
                    const text = input.value.trim();
                    if (!text) return;

                    addMessage(text, true);
                    input.value = '';

                    setTimeout(() => {
                        const response = handleQuery(text);
                        addMessage(response, false);
                    }, 500);
                }

                sendBtn?.addEventListener('click', sendMessage);
                input?.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                });
            }, 100);

            document.body.appendChild(button);
            document.body.appendChild(chatWindow);
            console.log('📱 Self-contained chatbot widget created');
        }

        return () => {
            // Cleanup: remove widget elements if they exist
            const widget = document.querySelector('[aria-label="Open V-Compass chatbot"]');
            const frame = document.querySelector('iframe[title="V-Compass Chat"]');
            if (widget) widget.remove();
            if (frame && frame.parentElement) frame.parentElement.remove();

            // Remove script
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }

            // Reset the loaded flag
            window.__vcompass_widget_loaded = false;
        };
    }, []);

    // Return null since the widget injects itself into the DOM
    return null;
};

export default Chatbot;
