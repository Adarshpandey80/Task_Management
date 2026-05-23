import React from 'react'
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react'
import '../css/footer.css'

const Footer = () => {
  return (
    <footer className="modern-footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <div className="footer-logo-icon">✓</div>
            <h3>TaskFlow</h3>
          </div>
          <p>Modern task management for teams that value efficiency.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <div className="contact-info">
            <div className="contact-item">
              <Mail size={18} />
              <a href="mailto:support@taskflow.com">support@taskflow.com</a>
            </div>
            <div className="contact-item">
              <Phone size={18} />
              <a href="tel:+1234567890">+1 (234) 567-890</a>
            </div>
            <div className="contact-item">
              <MapPin size={18} />
              <span>123 Business St, City, Country</span>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#" aria-label="GitHub"><Github size={20} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 TaskFlow. All rights reserved.</p>
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#cookies">Cookie Policy</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer