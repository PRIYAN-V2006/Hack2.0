import React from "react";
import AttendanceRing from "./AttendanceRing";
import { getAttendanceDecimal, getAttendanceStatus } from "../../data/attendanceData";

export default function AttendanceSubjectCard({ subject, onClick }) {
  const percentage = getAttendanceDecimal(subject.attended, subject.total);
  const status = getAttendanceStatus(subject.attended, subject.total);
  const missed = Math.max(0, subject.total - subject.attended);

  return (
    <article className="attendance-subject-card" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}>
      <div className="attendance-subject-main">
        <div className="attendance-subject-title-row">
          <div>
            <span className="attendance-code">{subject.code}</span>
            <h3>{subject.name}</h3>
            <p>{subject.slot} <span>•</span> {subject.faculty}</p>
          </div>
          <AttendanceRing percentage={percentage} size={78} stroke={8} />
        </div>

        <div className="attendance-progress-track">
          <div className={`attendance-progress-fill ${status.tone}`} style={{ width: `${Math.min(100, percentage)}%` }} />
        </div>

        <div className="attendance-subject-meta">
          <span><strong>{subject.total}</strong>Total</span>
          <span><strong>{subject.attended}</strong>Attended</span>
          <span><strong>{missed}</strong>Missed</span>
          <span><strong>{subject.upcomingClasses}</strong>Upcoming</span>
        </div>
      </div>

      <div className="attendance-subject-footer">
        <span className={`attendance-status-text ${status.tone}`}><span className="status-dot" /> {status.label}</span>
        <button className="text-action" onClick={(e) => { e.stopPropagation(); onClick(); }}>View details →</button>
      </div>
    </article>
  );
}
