import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from 'react';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom-bootstrap.css'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loading de toutes les pages pour optimiser le bundle initial
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./components/Contact'));
const News = lazy(() => import('./components/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Realisation = lazy(() => import('./components/Realisation'));
const RealisationDetail = lazy(() => import('./pages/RealisationDetail'));
const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminNews = lazy(() => import('./pages/AdminNews'));
const AdminRealisations = lazy(() => import('./pages/AdminRealisations'));
const DashboardAdmin = lazy(() => import('./pages/DashboardAdmin'));
const AdminSolutions = lazy(() => import('./pages/AdminSolutions'));
const AdminPartners = lazy(() => import('./pages/AdminPartners'));
const AdminNewsletter = lazy(() => import('./pages/AdminNewsletter'));
const AdminContacts = lazy(() => import('./pages/AdminContacts'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loader de fallback pendant le chargement lazy
const PageLoader = () => (
  <div style={{
    minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <div style={{
      width: 48, height: 48,
      border: '5px solid #e8f5e9',
      borderTop: '5px solid #2e7d32',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Suspense fallback={<PageLoader />}><Home /></Suspense> },
      { path: "/services", element: <Suspense fallback={<PageLoader />}><Services /></Suspense> },
      { path: "/contact", element: <Suspense fallback={<PageLoader />}><Contact /></Suspense> },
      { path: "/actualites", element: <Suspense fallback={<PageLoader />}><News /></Suspense> },
      { path: "/actualites/:id", element: <Suspense fallback={<PageLoader />}><NewsDetail /></Suspense> },
      { path: "/realisation", element: <Suspense fallback={<PageLoader />}><Realisation /></Suspense> },
      { path: "/realisation/:id", element: <Suspense fallback={<PageLoader />}><RealisationDetail /></Suspense> },
      { path: "/login", element: <Suspense fallback={<PageLoader />}><Login /></Suspense> },
      {
        path: "/admin",
        element: <Suspense fallback={<PageLoader />}><ProtectedRoute><Admin /></ProtectedRoute></Suspense>,
        children: [
          { index: true, element: <Suspense fallback={<PageLoader />}><DashboardAdmin /></Suspense> },
          { path: "news", element: <Suspense fallback={<PageLoader />}><AdminNews /></Suspense> },
          { path: "realisations", element: <Suspense fallback={<PageLoader />}><AdminRealisations /></Suspense> },
          { path: "solutions", element: <Suspense fallback={<PageLoader />}><AdminSolutions /></Suspense> },
          { path: "partners", element: <Suspense fallback={<PageLoader />}><AdminPartners /></Suspense> },
          { path: "newsletters", element: <Suspense fallback={<PageLoader />}><AdminNewsletter /></Suspense> },
          { path: "contacts", element: <Suspense fallback={<PageLoader />}><AdminContacts /></Suspense> },
        ],
      },
      { path: "*", element: <Suspense fallback={<PageLoader />}><NotFound /></Suspense> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
)

