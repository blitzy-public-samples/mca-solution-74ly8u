import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from '@reduxjs/toolkit';
import { store } from './store/store';
import { Dashboard } from './pages/Dashboard';
import { Applications } from './pages/Applications';
import { Webhooks } from './pages/Webhooks';
import { Users } from './pages/Users';
import { Navigation } from './components/Navigation';
import { AuthWrapper } from './components/AuthWrapper';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={
              <AuthWrapper>
                <Dashboard />
              </AuthWrapper>
            }
          />
          <Route
            path="/applications"
            element={
              <AuthWrapper>
                <Applications />
              </AuthWrapper>
            }
          />
          <Route
            path="/webhooks"
            element={
              <AuthWrapper>
                <Webhooks />
              </AuthWrapper>
            }
          />
          <Route
            path="/users"
            element={
              <AuthWrapper>
                <Users />
              </AuthWrapper>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;