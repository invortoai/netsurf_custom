import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Label } from "./components/ui/label";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Phone, LogOut, AlertCircle, CheckCircle2 } from "lucide-react";

// Webhook URL for call initiation
const WEBHOOK_URL = "https://n8n.srv743759.hstgr.cloud/webhook/netsurf";

// Auth Context
const AuthContext = {
  isLoggedIn: false,
  login: () => {},
  logout: () => {}
};

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
      <Card className="w-full max-w-md shadow-xl border-0 bg-white">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">NetSurf Direct</CardTitle>
          <CardDescription className="text-slate-600">Call Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the designated Email"
                className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
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
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">NetSurf Direct</h1>
              <p className="text-sm text-slate-600">Call Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">Welcome, {userEmail}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="border-slate-200 hover:bg-slate-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-lg shadow-xl border-0 bg-white">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-bold text-slate-800">Initiate Call</CardTitle>
            <CardDescription className="text-slate-600">
              Enter the 10-digit mobile number to initiate a call
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInitiateCall} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium">Mobile Number</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={handleNumberChange}
                    placeholder="9876543210"
                    className="h-12 text-lg font-mono border-slate-200 focus:border-blue-500 focus:ring-blue-500 pl-4"
                    maxLength={10}
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-500">
                    {phoneNumber.length}/10
                  </div>
                </div>
              </div>

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Call initiated successfully for {phoneNumber}
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg"
                disabled={loading || phoneNumber.length !== 10}
              >
                {loading ? "Initiating..." : "Initiate Call"}
              </Button>
            </form>
          </CardContent>
        </Card>
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