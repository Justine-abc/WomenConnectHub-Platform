// WomenConnect Hub - Footer Component
// Footer with contact info and important links

import React from 'react';
import { Container } from '../ui/index.js';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    entrepreneurs: {
      title: 'For Entrepreneurs',
      links: [
        { href: '/upload', label: 'Upload Project' },
        { href: '/register/seller', label: 'Join as Seller' },
        { href: '/help#selling', label: 'Selling Guide' },
        { href: '/success-stories', label: 'Success Stories' }
      ]
    },
    investors: {
      title: 'For Investors',
      links: [
        { href: '/register/investor', label: 'Join as Investor' },
        { href: '/projects?featured=true', label: 'Featured Projects' },
        { href: '/help#investing', label: 'Investment Guide' },
        { href: '/impact', label: 'Impact Stories' }
      ]
    },

  };

  const socialLinks = [
    { 
      href: 'https://twitter.com/womenconnecthub', 
      label: 'Twitter',
      icon: '🐦'
    },
    { 
      href: 'https://facebook.com/womenconnecthub', 
      label: 'Facebook',
      icon: '📘'
    },
    { 
      href: 'https://linkedin.com/company/womenconnecthub', 
      label: 'LinkedIn',
      icon: '💼'
    },
    { 
      href: 'https://instagram.com/womenconnecthub', 
      label: 'Instagram',
      icon: '📸'
    }
  ];

  return (
    <footer className="footer" role="contentinfo">
      <Container>
        <div className="footer-content">
          {/* Platform Description */}
          <div className="footer-section footer-brand">
            <h3>WomenConnect Hub</h3>
            <p className="footer-description">
              Connecting African women entrepreneurs with global investors and supporters. 
              Empowering dreams, building futures, creating opportunities.
            </p>
            <div className="footer-social">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label={`Follow us on ${social.label}`}
                >
                  <span className="social-icon" aria-hidden="true">
                    {social.icon}
                  </span>
                  <span className="social-text">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key} className="footer-section">
              <h3>{section.title}</h3>
              <ul className="footer-links">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Information */}
          <div className="footer-section">
            <h3>Get in Touch</h3>
            <div className="contact-info">
              <p>
                <strong>Email:</strong>
                <a href="mailto:hello@womenconnecthub.org" className="footer-link">
                  hello@womenconnecthub.org
                </a>
              </p>
              <p>
                <strong>WhatsApp:</strong>
                <a href="https://wa.me/1234567890" className="footer-link">
                  +1 (234) 567-8900
                </a>
              </p>
              <p className="office-hours">
                <strong>Support Hours:</strong><br />
                Monday - Friday: 9:00 AM - 6:00 PM (GMT)
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} WomenConnect Hub. All rights reserved.
            </p>
            <p className="mission">
              Built with ❤️ for African women entrepreneurs
            </p>
            <div className="footer-bottom-links">
              <a href="/accessibility" className="footer-link">
                Accessibility
              </a>
              <span aria-hidden="true">•</span>
              <a href="/sitemap" className="footer-link">
                Sitemap
              </a>
              <span aria-hidden="true">•</span>
              <a href="/cookies" className="footer-link">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </Container>

      <style jsx>{`
        .footer-content {
          display: grid;
          gap: var(--spacing-xl);
          grid-template-columns: 1fr;
          margin-bottom: var(--spacing-xl);
        }

        .footer-brand {
          grid-column: 1 / -1;
        }

        .footer-description {
          color: #d1d5db;
          line-height: 1.6;
          margin: var(--spacing-md) 0;
          max-width: 400px;
        }

        .footer-social {
          display: flex;
          gap: var(--spacing-md);
          flex-wrap: wrap;
          margin-top: var(--spacing-lg);
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: #d1d5db;
          text-decoration: none;
          padding: var(--spacing-sm);
          border-radius: var(--border-radius);
          transition: all 0.2s ease;
          min-height: var(--min-touch-target);
        }

        .social-link:hover,
        .social-link:focus {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .social-icon {
          font-size: var(--font-size-lg);
        }

        .social-text {
          font-size: var(--font-size-sm);
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: var(--spacing-sm);
        }

        .contact-info {
          color: #d1d5db;
        }

        .contact-info p {
          margin: var(--spacing-sm) 0;
          line-height: 1.5;
        }

        .contact-info strong {
          color: #f3f4f6;
          display: block;
          margin-bottom: var(--spacing-xs);
        }

        .office-hours {
          font-size: var(--font-size-sm);
          color: #9ca3af;
          margin-top: var(--spacing-md);
        }

        .footer-bottom-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--spacing-sm);
        }

        .copyright {
          margin: 0;
          color: #9ca3af;
        }

        .mission {
          margin: 0;
          color: #d1d5db;
          font-style: italic;
        }

        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
          justify-content: center;
        }

        .footer-bottom-links span {
          color: #6b7280;
        }

        /* Tablet and up */
        @media (min-width: 768px) {
          .footer-content {
            grid-template-columns: 2fr 1fr 1fr 1fr;
          }

          .footer-brand {
            grid-column: 1;
          }

          .social-text {
            display: none;
          }

          .social-link {
            justify-content: center;
            width: var(--min-touch-target);
          }
        }

        /* Desktop and up */
        @media (min-width: 1024px) {
          .footer-content {
            grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
          }

          .footer-bottom-content {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }

          .social-text {
            display: inline;
          }

          .social-link {
            width: auto;
            justify-content: flex-start;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .footer-link:focus,
          .social-link:focus {
            outline: 2px solid #ffffff;
            outline-offset: 2px;
          }
        }

        /* Print styles */
        @media print {
          .footer-social,
          .footer-bottom-links {
            display: none;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
