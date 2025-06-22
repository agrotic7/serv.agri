import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom-bootstrap.css';
import App from './App'
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './components/Contact';
import News from './components/News';
import NewsDetail from './pages/NewsDetail';
import Realisation from './components/Realisation';
import RealisationDetail from './pages/RealisationDetail';
import Login from './pages/Login';
import Admin from './pages/Admin';
import AdminNews from './pages/AdminNews';
import AdminRealisations from './pages/AdminRealisations';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/services", element: <Services /> },
      { path: "/contact", element: <Contact /> },
      { path: "/actualites", element: <News /> },
      { path: "/actualites/:id", element: <NewsDetail /> },
      { path: "/realisation", element: <Realisation /> },
      { path: "/realisation/:id", element: <RealisationDetail /> },
      { path: "/login", element: <Login /> },
      {
        path: "/admin",
        element: <ProtectedRoute><Admin /></ProtectedRoute>,
        children: [
          { index: true, element: <AdminNews /> }, // Default child route
          { path: "news", element: <AdminNews /> },
          { path: "realisations", element: <AdminRealisations /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
