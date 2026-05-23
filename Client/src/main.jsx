import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'react-toastify/dist/ReactToastify.css';
import './css/global.css'
import { ToastContainer} from 'react-toastify';

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer  
      autoClose={2000}
      position="top-right"
      theme="light"
    />
  </StrictMode >,
)
