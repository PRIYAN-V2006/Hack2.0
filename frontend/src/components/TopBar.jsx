import React from "react";
import Logo from "./Logo";

export default function TopBar({ user, onLogout, title }) {
  return (
    <header className="topbar">
      <Logo />
      <div className="topbar-right">
        {title && <span className="topbar-title">{title}</span>}
        {user && (
          <div className="user-chip">
            <div className="avatar">{(user.name || user.role || "U")[0].toUpperCase()}</div>
            <div className="user-chip-text">
              <strong>{user.name || user.role}</strong>
              <span>{user.role}</span>
            </div>
          </div>
        )}
        {onLogout && <button className="ghost-button" onClick={onLogout}>Logout</button>}
      </div>
    </header>
  );
}
