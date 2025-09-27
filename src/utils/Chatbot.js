import { useEffect } from 'react';
import { initChatbotHealthCheck } from './ChatbotHealth';

const Chatbot = () => {
    useEffect(() => {
        // Load the V-Compass chatbot widget
        if (window.__vcompass_widget_loaded) return;
        
        // Set the chatbot server origin
        window.VCOMPASS_ORIGIN = process.env.REACT_APP_CHATBOT_URL || 'http://localhost:3001';
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
        };
        
        document.body.appendChild(script);

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
