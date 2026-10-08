import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { attendanceData, getAttendanceDecimal } from "../../data/attendanceData";

export default function AttendanceDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const subject = attendanceData.find((item) => String(item.id) === String(id));

  const [futureClasses, setFutureClasses] = useState(10);
  const [plannedAttend, setPlannedAttend] = useState(8);
  const [targetPercentage, setTargetPercentage] = useState(85);

  const prediction = useMemo(() => {
    if (!subject) return null;
    const currentAttended = Number(subject.attended) || 0;
    const currentTotal = Number(subject.total) || 0;
    const future = Math.max(1, Number(futureClasses) || 1);
    const attend = Math.min(future, Math.max(0, Number(plannedAttend) || 0));
    const skip = future - attend;
    const futureAttended = currentAttended + attend;
    const futureTotal = currentTotal + future;
    const predicted = getAttendanceDecimal(futureAttended, futureTotal);
    const target = Number(targetPercentage) / 100;
    const minimumToReach = Math.max(0, Math.ceil(target * futureTotal - currentAttended));
    const canReach = minimumToReach <= future;
    const maxSkip = Math.max(0, future - minimumToReach);
    return {
      currentAttended,
      currentTotal,
      currentPercentage: getAttendanceDecimal(currentAttended, currentTotal),
      future,
      attend,
      skip,
      futureAttended,
      futureTotal,
      predicted,
      minimumToReach,
      canReach,
      maxSkip,
    };
  }, [subject, futureClasses, plannedAttend, targetPercentage]);

  if (!subject) {
    return (
      <div className="attendance-details-page">
        <button className="back-link" onClick={() => navigate("/attendance")}>← Back to Attendance</button>
        <div className="attendance-empty"><div>!</div><h3>Subject not found</h3><p>The selected subject does not exist.</p><button onClick={() => navigate("/attendance")}>Return to Attendance</button></div>
      </div>
    );
  }

  return (
    <div className="attendance-details-page">
      <button className="back-link" onClick={() => navigate("/attendance")}>← Back to Attendance</button>

      <div className="attendance-detail-header">
        <div>
          <span className="attendance-code">{subject.code}</span>
          <h1>{subject.name}</h1>
          <p>Subject attendance details and future attendance prediction.</p>
        </div>
      </div>

      <section className="attendance-detail-overview">
        <div className="detail-overview-ring">
          <div className="attendance-ring" style={{ width: 150, height: 150 }}>
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r="62" fill="none" stroke="#e7ebf2" strokeWidth="12" />
              <circle cx="75" cy="75" r="62" fill="none" stroke="#5365ee" strokeWidth="12" strokeLinecap="round" strokeDasharray={2 * Math.PI * 62} strokeDashoffset={(2 * Math.PI * 62) * (1 - Math.min(100, prediction.currentPercentage) / 100)} transform="rotate(-90 75 75)" />
            </svg>
            <strong>{prediction.currentPercentage}%</strong>
          </div>
          <span>Current attendance</span>
        </div>

        <div className="detail-overview-stats">
          <div><span>Total Classes</span><strong>{subject.total}</strong></div>
          <div><span>Attended</span><strong>{subject.attended}</strong></div>
          <div><span>Missed</span><strong>{subject.total - subject.attended}</strong></div>
          <div><span>Upcoming</span><strong>{subject.upcomingClasses}</strong></div>
        </div>

        <div className="attendance-calculation-box">
          <span>Current calculation</span>
          <strong>{subject.attended} / {subject.total} × 100 = {prediction.currentPercentage}%</strong>
          <small>Overall attendance is available in the Overview dashboard.</small>
        </div>
      </section>

      <section className="subject-predictor detail-predictor">
        <div className="subject-predictor-header">
          <div>
            <span className="detail-small-label">SUBJECT SMART PLANNER</span>
            <h2>Future Attendance Predictor</h2>
            <p>This prediction uses only <b>{subject.code}</b>.</p>
          </div>
          <div className="target-display">Target <strong>{targetPercentage}%</strong></div>
        </div>

        <div className="subject-predictor-controls">
          <div className="predictor-box">
            <div className="predictor-box-icon calendar">📅</div>
            <div className="predictor-box-text"><span>Upcoming Classes</span><small>Future classes</small></div>
            <div className="number-stepper"><button onClick={() => setFutureClasses((v) => Math.max(1, v - 1))}>−</button><strong>{futureClasses}</strong><button onClick={() => setFutureClasses((v) => v + 1)}>+</button></div>
          </div>

          <div className="predictor-box">
            <div className="predictor-box-icon attend">✓</div>
            <div className="predictor-box-text"><span>I'll Attend</span><small>Planned classes</small></div>
            <div className="number-stepper"><button disabled={plannedAttend <= 0} onClick={() => setPlannedAttend((v) => Math.max(0, v - 1))}>−</button><strong>{plannedAttend}</strong><button disabled={plannedAttend >= futureClasses} onClick={() => setPlannedAttend((v) => Math.min(futureClasses, v + 1))}>+</button></div>
          </div>

          <div className="predictor-box">
            <div className="predictor-box-icon skip">×</div>
            <div className="predictor-box-text"><span>I'll Skip</span><small>Automatically calculated</small></div>
            <div className="calculated-number">{prediction.skip}</div>
          </div>

          <div className="predictor-box">
            <div className="predictor-box-icon target">%</div>
            <div className="predictor-box-text"><span>Target</span><small>Minimum attendance</small></div>
            <div className="number-stepper"><button disabled={targetPercentage <= 50} onClick={() => setTargetPercentage((v) => Math.max(50, v - 1))}>−</button><strong>{targetPercentage}%</strong><button disabled={targetPercentage >= 100} onClick={() => setTargetPercentage((v) => Math.min(100, v + 1))}>+</button></div>
          </div>
        </div>

        <div className={`subject-prediction-result ${prediction.predicted >= targetPercentage ? "safe" : "danger"}`}>
          <div className="prediction-result-main">
            <span>Predicted {subject.code} Attendance</span>
            <strong>{prediction.predicted}%</strong>
            <div className="prediction-bar"><div style={{ width: `${Math.min(100, prediction.predicted)}%` }} /><span style={{ left: `${Math.min(100, targetPercentage)}%` }} /></div>
            <div className="prediction-bar-labels"><span>0%</span><span>Target {targetPercentage}%</span><span>100%</span></div>
          </div>
          <div className="prediction-result-divider" />
          <div className="prediction-mini-stat"><span>Current</span><strong>{prediction.currentAttended}/{prediction.currentTotal}</strong><small>{prediction.currentPercentage}%</small></div>
          <div className="prediction-mini-stat"><span>After Plan</span><strong>{prediction.futureAttended}/{prediction.futureTotal}</strong><small>{prediction.predicted}%</small></div>
        </div>

        <div className="subject-smart-result">
          <div className={`smart-result-icon ${prediction.predicted >= targetPercentage ? "safe" : "danger"}`}>{prediction.predicted >= targetPercentage ? "✓" : "!"}</div>
          <div>
            <strong>{prediction.predicted >= targetPercentage ? "Your planned attendance is safe" : "Your planned attendance is below target"}</strong>
            <p>{prediction.canReach ? <>To reach <b>{targetPercentage}%</b>, attend at least <b>{prediction.minimumToReach}</b> of the next <b>{prediction.future}</b> classes. At that target, you can skip <b>{prediction.maxSkip}</b>.</> : <>Even if you attend all <b>{prediction.future}</b> upcoming classes, you cannot reach <b>{targetPercentage}%</b> yet.</>}</p>
          </div>
        </div>
      </section>

      <section className="detail-information">
        <div className="detail-section-heading"><div><span className="detail-small-label">COURSE INFORMATION</span><h2>Attendance Information</h2></div></div>
        <div className="detail-information-grid">
          <div className="information-item"><span>Subject</span><strong>{subject.name}</strong></div>
          <div className="information-item"><span>Course Code</span><strong>{subject.code}</strong></div>
          <div className="information-item"><span>Classes Attended</span><strong>{subject.attended}</strong></div>
          <div className="information-item"><span>Total Classes</span><strong>{subject.total}</strong></div>
          <div className="information-item"><span>Classes Missed</span><strong>{subject.total - subject.attended}</strong></div>
          <div className="information-item"><span>Current Attendance</span><strong>{prediction.currentPercentage}%</strong></div>
        </div>
      </section>
    </div>
  );
}
