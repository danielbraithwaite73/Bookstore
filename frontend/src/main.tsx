/**
 * Application entry: mounts React to #root, enables StrictMode double-rendering in development,
 * and pulls in global styles (Bootstrap for layout/components, index.css for theme tokens).
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
