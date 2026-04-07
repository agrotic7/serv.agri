import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: true });

const loaderFavicon =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" stroke="%23388e3c" stroke-width="8" fill="none" stroke-dasharray="40 60" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="0.8s" repeatCount="indefinite"/></circle></svg>';

function setFavicon(href) {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = href;
}

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    NProgress.start();
    setFavicon(loaderFavicon);
    window.scrollTo(0, 0);
    NProgress.done();
    // Restaure le favicon normal après un court délai
    setTimeout(() => {
      setFavicon('/servagri_logo.png');
    }, 400);
  }, [pathname]);
  return null;
} 