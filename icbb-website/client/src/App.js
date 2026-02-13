import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Error Boundary and Loading
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Research = lazy(() => import('./pages/Research'));
const Training = lazy(() => import('./pages/Training'));
const Services = lazy(() => import('./pages/Services'));
const ServiceRequest = lazy(() => import('./pages/ServiceRequest'));
const Partnerships = lazy(() => import('./pages/Partnerships'));
const News = lazy(() => import('./pages/News'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/research" element={<Research />} />
              <Route path="/training" element={<Training />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/request" element={<ServiceRequest />} />
              <Route path="/service-request" element={<ServiceRequest />} />
              <Route path="/partnerships" element={<Partnerships />} />
              <Route path="/news" element={<News />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
