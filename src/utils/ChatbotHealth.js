// Utility to check chatbot server health
export const checkChatbotHealth = async () => {
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  const chatbotUrl = isProduction 
    ? 'https://your-chatbot-server.onrender.com' // Replace with your deployed chatbot URL
    : 'http://localhost:3001';
  
  try {
    const response = await fetch(`${chatbotUrl}/api/health`);
    const data = await response.json();
    
    if (data.status === 'ok') {
      console.log('✅ V-Compass chatbot is healthy:', data);
      return { healthy: true, data };
    } else {
      console.warn('⚠️ V-Compass chatbot returned unexpected status:', data);
      return { healthy: false, error: 'Unexpected status' };
    }
  } catch (error) {
    console.error('❌ V-Compass chatbot health check failed:', error.message);
    return { healthy: false, error: error.message };
  }
};

// Optional: Auto health check on app start
export const initChatbotHealthCheck = () => {
  // Wait a bit for servers to start up
  setTimeout(() => {
    checkChatbotHealth().then(result => {
      if (result.healthy) {
        console.log('🤖 V-Compass chatbot is ready!');
      } else {
        console.warn('🤖 V-Compass chatbot may not be available:', result.error);
      }
    });
  }, 3000); // 3 second delay
};