// WomenConnect Hub - ErrorBoundary Component
// Error handling with user-friendly messages

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you would send this to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, showDetails = false } = this.props;
      
      // Custom fallback component
      if (Fallback) {
        return <Fallback 
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
        />;
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">
              <span role="img" aria-label="Error">⚠️</span>
            </div>
            
            <h1 className="error-title">
              Oops! Something went wrong
            </h1>
            
            <p className="error-message">
              We're sorry, but something unexpected happened. 
              Don't worry - your data is safe and this has been reported to our team.
            </p>

            <div className="error-actions">
              <button 
                onClick={this.handleRetry}
                className="btn btn-primary"
              >
                Try Again
              </button>
              
              <button 
                onClick={this.handleReload}
                className="btn btn-secondary"
              >
                Reload Page
              </button>
              
              <button 
                onClick={this.handleGoHome}
                className="btn btn-secondary"
              >
                Go Home
              </button>
            </div>

            <details className="error-details">
              <summary className="error-details-toggle">
                Technical Details (Error ID: {this.state.errorId})
              </summary>
              
              {showDetails && this.state.error && (
                <div className="error-technical">
                  <h3>Error Information:</h3>
                  <pre className="error-stack">
                    {this.state.error.toString()}
                  </pre>
                  
                  {this.state.errorInfo && (
                    <>
                      <h3>Component Stack:</h3>
                      <pre className="error-stack">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              )}
            </details>

            <div className="error-help">
              <p>
                <strong>Need help?</strong> Contact our support team:
              </p>
              <p>
                📧 <a href="mailto:support@womenconnecthub.org">
                  support@womenconnecthub.org
                </a>
              </p>
              <p>
                💬 <a href="https://wa.me/1234567890">
                  WhatsApp Support
                </a>
              </p>
              <p className="error-id-note">
                Please include Error ID: <code>{this.state.errorId}</code> in your message.
              </p>
            </div>
          </div>

          <style jsx>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: var(--spacing-lg);
              background: linear-gradient(135deg, #fef2f2 0%, #fef7ff 100%);
            }

            .error-container {
              max-width: 600px;
              width: 100%;
              text-align: center;
              background: #ffffff;
              border-radius: var(--border-radius);
              padding: var(--spacing-xxl);
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              border: 1px solid #fecaca;
            }

            .error-icon {
              font-size: 4rem;
              margin-bottom: var(--spacing-lg);
            }

            .error-title {
              font-size: var(--font-size-xxl);
              font-weight: 700;
              color: #991b1b;
              margin-bottom: var(--spacing-md);
            }

            .error-message {
              font-size: var(--font-size-lg);
              color: #6b7280;
              line-height: 1.6;
              margin-bottom: var(--spacing-xl);
            }

            .error-actions {
              display: flex;
              gap: var(--spacing-md);
              justify-content: center;
              flex-wrap: wrap;
              margin-bottom: var(--spacing-xl);
            }

            .error-actions .btn {
              min-width: 120px;
            }

            .error-details {
              margin: var(--spacing-xl) 0;
              text-align: left;
              border: 1px solid #e5e7eb;
              border-radius: var(--border-radius);
              overflow: hidden;
            }

            .error-details-toggle {
              padding: var(--spacing-md);
              background: #f9fafb;
              cursor: pointer;
              font-weight: 500;
              color: #374151;
              border: none;
              width: 100%;
              text-align: left;
            }

            .error-details-toggle:hover {
              background: #f3f4f6;
            }

            .error-technical {
              padding: var(--spacing-md);
              background: #fefefe;
            }

            .error-technical h3 {
              font-size: var(--font-size-sm);
              font-weight: 600;
              color: #374151;
              margin: var(--spacing-md) 0 var(--spacing-sm) 0;
            }

            .error-technical h3:first-child {
              margin-top: 0;
            }

            .error-stack {
              background: #1f2937;
              color: #f3f4f6;
              padding: var(--spacing-md);
              border-radius: var(--border-radius);
              font-size: var(--font-size-xs);
              overflow-x: auto;
              white-space: pre-wrap;
              word-break: break-all;
            }

            .error-help {
              background: #f0f9ff;
              border: 1px solid #bae6fd;
              border-radius: var(--border-radius);
              padding: var(--spacing-lg);
              font-size: var(--font-size-sm);
              text-align: left;
            }

            .error-help p {
              margin: var(--spacing-sm) 0;
            }

            .error-help a {
              color: #2563eb;
              text-decoration: none;
            }

            .error-help a:hover,
            .error-help a:focus {
              text-decoration: underline;
            }

            .error-id-note {
              font-size: var(--font-size-xs);
              color: #6b7280;
              font-style: italic;
            }

            .error-id-note code {
              background: #f3f4f6;
              padding: 2px 4px;
              border-radius: 3px;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            }

            /* Mobile adjustments */
            @media (max-width: 768px) {
              .error-boundary {
                padding: var(--spacing-md);
                min-height: 100vh;
              }

              .error-container {
                padding: var(--spacing-lg);
              }

              .error-title {
                font-size: var(--font-size-xl);
              }

              .error-message {
                font-size: var(--font-size-base);
              }

              .error-actions {
                flex-direction: column;
                align-items: center;
              }

              .error-actions .btn {
                width: 100%;
                max-width: 200px;
              }
            }

            /* High contrast mode */
            @media (prefers-contrast: high) {
              .error-container {
                border: 2px solid #991b1b;
              }

              .error-details {
                border: 2px solid #374151;
              }

              .error-help {
                border: 2px solid #2563eb;
              }
            }

            /* Print styles */
            @media print {
              .error-boundary {
                background: #ffffff;
                min-height: auto;
              }

              .error-actions,
              .error-help {
                display: none;
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple Error Fallback Component
export const SimpleErrorFallback = ({ onRetry }) => (
  <div className="simple-error">
    <p>⚠️ Something went wrong</p>
    <button onClick={onRetry} className="btn btn-primary btn-small">
      Try Again
    </button>

    <style jsx>{`
      .simple-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-lg);
        text-align: center;
        color: #6b7280;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: var(--border-radius);
        margin: var(--spacing-md) 0;
      }
    `}</style>
  </div>
);

// Inline Error Component
export const InlineError = ({ message, onRetry }) => (
  <div className="inline-error" role="alert">
    <span className="error-text">
      {message || 'Something went wrong'}
    </span>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="retry-btn"
        aria-label="Retry"
      >
        🔄
      </button>
    )}

    <style jsx>{`
      .inline-error {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm) var(--spacing-md);
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: var(--border-radius);
        font-size: var(--font-size-sm);
        color: #991b1b;
      }

      .error-text {
        flex: 1;
      }

      .retry-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: var(--font-size-sm);
        padding: var(--spacing-xs);
        border-radius: 50%;
        transition: background 0.2s ease;
      }

      .retry-btn:hover,
      .retry-btn:focus {
        background: rgba(239, 68, 68, 0.1);
      }
    `}</style>
  </div>
);

export default ErrorBoundary;
