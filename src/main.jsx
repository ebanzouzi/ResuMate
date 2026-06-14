import { Buffer } from 'buffer';
window.Buffer = Buffer; // Rend l'objet disponible pour @react-pdf/renderer
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
