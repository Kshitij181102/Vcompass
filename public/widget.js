// V-Compass Chatbot Widget for Vercel Deployment
(function() {
    'use strict';
    
    // Prevent multiple widget loads
    if (window.__vcompass_widget_loaded) return;
    window.__vcompass_widget_loaded = true;
    
    // Auto-detect environment
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const CHATBOT_ORIGIN = isProduction ? window.location.origin : 'http://localhost:3001';
    
    // Widget configuration
    const config = {
        origin: window.VCOMPASS_ORIGIN || CHATBOT_ORIGIN,
        iconUrl: window.VCOMPASS_ICON_URL || 'logo.png',
        position: 'bottom-right',
        zIndex: 999999
    };
    
    // Create widget button
    function createWidget() {
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
            z-index: ${config.zIndex};
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });
        
        button.addEventListener('click', openChat);
        document.body.appendChild(button);
        
        return button;
    }
    
    // Create chat iframe
    function createChatFrame() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 350px;
            height: 500px;
            z-index: ${config.zIndex};
            display: none;
        `;
        
        const iframe = document.createElement('iframe');
        iframe.src = `${config.origin}/embed.html`;
        iframe.title = 'V-Compass Chat';
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        `;
        
        // Fallback: Create simple chat interface if iframe fails
        iframe.onerror = () => {
            container.innerHTML = createFallbackChat();
        };
        
        container.appendChild(iframe);
        document.body.appendChild(container);
        
        return container;
    }
    
    // Fallback chat interface
    function createFallbackChat() {
        return `
            <div style="
                width: 100%;
                height: 100%;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            ">
                <div style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 16px;
                    font-weight: 600;
                ">
                    V-Compass Assistant
                </div>
                <div style="
                    flex: 1;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                ">
                    Chat interface loading...
                </div>
            </div>
        `;
    }
    
    let chatFrame = null;
    let isOpen = false;
    
    function openChat() {
        if (!chatFrame) {
            chatFrame = createChatFrame();
        }
        
        if (isOpen) {
            chatFrame.style.display = 'none';
            isOpen = false;
        } else {
            chatFrame.style.display = 'block';
            isOpen = true;
        }
    }
    
    // Initialize widget when DOM is ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        createWidget();
        console.log('✅ V-Compass chatbot widget initialized');
    }
    
    init();
})();