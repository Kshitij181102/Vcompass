import reactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Chatbot from './utils/Chatbot';
reactDOM.createRoot(document.getElementById('root')).render(
<BrowserRouter>
<Chatbot/>
<Toaster position='top-center'/>
    <App />
</BrowserRouter>
);