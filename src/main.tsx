import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely catch any third-party cross-origin script error events (e.g. from external widgets / trackers)
window.addEventListener('error', (event) => {
  if (
    event.message === 'Script error.' ||
    (event.filename &&
      (event.filename.includes('disqus') ||
        event.filename.includes('google') ||
        event.filename.includes('clarity')))
  ) {
    event.preventDefault();
    return true;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
