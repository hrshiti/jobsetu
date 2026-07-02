import React from 'react';
import RootLayout from './layouts/RootLayout';
import AppRoutes from './routes';

function App() {
  return (
    <RootLayout>
      <AppRoutes />
    </RootLayout>
  );
}

export default App;
