import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ArrowUp, Send, Check } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Apply Now', path: '/apply', isCta: true },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
    { name: 'Support', path: '/support' },
  ];

  const policyLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Refund Policy', path: '/refund' },
    { name: 'Cancellation Policy', path: '/cancellation' },
    { name: 'Shipping & Delivery', path: '/shipping' },
    { name: 'Cookie Policy', path: '/cookie' },
    { name: 'Disclaimer', path: '/disclaimer' },
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Support Help', path: '/support' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Sticky Header / Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-slate-800/50 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              AN
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              ApplyNova
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.isCta) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="ml-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all text-sm"
                  >
                    {link.name}
                  </Link>
                );
              }
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="ml-4 p-2 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-6 px-6 shadow-xl flex flex-col gap-4 md:hidden animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`py-2 px-3 rounded-lg font-medium text-base transition-colors ${
                  link.isCta
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center shadow-md'
                    : location.pathname === link.path
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 w-full">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/80 pt-16 pb-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/10">
                AN
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                ApplyNova Portal
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              ApplyNova Portal is a secure, premium application gateway connecting top talent with industry-leading startups and enterprise companies.
            </p>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p>📍 rajeev, Barod, Post Office - SalayTehsil - Aron, District - GunaMadhya Pradesh - 473101</p>
              <p>✉️ jjmisarajeev@gmail.com</p>
              <p>📞 9630409952</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-950 dark:text-white uppercase tracking-wider mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Policies (Razorpay required) */}
          <div>
            <h4 className="font-bold text-sm text-slate-950 dark:text-white uppercase tracking-wider mb-6">
              Legal & Policies
            </h4>
            <ul className="space-y-3">
              {policyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="font-bold text-sm text-slate-950 dark:text-white uppercase tracking-wider mb-6">
              Stay Updated
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Subscribe to get alerts when new premium jobs are posted.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-grow px-4 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/10 hover:shadow-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            © {new Date().getFullYear()} ApplyNova Portal. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-400">
            <span>Razorpay Verification Sandbox Site</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Widget */}
      <a
        href="https://wa.me/918049123456"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.488 1.449 5.412 1.451 5.428 0 9.845-4.409 9.848-9.842.002-2.632-1.002-5.105-2.825-6.929C17.259 2.012 14.801 1.01 12.18 1.01c-5.433 0-9.851 4.41-9.854 9.844-.001 1.942.506 3.841 1.467 5.461l-.963 3.519 3.618-.949-.396-.231zm10.741-7.07c-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.568-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
        </svg>
      </a>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
