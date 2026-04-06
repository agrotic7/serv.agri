import React from 'react';
import NavBarPro from './components/NavBarPro';
import Footer from './components/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const location = useLocation();
  const hideNavAndFooter = location.pathname.startsWith('/login') || location.pathname.startsWith('/admin');
  return (
    <>
      {!hideNavAndFooter && <NavBarPro />}
      <ScrollToTop />
      <main>
        <Outlet />
      </main>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}

export default App; 