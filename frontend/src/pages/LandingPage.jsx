import React from "react";
import { roles } from "../data/roles";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";

const roleMeta = {
  student: { icon: "🎓", label: "Student Portal", color: "blue" },
  employee: { icon: "💼", label: "Employee Portal", color: "gold" },
  parent: { icon: "👨‍👩‍👧", label: "Parent Portal", color: "green" },
  alumni: { icon: "🌐", label: "Alumni Portal", color: "cyan" },
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="pro-landing">
      <div className="landing-orb landing-orb-one" />
      <div className="landing-orb landing-orb-two" />

      <header className="pro-landing-nav">
        <Logo />
        <div className="landing-nav-right">
          <span className="status-dot" />
          <span>VIT Vellore Campus</span>
          <span className="nav-divider" />
          <span>Secure Access</span>
        </div>
      </header>

      <section className="pro-landing-main">
        <div className="landing-copy">
          <div className="landing-kicker">
            <span className="kicker-line" /> VIT CAMPUS DIGITAL SERVICES
          </div>
          <h1>Your campus.<br /><span>One digital gateway.</span></h1>
          <p className="landing-description">
            Access academics, campus services, tracking, Lost &amp; Found and more
            through a single, secure VTOP experience.
          </p>

          <div className="landing-trust-row">
            <div className="trust-item"><span>✓</span><div><strong>Secure access</strong><small>Role-based portal</small></div></div>
            <div className="trust-item"><span>⚡</span><div><strong>Fast &amp; simple</strong><small>Everything in one place</small></div></div>
            <div className="trust-item"><span>◉</span><div><strong>Campus connected</strong><small>Digital campus services</small></div></div>
          </div>
        </div>

        <div className="portal-selector">
          <div className="selector-heading">
            <div>
              <span className="selector-eyebrow">WELCOME TO VTOP</span>
              <h2>Choose your portal</h2>
              <p>Select your role to continue securely.</p>
            </div>
            <div className="secure-lock">⌁</div>
          </div>

          <div className="pro-role-grid">
            {roles.map((role) => {
              const meta = roleMeta[role.id];
              return (
                <button
                  className={`pro-role-card role-${meta.color}`}
                  key={role.id}
                  onClick={() => navigate(`/login/${role.id}`)}
                >
                  <div className="pro-role-top">
                    <div className="pro-role-icon">{meta.icon}</div>
                    <span className="pro-role-arrow">↗</span>
                  </div>
                  <span className="pro-role-label">{meta.label}</span>
                  <h3>{role.title}</h3>
                  <p>{role.subtitle}</p>
                  <span className="pro-role-action">Continue to sign in <b>→</b></span>
                </button>
              );
            })}
          </div>

          <div className="selector-footer">
            <span className="mini-shield">✓</span>
            <span>Your portal session is protected with role-based access.</span>
          </div>
        </div>
      </section>

      <footer className="pro-landing-footer">
        <span>© 2026 VIT Vellore Campus</span>
        <span>•</span>
        <span>Campus Digital Services</span>
        <span>•</span>
        <span>Hackathon Prototype</span>
      </footer>
    </main>
  );
}
