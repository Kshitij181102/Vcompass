# V-Compass - Campus Navigation & Information System

A modern React-based campus information system with integrated AI chatbot.

## 🚀 Features

- **Campus Information System** - Complete navigation and information portal
- **AI Chatbot Integration** - Powered by deployed chatbot at https://vcompass-chatbot.vercel.app
- **Responsive Design** - Works on all devices
- **Modern UI** - Clean, professional interface

## 🛠️ Quick Start

### Development
```bash
npm install
npm start
```
Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
```

## 🤖 Chatbot Integration

The app integrates with a standalone chatbot deployed at:
**https://vcompass-chatbot.vercel.app**

The chatbot provides:
- Campus information queries
- Professor and office details
- Department information
- AI-powered responses

## 🌐 Deployment

Deploy to Vercel or any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Set environment variable: `REACT_APP_CHATBOT_URL=https://vcompass-chatbot.vercel.app`

## 📁 Project Structure

```
src/
├── components/
│   ├── ChatbotWidget.jsx    # Integrated chatbot widget
│   └── Layout.jsx           # Main layout component
├── pages/                   # Application pages
└── styles/                  # CSS and styling
```

## 🔧 Environment Variables

- `REACT_APP_CHATBOT_URL` - URL of the deployed chatbot service

## 📱 Chatbot Widget

The floating chatbot button appears in the bottom-right corner of all pages. Click to interact with the V-Compass AI assistant.

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
