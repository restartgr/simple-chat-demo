import React from 'react';
import ReactDOM from 'react-dom/client';
import { StoreProvider, store } from '@/stores';
import '@/i18n';
import '@/styles/index.css';
import 'antd/dist/reset.css';
import App from '@/App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider value={store}>
      <App />
    </StoreProvider>
  </React.StrictMode>
);
