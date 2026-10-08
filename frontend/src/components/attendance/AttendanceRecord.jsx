import React from "react";

export default function AttendanceRecord({ record }) {
  const present = record.status === "Present";
  return (
    <div className="attendance-record">
      <div className={`record-status-icon ${present ? "present" : "absent"}`}>
        {present ? "✓" : "×"}
      </div>
      <div className="record-time">
        <strong>{record.time}</strong>
        <span>{record.slot}</span>
      </div>
      <div className="record-location">
        <span>Classroom</span>
        <strong>{record.room}</strong>
      </div>
      <div className="record-date">
        <strong>{record.date}</strong>
        <span className={present ? "present-text" : "absent-text"}>{record.status}</span>
      </div>
    </div>
  );
}
