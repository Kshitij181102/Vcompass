# 🤖 V-Compass Chatbot Integration

This document explains how the custom V-Compass chatbot is integrated into the React application.

## 🚀 Quick Start

### First Time Setup
```bash
# Run the setup script to install all dependencies
npm run setup

# Or manually install dependencies
npm install
npm run install:chatbot
```

### Running the Application
```bash
# Start both React app and chatbot server
npm start

# Or start them separately
npm run start:client   # React app only (port 3000)
npm run start:chatbot  # Chatbot server only (port 3001)
```

## 🔧 Configuration

### Environment Variables
Create or modify `client/.env`:
```env
# Chatbot server URL
REACT_APP_CHATBOT_URL=http://localhost:3001

# Optional: Disable source maps for faster builds
GENERATE_SOURCEMAP=false
```

### Chatbot Server Configuration
The chatbot server can be configured via `client/chat/CHATBOT/.env`:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here  # Optional AI enhancement
```

## 🎯 How It Works

### 1. Widget Integration
The chatbot appears as a floating widget in the bottom-right corner of your React app.

### 2. Custom Chatbot Engine
- **Technology**: TF-IDF search algorithm
- **Knowledge Base**: Campus data (professors, offices, placement info)
- **Smart Processing**: Handles incomplete queries, provides polite responses
- **Fast Response**: Local search with sub-second response times

### 3. Widget Features
- **Floating Button**: Click to open/close chat
- **Responsive Design**: Works on desktop and mobile
- **Customizable**: Easy to modify appearance and behavior
- **Embeddable**: Can be used on other websites too

## 📊 Knowledge Base

The chatbot knows about:
- **80+ Professor offices** and contact information
- **Campus offices** (Library, CDC, COE, Dean offices, etc.)
- **Placement queries** (Training, CDC portal, LOR requests)
- **General campus information**

### Adding New Data
Edit `client/chat/CHATBOT/data/campus_data.json`:
```json
{
  "professors": [
    {
      "question": "Where is Professor Name's office?",
      "keywords": "professor name, office, location",
      "response": "Professor Name's office is in Building, Room X."
    }
  ]
}
```

## 🛠 Customization

### Widget Appearance
Modify `client/chat/CHATBOT/public/widget.js`:
- Button size and position
- Colors and styling
- Chat window dimensions

### Chat Interface
Modify `client/chat/CHATBOT/public/style.css`:
- Color scheme
- Typography
- Layout and spacing

### Server Behavior
Modify `client/chat/CHATBOT/server.js`:
- Search algorithm parameters
- Response formatting
- API endpoints

## 🔍 API Endpoints

The chatbot server provides:
- `GET /api/health` - Server status
- `POST /api/query` - Process chat queries
- `POST /api/reload` - Reload knowledge base
- `GET /widget.js` - Widget injection script
- `GET /embed.html` - Embeddable chat interface

## 🚨 Troubleshooting

### Chatbot Not Loading
1. Check if chatbot server is running on port 3001
2. Verify CORS settings allow requests from port 3000
3. Check browser console for JavaScript errors

### Widget Not Appearing
1. Ensure `REACT_APP_CHATBOT_URL` is set correctly
2. Check network tab for failed widget.js requests
3. Verify the widget script is loading successfully

### Search Not Working
1. Check `campus_data.json` format
2. Verify TF-IDF indexing completed successfully
3. Test queries directly via `/api/query` endpoint

## 📈 Performance

- **Fast Startup**: Widget loads asynchronously
- **Efficient Search**: Pre-computed TF-IDF vectors
- **Small Footprint**: Minimal impact on main app performance
- **Scalable**: Easy to add more knowledge base entries

## 🔒 Security

- **CORS Configured**: Allows requests from your domain
- **Input Sanitization**: Prevents injection attacks
- **Rate Limiting**: Can be added for production use
- **No Sensitive Data**: Knowledge base contains only public campus info

## 🎨 Integration with React App

The chatbot integrates seamlessly:
1. **Automatic Loading**: Starts with `npm start`
2. **No UI Conflicts**: Uses high z-index positioning
3. **Clean Cleanup**: Properly removes elements on unmount
4. **Error Handling**: Graceful fallbacks if server unavailable

This integration provides a powerful, fast, and customizable chatbot experience for your VCompass application!