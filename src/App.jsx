import React from 'react';
import NavBarPro from './components/NavBarPro';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <NavBarPro />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App; 