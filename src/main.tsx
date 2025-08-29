import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Debug: Check if root element exists
const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Debug: Log when the app starts rendering
console.log('Starting app...');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
