import React, { Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Upload, 
  Settings, 
  Users, 
  HelpCircle, 
  Video,
  Menu,
  X
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { VideoProvider } from "./context/VideoContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

// Lazy load components
const HomeComponent = React.lazy(() => import("./components/Home"));
const UploadComponent = React.lazy(() => import("./components/Upload"));
const ManageComponent = React.lazy(() => import("./components/Manage"));
const TeamComponent = React.lazy(() => import("./components/Team"));
const NotFoundComponent = React.lazy(() => import("./components/NotFound"));
const FAQComponent = React.lazy(() => import("./components/FAQ"));

// Error Boundary Component
function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const errorHandler = (error) => {
      console.error("Global error:", error);
      setError(error);
      setHasError(true);
    };

    const unhandledRejectionHandler = (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      setError(event.reason);
      setHasError(true);
    };

    window.addEventListener("error", errorHandler);
    window.addEventListener("unhandledrejection", unhandledRejectionHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
      window.removeEventListener("unhandledrejection", unhandledRejectionHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div className="container text-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="mb-4">Something went wrong</h2>
          <p className="text-secondary mb-4">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          {error && (
            <details className="text-left">
              <summary className="cursor-pointer mb-2">Error Details</summary>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {error.toString()}
              </pre>
            </details>
          )}
          <button
            className="btn btn-primary mt-4"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </motion.div>
      </div>
    );
  }

  return children;
}

// Navigation Component
function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/upload", label: "Search Scene", icon: Upload },
    { path: "/manage", label: "Manage", icon: Settings },
    { path: "/team", label: "Team", icon: Users },
    { path: "/faq", label: "FAQ", icon: HelpCircle },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="position-relative z-1">
      {/* Mobile Menu Button */}
      <button
        className="btn btn-light d-md-none position-absolute top-0 end-0 m-3"
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop Navigation */}
      <div className="d-none d-md-flex justify-content-center flex-wrap">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              className={`btn ${isActive ? 'active' : ''}`}
              to={item.path}
              end={item.path === "/"}
            >
              <Icon size={18} />
              <span className="ms-2">{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="d-md-none mt-4"
          >
            <div className="d-flex flex-column gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <NavLink
                    key={item.path}
                    className={`btn ${isActive ? 'active' : ''}`}
                    to={item.path}
                    end={item.path === "/"}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon size={18} />
                    <span className="ms-2">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Loading Component
function LoadingSpinner() {
  return (
    <div className="container text-center py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="d-flex flex-column align-items-center"
      >
        <div className="loading-spinner mb-3"></div>
        <p className="text-secondary">Loading amazing content...</p>
      </motion.div>
    </div>
  );
}

// Page Transition Component
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  
  const handleToggle = () => {
    console.log('Theme toggle clicked! Current theme:', theme);
    toggleTheme();
  };
  
  return (
    <button
      className="btn btn-outline-light ms-3 d-flex align-items-center justify-content-center"
      onClick={handleToggle}
      aria-label="Toggle dark/light mode"
      style={{ 
        minWidth: 48, 
        height: 48,
        borderRadius: '50%',
        padding: 0,
        fontSize: '1.5rem',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease'
      }}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}

function App() {
  return (
    <ThemeProvider>
      <VideoProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-primary text-white text-center py-4"
            >
              <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between">
                <motion.h1
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-4 mb-md-0"
                >
                  <Video className="d-inline-block me-3" size={40} />
                  Video Scene Classification
                </motion.h1>
                <div className="d-flex align-items-center">
                  <Navigation />
                  <ThemeToggleButton />
                </div>
              </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow-1">
              <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <PageTransition>
                            <HomeComponent />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/upload"
                        element={
                          <PageTransition>
                            <UploadComponent />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/manage"
                        element={
                          <PageTransition>
                            <ManageComponent />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/team"
                        element={
                          <PageTransition>
                            <TeamComponent />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/faq"
                        element={
                          <PageTransition>
                            <FAQComponent />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="*"
                        element={
                          <PageTransition>
                            <NotFoundComponent />
                          </PageTransition>
                        }
                      />
                    </Routes>
                  </AnimatePresence>
                </Suspense>
              </ErrorBoundary>
            </main>

            {/* Footer */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-dark text-white text-center py-4"
            >
              <div className="container">
                <p className="mb-0">
                  &copy; 2025 Video Scene Classification. Built with ❤️ using AI.
                </p>
              </div>
            </motion.footer>

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--white)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                },
                success: {
                  iconTheme: {
                    primary: 'var(--secondary-color)',
                    secondary: 'var(--white)',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: 'var(--white)',
                  },
                },
              }}
            />
          </div>
        </Router>
      </VideoProvider>
    </ThemeProvider>
  );
}

export default App;