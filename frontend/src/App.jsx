import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ShuttleTracking from "./pages/ShuttleTracking";
import LostFoundHome from "./pages/lost-found/LostFoundHome";
import ReportItem from "./pages/lost-found/ReportItem";
import SearchItems from "./pages/lost-found/SearchItems";
import ItemDetails from "./pages/lost-found/ItemDetails";
import MyActivity from "./pages/lost-found/MyActivity";
import XeroxShop from "./pages/XeroxShop";
import XeroxOwner from "./pages/XeroxOwner";
import AttendancePage from "./pages/attendance/AttendancePage";
import AttendanceDetails from "./pages/attendance/AttendanceDetails";
import RequestPage from "./pages/RequestPage";
import TopBar from "./components/TopBar";
import AppSidebar from "./components/AppSidebar";

function ProtectedShell({ user, onLogout, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLostFound = location.pathname.startsWith("/lost-found");
  const isDashboard = location.pathname === "/dashboard";
  const isAttendance = location.pathname.startsWith("/attendance");
  const isXerox = location.pathname.startsWith("/xerox-shop") || location.pathname.startsWith("/xerox-owner");
  const isRequest = location.pathname === "/request";
  const title = isLostFound ? "Lost & Found" : isAttendance ? "Attendance" : isXerox ? "Xerox Shop" : isRequest ? "Request" : isDashboard ? "Student Dashboard" : "Campus Service";

  return (
    <div className="app-shell">
      <TopBar user={user} onLogout={onLogout} title={title} />
      <div className="app-body">
        <AppSidebar user={user} />
        <main className="app-content">{children}</main>
      </div>
      {isLostFound && (
        <button className="mobile-dashboard-back" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("vtop_user")) || null; }
    catch { return null; }
  });

  const login = (loggedInUser) => {
    localStorage.setItem("vtop_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const logout = () => {
    localStorage.removeItem("vtop_user");
    setUser(null);
  };

  const protectedPage = (element) =>
    user ? (
      <ProtectedShell user={user} onLogout={logout}>{element}</ProtectedShell>
    ) : <Navigate to="/" replace />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/:role" element={<LoginPage onLogin={login} />} />
        <Route path="/dashboard" element={protectedPage(<DashboardPage user={user} onLogout={logout} />)} />
        <Route path="/tracking/shuttle" element={protectedPage(<ShuttleTracking user={user} />)} />
        <Route path="/attendance" element={protectedPage(<AttendancePage user={user} />)} />
        <Route path="/attendance/:id" element={protectedPage(<AttendanceDetails user={user} />)} />
        <Route path="/lost-found" element={protectedPage(<LostFoundHome user={user} />)} />
        <Route path="/xerox-shop" element={protectedPage(<XeroxShop user={user} />)} />
        <Route path="/xerox-owner" element={protectedPage(<XeroxOwner user={user} />)} />
        <Route path="/request" element={protectedPage(<RequestPage user={user} />)} />
        <Route path="/lost-found/home" element={<Navigate to="/lost-found" replace />} />
        <Route path="/lost-found/report" element={protectedPage(<ReportItem user={user} />)} />
        <Route path="/lost-found/search" element={protectedPage(<SearchItems user={user} />)} />
        <Route path="/lost-found/item/:id" element={protectedPage(<ItemDetails user={user} />)} />
        <Route path="/lost-found/activity" element={protectedPage(<MyActivity user={user} />)} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
