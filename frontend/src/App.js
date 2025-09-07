import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border-0 p-8">
        <div className="text-center space-y-2 pb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">NetSurf Direct</h1>
          <p className="text-slate-600">Call Management System</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-slate-700 font-medium block">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter the designated Email"
              className="w-full h-11 px-3 border border-slate-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-slate-700 font-medium block">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full h-11 px-3 border border-slate-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          {error && (
            <div className="border border-red-200 bg-red-50 rounded-md p-3 flex items-center space-x-2">
              <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          )}
          <button 
            type="submit" 
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50"
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

      const response = await axios.post(WEBHOOK_URL, payload, {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 10000 // 10 second timeout
      });

      setSuccess(true);
      setPhoneNumber("");
      setTimeout(() => setSuccess(false), 3000);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">NetSurf Direct</h1>
              <p className="text-sm text-slate-600">Call Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">Welcome, {userEmail}</span>
            <button 
              onClick={handleLogout}
              className="px-3 py-1 border border-slate-200 hover:bg-slate-50 rounded-md text-sm flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-xl border-0 p-8">
          <div className="text-center pb-8">
            <h2 className="text-2xl font-bold text-slate-800">Initiate Call</h2>
            <p className="text-slate-600 mt-2">
              Enter the 10-digit mobile number to initiate a call
            </p>
          </div>
          <form onSubmit={handleInitiateCall} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-slate-700 font-medium block">Mobile Number</label>
              <div className="relative">
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={handleNumberChange}
                  placeholder="9876543210"
                  className="w-full h-12 text-lg font-mono border border-slate-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none pl-4 pr-16"
                  maxLength={10}
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-500">
                  {phoneNumber.length}/10
                </div>
              </div>
            </div>

            {success && (
              <div className="border border-green-200 bg-green-50 rounded-md p-3 flex items-center space-x-2">
                <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-700">
                  Call initiated successfully for {phoneNumber}
                </span>
              </div>
            )}

            {error && (
              <div className="border border-red-200 bg-red-50 rounded-md p-3 flex items-center space-x-2">
                <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-md disabled:opacity-50"
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