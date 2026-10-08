import React from "react";
import { useNavigate } from "react-router-dom";
import { getAttendanceStatus, getOverallAttendance } from "../data/attendanceData";
import { getStudentRequests } from "../services/requestService";

export default function DashboardPage({ user }) {
  const navigate = useNavigate();
  const overall = getOverallAttendance();
  const attendanceStatus = getAttendanceStatus(overall.attended, overall.total);
  const requests = getStudentRequests(user?.username || user?.registerNo || "student");

  return (
    <main className="dashboard-main">
      <section className="welcome-banner">
        <div>
          <span className="eyebrow">STUDENT PORTAL</span>
          <h1>Good day, {user?.name || "Student"} 👋</h1>
          <p>Manage your campus activities from one place.</p>
        </div>
        <div className="date-card">
          <span>Today</span>
          <strong>
            {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </strong>
        </div>
      </section>

      <section className="stats-grid">
        <button className="stat-card stat-card-button" onClick={() => navigate("/attendance")}>
          <span>Attendance</span>
          <strong>{overall.percentage}%</strong>
          <small>{overall.attended} / {overall.total} classes attended</small>
        </button>
        <div className="stat-card">
          <span>Courses</span>
          <strong>{6}</strong>
          <small>Current semester</small>
        </div>
        <div className="stat-card">
          <span>Notifications</span>
          <strong>4</strong>
          <small>Unread updates</small>
        </div>
        <button className="stat-card stat-card-button" onClick={() => navigate("/request")}>
          <span>Requests</span>
          <strong>{requests.length}</strong>
          <small>Pending requests</small>
        </button>
      </section>

      <section className="overview-attendance-card">
        <div className="overview-attendance-header">
          <div>
            <span className="overview-card-label">ACADEMIC OVERVIEW</span>
            <h2>Overall Attendance</h2>
            <p>Attendance calculated across all registered subjects.</p>
          </div>
          <button className="overview-view-button" onClick={() => navigate("/attendance")}>
            View Attendance →
          </button>
        </div>

        <div className="overview-attendance-content">
          <div
            className="overview-attendance-ring"
            style={{ "--attendance-angle": `${overall.percentage * 3.6}deg` }}
          >
            <div className="overview-attendance-ring-inner">
              <strong>{overall.percentage}%</strong>
              <span>Overall</span>
            </div>
          </div>

          <div className="overview-attendance-main">
            <div className="overview-attendance-status">
              <span className={`attendance-status-dot ${attendanceStatus.tone}`} />
              <strong>{attendanceStatus.label} attendance</strong>
            </div>

            <div className="overview-progress-track">
              <div style={{ width: `${overall.percentage}%` }} />
            </div>

            <div className="overview-attendance-numbers">
              <div>
                <span>Attended</span>
                <strong>{overall.attended}</strong>
              </div>
              <div>
                <span>Total Classes</span>
                <strong>{overall.total}</strong>
              </div>
              <div>
                <span>Missed</span>
                <strong>{overall.absent}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section-title-row">
          <div>
            <span className="eyebrow">QUICK ACCESS</span>
            <h2>Campus services</h2>
          </div>
        </div>
        <div className="service-grid">
          <button className="service-card" onClick={() => navigate("/tracking/shuttle")}>
            <div className="service-icon">⌁</div>
            <h3>Shuttle Tracking</h3>
            <p>Check the campus shuttle status and route.</p>
            <span>Open service →</span>
          </button>
          <button className="service-card featured-service" onClick={() => navigate("/lost-found")}>
            <div className="service-icon">⌕</div>
            <h3>Lost &amp; Found</h3>
            <p>Report, search, claim and manage campus lost items.</p>
            <span>Open service →</span>
          </button>
          <button className="service-card" onClick={() => navigate("/xerox-shop")}>
            <div className="service-icon">▣</div>
            <h3>Xerox Shop</h3>
            <p>Upload documents, customize printing and place an order.</p>
            <span>Open service →</span>
          </button>
          <button className="service-card" onClick={() => navigate("/request")}>
            <div className="service-icon">＋</div>
            <h3>Request</h3>
            <p>Submit a campus-related request.</p>
            <span>Open service →</span>
          </button>
        </div>
      </section>
    </main>
  );
}
