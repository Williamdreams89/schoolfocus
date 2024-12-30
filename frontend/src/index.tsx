import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StyledEngineProvider } from '@mui/material/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import MyContext from './utils/contexts/ReactContext';
// import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
        


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <MantineProvider>
        <MyContext>
          <Router>
            <App />
          </Router>
        </MyContext>
      </MantineProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);