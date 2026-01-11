import React, { useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.css";
import "./websiteStyles.css";
import WebsiteHeader from './WebsiteHeader.tsx';

const WebPage = () => {
  useEffect(() => {
    // Add class to body to enable scrolling on website pages
    document.body.classList.add('website-page');
    document.documentElement.classList.add('website-page');
    return () => {
      // Remove class when component unmounts
      document.body.classList.remove('website-page');
      document.documentElement.classList.remove('website-page');
    };
  }, []);

  return (
    <>
      <WebsiteHeader/>
      <div className="website-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 hero-content">
                <h1 className="hero-title">Your Files, Organized & Secure</h1>
                <p className="hero-subtitle">
                  SmartFS is the intelligent file management system that helps you store, organize, 
                  and access your files from anywhere. Experience seamless file management with 
                  powerful search and organization features.
                </p>
                <div className="hero-buttons">
                  <button 
                    className="btn btn-primary btn-hero-primary" 
                    onClick={() => window.location.href = "/signup"}
                  >
                    Get Started Free
                  </button>
                  <button 
                    className="btn btn-outline-primary btn-hero-secondary" 
                    onClick={() => window.location.href = "/signin"}
                  >
                    Sign In
                  </button>
                </div>
              </div>
              <div className="col-lg-6 hero-image">
                <div className="hero-illustration">
                  <div className="file-icon-large">
                    <i className="fas fa-cloud"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Why Choose SmartFS?</h2>
            <div className="row">
              <div className="col-md-4 feature-card">
                <div className="feature-icon">
                  <i className="fas fa-search"></i>
                </div>
                <h3 className="feature-title">Powerful Search</h3>
                <p className="feature-description">
                  Find any file instantly with our advanced search functionality. 
                  Search by name, type, or content to locate what you need in seconds.
                </p>
              </div>
              <div className="col-md-4 feature-card">
                <div className="feature-icon">
                  <i className="fas fa-folder-tree"></i>
                </div>
                <h3 className="feature-title">Smart Organization</h3>
                <p className="feature-description">
                  Create folders, organize files, and manage your digital workspace 
                  with an intuitive interface designed for productivity.
                </p>
              </div>
              <div className="col-md-4 feature-card">
                <div className="feature-icon">
                  <i className="fas fa-upload"></i>
                </div>
                <h3 className="feature-title">Easy Upload</h3>
                <p className="feature-description">
                  Upload files effortlessly with drag-and-drop support. 
                  Manage multiple files and folders with ease.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 benefits-image">
                <div className="benefits-illustration">
                  <div className="benefit-icon-wrapper">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 benefits-content">
                <h2 className="section-title">Secure & Reliable</h2>
                <ul className="benefits-list">
                  <li className="benefit-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Secure cloud storage for all your files</span>
                  </li>
                  <li className="benefit-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Access your files from anywhere, anytime</span>
                  </li>
                  <li className="benefit-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Fast and reliable file management system</span>
                  </li>
                  <li className="benefit-item">
                    <i className="fas fa-check-circle"></i>
                    <span>User-friendly interface for seamless experience</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Get Started?</h2>
              <p className="cta-subtitle">
                Join thousands of users who trust SmartFS for their file management needs.
              </p>
              <button 
                className="btn btn-primary btn-cta" 
                onClick={() => window.location.href = "/signup"}
              >
                Create Your Free Account
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="website-footer">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <p className="footer-text">&copy; 2024 SmartFS. All rights reserved.</p>
              </div>
              <div className="col-md-6 footer-links">
                <a href="/signin" className="footer-link">Sign In</a>
                <a href="/signup" className="footer-link">Sign Up</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default WebPage;
