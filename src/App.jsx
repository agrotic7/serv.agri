import React from 'react';
import NavBarPro from './components/layout/NavBarPro';
import Footer from './components/layout/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import ScrollToTop from './components/layout/ScrollToTop';
import FloatingContact from './components/ui/FloatingContact';

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
      {!hideNavAndFooter && <FloatingContact />}
    </>
  );
}

export default App; 