import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, 
  Search, 
  ArrowLeft, 
  FileVideo, 
  HelpCircle 
} from "lucide-react";

function NotFound() {
  return (
    <div className="container py-8">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 404 Number */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="display-1 fw-bold text-primary mb-4"
            >
              404
            </motion.div>

            {/* Main Message */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="display-5 fw-bold mb-4"
            >
              Page Not Found
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lead text-secondary fs-5 mb-6"
            >
              Oops! The page you're looking for doesn't exist. 
              It might have been moved, deleted, or you entered the wrong URL.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="d-flex flex-column flex-md-row gap-3 justify-content-center mb-8"
            >
              <Link to="/" className="btn btn-primary btn-lg">
                <Home className="me-2" size={20} />
                Go Home
              </Link>
              <Link to="/upload" className="btn btn-outline-primary btn-lg">
                <Search className="me-2" size={20} />
                Search Scenes
              </Link>
              <button 
                onClick={() => window.history.back()}
                className="btn btn-outline-secondary btn-lg"
              >
                <ArrowLeft className="me-2" size={20} />
                Go Back
              </button>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="card border-0 shadow-sm"
            >
              <div className="card-body p-6">
                <h4 className="card-title mb-4">Popular Pages</h4>
                <div className="row g-3">
                  <div className="col-md-4">
                    <Link to="/" className="text-decoration-none">
                      <div className="card border-0 bg-light h-100">
                        <div className="card-body text-center p-4">
                          <Home className="text-primary mb-3" size={32} />
                          <h6 className="card-title">Home</h6>
                          <p className="card-text small text-muted">Back to homepage</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/upload" className="text-decoration-none">
                      <div className="card border-0 bg-light h-100">
                        <div className="card-body text-center p-4">
                          <FileVideo className="text-primary mb-3" size={32} />
                          <h6 className="card-title">Search Scenes</h6>
                          <p className="card-text small text-muted">Upload and search videos</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/faq" className="text-decoration-none">
                      <div className="card border-0 bg-light h-100">
                        <div className="card-body text-center p-4">
                          <HelpCircle className="text-primary mb-3" size={32} />
                          <h6 className="card-title">FAQ</h6>
                          <p className="card-text small text-muted">Find answers to questions</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Help Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-6"
            >
              <div className="card border-0 shadow-sm bg-gradient"
                style={{
                  background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                  color: 'var(--white)'
                }}
              >
                <div className="card-body p-6">
                  <h4 className="mb-3">Need Help?</h4>
                  <p className="mb-4 opacity-90">
                    Can't find what you're looking for? Our support team is here to help you navigate our platform.
                  </p>
                  <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                    <Link to="/faq" className="btn btn-light">
                      <HelpCircle className="me-2" size={16} />
                      Browse FAQ
                    </Link>
                    <Link to="/team" className="btn btn-outline-light">
                      Contact Team
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;