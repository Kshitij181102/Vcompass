# 🚀 V-Compass Chatbot Setup Instructions

## ✅ Changes Made

### 1. **Updated Chatbot Integration** (`src/utils/Chatbot.js`)
- ❌ **Removed**: Dialogflow integration
- ✅ **Added**: Custom V-Compass TF-IDF chatbot widget
- ✅ **Added**: Health check system
- ✅ **Added**: Proper cleanup and error handling

### 2. **Modified Package.json**
- ✅ **Added**: `concurrently` dependency for running multiple servers
- ✅ **Updated**: Scripts to start both React app and chatbot server
- ✅ **Added**: Setup script for easy installation

### 3. **Created Configuration Files**
- ✅ **Added**: `.env` file with chatbot URL configuration
- ✅ **Added**: Health check utility (`ChatbotHealth.js`)
- ✅ **Added**: Setup script (`setup-chatbot.js`)

### 4. **Documentation**
- ✅ **Created**: Complete integration guide (`CHATBOT_INTEGRATION.md`)
- ✅ **Created**: This setup instruction file

## 🎯 Quick Setup

### Step 1: Install Dependencies
```bash
cd client
npm run setup
```

### Step 2: Start the Application
```bash
npm start
```

This will start:
- **React App** on `http://localhost:3000`
- **Chatbot Server** on `http://localhost:3001`

## 🎨 What You'll See

1. **React App**: Your main VCompass application
2. **Chatbot Widget**: Floating button in bottom-right corner
3. **Console Logs**: Health check and loading status messages

## 🔧 Available Scripts

```bash
npm start              # Start both React app and chatbot
npm run start:client   # Start only React app
npm run start:chatbot  # Start only chatbot server
npm run setup          # Install all dependencies
npm run install:chatbot # Install only chatbot dependencies
```

## 🤖 Chatbot Features

### Smart Campus Assistant
- **80+ Professor locations** with office details
- **Campus offices** (Library, CDC, COE, etc.)
- **Placement queries** (Training, LOR, CDC portal)
- **Intelligent search** using TF-IDF algorithm

### User Experience
- **Floating widget** - Click to open/close
- **Fast responses** - Sub-second search results
- **Smart handling** - Polite responses for unclear queries
- **Mobile friendly** - Responsive design

### Technical Features
- **Local processing** - No external API dependencies
- **Extensible** - Easy to add new campus data
- **Embeddable** - Can be used on other websites
- **Performance optimized** - Minimal impact on main app

## 🚨 Troubleshooting

### Chatbot Not Loading
1. **Check servers**: Both should be running (ports 3000 & 3001)
2. **Check console**: Look for error messages
3. **Verify setup**: Run `npm run setup` again

### Widget Not Appearing
1. **Wait 3 seconds**: Health check runs after delay
2. **Check network**: Verify widget.js loads successfully
3. **Check environment**: Ensure `.env` file exists

### Search Issues
1. **Test directly**: Visit `http://localhost:3001` for standalone chat
2. **Check data**: Verify `chat/CHATBOT/data/campus_data.json` exists
3. **Restart servers**: Stop and run `npm start` again

## 🎉 Success Indicators

You'll know everything is working when you see:
- ✅ Both servers start without errors
- ✅ Console shows "V-Compass chatbot is ready!"
- ✅ Floating chat button appears in bottom-right
- ✅ Clicking button opens chat interface
- ✅ Typing queries returns relevant responses

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure both servers are running
4. Review the `CHATBOT_INTEGRATION.md` for detailed info

**Enjoy your new intelligent campus chatbot! 🎓🤖**