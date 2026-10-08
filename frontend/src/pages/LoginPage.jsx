import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { roles } from "../data/roles";
import Logo from "../components/Logo";

const icons = { student: "🎓", employee: "💼", parent: "👨‍👩‍👧", alumni: "🌐" };

export default function LoginPage({ onLogin }) {
  const { role: rid } = useParams();
  const navigate = useNavigate();
  const role = roles.find((r) => r.id === rid);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!role) {
    return (
      <main className="auth-page">
        <div className="invalid-auth-card">
          <Logo />
          <h2>Portal not found</h2>
          <p>The selected portal is unavailable.</p>
          <button className="auth-primary" onClick={() => navigate("/")}>Back to VTOP</button>
        </div>
      </main>
    );
  }

  const submit = (event) => {
    event.preventDefault();
    setError("");
    if (username.trim() === role.username && password === role.password) {
      setLoading(true);
      setTimeout(() => {
        onLogin({ role: role.id, name: role.title, username: username.trim() });
        navigate("/dashboard");
      }, 300);
    } else {
      setError("The username or password you entered is incorrect.");
    }
  };

  const useDemo = () => {
    setUsername(role.username);
    setPassword(role.password);
    setError("");
  };

  return (
    <main className="auth-page">
      <div className="auth-background-orb auth-orb-a" />
      <div className="auth-background-orb auth-orb-b" />

      <header className="auth-topbar">
        <button className="auth-brand-button" onClick={() => navigate("/")} aria-label="Back to VTOP">
          <Logo />
        </button>
        <div className="auth-top-status"><span className="status-dot" /> Secure VTOP Access</div>
      </header>

      <section className="auth-layout">
        <div className="auth-showcase">
          <button className="back-role-link" onClick={() => navigate("/")}>← Choose another portal</button>
          <div className="showcase-badge"><span>{icons[role.id]}</span> {role.title} Portal</div>
          <h1>Welcome to your<br /><span>VTOP workspace.</span></h1>
          <p>
            Sign in to continue to your personalized campus dashboard and access
            the services available for your role.
          </p>

          <div className="showcase-feature-list">
            <div><span>01</span><div><strong>Personalized dashboard</strong><small>View your campus information at a glance.</small></div></div>
            <div><span>02</span><div><strong>Campus services</strong><small>Tracking, Lost &amp; Found, requests and more.</small></div></div>
            <div><span>03</span><div><strong>Secure role access</strong><small>Your portal is tailored to your campus role.</small></div></div>
          </div>
        </div>

        <div className="auth-form-wrap">
          <div className="auth-form-card">
            <div className="auth-card-head">
              <div className="auth-role-icon">{icons[role.id]}</div>
              <div><span>VTOP AUTHENTICATION</span><strong>{role.title} sign in</strong></div>
            </div>

            <h2>Sign in to continue</h2>
            <p className="auth-subtitle">Use your portal credentials to access VTOP.</p>

            {error && <div className="auth-error"><span>!</span><div><strong>Sign in failed</strong><small>{error}</small></div></div>}

            <form className="professional-auth-form" onSubmit={submit}>
              <label>
                <span>Username</span>
                <div className="auth-input-wrap">
                  <span className="input-symbol">@</span>
                  <input
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={`Enter your ${role.title.toLowerCase()} ID`}
                    required
                  />
                </div>
              </label>

              <label>
                <span>Password</span>
                <div className="auth-input-wrap">
                  <span className="input-symbol">●</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <div className="auth-options">
                <label className="remember-option"><input type="checkbox" /> <span>Remember me</span></label>
                <button type="button" className="forgot-button" onClick={() => alert("For this hackathon prototype, use the demo credentials shown below.")}>Forgot password?</button>
              </div>

              <button className="auth-primary auth-submit" type="submit" disabled={loading}>
                {loading ? "Signing in..." : `Sign in as ${role.title}`} <span>→</span>
              </button>
            </form>

            <div className="demo-box">
              <div><span className="demo-icon">⌁</span><div><strong>Hackathon demo access</strong><small>Temporary credentials for this frontend prototype.</small></div></div>
              <button type="button" onClick={useDemo}>Use demo credentials</button>
            </div>

            <div className="auth-security-note"><span>✓</span> Secure role-based access · Frontend prototype</div>
          </div>
        </div>
      </section>

      <footer className="auth-footer">VIT Vellore Campus · Campus Digital Services · Hackathon Prototype</footer>
    </main>
  );
}
