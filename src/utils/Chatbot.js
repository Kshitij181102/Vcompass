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

        // Function to create a fallback widget
        function createFallbackWidget() {
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

            button.addEventListener('click', () => {
                alert('Chatbot server is currently unavailable. Please try again later or contact support.');
            });

            document.body.appendChild(button);
            console.log('📱 Fallback chatbot widget created - server unavailable');
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
