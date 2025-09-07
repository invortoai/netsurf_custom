import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Webhook URL for call initiation
const WEBHOOK_URL = "https://n8n.srv743759.hstgr.cloud/webhook/netsurf";

// Login Component
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate email domain
    if (!email.endsWith("@netsurfdirect.com")) {
      setError("Only @netsurfdirect.com email addresses are allowed");
      setLoading(false);
      return;
    }

    // Validate password
    if (password !== "Invorto2025") {
      setError("Invalid password");
      setLoading(false);
      return;
    }

    // Simulate login delay
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      onLogin();
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7f1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          paddingBottom: '2rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>NetSurf Direct</h1>
          <p style={{ color: '#64748b' }}>Call Management System</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter the designated Email"
              style={{
                width: '100%',
                height: '44px',
                padding: '0 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: '100%',
                height: '44px',
                padding: '0 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          {error && (
            <div style={{
              border: '1px solid #fecaca',
              backgroundColor: '#fef2f2',
              borderRadius: '4px',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <svg style={{ width: '16px', height: '16px', color: '#dc2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ color: '#dc2626' }}>{error}</span>
            </div>
          )}
          <button 
            type="submit" 
            style={{
              width: '100%',
              height: '44px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Call Initiation Component
const CallInitiation = ({ onLogout }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const userEmail = localStorage.getItem("userEmail");

  const handleNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handleInitiateCall = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    // Validate phone number
    if (phoneNumber.length !== 10) {
      setError("Please enter exactly 10 digits");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        number: phoneNumber,
        call_attempted: "No",
        PCAP: "netsurf"
      };

      // Using fetch instead of axios to avoid dependency issues
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        timeout: 10000 // 10 second timeout
      });

      if (response.ok) {
        setSuccess(true);
        setPhoneNumber("");
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Servers are busy, please try again later");
      }
    } catch (error) {
      setError("Servers are busy, please try again later");
      console.error("Webhook error:", error);
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    onLogout();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7f1 100%)'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#3b82f6',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>NetSurf Direct</h1>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Call Management</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Welcome, {userEmail}</span>
            <button 
              onClick={handleLogout}
              style={{
                padding: '0.25rem 0.75rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.25rem',
                backgroundColor: 'white',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          <div style={{
            textAlign: 'center',
            paddingBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>Initiate Call</h2>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
              Enter the 10-digit mobile number to initiate a call
            </p>
          </div>
          <form onSubmit={handleInitiateCall} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={handleNumberChange}
                  placeholder="9876543210"
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '1.125rem',
                    fontFamily: 'monospace'
                  }}
                  maxLength={10}
                  required
                />
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.875rem',
                  color: '#94a3b8'
                }}>
                  {phoneNumber.length}/10
                </div>
              </div>
            </div>

            {success && (
              <div style={{
                border: '1px solid #bbf7d0',
                backgroundColor: '#f0fdf4',
                borderRadius: '4px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg style={{ width: '16px', height: '16px', color: '#16a34a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style={{ color: '#16a34a' }}>
                  Call initiated successfully for {phoneNumber}
                </span>
              </div>
            )}

            {error && (
              <div style={{
                border: '1px solid #fecaca',
                backgroundColor: '#fef2f2',
                borderRadius: '4px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg style={{ width: '16px', height: '16px', color: '#dc2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style={{ color: '#dc2626' }}>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: '500',
                fontSize: '1.125rem',
                cursor: (loading || phoneNumber.length !== 10) ? 'not-allowed' : 'pointer',
                opacity: (loading || phoneNumber.length !== 10) ? 0.7 : 1
              }}
              disabled={loading || phoneNumber.length !== 10}
            >
              {loading ? "Initiating..." : "Initiate Call"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// Main App Component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login" 
            element={
              isLoggedIn ? 
              <Navigate to="/initiate-call" replace /> : 
              <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/initiate-call" 
            element={
              <ProtectedRoute>
                <CallInitiation onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={isLoggedIn ? "/initiate-call" : "/login"} replace />} 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;