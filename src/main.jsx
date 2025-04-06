import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ Import this
import App from './App';
import './index.css';
import './global.css';
import { Buffer } from 'buffer';
window.Buffer = Buffer;



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ Wrap everything inside */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
