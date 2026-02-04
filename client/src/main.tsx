import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Suppress findDOMNode warning from Ant Design
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('findDOMNode')) {
    return;
  }
  originalConsoleError(...args);
};

createRoot(document.getElementById('root')!).render(
  <App />
)
