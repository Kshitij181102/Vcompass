import React, { useEffect } from 'react';

const Chatbot = () => {
    // Load Dialogflow Messenger script once
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div>
            {/* Dialogflow Messenger always visible */}
            <df-messenger
                intent="WELCOME"
                chat-title="V-Guide"
                agent-id="84b3c3f1-9005-4363-85d0-662e09cb9e84"
                language-code="en"
                style={{
                    position: 'fixed',
                    bottom: '20px', // Adjusted for visible positioning
                    right: '20px', // Right positioning
                    width: '0px', // Adjusted width to be more appropriate
                    height: '0px', // Adjusted height to make it a standard size
                    zIndex: '1000',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
                }}
            ></df-messenger>
        </div>
    );
};

export default Chatbot;
