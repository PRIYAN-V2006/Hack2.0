import React from "react";
import AttendanceRing from "./AttendanceRing";
import { getAttendanceStatus } from "../../data/attendanceData";

export default function AttendanceSummary({ overall }) {
  if (!overall) return null;
  const status = getAttendanceStatus(overall.attended, overall.total);

  return (
    <section className="attendance-summary-card">
      <div className="attendance-summary-copy">
        <span className="eyebrow">CURRENT SEMESTER</span>
        <h2>Overall Attendance</h2>
        <p>Your attendance across all registered courses.</p>
        <div className={`attendance-status-badge ${status.tone}`}>
          <span className="status-dot" /> {status.label} attendance
        </div>
      </div>
      <div className="attendance-summary-ring">
        <AttendanceRing percentage={overall.percentage} size={150} stroke={12} />
      </div>
      <div className="attendance-mini-stats">
        <div><span>Total Classes</span><strong>{overall.total}</strong></div>
        <div><span>Attended</span><strong>{overall.attended}</strong></div>
        <div><span>Not Attended</span><strong>{overall.absent}</strong></div>
      </div>
    </section>
  );
}
