import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/Themecontext.jsx'

import axios from "axios";   // ✅ add this

console.log("API URL:", import.meta.env.VITE_API_URL);
// ✅ configure axios once
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
 
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider> 
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
