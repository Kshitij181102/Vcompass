import reactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ChatbotWidget from './components/ChatbotWidget';

reactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ChatbotWidget />
        <Toaster position='top-center' />
        <App />
    </BrowserRouter>
);