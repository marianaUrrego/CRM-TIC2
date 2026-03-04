import React, { useState } from "react";
import { Building2, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    console.log("Login attempt:", { email, password });
    alert("Login successful! (demo)");
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <div className="logo-container">
            <Building2 className="logo-icon" />
          </div>
          <h1 className="login-title">CRM Cloud</h1>
          <p className="login-subtitle">Customer Management System</p>
        </div>

        <div className="login-card">
          <div className="card-header">
            <h2 className="card-title">Welcome Back</h2>
            <p className="card-description">Sign in to access your dashboard</p>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="submit-button">
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="footer-text">
          <p>Cloud Migration MVP - Customer Management Module</p>
        </div>
      </div>
    </div>
  );
}