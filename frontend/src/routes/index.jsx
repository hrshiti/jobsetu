import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load pages for better performance
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Careers = lazy(() => import('../pages/Careers'));
const Apply = lazy(() => import('../pages/Apply'));
const ThankYou = lazy(() => import('../pages/ThankYou'));
const Support = lazy(() => import('../pages/Support'));
const FAQ = lazy(() => import('../pages/FAQ'));
const Policy = lazy(() => import('../pages/Policy'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Loader component for suspense fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-950/50"></div>
        <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/support" element={<Support />} />
        <Route path="/faq" element={<FAQ />} />
        
        {/* Policy Routes */}
        <Route path="/privacy" element={<Policy type="privacy" />} />
        <Route path="/terms" element={<Policy type="terms" />} />
        <Route path="/refund" element={<Policy type="refund" />} />
        <Route path="/cancellation" element={<Policy type="cancellation" />} />
        <Route path="/shipping" element={<Policy type="shipping" />} />
        <Route path="/cookie" element={<Policy type="cookie" />} />
        <Route path="/disclaimer" element={<Policy type="disclaimer" />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
