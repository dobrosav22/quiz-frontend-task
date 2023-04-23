import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClientProvider,QueryClient } from 'react-query';
import { makeServer } from './api/mirageServer';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

/**We invoke the MakeServer function to run our mirageJs server. 
 * Once the actuall endpoints is available, we remove this code.
 */
  makeServer();

root.render(
  <React.StrictMode>
      <QueryClientProvider client = { queryClient } > 
    <App />
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();
