#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🤖 Setting up V-Compass Chatbot...\n');

// Check if chatbot directory exists
const chatbotPath = path.join(__dirname, 'chat', 'CHATBOT');
if (!fs.existsSync(chatbotPath)) {
  console.error('❌ Chatbot directory not found at:', chatbotPath);
  process.exit(1);
}

// Install chatbot dependencies
console.log('📦 Installing chatbot dependencies...');
try {
  execSync('npm install', { 
    cwd: chatbotPath, 
    stdio: 'inherit' 
  });
  console.log('✅ Chatbot dependencies installed successfully!\n');
} catch (error) {
  console.error('❌ Failed to install chatbot dependencies:', error.message);
  process.exit(1);
}

// Install client dependencies (including concurrently)
console.log('📦 Installing client dependencies...');
try {
  execSync('npm install', { 
    cwd: __dirname, 
    stdio: 'inherit' 
  });
  console.log('✅ Client dependencies installed successfully!\n');
} catch (error) {
  console.error('❌ Failed to install client dependencies:', error.message);
  process.exit(1);
}

console.log('🎉 Setup complete! You can now run:');
console.log('   npm start    - Start both React app and chatbot');
console.log('   npm run start:client  - Start only React app');
console.log('   npm run start:chatbot - Start only chatbot server');
console.log('\n💡 The chatbot will be available at http://localhost:3001');
console.log('💡 The React app will be available at http://localhost:3000');