import React from "react";
import { NavLink } from "react-router-dom";

const mainItems = [
  { to: "/dashboard", label: "Overview", icon: "grid" },
  { to: "#academics", label: "Academics", icon: "book" },
  { to: "/attendance", label: "Attendance", icon: "check" },
  { to: "#examinations", label: "Examinations", icon: "pen" },
  { to: "#calendar", label: "Calendar", icon: "calendar" },
  { to: "#notifications", label: "Notifications", icon: "bell" }
];

const serviceItems = [
  { to: "/tracking/shuttle", label: "Tracking", icon: "route" },
  { to: "/lost-found", label: "Lost & Found", icon: "search" },
  { to: "/xerox-shop", label: "Xerox Shop", icon: "printer" },
  { to: "/request", label: "Request", icon: "plus" }
];

function Icon({ name }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    grid: <><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 5.5v16"/><path d="M8 7h8"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    pen: <><path d="m4 20 4.2-1 10.6-10.6a2 2 0 0 0-2.8-2.8L5.4 16.2z"/><path d="m14.5 6.5 3 3"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    route: <><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h4a4 4 0 0 0 4-4V10"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></>,
    printer: <><path d="M6 9V4h12v5"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/><path d="M18 12h.01"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>
  };
  return <svg {...common}>{paths[name] || paths.grid}</svg>;
}

function SidebarLink({ item }) {
  const disabled = item.to.startsWith("#");
  if (disabled) {
    return (
      <button className="sidebar-link" onClick={() => alert(`${item.label} module is ready for the next phase.`)}>
        <Icon name={item.icon}/><span>{item.label}</span>
      </button>
    );
  }
  return (
    <NavLink to={item.to} end={item.to === "/dashboard"} className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`}>
      <Icon name={item.icon}/><span>{item.label}</span>
      {item.to === "/lost-found" && <Icon name="chevron"/>}
    </NavLink>
  );
}

export default function AppSidebar({ user }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-section-title">MAIN MENU</div>
      {mainItems.map(item => <SidebarLink key={item.label} item={item}/>)}

      <div className="sidebar-section-title services-title">CAMPUS SERVICES</div>
      {serviceItems.map(item => <SidebarLink key={item.label} item={item}/>)}

      <div className="sidebar-help">
        <div className="help-icon">?</div>
        <div>
          <strong>Need help?</strong>
          <span>Contact campus support</span>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">{(user?.name || "S")[0]}</div>
        <div>
          <strong>{user?.name || "Student"}</strong>
          <span>{user?.username || "student"}</span>
        </div>
      </div>
    </aside>
  );
}
